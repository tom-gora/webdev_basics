<?php
session_start();
$user_id = isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : null;
$user_role = isset($_SESSION["user_type"]) ? $_SESSION["user_type"] : null;
if (!$user_id || $user_role == "user") {
  header("location:../index.php?error=noadmin");
  exit();
}

require_once "./db.php";
require_once "./user_functionality.php";

if (isset($_POST["del-user-id"])) {
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
    header("location:../pages/admin.php?error=deletedisallowed");
    exit();
  }
  delete_user($id_to_delete);
  header("location:../pages/admin.php?status=userdeleted");
} elseif (
  isset($_POST["edit-user-email"]) ||
  isset($_POST["edit-user-first-name"]) ||
  isset($_POST["edit-user-last-name"]) ||
  isset($_POST["edit-user-password"]) ||
  isset($_FILES["edit-user-image"]) ||
  isset($_POST["edit-user-type"])
) {
  $id_to_edit = $_POST["edit-user-id"];
  $edited_user = get_user($id_to_edit);
  $tmp_img_url = $_FILES["edit-user-image"]["tmp_name"];

  //
  //WARN:
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ASSESSMENT: Same as above but for editing user data
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //

  if ($edited_user->user_type != "user" && $_SESSION["user_type"] != "owner") {
    header("location:../pages/admin.php?error=editdisallowed");
    exit();
  }

  $new_user_data = new User();
  $new_user_data->user_id = $id_to_edit;
  $new_user_data->user_email = $_POST["edit-user-email"];
  $new_user_data->user_firstname = $_POST["edit-user-first-name"];
  $new_user_data->user_lastname = $_POST["edit-user-last-name"];
  $new_user_data->user_type = $_POST["edit-user-type"];

  if (
    $_FILES["edit-user-image"]["name"] != "" &&
    isset($_FILES["edit-user-image"])
  ) {
    try {
      $attempt_store_img = store_user_img($tmp_img_url);
      // if failed storing image from api reponse assign default image
      if ($attempt_store_img == false) {
        $new_user_data->user_img = "default.jpg";
      } else {
        // else filename string was returned thus assign to user_img
        $new_user_data->user_img = $attempt_store_img;
      }
    } catch (Exception) {
      // if any other fails just assign a default image
      $new_user_data->user_img = "default.jpg";
    }
  } else {
    $new_user_data->user_img = $edited_user->user_img;
  }
  $new_user_data->user_auth_method = $edited_user->user_auth_method; // not editable, stays the same
  $new_user_data->user_registration = $edited_user->user_registration; // not editable, stays the same

  $new_user_password = new UserPassword();
  $new_user_password->user_id = $id_to_edit;
  $new_user_password->__set_password($_POST["edit-user-password"]);

  $res_data = update_user($new_user_data);
  $res_pass = update_user_password($new_user_password);
  if ($res_data && $res_pass) {
    if (
      $new_user_data->user_img != "default.jpg" &&
      $new_user_data->user_img != ""
    ) {
      try {
        $new_img_filename =
          $id_to_edit .
          "_" .
          strtolower($new_user_data->user_firstname) .
          "_" .
          strtolower($new_user_data->user_lastname) .
          ".jpg";
        rename(
          "../res/user_img/" . $new_user_data->user_img,
          "../res/user_img/" . $new_img_filename
        );
        rename_new_img($new_img_filename, $id_to_edit);
      } catch (Exception) {
        header("Location:../pages/admin.php?error=errorimg");
      }
    }
    header("location:../pages/admin.php?status=userupdated");
    exit();
  } elseif (!$res_data && $res_pass) {
    header("location:../pages/admin.php?error=passupdateddatafailed");
    exit();
  } elseif ($res_data && !$res_pass) {
    header("location:../pages/admin.php?error=dataupdatedpassfailed");
    exit();
  } else {
    header("location:../pages/admin.php?error=dataupdatedpassfailed");
    exit();
  }
  // if ($_FILES["edit-user-image"]["error"] === UPLOAD_ERR_OK) {
  //   // Echo the name of the received file
  //   echo "Received file: " . $_FILES["edit-user-image"]["name"];
  // } else {
  //   echo "No file received or file upload error.";
  // }
}
