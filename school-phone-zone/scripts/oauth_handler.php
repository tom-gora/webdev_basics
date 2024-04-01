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
    get_token($authorization_code);
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

function get_token($code)
{
  // reference used:
  // https://codeshack.io/implement-google-login-php/#process-curl-requests
  // TODO: handle google oauth
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
  $profile = json_decode($response, true);
  //for quick show so sajjad can see data is received not hardcoded
  echo "<script>console.log(" . json_encode($profile) . ")</script>";
}
