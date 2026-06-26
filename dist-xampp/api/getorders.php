<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$db = new SQLite3('orders.db');

$result = $db->query("SELECT * FROM orders ORDER BY created_at DESC");
$orders = [];

while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $istmt = $db->prepare("SELECT meal_id FROM order_items WHERE order_id = ?");
    $istmt->bindValue(1, $row['id'], SQLITE3_INTEGER);
    $ires = $istmt->execute();
    $row['cart'] = [];
    while ($item = $ires->fetchArray(SQLITE3_ASSOC)) {
        $row['cart'][] = $item['meal_id'];
    }
    $orders[] = $row;
}

echo json_encode(["orders" => $orders, "count" => count($orders)]);