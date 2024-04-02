<?php

session_start();
$user_id = isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : null;

if (!$user_id) {
  header("location:../index.php?error=nologin");
  exit();
}

//only establish connection after confirming session status
require_once "../scripts/db.php";
require_once "../scripts/user_functionality.php";
$connection = get_mysqli();
$query = "SELECT * FROM users WHERE user_id = '$user_id'";
$result = mysqli_query($connection, $query);
$row = mysqli_fetch_assoc($result);
$logged_in_mf = new User();
$logged_in_mf->user_id = $user_id;
$logged_in_mf->user_email = $row["user_email"];
$logged_in_mf->user_registration = new DateTime($row["user_registration"]);
$logged_in_mf->user_firstname = $row["user_firstname"];
$logged_in_mf->user_lastname = $row["user_lastname"];
$logged_in_mf->user_img = $row["user_img"] ?: "default.jpg";
echo "<script>console.log(" . $row["user_img"] . ")</script>";
$logged_in_mf->user_type = $row["user_type"];
$logged_in_mf->user_auth_method = $row["user_auth_method"];

$formatted_date = $logged_in_mf->user_registration->format("d M y");

$nav_html = file_get_contents("../html_components/navigation.html");
$profile_header_html = file_get_contents(
  "../html_components/profile_header.html"
);

$nav_html = str_replace(
  ["not-for-logged-in", "res/logo-h.png"],
  ["hidden", "../res/logo-h.png"],
  $nav_html
);

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
?>


<!-- source for box shadow snippets https://manuarora.in/boxshadows -->
<!-- animations from https://www.tailwindcss-animated.com/ -->
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PhoneZone<?php echo " - Your profile: " .
      $logged_in_mf->user_firstname .
      " " .
      $logged_in_mf->user_lastname; ?></title>
  <link href="../css/output/tailwind-styles.css" rel="stylesheet" />
  <!--NOTE: Logo font used is: Suez One-->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Suez+One&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="../css/globals.css">
</head>


<body class="bg-gray-100 h-screen flex flex-col items-center gap-4 py-24">
    <?php
    echo $nav_html;
    echo $profile_header_html;
    ?>
  </body>
</html>
