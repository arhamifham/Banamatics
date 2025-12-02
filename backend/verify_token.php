#AI generated JWT authentication backend
<?php
include "db.php";

$headers = apache_request_headers();
$token = $headers["Authorization"] ?? "";

$query = $conn->prepare("SELECT * FROM users WHERE token=?");
$query->bind_param("s", $token);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 1) {
  echo json_encode(["valid" => true]);
} else {
  echo json_encode(["valid" => false]);
}
