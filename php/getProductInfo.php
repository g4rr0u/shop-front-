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
$sql_getProductInfo = "SELECT * FROM products WHERE product_id = ?";
$stmt_getProductInfo = $mysqli->prepare($sql_getProductInfo);

if($stmt_getProductInfo) {
    $stmt_getProductInfo->bind_param("i", $product_id);
    $stmt_getProductInfo->execute();
    $result = $stmt_getProductInfo->get_result();
    $products=[];
    
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()) {
            $products[] = array(
                'product_id' => $row['product_id'],
                'product_name' => $row['product_name'],
                'product_model' => $row['product_model'],
                'product_category' => $row['product_category'],
                'product_country' => $row['product_country'],
                'product_year' => $row['product_year'],
                'product_description' => $row['product_description'],
                'product_price' => $row['product_price'],
                'product_amount' => $row['product_amount'],
                'product_photo' => $row['product_photo'],
            );
        }
    }
    echo json_encode(['success' => true, 'data' => $products]);
} else {
    echo json_encode(['success' => false, 'error' => 'error preparing statement: '. $mysqli->error]);
}
$mysqli->close();
?>
