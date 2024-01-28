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

$stmt_getCategory = "SELECT * FROM categories";
$result = $mysqli->query($stmt_getCategory);

if($result) {
    $categories=[];
while($row = $result->fetch_assoc()) {
    $categories[] = array(
        'category_id' => $row['category_id'],
        'category_name' => $row['category_name']
    );
}
    echo json_encode(['success' => true, 'data' => $categories]);
} else {
    echo  json_encode(['error' => 'error preparing statement: ' . $mysqli->error]);
}
$mysqli->close();
?>