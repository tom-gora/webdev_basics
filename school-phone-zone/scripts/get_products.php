<?php
class Product
{
  public string $product_name;
  public  int $product_price;
  public string $product_img_path;
}

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
