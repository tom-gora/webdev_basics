<?php
function get_mysqli()
{
  $pass = getenv("MYSQL_PASS_TOMANO");
  $connection = mysqli_connect("localhost", "tomano", $pass, "phonezone", 3306);
  if (!$connection) {
    die("Error connecting to database");
  }
  return $connection;
}
