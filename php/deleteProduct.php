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

// Получение product_id из POST-запроса
$product_id = $_POST['product_id'];

// Запрос на удаление товара
$sql_deleteProduct = "DELETE FROM products WHERE product_id = ?";
$stmt_deleteProduct = $mysqli->prepare($sql_deleteProduct);

if ($stmt_deleteProduct) {
    $stmt_deleteProduct->bind_param("i", $product_id);
    $stmt_deleteProduct->execute();

    if ($stmt_deleteProduct->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Товар успешно удален.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Не удалось удалить товар.']);
    }
    $stmt_deleteProduct->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Ошибка подготовки запроса: ' . $mysqli->error]);
}

$mysqli->close();
?>
