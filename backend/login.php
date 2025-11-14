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
$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if (!$username || !$password) {
  echo json_encode(["status" => "error", "message" => "Missing fields"]);
  exit;
}

$sql = "SELECT id, username, email, password, coins, themes FROM user_details WHERE username = ?";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
  echo json_encode(["status" => "error", "message" => "DB prepare error: " . $conn->error]);
  exit;
}
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows === 1) {
  $user = $result->fetch_assoc();
  if (password_verify($password, $user["password"])) {
    // Remove password before returning user object
    unset($user["password"]);
    echo json_encode(["status" => "success", "user" => $user]);
  } else {
    echo json_encode(["status" => "error", "message" => "Incorrect password"]);
  }
} else {
  echo json_encode(["status" => "error", "message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
