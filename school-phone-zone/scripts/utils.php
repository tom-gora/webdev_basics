<?php

// handle client requests

//  FN: _______________________________________________________________________
// return curretly logged in user's ID if client needs it

if (isset($_POST["client_request"]) && $_POST["client_request"] == "get_id") {
  session_start();
  if (isset($_SESSION["user_id"])) {
    echo $_SESSION["user_id"];
  } else {
    echo "no_id";
  }
}
// --------------------------------------------------------
// functions storing internal app abstractions

//  FN: _______________________________________________________________________
// log something directly into PHP / Apache logs

function put_value_into_apache_logs(string $descritpiton, $value)
{
  echo $descritpiton . "\n";
  file_put_contents("php://stderr", print_r($value . "\n", true));
}

//  FN: _______________________________________________________________________
// make sure user ID processed is within range of stored users

function validate_id(int $user_id)
{
  require_once "db.php";
  $connection = get_mysqli();
  $query = "select max(user_id) as max_id from users";
  $statement = mysqli_prepare($connection, $query);
  if (!$statement) {
    mysqli_close($connection);
    return false;
  }
  mysqli_stmt_execute($statement);
  $result = mysqli_stmt_get_result($statement);
  if (!$result) {
    db_tidy_up($statement, $connection);
    return false;
  }
  $max_id = mysqli_fetch_assoc($result)["max_id"];
  db_tidy_up($statement, $connection);
  return $user_id >= 0 && $user_id <= $max_id;
}

//  FN: _______________________________________________________________________
// encapsulate closing of DB connection and statement into one line call

function db_tidy_up($statement, $connection)
{
  mysqli_stmt_close($statement);
  mysqli_close($connection);
}

//  FN: _______________________________________________________________________
// provide flexible redirects with option to pass param to use in ui error handling
// and optional error messages to use in error reporting down the line

function redirect_with_query(
  string $url,
  array $query,
  ?array $error_msg = null
) {
  if (isset($error_msg) && count($error_msg) > 0 && $error_msg != null) {
    $query = array_merge($query, $error_msg);
  }
  $query_string = http_build_query($query);
  header("Location: $url?" . $query_string);
  exit();
}
