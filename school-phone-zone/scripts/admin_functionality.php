<?php
require_once "../scripts/utils.php";
session_start();
$user_id = isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : null;
$user_role = isset($_SESSION["user_type"]) ? $_SESSION["user_type"] : null;
if (!$user_id || $user_role == "user") {
  redirect_with_query("../index.php", ["error" => "noadmin"]);
}

require_once "../scripts/db.php";
require_once "../scripts/user_functionality.php";

// select appropriate action and call func
if (isset($_POST["del-user-id"])) {
  handle_user_operations("delete");
} elseif (
  isset($_POST["edit-user-email"]) ||
  isset($_POST["edit-user-first-name"]) ||
  isset($_POST["edit-user-last-name"]) ||
  isset($_POST["edit-user-password"]) ||
  isset($_FILES["edit-user-image"]) ||
  isset($_POST["edit-user-type"])
) {
  handle_user_operations("edit");
}

//  FN: _______________________________________________________________________
// function handling operations on users performed by admin
// conditionally acting on requested action - delete, or edit
// TODO: 1 build adding functionality, maybe extract actions into separate functions?
// TODO: 2 further functionalities for managing products

function handle_user_operations(string $operation_type)
{
  if ($operation_type == "delete") {
    $id_to_delete = $_POST["del-user-id"];
    $user_to_delete_type = get_user_type_by_id($id_to_delete);
    //
    //WARN:
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ASSESSMENT: this is securing task 3 requirement on the server side
    // even if someone could somehow i.e. curl correct data to this script
    // it will be ignored based on required conditions.
    // Only the owner can delete non-regular users
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //

    if ($user_to_delete_type != "user" && $_SESSION["user_type"] != "owner") {
      redirect_with_query("../pages/admin.php", [
        "error" => "deleteuserdisallowed",
      ]);
    }
    delete_user($id_to_delete);
    redirect_with_query("../pages/admin.php", ["status" => "userdeleted"]);
  } elseif ($operation_type == "edit") {
    $result_param = "userupdated";
    $id_to_edit = $_POST["edit-user-id"];
    $edited_user = get_user($id_to_edit);

    //TODO: Log print to be deleted
    // echo $edited_user->user_type;
    // exit();

    //
    //WARN:
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ASSESSMENT: Same as above but for editing user data
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //

    if (
      $edited_user->user_type != "user" &&
      $_SESSION["user_type"] != "owner"
    ) {
      redirect_with_query("../pages/admin.php", ["error" => "editdisallowed"]);
    }

    $received_new_user_data = new User();
    $received_new_user_data->user_id = $id_to_edit;
    $received_new_user_data->user_email = $_POST["edit-user-email"];
    $received_new_user_data->user_firstname = $_POST["edit-user-first-name"];
    $received_new_user_data->user_lastname = $_POST["edit-user-last-name"];
    $received_new_user_data->user_type = $_POST["edit-user-type"];

    //if for whatever reason img name was missing from the db in the first place
    //and new image is not set handle the err and just fallback to default image
    if (!isset($edited_user->user_img) && !isset($_FILES["edit-user-image"])) {
      $received_new_user_data->user_img = "default.jpg";
    } elseif (
      //further checks for image upload data
      //if it is an image, it is not empty or not null and no errors
      isset($_FILES["edit-user-image"]) &&
      str_contains($_FILES["edit-user-image"]["type"], "image") &&
      $_FILES["edit-user-image"]["name"] != "" &&
      $_FILES["edit-user-image"]["name"] != null &&
      $_FILES["edit-user-image"]["error"] == 0
    ) {
      $tmp_img_url = $_FILES["edit-user-image"]["tmp_name"];
      $attempt_store_img = store_user_img($tmp_img_url);

      // if failed storing image from fallback to default image
      if (!$attempt_store_img) {
        $received_new_user_data->user_img = "default.jpg";
        $result_param = "errordefaultimgused";
      } else {
        // else filename string was returned thus assign to user_img
        $received_new_user_data->user_img = $attempt_store_img;
      }
    } else {
      // if no new image is uploaded keep the old one
      $received_new_user_data->user_img = $edited_user->user_img;
    }

    //having dealt with the image carry on with the rest of the user crap

    // 2 values below are not editable, stay the same
    $received_new_user_data->user_auth_method = $edited_user->user_auth_method;
    $received_new_user_data->user_registration =
      $edited_user->user_registration;

    //prep the password handling objects with private pass value
    $received_new_user_password = new UserPassword();
    $edited_user_password = new UserPassword();
    $received_new_user_password->user_id = $id_to_edit;
    $edited_user_password->user_id = $id_to_edit;

    $connection = get_mysqli();
    $current_password_query =
      "SELECT user_password FROM users WHERE user_id = ?";
    $statement = mysqli_prepare($connection, $current_password_query);
    if (!$statement) {
      db_tidy_up($connection, $statement);
      redirect_with_query("../pages/admin.php", [
        "error" => "internalerr",
        "error_msg" => "err_updating_pass_01",
      ]);
    }
    mysqli_stmt_bind_param($statement, "i", $id_to_edit);
    mysqli_stmt_execute($statement);
    $current_password_result = mysqli_stmt_get_result($statement);
    // if failed to get current password from db die an set var for error handling
    if (!$current_password_result) {
      db_tidy_up($connection, $statement);
      redirect_with_query(
        "../pages/admin.php",
        ["error" => "internalerr"],
        ["error_msg" => "err_updating_pass_02"]
      );
    }
    $current_password = $current_password_result->fetch_assoc()[
      "user_password"
    ];
    if (
      // checks for posted password data:
      // if it is not empty or null, the same as current one nor equal ti hashed empty string
      !isset($_POST["edit-user-password"]) ||
      $_POST["edit-user-password"] == "" ||
      $_POST["edit-user-password"] == null ||
      md5($_POST["edit-user-password"]) == $current_password ||
      md5($_POST["edit-user-password"]) == "d41d8cd98f00b204e9800998ecf8427e"
    ) {
      // if confirmed wrong keep the present value
      $received_new_user_password->__set_password($current_password);
    } else {
      //else if password was sent correctly update it from form data
      $received_new_user_password->__set_password(
        md5($_POST["edit-user-password"])
      );
    }

    // push updates to db and store results
    $res_data = update_user($received_new_user_data);
    $res_pass = update_user_password($received_new_user_password, false);
    if ($res_data && $res_pass) {
      if (
        // if new img stored ok and it is not default or empty nor equal to old one
        $received_new_user_data->user_img != "default.jpg" &&
        $received_new_user_data->user_img != "" &&
        $received_new_user_data->user_img != null &&
        $received_new_user_data->user_img != $edited_user->user_img
      ) {
        // finish off by removing the old file
        try {
          $old_file_path = "../res/user_img/" . $edited_user->user_img;
          unlink($old_file_path);
        } catch (Exception) {
          // if failed to delete old file log it and continue
          put_value_into_apache_logs(
            "Error deleting old image file. Consider manually deleting redundant file: ",
            $old_file_path
          );
        }
      }
      db_tidy_up($connection, $statement);
      redirect_with_query("../pages/admin.php", ["status" => $result_param]);
    } elseif (!$res_data && $res_pass) {
      $result_param = "user_edit_data_failed_pass_ok";
    } elseif ($res_data && !$res_pass) {
      $result_param = "user_edit_data_ok_pass_failed";
    } else {
      $result_param = "user_edit_data_failed_pass_failed";
    }

    if ($result_param != "userupdated") {
      db_tidy_up($connection, $statement);
      redirect_with_query(
        "../pages/admin.php",
        ["error" => "internalerr"],
        ["error_msg" => $result_param]
      );
    }
  } else {
    redirect_with_query(
      "../pages/admin.php",
      ["error" => "internalerr"],
      ["error_msg" => "err_processing_user_incorrect_request"]
    );
  }
}
