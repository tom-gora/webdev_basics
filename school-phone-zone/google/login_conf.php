<?php
//abstracted to a function to not expose details
function get_google_login_url()
{
  require_once "vendor/autoload.php";

  $oauth_json_raw = getenv("GOOGLE_CLIENT_JSON");
  $oauth_obj = json_decode($oauth_json_raw, true);

  //Make object of Google API Client for call Google API
  $google_client = new Google_Client();

  //Set the OAuth 2.0 Client ID
  $google_client->setClientId($oauth_obj["web"]["client_id"]);

  //Set the OAuth 2.0 Client Secret key
  $google_client->setClientSecret($oauth_obj["web"]["client_secret"]);

  //Set the OAuth 2.0 Redirect URI
  $google_client->setRedirectUri($oauth_obj["web"]["redirect_uris"][0]);
  $google_client->setRedirectUri(
    "http://localhost:9000/scripts/oauth_handler.php"
  );

  // to get the email and profile
  $google_client->addScope("email");

  $google_client->addScope("profile");

  $google_client->setApplicationName("PhoneZone");

  $google_client->getAccessToken();

  return $google_client->createAuthUrl();
}
