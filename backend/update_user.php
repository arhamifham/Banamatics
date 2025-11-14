<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['username'])) {
  echo json_encode(["status" => "error", "message" => "Invalid data"]);
  exit;
}

$username = $data['username'];
$coins = intval($data['coins'] ?? 0);
$theme = $data['themes'] ?? 'default';

// Update coins and theme
$stmt = $conn->prepare("UPDATE user_details SET coins = ?, themes = ? WHERE username = ?");
if ($stmt === false) {
  echo json_encode(["status" => "error", "message" => "DB prepare error: " . $conn->error]);
  exit;
}
$stmt->bind_param("iss", $coins, $theme, $username);

if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => "Database update failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
