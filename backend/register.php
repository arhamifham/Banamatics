<?php
// CORS + preflight
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
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (!$username || !$email || !$password) {
  echo json_encode(["status" => "error", "message" => "Missing fields"]);
  exit;
}

// Hash password
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// Check if username already exists
$sql_check = "SELECT id FROM user_details WHERE username = ?";
$stmt = $conn->prepare($sql_check);
if ($stmt === false) {
  echo json_encode(["status" => "error", "message" => "DB prepare error (check query): " . $conn->error]);
  exit;
}
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
  echo json_encode(["status" => "error", "message" => "Username already exists"]);
  $stmt->close();
  $conn->close();
  exit;
}
$stmt->close();

if (!preg_match('/[A-Z]/', $password) ||
    !preg_match('/[a-z]/', $password) ||
    !preg_match('/[0-9]/', $password) ||
    !preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password) ||
    strlen($password) < 8) 
{
    echo json_encode(["status" => "error", "message" => "Weak password"]);
    exit;
}


// Insert user (coins default 0, theme default 'default')
$sql = "INSERT INTO user_details (username, email, password, coins, themes) VALUES (?, ?, ?, 0, 'default')";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
  echo json_encode(["status" => "error", "message" => "DB prepare error (insert): " . $conn->error]);
  exit;
}
$stmt->bind_param("sss", $username, $email, $passwordHash);

if ($stmt->execute()) {
  echo json_encode(["status" => "success", "message" => "User registered successfully"]);
} else {
  echo json_encode(["status" => "error", "message" => "Registration failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
