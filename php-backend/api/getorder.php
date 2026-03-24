<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) { http_response_code(400); exit; }

$db = new SQLite3('orders.db');

$stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->bindValue(1, $id, SQLITE3_INTEGER);
$row = $stmt->execute()->fetchArray(SQLITE3_ASSOC);
if (!$row) { http_response_code(404); exit; }

$istmt = $db->prepare("SELECT meal_id FROM order_items WHERE order_id = ?");
$istmt->bindValue(1, $id, SQLITE3_INTEGER);
$res = $istmt->execute();

$items = [];
while ($item = $res->fetchArray(SQLITE3_ASSOC)) {
    $items[] = $item['meal_id'];
}

$row['cart'] = $items;
echo json_encode($row);