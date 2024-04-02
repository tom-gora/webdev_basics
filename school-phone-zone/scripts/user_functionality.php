<?php
class User
{
  public int $user_id;
  public string $user_email;
  public DateTime $user_registration;
  public string $user_firstname;
  public string $user_lastname;
  public string $user_img;
  public string $user_type;
  public string $user_auth_method;
}
class UserPassword
{
  public string $user_id;
  private ?string $user_password;
  public function __get_password()
  {
    return $this->user_password;
  }
  public function __set_password(?string $new_password)
  {
    $this->user_password = $new_password;
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
    $user->user_email = $row["user_email"];
    $user->user_registration = new DateTime($row["user_registration"]);
    $user->user_firstname = $row["user_firstname"];
    $user->user_lastname = $row["user_lastname"];
    //with null check
    $user->user_img = $row["user_img"] ?: "default.jpg";
    $user->user_type = $row["user_type"];
    $user->user_auth_method = $row["user_auth_method"];
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
  $fetched_user->user_email = mysqli_fetch_assoc($result)["user_email"];
  $fetched_user->user_registration = mysqli_fetch_assoc($result)[
    "user_registration"
  ];
  $fetched_user->user_firstname = mysqli_fetch_assoc($result)["user_firstname"];
  $fetched_user->user_lastname = mysqli_fetch_assoc($result)["user_lastname"];
  // with null check
  $fetched_user->user_img =
    mysqli_fetch_assoc($result)["user_img"] ?: "default.jpg";
  $fetched_user->user_type = mysqli_fetch_assoc($result)["user_type"];
  $fetched_user->user_auth_method = mysqli_fetch_assoc($result)[
    "user_auth_method"
  ];

  mysqli_close($connection);
  return $fetched_user;
}

function add_user(User $user, ?string $user_password)
{
  require_once "db.php";
  $connection = get_mysqli();
  $pass_insert = null;
  if ($user_password != "") {
    $pass_insert = md5($user_password);
  }
  $formatted_date = $user->user_registration->format("Y-m-d");
  $query = "INSERT INTO users (user_email, user_registration, user_firstname, user_lastname, user_password, user_img, user_type, user_auth_method ) VALUES (
  '$user->user_email', 
  '$formatted_date',
  '$user->user_firstname', 
  '$user->user_lastname', 
  '$pass_insert',
  '$user->user_img', 
  '$user->user_type', 
  '$user->user_auth_method')";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die("Error adding user to database");
  }
  mysqli_close($connection);
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
  // $fetched_pass_obj->user_password = mysqli_fetch_assoc($result)[
  //   "user_password"
  // ];
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

function check_if_email_exists(string $email)
{
  require_once "db.php";
  $connection = get_mysqli();
  $query = "SELECT * FROM users WHERE user_email = '$email'";
  $result = mysqli_query($connection, $query);
  if (mysqli_num_rows($result) > 0) {
    mysqli_close($connection);
    return true;
  }
  mysqli_close($connection);
  return false;
}

function get_id_by_existing_email(string $email)
{
  require_once "db.php";
  $connection = get_mysqli();
  $query = "SELECT user_id FROM users WHERE user_email = '$email'";
  $result = mysqli_query($connection, $query);
  if ($result) {
    $row = mysqli_fetch_assoc($result);
    return $row["user_id"];
  }

  return false;
}

function update_img_filename(string $new_img_filename, int $user_id)
{
  require_once "db.php";
  $connection = get_mysqli();
  $query = "UPDATE users SET user_img = '$new_img_filename' WHERE user_id = '$user_id'";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die("Error updating user img filename in database");
  }
  mysqli_close($connection);
}

function store_user_img($user_img_url)
{
  $random_int = rand(1000000000, 9999999999);
  $user_img_temp_path = "../res/user_img/" . $random_int . "_temp.jpg";
  $img_data = file_get_contents($user_img_url);
  if ($img_data == false) {
    return false;
  }
  $img_data = base64_encode($img_data);
  $img_data = str_replace("data:image/jpeg;base64,", "", $img_data);
  $img_data = str_replace(" ", "+", $img_data);
  file_put_contents($user_img_temp_path, base64_decode($img_data));
  return $random_int . "_temp.jpg";
}
