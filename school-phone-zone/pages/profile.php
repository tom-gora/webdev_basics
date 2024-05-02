<!-- source for box shadow snippets https://manuarora.in/boxshadows -->
<!-- animations from https://www.tailwindcss-animated.com/ -->
<?php
// this is logged in content exclusively so first grab the user data
define("ALLOW_REQUIRED_SCRIPTS", true);
session_start();
$user_id = isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : null;

//disallow not logged in users
if (!$user_id) {
  header("location:../index.php?error=nologin");
  exit();
}
//only start work and involve database when confirmed session status
require_once "../scripts/db.php";
require_once "../scripts/user_functionality.php";
require_once "../google/login_conf.php";
require_once "../github/login_conf.php";
$connection = get_mysqli();
$query = "SELECT * FROM users WHERE user_id = '$user_id'";
$result = mysqli_query($connection, $query);
$row = mysqli_fetch_assoc($result);

//construct current user object
$logged_in_mf = new User();
$logged_in_mf->user_id = $user_id;
$logged_in_mf->user_email = $row["user_email"];
$logged_in_mf->user_registration = new DateTime($row["user_registration"]);
$logged_in_mf->user_firstname = $row["user_firstname"];
$logged_in_mf->user_lastname = $row["user_lastname"];
$logged_in_mf->user_img = $row["user_img"] ?: "default.jpg";
$logged_in_mf->user_type = $row["user_type"];
$logged_in_mf->user_auth_method = $row["user_auth_method"];

//preformat the date for the page
$formatted_date = $logged_in_mf->user_registration->format("d M y");
?>

<!-- begin markup -->
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/png" href="../res/favicon.png" />
    <title>PhoneZone
      <?php echo " - Your profile: " .
        $logged_in_mf->user_firstname .
        " " .
        $logged_in_mf->user_lastname; ?>

    </title>
  <link href="../css/output/tailwind-styles.css" rel="stylesheet" />
  <!--NOTE: Logo font used is: Suez One-->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Suez+One&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="../css/globals.css">
</head>


<body class="bg-gray-100 h-screen flex flex-col items-center gap-4 md:pt-24">
<?php
// bring in the base markup for my html components
$nav_html = file_get_contents("../html_components/navigation.html");
$profile_header_html = file_get_contents(
  "../html_components/profile_header.html"
);
$html_containing_form = file_get_contents(
  "../html_components/admin_panel_user_grid.html"
);
$temp_dom = new DOMDocument();
@$temp_dom->loadHTML($html_containing_form);
$edit_form = $temp_dom->getElementById("edit-dialog");
@$del_form = $temp_dom->getElementById("del-dialog");

$edit_form = $temp_dom->saveHTML($edit_form);
$del_form = $temp_dom->saveHTML($del_form);
$edit_form = str_replace(
  [
    "Edit details</h2>",
    'name="edit-user-id" value=""',
    'name="edit-user-email"',
    'name="edit-user-first-name"',
    'name="edit-user-last-name"',
    'name="edit-user-password"',
    'id="label-bg"',
  ],
  [
    "Edit your details</h2>",
    'name="edit-user-id" value="' . $logged_in_mf->user_id . '"',
    'name="edit-user-email" value="' . $logged_in_mf->user_email . '"',
    'name="edit-user-first-name" value="' . $logged_in_mf->user_firstname . '"',
    'name="edit-user-last-name" value="' . $logged_in_mf->user_lastname . '"',
    'name="edit-user-password" value=""',
    'id="label-bg" style="background-image: url(../res/user_img/' .
    $logged_in_mf->user_img .
    '); background-size: cover; background-position: center;"',
  ],
  $edit_form
);
// WOW I will always remeber how I fucking came up with this solution
// just by reading docs for select element and flipping the AI off HARD
// I fucking KNEW this could be done on the server without bloody JS!!!!!!!

// WARN: ASSESSMENT:
// This is a fancy addition. Not only I preselect role in the form on the server
// for the user, but also modify options, so that user cannot do shit and sees
// shit, admin can demote themselves, but not ascend to ownershit and the owner
// can play fucking 11-D chess made of strings and branes if he wants XD
switch ($logged_in_mf->user_type) {
  case "user":
    $edit_form = str_replace(
      [
        '<option value="owner">Owner</option>',
        '<option value="admin">Admin</option',
        '<option value="user">User</option>',
        'id="role-input" class="',
      ],
      [
        "",
        "",
        '<option value="user" selected>User</option>',
        'id="role-input" class="hidden ',
      ],
      $edit_form
    );
    break;
  case "admin":
    $edit_form = str_replace(
      [
        '<option value="owner">Owner</option>',
        '<option value="admin">Admin</option',
      ],
      ["", '<option value="admin" selected>Admin</option>'],
      $edit_form
    );
    break;
  case "owner":
    $edit_form = str_replace(
      ['<option value="owner">Owner</option>'],
      ['<option value="owner" selected>Owner</option>'],
      $edit_form
    );
    break;
}
$del_form = str_replace(
  'name="del-user-id" value="delete_user',
  'name="del-user-id" value="' . $user_id,
  $del_form
);
$profile_cart_html = file_get_contents("../html_components/profile_cart.html");
$profile_order_history = file_get_contents(
  "../html_components/profile_history.html"
);
$footer_html = file_get_contents("../html_components/footer.html");

$nav_html = str_replace(
  ["res/logo-h.png", 'href="index.php"'],
  ["../res/logo-h.png", 'href="../index.php"'],
  $nav_html
);

//this page cannot be accessed by non-logged in users so no conditional
//markup text swapping is needed. only changes appying to logged in users

//conditional changes based on user type (for admin/owner stuff)
if (isset($_SESSION["user_type"]) && $_SESSION["user_type"] != "user") {
  $profile_header_html = str_replace(
    ["role hidden", "PROFILE_USER_ROLE", "inline-flex hidden"],
    ["", ucfirst($_SESSION["user_type"]), "inline-flex"],
    $profile_header_html
  );
}
// adjust navbar strings
$nav_html = str_replace(
  [
    "for-logged-in hidden",
    "for-logged-in group hidden",
    "pages/profile.php",
    "res/user_img/PROFILE_USER_IMG",
    "pages/products.php",
    "scripts/logout.php",
  ],
  [
    "",
    "group",
    "../pages/profile.php",
    "../res/user_img/" . $logged_in_mf->user_img,
    "../pages/products.php",
    "../scripts/logout.php",
  ],
  $nav_html
);

// adjust profile header strings
$profile_header_html = str_replace(
  [
    "PROFILE_USER_NAME",
    "PROFILE_USER_EMAIL",
    "PROFILE_USER_REGISTRATION_DATE",
    "PROFILE_USER_IMG",
  ],
  [
    $logged_in_mf->user_firstname . " " . $logged_in_mf->user_lastname,
    $logged_in_mf->user_email,
    $formatted_date,
    $logged_in_mf->user_img,
  ],
  $profile_header_html
);

// echo content to the page
echo $nav_html;
echo $profile_header_html;
echo "<div class='w-10/12 py-8 h-max grow md:min-h-80 items-center flex flex-col md:flex-row gap-4 md:justify-between'>";
echo $profile_cart_html;
echo $profile_order_history;
echo "</div>";
echo $footer_html;
echo $edit_form;
echo $del_form;
?>
<script type="module" src="../js/profile.js"></script>
  </body>
</html>
