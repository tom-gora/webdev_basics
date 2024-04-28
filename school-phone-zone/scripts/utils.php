<?php

// handle client requests
if (isset($_POST["client_request"]) && $_POST["client_request"] == "get_id") {
  session_start();
  if (isset($_SESSION["user_id"])) {
    echo $_SESSION["user_id"];
  } else {
    echo "no_id";
  }
}
// --------------------------------------------------------
// functions

function put_value_into_apache_logs(string $descritpiton, $value)
{
  echo $descritpiton . "\n";
  file_put_contents("php://stderr", print_r($value . "\n", true));
}

function validate_id(int $user_id)
{
  require_once "db.php";
  $connection = get_mysqli();
  $query = "select max(user_id) as max_id from users";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    mysqli_close($connection);
    return false;
  }
  $max_id = mysqli_fetch_assoc($result)["max_id"];
  mysqli_close($connection);
  return $user_id >= 0 && $user_id <= $max_id;
}

function db_tidy_up($statement, $connection)
{
  mysqli_stmt_close($statement);
  mysqli_close($connection);
}

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
