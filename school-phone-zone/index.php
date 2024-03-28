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
  <nav class="w-screen px-12 bg-[--brand-color-light-blue] flex justify-between items-center shadow-md fixed top-0">
    <div class="logo">
      <img src="res/logo-h.png" alt="Store Logo" width="200px" class="m-4">
    </div>
    <ul class="flex gap-4 font-bold text-[--brand-color-blue] transition">
      <li class="text-xl hover:text-[--brand-color-dark-blue] transition"><a href="#">Home</a></li>
      <li class="text-xl hover:text-[--brand-color-dark-blue] transition"><a href="#">Products</a></li>
      <li class="text-xl hover:text-[--brand-color-dark-blue] transition"><a href="#">Login</a></li>
      <li class="text-xl hover:text-[--brand-color-dark-blue] transition mt-[-4px]"><a href="#"><i class="fa-duotone fa-cart-shopping text-3xl"></i></a></li>
    </ul>
  </nav>
  <section class="w-10/12 flex flex-col items-center gap-0 ">
    <h2 class="text-center font-bold text-xl py-4">Explore our great range of phones!</h2>
    <div class="bg-cover bg-[url('../../res/cta-bg.png')] bg-no-repeat bg-top w-full h-64"></div>
    <p class="p-4 text-justify">Welcome to our online store, where finding your next smartphone is as simple as a few clicks. Explore our wide selection of top-tier devices and experience the ease of upgrading with just a touch.</p>
  </section>
  <section class="bg-gray-200 w-screen flex flex-col items-center">
    <div class="w-10/12 flex flex-col items-center gap-4">
      <h2 class="text-center font-bold text-xl py-4">About Us</h2>
      <p class="p-4 text-justify">Established in 2022, our online store has been a trusted destination for smartphone enthusiasts seeking quality devices and seamless shopping experiences. With a passion for innovation and a commitment to customer satisfaction, we strive to provide the latest technology paired with exceptional service, making us your go-to destination for all things mobile.</p>
    </div>
  </section>
  <section class="pb-24">
    <h2 class="text-center font-bold text-xl py-4">Top Products</h2>
    <div class="w-screen px-12 grid grid-cols-1 gap-y-8 col-span-full place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <?php
      for ($i = 0; $i < 8; $i++) {
        echo "<div class='w-56 h-96 flex flex-col gap-2 py-8 px-2 bg-white rounded-lg justify-center items-center'>
        <img src='res/phone.png' alt='Phone' width='100%' class='m-4 aspect-[1/1]'>
        <p class='text-center'>Phone Name</p>
        <p class='text-center font-bold'>$100</p>
        <button class='bg-[--brand-color-green] text-white px-4 py-2 rounded-md mt-[auto] transition-all hover:bg-[--brand-color-dark-blue] hover:text-[--brand-color-light-blue] hover:font-semibold'>Add to Cart</button>
        </div>";
      }
      ?>
    </div>
  </section>
  <footer class="fixed bottom-0 w-screen bg-gray-100 h-16 px-12 flex justify-end items-center shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
    <p>&copy; 2024 PhoneZone. All rights reserved.</p>
  </footer>
</body>

</html>
