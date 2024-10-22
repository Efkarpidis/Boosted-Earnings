<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $file = fopen("emails.csv", "a");
        fputcsv($file, array($email, date("Y-m-d H:i:s")));
        fclose($file);
        
        $response = array("success" => true, "message" => "Thank you for subscribing!");
    } else {
        $response = array("success" => false, "message" => "Invalid email address.");
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?>
