<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$db_name = 'shop';
$username = 'root';
$password = '';

$mysqli = new mysqli($host, $username, $password, $db_name);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$product_name = $_POST['product_name'];
$product_model = $_POST['product_model'];
$product_category = $_POST['product_category']; 
$product_country = $_POST['product_country'];
$product_year = $_POST['product_year'];
$product_description = $_POST['product_description'];
$product_price = $_POST['product_price'];
$product_amount = $_POST['product_amount'];

$upload_directory = "C:/OSPanel/domains/shop-front-/media/";
$product_photo = $_FILES['product_photo']['name'];
$unique_id = uniqid();
$product_photo_unique = $unique_id . '_' . $product_photo;



$sql_checkForData = "SELECT * FROM products WHERE product_name = ? AND product_model = ? AND product_year = ?";
$stmt_checkForData = $mysqli->prepare($sql_checkForData);
$stmt_checkForData->bind_param("ssi", $product_name, $product_model, $product_year);
$stmt_checkForData->execute();
$result = $stmt_checkForData->get_result();

if($result->num_rows > 0) {
    $response = array('success' => false, 'error' => 'Product already exist' );
} else{
    
    move_uploaded_file($_FILES['product_photo']['tmp_name'], $upload_directory . $product_photo_unique);

    $sql_addProduct = "INSERT INTO products (product_name, product_model, product_category, product_country, product_year, product_description, product_price, product_amount, product_photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt_addProduct = $mysqli->prepare($sql_addProduct);
    $stmt_addProduct->bind_param("ssssisiis", $product_name, $product_model, $product_category, $product_country, $product_year, $product_description, $product_price, $product_amount, $product_photo_unique);
    
    if ($stmt_addProduct->execute()) {
        $response = array('success' => true);
    } else {
        $response = array('success' => false, 'error' => 'Error executing query: ' . $stmt_addProduct->error);
    }    
    $stmt_addProduct->close();

}

$stmt_checkForData->close();
$mysqli->close();

echo json_encode($response);
?>
