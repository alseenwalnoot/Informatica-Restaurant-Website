<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$postcode = $_GET['postcode'] ?? '';
$order_id = (int)($_GET['id'] ?? 0);

if (!$postcode || $order_id <= 0) { http_response_code(400); echo json_encode(['error' => 'Missing params']); exit; }

$db = new SQLite3('orders.db');
$db->exec("ATTACH DATABASE 'meals.db' AS meals_db");

$stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->bindValue(1, $order_id, SQLITE3_INTEGER);
$order = $stmt->execute()->fetchArray(SQLITE3_ASSOC);

if (!$order) { http_response_code(404); echo json_encode(['error' => 'Order not found']); exit; }

// Normalise postcodes for comparison (strip spaces, uppercase)
$norm = fn($p) => strtoupper(str_replace(' ', '', $p));
if ($norm($order['postcode']) !== $norm($postcode)) {
    http_response_code(403);
    echo json_encode(['error' => 'Postcode does not match']);
    exit;
}

// Fetch meal ids
$istmt = $db->prepare("SELECT meal_id FROM order_items WHERE order_id = ?");
$istmt->bindValue(1, $order_id, SQLITE3_INTEGER);
$ires = $istmt->execute();
$meals = [];
$total = 0;
while ($item = $ires->fetchArray(SQLITE3_ASSOC)) {
    $mid = $item['meal_id'];
    $mstmt = $db->prepare("SELECT id, name, price FROM meals_db.meals WHERE id = ?");
    $mstmt->bindValue(1, $mid, SQLITE3_INTEGER);
    $meal = $mstmt->execute()->fetchArray(SQLITE3_ASSOC);
    if ($meal) {
        $meals[] = $meal;
        $total += $meal['price'];
    }
}

echo json_encode([
    'order' => $order,
    'meals' => $meals,
    'total' => $total
]);