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

$stmt_getOrders = "SELECT * FROM orders";
$result = $mysqli->query($stmt_getOrders);

if($result) {
    $orders=[];
    while($row = $result->fetch_assoc()) {
        $orders[] = array(
            'order_id' => $row['order_id'],
            'user_id' => $row['user_id'],
            'user_fullname' => $row['user_fullname'],
            'order_info' => $row['order_info'],
            'order_status' => $row['order_status'],
        );
    }
    echo json_encode(['success' => true, 'data' => $orders]);
} else {
    echo json_encode(['success' => false, 'error' => 'error preparing statement: '. $mysqli->error]);
}
$mysqli->close();
?>
