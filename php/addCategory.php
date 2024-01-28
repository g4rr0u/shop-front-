<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$username = 'root';
$password = '';
$db_name = 'shop';

$mysqli = new mysqli($host, $username, $password, $db_name);

if($mysqli->connect_error){
    die("Connection failed: " . $mysqli->connect_error);
}

$category_name = $_POST['newCategory'];

$sql_checkForData = "SELECT * FROM categories WHERE category_name = ?";
$stmt_checkForData = $mysqli->prepare($sql_checkForData);
$stmt_checkForData->bind_param('s', $category_name);
$stmt_checkForData->execute();
$result = $stmt_checkForData->get_result();




if($result->num_rows > 0) {
    $response = array('success' => false, 'error' => 'Category already exist');
} else {
    $sql_addCategory = "INSERT INTO categories (category_name) VALUES (?)";
    $stmt_addCategory = $mysqli->prepare($sql_addCategory);
    if($stmt_addCategory) {
        $stmt_addCategory->bind_param('s', $category_name);
        $stmt_addCategory->execute();
        if($stmt_addCategory->affected_rows > 0) {
            $response = array('success' => true);
        } else {
            $response = array('success' => false, 'error' => 'error insert data');
        }
        $stmt_addCategory->close();
    } else {
        $response = array('success' => false, 'error' => 'error preparing statement');
    }
}
$stmt_checkForData->close();
$mysqli->close();

header('Content-Type: application/json');
echo json_encode($response);
die();
?>