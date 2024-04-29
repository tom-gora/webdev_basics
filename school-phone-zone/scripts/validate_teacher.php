<?php
if (isset($_POST["username"]) && isset($_POST["password"])) {
  $username = $_POST["username"];
  $password = $_POST["password"];
  $username = strtolower($username);
  if ($username === "sajjad" && $password === "1367") {
    session_start();
    $_SESSION["teacher_access"] = "granted";
    header("Location:./index.php");
  } else {
    header("Location:./teacher-gate.php");
  }
}
