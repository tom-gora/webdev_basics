<?php
session_start();
require_once "utils.php";
if (isset($_SESSION["user_id"])) {
  unset($_SESSION["user_id"]);
  session_destroy();
  redirect_with_query("../index.php", ["status" => "loggedout"]);
}
