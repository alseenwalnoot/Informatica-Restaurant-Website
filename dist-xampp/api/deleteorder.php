<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) { http_response_code(400); exit; }

$db = new SQLite3('orders.db');

$db->exec('BEGIN');
$s1 = $db->prepare("DELETE FROM order_items WHERE order_id = ?");
$s1->bindValue(1, $id, SQLITE3_INTEGER);
$s1->execute();

$s2 = $db->prepare("DELETE FROM orders WHERE id = ?");
$s2->bindValue(1, $id, SQLITE3_INTEGER);
$s2->execute();
$db->exec('COMMIT');

echo json_encode(["deleted" => $id]);