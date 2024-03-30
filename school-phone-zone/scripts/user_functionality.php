<?php
class User
{
  public int $user_id;
  public string $user_name;
  public string $user_email;
  public string $user_type;
  public string $user_img;
  public string $user_phone;
  public string $user_code;
}

class UserPassword
{
  public string $user_id;
  public string $user_password;

  private function __expose_password()
  {
    return $this->user_password;
  }
}

function get_users_array()
{
  require_once "db.php";
  $connection = get_mysqli();
  $query = "SELECT * FROM users";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die("Error getting users from database");
  }
  $users = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $user = new User();
    $user->user_id = $row["user_id"];
    $user->user_name = $row["user_name"];
    $user->user_email = $row["user_email"];
    $user->user_type = $row["user_type"];
    $user->user_img = $row["user_img"];
    array_push($users, $user);
  }
  mysqli_close($connection);
  return $users;
}

function get_user(int $user_id)
{
  require_once "db.php";
  $connection = get_mysqli();
  $query = "SELECT * FROM users WHERE user_id = '$user_id'";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die("Error getting user from database");
  }
  $fetched_user = new User();
  $fetched_user->user_id = $user_id;
  $fetched_user->user_name = mysqli_fetch_assoc($result)["user_name"];
  $fetched_user->user_email = mysqli_fetch_assoc($result)["user_email"];
  $fetched_user->user_type = mysqli_fetch_assoc($result)["user_type"];
  $fetched_user->user_img = mysqli_fetch_assoc($result)["user_img"];

  mysqli_close($connection);
  return $fetched_user;
}

function delete_user(int $user_id)
{
  require_once "db.php";
  $connection = get_mysqli();
  $query = "DELETE FROM users WHERE user_id = '$user_id'";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die("Error deleting user from database");
  }
  mysqli_close($connection);
}

function get_user_password(int $user_id)
{
  require_once "db.php";
  $connection = get_mysqli();
  $query = "SELECT user_password FROM users WHERE user_id = '$user_id'";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die("Error getting user password from database");
  }
  $fetched_pass_obj = new UserPassword();
  $fetched_pass_obj->user_id = $user_id;
  $fetched_pass_obj->user_password = mysqli_fetch_assoc($result)[
    "user_password"
  ];
  mysqli_close($connection);
  return $fetched_pass_obj;
  // to get password object needs being initialized then private func called
}

function update_user_password(string $new_password, UserPassword $pass_obj)
{
  $hashed_password = md5($new_password);
  require_once "db.php";
  $connection = get_mysqli();
  $query = "UPDATE users SET user_password = '{$hashed_password}' WHERE user_id = '$pass_obj->user_id'";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die("Error updating user password in database");
    header("Location:../pages/profile.php?error=internalerr");
  }
  mysqli_close($connection);
  header("Location:../pages/profile.php?success=passupdated");
  exit();
}
