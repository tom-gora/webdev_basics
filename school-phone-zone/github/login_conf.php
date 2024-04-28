<?php
// using https://github.com/thephpleague/oauth2-github

//abstracted to a function to not expose details

require "vendor/autoload.php";

function get_github_auth_url()
{
  $oauth_json_raw = base64_decode(getenv("GITHUB_CLIENT_JSON"));
  $oauth_obj = json_decode($oauth_json_raw, true);
  $provider = new League\OAuth2\Client\Provider\Github([
    "clientId" => $oauth_obj["web"]["client_id"],
    "clientSecret" => $oauth_obj["web"]["client_secret"],
    "redirectUri" => "http://localhost/phonezone/scripts/oauth_handler.php",
  ]);
  // If we don't have an authorization code then get one
  return $provider->getAuthorizationUrl();
}
