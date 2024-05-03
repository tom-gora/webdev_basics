<!-- source for box shadow snippets https://manuarora.in/boxshadows -->
<!-- animations from https://www.tailwindcss-animated.com/ -->
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PhoneZone Products</title>
  <link rel="icon" type="image/png" href="../res/favicon.png" />
  <link href="../css/output/tailwind-styles.css" rel="stylesheet" />
  <!--NOTE: Logo font used is: Suez One-->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Suez+One&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/globals.css">
</head>


<body class="bg-gray-100 h-screen flex flex-col items-center gap-4 md:pt-[5.5rem]">
<?php
define("ALLOW_REQUIRED_SCRIPTS", true);
session_start();

// bring in the php scripts
require_once "../scripts/db.php";
require_once "../scripts/products_functionality.php";
require_once "../google/login_conf.php";
require_once "../github/login_conf.php";

// grab markup for my html components
$nav_html = file_get_contents("../html_components/navigation.html");
$phone_card_html = file_get_contents("../html_components/phone_card.html");
$grid_html = file_get_contents("../html_components/products_grid.html");
$footer_html = file_get_contents("../html_components/footer.html");

// inject google api url and control what html to show for logged in and logged out users
$google_login_button_target = get_google_login_url();
$github_login_button_target = get_github_auth_url();
$github_login_button_target = $github_login_button_target . "&scope=user:email";

// changes regardless of logged in or logged out
$nav_html = str_replace(
  ["res/logo-h.png", 'href="index.php"', "pages/products.php"],
  ["../res/logo-h.png", 'href="../index.php"', "../pages/products.php"],
  $nav_html
);

if (!isset($_SESSION["user_id"])) {
  // changes when user is logged out
  $nav_html = str_replace(
    [
      "GOOGLE_API_URL",
      "GITHUB_API_URL",
      "for-logged-out hidden",
      "for-logged-out mb-auto mt-24 hidden",
      "scripts/login.php",
    ],
    [
      "window.location = '" . $google_login_button_target . "';",
      "window.location = '" . $github_login_button_target . "';",
      "",
      "mb-auto mt-24",
      "../scripts/login.php",
    ],
    $nav_html
  );
} else {
  // changes when user is logged in
  require_once "../scripts/user_functionality.php";
  $logged_in_mf = get_user($_SESSION["user_id"]);
  $nav_html = str_replace(
    [
      "for-logged-in hidden",
      "for-logged-in group hidden",
      "pages/profile.php",
      "scripts/logout.php",
      "res/user_img/PROFILE_USER_IMG",
    ],
    [
      "",
      "group",
      "../pages/profile.php",
      "../scripts/logout.php",
      "../res/user_img/" . $logged_in_mf->user_img,
    ],
    $nav_html
  );
}

//build products grid markup
$products = get_products();
shuffle($products);
$products_cards_html_stringbuilder = "";
foreach ($products as $product) {
  $next_product_card_html = str_replace(
    [
      "PRODUCT_NAME",
      "PRODUCT_PRICE",
      "res/phones/PRODUCT_IMG_PATH",
      "promo-sticker",
    ],
    [
      $product->product_name,
      $product->product_price,
      "../res/phones/" . $product->product_img_path,
      "hidden",
    ],
    $phone_card_html
  );
  $products_cards_html_stringbuilder .= $next_product_card_html;
}

$grid_html = str_replace(
  ["SECTION_TITLE", "PRODUCTS_GRID"],
  ["OUR PHONES RANGE", $products_cards_html_stringbuilder],
  $grid_html
);

//pout stuff onto a page and send to browser
echo $nav_html;
echo $grid_html;
echo $footer_html;
?>

</body>
