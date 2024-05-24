<?php
require_once "db.php";
require_once "utils.php";
ban_script_access();

$connection = get_mysqli();
$json = file_get_contents("php://input");
$obj = json_decode($json);
$client_request = $obj->client_request;
switch ($client_request) {
  case "get_product_for_cart":
    $product_id = $obj->product_id;

    $query = "SELECT * FROM products WHERE product_id = ?";
    $statement = mysqli_prepare($connection, $query);

    if (!$statement) {
      redirect_with_query(
        "../index.php",
        ["error" => "internalerr"],
        ["err_message" => "err_getting_product_for_cart_01"]
      );
    }
    mysqli_stmt_bind_param($statement, "i", $product_id);
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);
    if (!$result) {
      redirect_with_query(
        "../index.php",
        ["error" => "internalerr"],
        ["err_message" => "err_getting_product_for_cart_02"]
      );
    }
    $row = mysqli_fetch_assoc($result);

    echo json_encode($row);
    break;
  case "init_cart":
    $user_id = $obj->user_id;
    $query = "SELECT * FROM cart_state_store WHERE user_id =?";
    $statement = mysqli_prepare($connection, $query);
    if (!$statement) {
      redirect_with_query(
        "../index.php",
        ["error" => "internalerr"],
        ["err_message" => "err_getting_cart_state_01"]
      );
    }
    mysqli_stmt_bind_param($statement, "i", $user_id);
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);
    if (!$result) {
      redirect_with_query(
        "../index.php",
        ["error" => "internalerr"],
        ["err_message" => "err_getting_cart_state_02"]
      );
    }
    $row = mysqli_fetch_assoc($result);
    echo json_encode($row ?: ["order_contents" => "no_cart"]);
    break;
  case "save_cart_state":
    $user_id = $obj->user_id;
    $cart_state = json_encode($obj->cart_state);
    $query =
      "INSERT INTO cart_state_store (user_id, order_contents, state_save_timestamp) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE order_contents = VALUES(order_contents), state_save_timestamp = NOW();";
    $statement = mysqli_prepare($connection, $query);
    if (!$statement) {
      redirect_with_query(
        "../index.php",
        ["error" => "internalerr"],
        ["err_message" => "err_saving_cart_state_01"]
      );
    }
    mysqli_stmt_bind_param($statement, "is", $user_id, $cart_state);
    $result = mysqli_stmt_execute($statement);

    if (!$result) {
      echo json_encode([
        "success" => "false",
        "error" => "execution_error",
        "message" => mysqli_stmt_error($statement),
      ]);
      break;
    }
    if (mysqli_stmt_affected_rows($statement) == 0) {
      echo json_encode(["success" => "false", "error" => "no_changes_written"]);
      break;
    }
    echo json_encode(["success" => "true"]);
    break;
  case "delete_cart_state":
    $user_id = $obj->user_id;
    $query = "DELETE FROM cart_state_store WHERE user_id =?";
    $statement = mysqli_prepare($connection, $query);
    if (!$statement) {
      redirect_with_query(
        "../index.php",
        ["error" => "internalerr"],
        ["err_message" => "err_deleting_cart_state_01"]
      );
    }
    mysqli_stmt_bind_param($statement, "i", $user_id);
    $result = mysqli_stmt_execute($statement);
    if (!$result) {
      echo json_encode([
        "success" => "false",
        "error" => "execution_error",
        "message" => mysqli_stmt_error($statement),
      ]);
      break;
    }
    if (mysqli_stmt_affected_rows($statement) == 0) {
      echo json_encode(["success" => "false", "error" => "no_changes_written"]);
      break;
    }
    echo json_encode(["success" => "true"]);
    break;
}
