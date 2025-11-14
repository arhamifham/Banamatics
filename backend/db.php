<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "b_user";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
  exit;
}
?>
