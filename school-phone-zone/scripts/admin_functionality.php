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

if (isset($_POST["user-id"])) {
  $id_to_delete = $_POST["user-id"];
  $user_to_delete_type = get_user_type_by_id($id_to_delete);
  //
  //WARN:
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ASSESSMENT: this is securing task 3 requirement on the server side
  // even if someone could somehow html post correct data to this script
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
}
