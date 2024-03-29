<?php

declare(strict_types=1) ?>
<!-- source for box shadow snippets https://manuarora.in/boxshadows -->
<!-- animations from https://www.tailwindcss-animated.com/ -->
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PhoneZone</title>
  <link href="css/output/tailwind-styles.css" rel="stylesheet" />
  <!--NOTE: Logo font used is: Suez One-->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Suez+One&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <style>
    :root {
      --brand-color-blue: #0D72B9;
      --brand-color-green: #3AB54B;
      --brand-color-light-blue: color-mix(in lab, var(--brand-color-blue) 30%, #fff 70%);
      --brand-color-light-green: color-mix(in lab, var(--brand-color-green) 30%, #fff 70%);
      --brand-color-dark-blue: color-mix(in lab, var(--brand-color-blue) 70%, #000 30%);
      --brand-color-dark-green: color-mix(in lab, var(--brand-color-green) 70%, #000 30%);
    }
  </style>
</head>


<body class="bg-gray-100 h-screen flex flex-col items-center gap-4 py-24">
  <?php
  $nav_html = file_get_contents("./html_components/navigation.html");
  $cta_html = file_get_contents("./html_components/call_to_action.html");
  echo $nav_html;
  echo $cta_html;
  ?>
  
  <section class="pb-16 bg-gray-200">
    <h2 class="text-center font-bold text-xl py-4">Top Products</h2>
    <div class="w-screen px-12 grid grid-cols-1 gap-y-8 col-span-full place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <?php
      require_once "scripts/get_products.php";

      $current_url = $_SERVER["PHP_SELF"];
      $products = get_products();
      $eight_rand_product_keys = array_rand($products, 4);
      $eight_rand_products = [];
      foreach ($eight_rand_product_keys as $key) {
        array_push($eight_rand_products, $products[$key]);
      }

      $phone_card_html = file_get_contents("./html_components/phone_card.html");

      foreach ($eight_rand_products as $product) {
        if (str_contains($current_url, "index.php")) {
          $next_product_card_html = str_replace(
            ["PROMO", "promo-sticker h-0"],
            [
              '<div class="text-white text-sm text-center absolute w-36 h-6 bg-red-400 rotate-45 top-0 translate-y-7 translate-x-8 right-0">GREAT DEAL</div>',
              "",
            ],
            $phone_card_html
          );
        }
        $next_product_card_html = str_replace(
          ["PRODUCT_NAME", "PRODUCT_PRICE", "PRODUCT_IMG_PATH"],
          [
            $product->product_name,
            $product->product_price,
            $product->product_img_path,
          ],
          $next_product_card_html
        );
        echo $next_product_card_html;
      }
      ?>
    </div>
  </section>
  <?php
  $about_html = file_get_contents("./html_components/about.html");
  echo $about_html;
  $footer_html = file_get_contents("./html_components/footer.html");
  echo $footer_html;
  ?>
  <script>
    const loginBtn = document.querySelector('#login-btn');
    const loginDialog = document.querySelector('#login-dialog');
    const loginErrMsgBox = document.querySelector('#err-msg');
    const emailInput = document.querySelector('input[name="email"]');
    const loginDialogCloseBtn = document.querySelector('#login-dialog-close');
    const passInput = document.querySelector('input[name="password"]');

    loginBtn.onclick = (e) => {
     e.preventDefault();
      loginDialog.showModal();
      loginDialog.classList.add('animate-fade-down', 'animate-duration-300', 'animate-ease-out');
    };
    
    // src: https://www.stefanjudis.com/blog/a-look-at-the-dialog-elements-super-powers/
    loginDialog.onclick = (e) => {
      if (e.target.nodeName === 'DIALOG') {
        loginDialog.close();
      }
    };

    emailInput.onfocus = () => {
      emailInput.setAttribute("autocomplete", "email");
    };

    loginDialog.onclose = () => {
      loginErrMsgBox.classList.remove("opacity-1");
      loginErrMsgBox.classList.add("opacity-0");
      emailInput.setAttribute("autocomplete", "off");
    };

      loginDialogCloseBtn.onclick = (e) => {
      e.preventDefault();
      loginDialog.close();
    };

    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    switch (err) {
      case 'nouser':
      console.log('nouser');
      loginErrMsgBox.innerText = "No user with that email and password.";
      loginErrMsgBox.classList.remove("opacity-0");
      loginErrMsgBox.classList.add("opacity-1");
      loginDialog.showModal();
      break;
    }
    </script>
</body>

</html>
