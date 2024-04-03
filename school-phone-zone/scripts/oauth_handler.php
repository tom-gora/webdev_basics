<?php
$handler_case = "";
if (
  isset($_GET["code"]) &&
  str_contains($_GET["scope"], "www.googleapis.com")
) {
  $handler_case = "google_handle_auth_code";
} elseif (isset($_GET["code"]) && str_contains($_GET["scope"], "github.com")) {
  $handler_case = "github_handle_auth_code";
} else {
  $handler_case = "handle_auth_error";
}

switch ($handler_case) {
  case "google_handle_auth_code":
    if (!isset($_GET["code"]) || empty($_GET["code"])) {
      echo "No authorization code found";
      header("Location:../index.php?error=autherror");
      exit();
    }
    $authorization_code = $_GET["code"];
    handle_google($authorization_code);
    break;
  case "github_handle_auth_code":
    $authorization_code = $_GET["code"];
    break;
  case "handle_auth_error":
    header("Location:../index.php?error=autherror");
    exit();
    break;
  default:
    header("Location:../index.php?error=autherror");
    exit();
    break;
}

function handle_google($code)
{
  // reference used:
  // https://codeshack.io/implement-google-login-php/#process-curl-requests
  // TODO: handle google oauth
  require_once "./user_functionality.php";
  $oauth_json_raw = getenv("GOOGLE_CLIENT_JSON");
  $oauth_obj = json_decode($oauth_json_raw, true);
  $query_params = [
    "code" => $code,
    "client_id" => $oauth_obj["web"]["client_id"],
    "client_secret" => $oauth_obj["web"]["client_secret"],
    "redirect_uri" => "http://localhost:9000/scripts/oauth_handler.php",
    "grant_type" => "authorization_code",
  ];
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, "https://accounts.google.com/o/oauth2/token");
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($query_params));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $response = curl_exec($ch);
  curl_close($ch);
  $response = json_decode($response, true);
  if (!isset($response["access_token"]) || empty($response["access_token"])) {
    header("Location:../index.php?error=autherror");
    exit();
  }

  $ch = curl_init();
  curl_setopt(
    $ch,
    CURLOPT_URL,
    "https://www.googleapis.com/oauth2/v2/userinfo"
  );
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $response["access_token"],
  ]);
  $response = curl_exec($ch);
  curl_close($ch);
  $google_profile_data = json_decode($response, true);
  //for quick show so sajjad can see data is received not hardcoded
  $response = json_encode($google_profile_data);
  echo "<script>console.log(" . $response . ")</script>";

  //
  //WARN:
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ASSESSMENT: this is one place where task 4 is handled for google oauth2 case
  // it takes care of several routes. Email taken, but with different auth method,
  // email not taken at all and thus registration of new user, or email taken
  // but already authenticated with google, then log this user in successfully
  // details in comments for each section of code
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //
  $email_to_check = $google_profile_data["email"];
  //if email present in db two options
  if (check_if_email_exists($email_to_check)) {
    // check if registered via google oauth
    require_once "./db.php";
    $connection = get_mysqli();
    $query = "SELECT user_auth_method FROM users WHERE user_email = '$email_to_check'";
    $result = mysqli_query($connection, $query);
    // fail if query fails guard clause check
    if (!$result) {
      die("Error getting user auth method from database");
      header("Location:../index.php?error=internalerr");
      exit();
    }
    $row = mysqli_fetch_assoc($result);
    $user_auth_method = $row["user_auth_method"];
    // if user registered via google oauth proceed
    if ($user_auth_method == 2) {
      session_start();
      $id = get_id_by_existing_email($email_to_check);
      $type = get_user_type_by_id($id);
      $_SESSION["user_id"] = $id;
      $_SESSION["user_type"] = $type;
      header("Location:../pages/profile.php");
    } else {
      // else (different method of registration) back to main page to display info
      header("Location:../index.php?error=emailtaken");
    }
    //the only remaining route is registration
  } else {
    $new_user = new User();
    $user_img_url = $google_profile_data["picture"];
    try {
      $attempt_store_img = store_user_img($user_img_url);
      // if failed storing image from api reponse assign default image
      if ($attempt_store_img == false) {
        $new_user->user_img = "default.jpg";
      } else {
        // else filename string was returned thus assign to user_img
        $new_user->user_img = $attempt_store_img;
      }
    } catch (Exception) {
      // if any other fails just assign a default image
      $new_user->user_img = "default.jpg";
    }
    $new_user->user_id = -1;
    $new_user->user_email = $email_to_check;
    $new_user->user_registration = new DateTime(date("Y-m-d"));
    $new_user->user_firstname = $google_profile_data["given_name"];
    $new_user->user_lastname = $google_profile_data["family_name"];
    $new_user->user_type = "user";
    $new_user->user_auth_method = 2; // 2 for google

    // with oauth store user with null password
    add_user($new_user, "");
    $stored_user_id = get_id_by_existing_email($email_to_check);
    // after successfully adding grab next assigned ID (providing it worked else fail)
    if ($stored_user_id == false) {
      header("Location:../index.php?error=internalerr");
      exit();
    }

    //if adding image under temp name worked and it is not a default image
    // attempt to rename it with final user ID coming from the DB and their name
    // (id in sync with the DB )
    if ($new_user->user_img != "default.jpg") {
      try {
        $new_img_filename =
          $stored_user_id .
          "_" .
          strtolower($new_user->user_firstname) .
          "_" .
          strtolower($new_user->user_lastname) .
          ".jpg";
        rename(
          "../res/user_img/" . $new_user->user_img,
          "../res/user_img/" . $new_img_filename
        );
        rename_new_img($new_img_filename, $stored_user_id);
      } catch (Exception) {
        header("Location:../index.php?error=errorimg");
      }
    }
    // after registration redirect to profile page
    session_start();
    $id = get_id_by_existing_email($email_to_check);
    $type = get_user_type_by_id($id);
    $_SESSION["user_id"] = $id;
    $_SESSION["user_type"] = $type;
    header("Location:../pages/profile.php");
  }
}
