<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = "localhost";
$username = "root";
$password = "";
$db_name = "shop";

$mysqli = new mysqli($host, $username, $password, $db_name);

if($mysqli->connect_error){
    die("Connection failed: " . $mysqli->connect_error);
}

$product_id = $_POST['product_id'];
$product_name = $_POST['product_name'];
$product_model = $_POST['product_model'];
$product_category = $_POST['product_category'];
$product_country = $_POST['product_country'];
$product_year = $_POST['product_year'];
$product_description = $_POST['product_description'];
$product_price = $_POST['product_price'];
$product_amount = $_POST['product_amount'];

$sql_editProduct = "UPDATE products SET 
                    product_name = ?, 
                    product_model = ?, 
                    product_category = ?, 
                    product_country = ?, 
                    product_year = ?, 
                    product_description = ?, 
                    product_price = ?, 
                    product_amount = ?
                    WHERE product_id = ?";

$stmt_editProduct = $mysqli->prepare($sql_editProduct);

if ($stmt_editProduct) {
    $stmt_editProduct->bind_param("ssssisiisi", 
                                $product_name, 
                                $product_model, 
                                $product_category, 
                                $product_country, 
                                $product_year, 
                                $product_description, 
                                $product_price, 
                                $product_amount,                    
                                $product_id);
    $stmt_editProduct->execute();

    if ($stmt_editProduct->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Товар успешно отредактирован.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Не удалось отредактировать товар.']);
    }
    $stmt_editProduct->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Ошибка подготовки запроса: ' . $mysqli->error]);
}

$mysqli->close();
?>
