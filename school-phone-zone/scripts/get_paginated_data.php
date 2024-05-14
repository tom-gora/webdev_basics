<?php
require_once "db.php";
require_once "utils.php";
ban_script_access();

$json = file_get_contents("php://input");
$obj = json_decode($json);
$client_request = $obj->client_request;
$requested_data = $obj->requested_data;

if (!isset($client_request) || $client_request !== "get_data_portion") {
  redirect_with_query(
    "../index.php",
    ["error" => "internalerr"],
    ["err_message" => "err_getting_pagination_01"]
  );
  exit();
}

$connection = get_mysqli();

$limit = $obj->items_per_page;
$offset = ($obj->page_nr - 1) * $obj->items_per_page;
$connection = get_mysqli();
switch ($requested_data) {
  case "products":
    $query = "SELECT * FROM products ORDER BY product_id ASC LIMIT ? OFFSET ?";
    break;
  case "users":
    $query = "SELECT count(*) FROM users";
    $statement = mysqli_prepare($connection, $query);
    if (!$statement) {
      redirect_with_query(
        "../index.php",
        ["error" => "internalerr"],
        ["err_message" => "err_getting_users_pagination_01"]
      );
    }
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);
    if (!$result) {
      redirect_with_query(
        "../index.php",
        ["error" => "internalerr"],
        ["err_message" => "err_getting_users_pagination_02"]
      );
    }
    $users_total_count = mysqli_fetch_assoc($result)["count(*)"];

    $query = "SELECT * FROM users ORDER BY user_id ASC LIMIT ? OFFSET ?";
    $statement = mysqli_prepare($connection, $query);
    if (!$statement) {
      redirect_with_query(
        "../index.php",
        ["error" => "internalerr"],
        ["err_message" => "err_getting_pagination_02"]
      );
    }
    mysqli_stmt_bind_param($statement, "ii", $limit, $offset);
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);
    if (!$result) {
      redirect_with_query(
        "../index.php",
        ["error" => "internalerr"],
        ["err_message" => "err_getting_pagination_03"]
      );
    }
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
      $row["user_registration"] = date_format(
        date_create($row["user_registration"]),
        "d M y"
      );
      $row["user_type"] = ucfirst($row["user_type"]);
      switch ($row["user_auth_method"]) {
        case "1":
          $row["user_auth_method"] = "Email";
          break;
        case "2":
          $row["user_auth_method"] = "Google";
          break;
        case "3":
          $row["user_auth_method"] = "Github";
          break;
      }

      array_push($data, $row);
    }
    array_push($data, $users_total_count);
    echo json_encode($data);
    break;
  case "orders":
    $query = "SELECT * FROM orders ORDER BY order_id ASC LIMIT ? OFFSET ?";
    break;
}
