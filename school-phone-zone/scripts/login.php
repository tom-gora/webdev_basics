<?php

include_once "db.php";
$connection = get_mysqli();

if (isset($_POST["email"]) && isset($_POST["password"])) {
  $email = mysqli_real_escape_string($connection, $_POST["email"]);
  $password = mysqli_real_escape_string($connection, md5($_POST["password"]));

  $user_query = "SELECT * FROM users WHERE user_email = '$email' AND user_password = '$password'";

  $result = mysqli_query($connection, $user_query);
  if (mysqli_num_rows($result) == 0) {
    header("Location:../index.php?error=nouser");
    exit();
  } elseif (mysqli_num_rows($result) != 1) {
    header("Location: ../index.php?error=internalerr");
    exit();
  }
  session_start();
  $row = mysqli_fetch_assoc($result);
  $_SESSION["user_id"] = $row["user_id"];
  header("Location: profile.php");
}
?>
