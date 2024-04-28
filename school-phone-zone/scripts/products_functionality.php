<?php
class Product
{
  public string $product_name;
  public int $product_price;
  public string $product_img_path;
}

// get all phones as an array of objects
function get_products()
{
  require_once "db.php";
  $products = [];
  $connection = get_mysqli();
  $query = "SELECT * FROM products";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die("Error getting products from database");
  }

  while ($row = mysqli_fetch_assoc($result)) {
    $product = new Product();
    $product->product_name = $row["product_name"];
    $product->product_price = $row["product_price"];
    $product->product_img_path = $row["product_img_path"];
    array_push($products, $product);
  }
  return $products;
}

// get phone by product id
function get_product(int $product_id)
{
  require_once "db.php";
  $connection = get_mysqli();
  $query = "SELECT * FROM products WHERE product_id = '$product_id'";
  $result = mysqli_query($connection, $query);
  if (!$result) {
    die("Error getting product from database");
  }
  $product = new Product();
  $product->product_name = mysqli_fetch_assoc($result)["product_name"];
  $product->product_price = mysqli_fetch_assoc($result)["product_price"];
  $product->product_img_path = mysqli_fetch_assoc($result)["product_img_path"];
  return $product;
}

// get an array of randomly selected phones
function get_random_products(int $num_products)
{
  $products = get_products();
  shuffle($products);
  return array_slice($products, 0, $num_products);
}
?>
