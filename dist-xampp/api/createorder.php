<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) { http_response_code(400); echo json_encode(["error" => "Invalid JSON"]); exit; }

$name     = trim($body['name']     ?? '');
$email    = trim($body['email']    ?? '');
$city     = trim($body['city']     ?? '');
$street   = trim($body['street']   ?? '');
$postcode = trim($body['postcode'] ?? '');
$items    = $body['cart']          ?? [];  // array of meal ids

if (!$name || !$email || !$city || !$street || !$postcode || empty($items)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$db = new SQLite3('orders.db');
$db->exec('BEGIN');

$stmt = $db->prepare(
    "INSERT INTO orders (name, email, city, street, postcode) VALUES (?, ?, ?, ?, ?)"
);
$stmt->bindValue(1, $name);
$stmt->bindValue(2, $email);
$stmt->bindValue(3, $city);
$stmt->bindValue(4, $street);
$stmt->bindValue(5, $postcode);
$stmt->execute();

$order_id = $db->lastInsertRowID();

$istmt = $db->prepare("INSERT INTO order_items (order_id, meal_id) VALUES (?, ?)");
foreach ($items as $meal_id) {
    $istmt->bindValue(1, $order_id, SQLITE3_INTEGER);
    $istmt->bindValue(2, (int)$meal_id, SQLITE3_INTEGER);
    $istmt->execute();
    $istmt->reset();
}

$db->exec('COMMIT');
echo json_encode(["order_id" => $order_id]);