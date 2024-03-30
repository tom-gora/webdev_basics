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
  <link rel="stylesheet" href="./css/globals.css">
</head>


<body class="bg-gray-100 h-screen flex flex-col items-center gap-4 py-24">
  <?php
  require_once "./scripts/products_functionality.php";

  // how many bestsellers I want to display
  $best_sellers_count_to_display = 4;

  //get my html components contents
  $nav_html = file_get_contents("./html_components/navigation.html");
  $cta_html = file_get_contents("./html_components/call_to_action.html");
  $phone_card_html = file_get_contents("./html_components/phone_card.html");
  $about_html = file_get_contents("./html_components/about.html");
  $footer_html = file_get_contents("./html_components/footer.html");

  // since we are on index, adjust the top sellers component with appropriate title
  $top_products_html = str_replace(
    ["SECTION_TITLE"],
    ["Best sellers"],
    file_get_contents("./html_components/products_grid.html")
  );
  // and also make the promo sticker show up (removing the attribute giving it height of 0 and injecting html into it)
  $phone_card_html = str_replace(
    ["PROMO", "promo-sticker h-0"],
    [
      '<div class="text-white text-sm text-center absolute w-36 h-6 bg-red-400 rotate-45 top-0 translate-y-7 translate-x-8 right-0">GREAT DEAL</div>',
      "",
    ],
    $phone_card_html
  );

  // get an array of random phones from db
  $random_products = get_random_products($best_sellers_count_to_display);

  //array to store html snippets per each card
  $top_sellers_grid_content_html = "";

  // adjust html per each phone grabbed from db and construct the html as string
  foreach ($random_products as $product) {
    $next_product_card_html = str_replace(
      ["PRODUCT_NAME", "PRODUCT_PRICE", "PRODUCT_IMG_PATH"],
      [
        $product->product_name,
        $product->product_price,
        $product->product_img_path,
      ],
      $phone_card_html
    );
    $top_sellers_grid_content_html .= $next_product_card_html;
  }

  //insert the cards into grid component
  $top_products_html = str_replace(
    ["PRODUCTS_GRID"],
    [$top_sellers_grid_content_html],
    $top_products_html
  );

  // echo crap onto the page
  echo $nav_html;
  echo $cta_html;
  echo $top_products_html;
  echo $about_html;
  echo $footer_html;
  ?>

  <script src="./js/index.js" type="text/javascript"></script>
</body>

</html>
