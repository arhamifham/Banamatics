<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

header("Content-Type: application/json; charset=UTF-8");

include "db.php"; // uses $conn (mysqli)

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data['username']) || !isset($data['theme'])) {
    echo json_encode(["status" => "error", "message" => "Missing parameters"]);
    exit;
}

$username = trim($data['username']);
$selectedTheme = trim($data['theme']);

// prepare and bind (mysqli)
$stmt = $conn->prepare("UPDATE user_details SET themes_s = ? WHERE username = ?");
if ($stmt === false) {
    echo json_encode(["status" => "error", "message" => "DB prepare error: " . $conn->error]);
    exit;
}

$stmt->bind_param("ss", $selectedTheme, $username);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Theme updated"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update theme: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
