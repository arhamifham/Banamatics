<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'vendor/autoload.php'; // if using Google PHP client

$input = json_decode(file_get_contents("php://input"), true);
$token = $input['token'] ?? null;

if (!$token) {
    echo json_encode(["success" => false, "msg" => "Missing token"]);
    exit;
}

$client = new Google_Client(['client_id' => "YOUR_GOOGLE_CLIENT_ID"]);
$payload = $client->verifyIdToken($token);

if ($payload) {
    $email = $payload["email"];
    $name  = $payload["name"];

    // check if user exists or create new one
    require_once "db.php";
    $stmt = $conn->prepare("SELECT * FROM user_details WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();
    
    if ($res->num_rows === 0) {
        // create new user
        $insert = $conn->prepare("INSERT INTO user_details (username, email) VALUES (?, ?)");
        $insert->bind_param("ss", $name, $email);
        $insert->execute();
    }

    $stmt = $conn->prepare("SELECT * FROM user_details WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false, "msg" => "Invalid Google token"]);
}
?>
