<!-- source for box shadow snippets https://manuarora.in/boxshadows -->
<!-- animations from https://www.tailwindcss-animated.com/ -->
<?php
// this is logged in content exclusively so first grab the user data
// plus make sure no regular user is trying to access this page
define("ALLOW_REQUIRED_SCRIPTS", true);
session_start();
$user_id = isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : null;
$user_role = isset($_SESSION["user_type"]) ? $_SESSION["user_type"] : null;
if (!$user_id || $user_role == "user") {
  header("location:../index.php?error=noadmin");
  exit();
}
?>

<!-- begin markup -->
<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PhoneZone - Admin Panel</title>
    <link rel="icon" type="image/png" href="../res/favicon.png" />
    <link href="../css/output/tailwind-styles.css" rel="stylesheet" />
    <link rel="stylesheet" href="../css/globals.css" />
  </head>

  <body class="h-screen items-center bg-[--background-light]">
    <?php
    //only establish connection after confirming session status
    require_once "../scripts/db.php";
    require_once "../scripts/user_functionality.php";
    require_once "../google/login_conf.php";

    // get the markup
    $nav_html = file_get_contents("../html_components/navigation.html");
    $users_grid_html = file_get_contents(
      "../html_components/admin_panel_user_grid.html"
    );
    $user_card_html = file_get_contents(
      "../html_components/admin_user_card.html"
    );
    $footer_html = file_get_contents("../html_components/footer.html");

    // get the users
    $users = get_users_array();
    $users_cards_html_stringbuilder = "";

    //In a loop step 1:
    //put the unconditional content into each user's card html
    foreach ($users as $user) {
      $formatted_date = $user->user_registration->format("d/m/Y");
      $auth_as_string;
      // switch case for auth method to show readble strings not codes
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
      // per user insert personal details
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
      // In a loop step 2:
      // put the conditional content into each user's card html to not show UI
      // allowing for editing admin/owner unless owner is logged in by hiding it
      // for everyone else
      if ($_SESSION["user_type"] != "owner" && $user->user_type != "user") {
        $users_grid_html = str_replace(
          [
            '<option value="admin">Admin</option>',
            '<option value="owner">Owner</option>',
          ],
          ["", ""],
          $users_grid_html
        );
        $next_user_card_html = str_replace(
          ["del-btn", "edit-btn", "forbidden flex hidden"],
          ["hidden", "hidden", "flex mr-2"],
          $next_user_card_html
        );
      }
      // with the card ready concat it to the stringbuilder var
      $users_cards_html_stringbuilder .= $next_user_card_html;
    }

    // insert the markup into a grid wrapper
    $users_grid_html = str_replace(
      ["ADMIN_USERS_CARDS"],
      [$users_cards_html_stringbuilder],
      $users_grid_html
    );

    //get the logged in user avatar for the navigation miniature
    $connection = get_mysqli();
    $query = "SELECT user_img FROM users WHERE user_id = '$user_id'";
    $result = mysqli_query($connection, $query);
    $row = mysqli_fetch_assoc($result);

    //fix nav as usual - links, details etc specific per page
    $nav_html = str_replace(
      [
        "res/user_img/PROFILE_USER_IMG",
        "for-logged-in nav-link hidden",
        "for-logged-in nav-link group hidden",
        "res/logo-h.png",
        'href="index.php"',
        "pages/products.php",
        "pages/profile.php",
        "scripts/logout.php",
      ],
      [
        "../res/user_img/" . $row["user_img"],
        "nav-link",
        "nav-link group",
        "../res/logo-h.png",
        'href="../index.php"',
        "../pages/products.php",
        "../pages/profile.php",
        "../scripts/logout.php",
      ],
      $nav_html
    );

    // add content onto the page before shipping to client
    echo $nav_html;
    echo $users_grid_html;
    echo $footer_html;
    ?>

<script type="module" src="../js/admin.js"></script>
  </body>
</html>
