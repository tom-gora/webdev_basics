<!-- source for box shadow snippets https://manuarora.in/boxshadows -->
<!-- animations from https://www.tailwindcss-animated.com/ -->
<!doctype html>
<html lang="en" data-theme="light">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PhoneZone Products</title>
  <link rel="icon" type="image/png" href="../res/favicon.ico" />
  <link href="../css/output/tailwind-styles.css" rel="stylesheet" />
  <link rel="stylesheet" href="../css/globals.css">
</head>


<body class="h-screen flex flex-col items-center gap-4 md:pt-24">
<?php
define("ALLOW_REQUIRED_SCRIPTS", true);
session_start();

// bring in the php scripts
require_once "../scripts/db.php";
require_once "../scripts/products_functionality.php";
require_once "../google/login_conf.php";
require_once "../github/login_conf.php";

// grab markup for my html components
$cart_sidebar = file_get_contents("../html_components/cart_sidebar.html");
$nav_html = file_get_contents("../html_components/navigation.html");
$mobile_toggle = file_get_contents("../html_components/mobile_toggle.html");
$phone_card_html = file_get_contents("../html_components/phone_card.html");
$grid_html = file_get_contents("../html_components/products_grid.html");
$footer_html = file_get_contents("../html_components/footer.html");
$pagination_html = file_get_contents("../html_components/pagination.html");
$login_dialog_html = file_get_contents("../html_components/dialog_login.html");
$reg_dialog_html = file_get_contents("../html_components/dialog_register.html");

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
  $login_dialog_html = str_replace(
    ["GOOGLE_API_URL", "GITHUB_API_URL"],
    [
      "window.location = '" . $google_login_button_target . "';",
      "window.location = '" . $github_login_button_target . "';",
    ],
    $login_dialog_html
  );

  $nav_html = str_replace(
    [
      "for-logged-out nav-link hidden",
      "for-logged-out mb-auto mt-4 hidden",
      "scripts/login.php",
    ],
    ["nav-link", "mb-auto mt-24", "../scripts/login.php"],
    $nav_html
  );
} else {
  // changes when user is logged in
  require_once "../scripts/user_functionality.php";
  $logged_in_mf = get_user($_SESSION["user_id"]);
  $nav_html = str_replace(
    [
      "for-logged-in nav-link hidden",
      "for-logged-in nav-link group hidden",
      "pages/profile.php",
      "scripts/logout.php",
      "res/user_img/PROFILE_USER_IMG",
    ],
    [
      "nav-link",
      "nav-link group",
      "../pages/profile.php",
      "../scripts/logout.php",
      "../res/user_img/" . $logged_in_mf->user_img,
    ],
    $nav_html
  );
}

$grid_html = str_replace(
  ["SECTION_TITLE", "bg-bg-light", "dark:bg-bg-darker", "col-span-full grid"],
  [
    "OUR PHONES RANGE",
    "bg-bg-lighter",
    "dark:bg-bg-dark",
    "col-span-full grid pt-4",
  ],
  $grid_html
);

$grid_html = str_replace("pb-16", "pb-8", $grid_html);

$connection = get_mysqli();
$query = "SELECT COUNT(product_id) AS total_products FROM products;";
$statement = mysqli_prepare($connection, $query);
if (!$statement) {
  mysqli_close($connection);
  $err_msg_params = ["error_msg" => "err_retrieving_products_count_01"];
  redirect_with_query("../index.php", $err_msg_params);
}
$result = mysqli_stmt_execute($statement);
if (!$result) {
  db_tidy_up($statement, $connection);
  $err_msg_params = ["error_msg" => "err_retrieving_products_count_02"];
  redirect_with_query("../index.php", $err_msg_params);
}
$result = mysqli_stmt_get_result($statement);
db_tidy_up($statement, $connection);
$row = mysqli_fetch_assoc($result);
$total_products = $row["total_products"];

$pagination_html = str_replace(
  ['id="pagination"'],
  ['id="pagination" data-total-products=' . $total_products],
  $pagination_html
);
$pagination_html = str_replace("scale-90", "pb-16", $pagination_html);

//pout stuff onto a page and send to browser
echo $cart_sidebar;
echo $login_dialog_html;
echo $reg_dialog_html;
echo $nav_html;
echo $grid_html;
echo $pagination_html;
echo $footer_html;
echo $mobile_toggle;
?>
<script type="module" src="../js/navigation.js"></script>
<script defer type="module" src="../js/cart.js"></script>
<script type="module" src="../js/products.js"></script>
</body>
