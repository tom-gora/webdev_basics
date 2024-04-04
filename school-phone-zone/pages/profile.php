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


<body class="bg-gray-100 h-screen flex flex-col items-center gap-4 md:pt-24">
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
    require_once "../google/login_conf.php";
    require_once "../github/login_conf.php";
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
    $logged_in_mf->user_type = $row["user_type"];
    $logged_in_mf->user_auth_method = $row["user_auth_method"];

    $formatted_date = $logged_in_mf->user_registration->format("d M y");

    $nav_html = file_get_contents("../html_components/navigation.html");
    $profile_header_html = file_get_contents(
      "../html_components/profile_header.html"
    );
    $profile_cart_html = file_get_contents(
      "../html_components/profile_cart.html"
    );
    $profile_order_history = file_get_contents(
      "../html_components/profile_history.html"
    );
    $footer_html = file_get_contents("../html_components/footer.html");

    $nav_html = str_replace(
      ["res/logo-h.png", 'href="index.php"', "scripts/logout.php"],
      ["../res/logo-h.png", 'href="../index.php"', "../scripts/logout.php"],
      $nav_html
    );

    // inject google api url and control what html to show for logged in and logged out users
    $login_button_target = get_google_login_url();
    if (!isset($_SESSION["user_id"])) {
      $nav_html = str_replace(
        [
          "GOOGLE_API_URL",
          "for-logged-out hidden",
          "for-logged-out mb-auto mt-24 hidden",
        ],
        [
          "window.location = '" . $login_button_target . "';",
          "",
          "mb-auto mt-24",
        ],
        $nav_html
      );
    } else {
      if (isset($_SESSION["user_type"]) && $_SESSION["user_type"] != "user") {
        $profile_header_html = str_replace(
          ["role hidden", "PROFILE_USER_ROLE", "inline-flex hidden"],
          ["", ucfirst($_SESSION["user_type"]), "inline-flex"],
          $profile_header_html
        );
      }
      $nav_html = str_replace(
        ["for-logged-in hidden", "for-logged-in group hidden"],
        ["", "group"],
        $nav_html
      );
      $nav_html = str_replace(
        ["PROFILE_USER_IMG"],
        [$logged_in_mf->user_img],
        $nav_html
      );
    }

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
    echo $nav_html;
    echo $profile_header_html;
    echo "<div class='w-10/12 py-8 h-max grow md:min-h-80 items-center flex flex-col md:flex-row gap-4 md:justify-between'>";
    echo $profile_cart_html;
    echo $profile_order_history;
    echo "</div>";
    echo $footer_html;
    ?>
  </body>
</html>
