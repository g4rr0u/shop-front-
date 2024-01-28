<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$username = 'root';
$password = '';
$db_name = 'shop';

$mysqli = new mysqli($host, $username, $password, $db_name);

if($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
$category_id = $_POST['choosenCategoryId'];

$sql_deleteCategory = "DELETE FROM categories WHERE category_id = ?";
$stmt_deleteCategory = $mysqli->prepare($sql_deleteCategory);
$stmt_deleteCategory->bind_param("i", $category_id);

if($stmt_deleteCategory->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'error preparing statement' . $stmt_deleteCategory->error]);
}
$stmt_deleteCategory->close();
$mysqli->close();

?>