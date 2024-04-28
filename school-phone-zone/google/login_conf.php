<?php
// using https://github.com/thephpleague/oauth2-github

//abstracted to a function to not expose details

require "vendor/autoload.php";

function get_google_login_url()
{
  $oauth_json_raw = base64_decode(getenv("GOOGLE_CLIENT_JSON"));
  $oauth_obj = json_decode($oauth_json_raw, true);
  $provider = new League\OAuth2\Client\Provider\Google([
    "clientId" => $oauth_obj["web"]["client_id"],
    "clientSecret" => $oauth_obj["web"]["client_secret"],
    "redirectUri" => $oauth_obj["web"]["redirect_uris"][0],
    "accessType" => "online",
    "scopes" => ["email", "profile"],
  ]);
  $url = $provider->getAuthorizationUrl();
  $url = preg_replace("/([&?])state=[^&]*(&|$)/", "&state&", $url);
  $url = str_replace("openid%20", "", $url);
  $url = $url . "&approval_prompt=auto";

  return $url;
}
