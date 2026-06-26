<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

$body = json_decode(file_get_contents('php://input'), true);
$order_id = (int)($body['order_id'] ?? 0);
if ($order_id <= 0) { http_response_code(400); echo json_encode(['error' => 'Missing order_id']); exit; }

$db = new SQLite3('orders.db');
$db->exec("ATTACH DATABASE 'meals.db' AS meals_db");

// Fetch order
$stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->bindValue(1, $order_id, SQLITE3_INTEGER);
$order = $stmt->execute()->fetchArray(SQLITE3_ASSOC);
if (!$order) { http_response_code(404); echo json_encode(['error' => 'Order not found']); exit; }

// Fetch meal ids
$istmt = $db->prepare("SELECT meal_id FROM order_items WHERE order_id = ?");
$istmt->bindValue(1, $order_id, SQLITE3_INTEGER);
$ires = $istmt->execute();
$meal_ids = [];
while ($item = $ires->fetchArray(SQLITE3_ASSOC)) {
    $meal_ids[] = $item['meal_id'];
}

// Fetch meal names + prices
$meal_lines = [];
$total = 0;
foreach ($meal_ids as $mid) {
    $mstmt = $db->prepare("SELECT name, price FROM meals_db.meals WHERE id = ?");
    $mstmt->bindValue(1, $mid, SQLITE3_INTEGER);
    $meal = $mstmt->execute()->fetchArray(SQLITE3_ASSOC);
    if ($meal) {
        $meal_lines[] = "  - {$meal['name']}: \xe2\x82\xac" . number_format($meal['price'], 2);
        $total += $meal['price'];
    }
}

$tracking_url = "https://walnutstudios.uk/track/{$order['postcode']}/{$order_id}";
$meal_list    = implode("\n", $meal_lines);
$total_fmt    = number_format($total, 2);
$subject      = "Your Prestige Opulent Order #{$order_id}";
$body_text    = "Hi {$order['name']},\n\nThank you for your order!\n\nOrder #{$order_id}\nDelivery to: {$order['street']}, {$order['postcode']}, {$order['city']}\n\nItems:\n{$meal_list}\n\nTotal: \xe2\x82\xac{$total_fmt}\n\nTrack your order here:\n{$tracking_url}\n\n\xe2\x80\x94 Prestige Opulent \xe2\x80\x94";

$jmap_url   = 'https://mail.walnutstudios.uk/jmap';
$jmap_user  = 'reciept@walnutstudios.uk';
$jmap_pass  = 'prestigeopulent';
$account_id = 'c';
$mailbox_id = 'e'; // Sent Items
$identity_id = 'b';
$auth       = base64_encode("$jmap_user:$jmap_pass");

$jmap_request = [
    'using' => [
        'urn:ietf:params:jmap:core',
        'urn:ietf:params:jmap:mail',
        'urn:ietf:params:jmap:submission'
    ],
    'methodCalls' => [
        ['Email/set', [
            'accountId' => $account_id,
            'create' => [
                'draft1' => [
                    'mailboxIds' => [$mailbox_id => true],
                    'from'       => [['email' => $jmap_user, 'name' => 'Prestige Opulent']],
                    'to'         => [['email' => $order['email']]],
                    'subject'    => $subject,
                    'textBody'   => [['partId' => '1', 'type' => 'text/plain']],
                    'bodyValues' => ['1' => ['value' => $body_text]],
                    'keywords'   => new stdClass(),
                ]
            ]
        ], 'r1'],
        ['EmailSubmission/set', [
            'accountId' => $account_id,
            'create' => [
                'sub1' => [
                    'emailId'    => '#draft1',
                    'identityId' => $identity_id,
                    'envelope'   => [
                        'mailFrom' => ['email' => $jmap_user],
                        'rcptTo'   => [['email' => $order['email']]],
                    ]
                ]
            ]
        ], 'r2']
    ]
];

$json = json_encode($jmap_request, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$ch = curl_init($jmap_url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $json,
    CURLOPT_HTTPHEADER     => [
        "Authorization: Basic $auth",
        "Content-Type: application/json",
        "Accept: application/json",
        "Content-Length: " . strlen($json),
    ],
]);
$resp      = json_decode(curl_exec($ch), true);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'JMAP request failed', 'detail' => $resp]);
    exit;
}

$submission = $resp['methodResponses'][1][1] ?? [];
if (!empty($submission['notCreated'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Email submission failed', 'detail' => $submission['notCreated']]);
    exit;
}

echo json_encode(['ok' => true, 'tracking_url' => $tracking_url]);