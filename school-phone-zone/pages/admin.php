<!-- source for box shadow snippets https://manuarora.in/boxshadows -->
<!-- animations from https://www.tailwindcss-animated.com/ -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PhoneZone - Admin Panel</title>
    <link href="../css/output/tailwind-styles.css" rel="stylesheet" />
    <!--NOTE: Logo font used is: Suez One-->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Suez+One&display=swap"
      rel="stylesheet" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="../css/globals.css" />
  </head>

  <body class="h-screen items-center bg-gray-100 md:pt-24">
<?php
session_start();
$user_id = isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : null;
$user_role = isset($_SESSION["user_type"]) ? $_SESSION["user_type"] : null;
if (!$user_id || $user_role == "user") {
  header("location:../index.php?error=noadmin");
  exit();
}

//only establish connection after confirming session status
require_once "../scripts/db.php";
require_once "../scripts/user_functionality.php";
require_once "../google/login_conf.php";
$connection = get_mysqli();
$nav_html = file_get_contents("../html_components/navigation.html");
$users_grid_html = file_get_contents(
  "../html_components/admin_panel_user_grid.html"
);
$user_card_html = file_get_contents("../html_components/admin_user_card.html");
$footer_html = file_get_contents("../html_components/footer.html");

$users = get_users_array();
$users_cards_html_stringbuilder = "";
foreach ($users as $user) {
  $formatted_date = $user->user_registration->format("d/m/Y");
  //  $pass_obj = get_user_password($user->user_id);
  $auth_as_string;
  switch ($user->user_auth_method) {
    case "1":
      $auth_as_string = "Email";
      break;
    case "2":
      $auth_as_string = "Google";
      break;
    case "3":
      $auth_as_string = "Github";
      break;
  }
  $next_user_card_html = str_replace(
    [
      "USER_ID",
      "USER_NAME",
      "USER_EMAIL",
      "USER_REGISTRATION",
      "USER_ROLE",
      "USER_AUTH_METHOD",
      "USER_FIRST_NAME",
      "USER_LAST_NAME",
      "USER_IMG",
      "USER_TYPE",
    ],
    [
      $user->user_id,
      $user->user_firstname . " " . $user->user_lastname,
      $user->user_email,
      $formatted_date,
      ucfirst($user->user_type),
      $auth_as_string,
      $user->user_firstname,
      $user->user_lastname,
      $user->user_img,
      $user->user_type,
    ],
    $user_card_html
  );
  //
  //WARN:
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ASSESSMENT: this is accomplishing task 3 in my implementation on the front end by hiding buttons (additional prevention)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //
  if ($_SESSION["user_type"] != "owner" && $user->user_type != "user") {
    $next_user_card_html = str_replace(
      ["del-btn", "edit-btn", "forbidden hidden"],
      ["hidden", "hidden", "mr-2"],
      $next_user_card_html
    );
  }
  $users_cards_html_stringbuilder .= $next_user_card_html;
}

$nav_html = str_replace(
  ["res/logo-h.png", 'href="index.php"', "scripts/logout.php"],
  ["../res/logo-h.png", 'href="../index.php"', "../scripts/logout.php"],
  $nav_html
);
$nav_html = str_replace(
  ["for-logged-in hidden", "for-logged-in group hidden"],
  ["", "group"],
  $nav_html
);
$query = "SELECT user_img FROM users WHERE user_id = '$user_id'";
$result = mysqli_query($connection, $query);
$row = mysqli_fetch_assoc($result);

$nav_html = str_replace(["PROFILE_USER_IMG"], [$row["user_img"]], $nav_html);

$users_grid_html = str_replace(
  ["ADMIN_USERS_CARDS"],
  [$users_cards_html_stringbuilder],
  $users_grid_html
);

echo $nav_html;
echo $users_grid_html;
echo $footer_html;
?>
    <script type="text/javascript" src="../js/admin.js"></script>
  </body>
</html>
