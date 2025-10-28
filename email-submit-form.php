<?php 
if($_SERVER["REQUEST_METHOD"] == "POST"){
    header('Content-Type: application/json'); 

    $name = htmlspecialchars($_POST['name'] );
    $phone = htmlspecialchars($_POST['phone'] );    
    $email = htmlspecialchars($_POST['email'] );
    $subject = htmlspecialchars($_POST['subject'] );
    $message1 = htmlspecialchars($_POST['message'] );
    $recaptcha_response = $_POST['g-recaptcha-response'];

 // Verify Google reCAPTCHA
    $secret_key = '6LcJcuwrAAAAAHx1dFXDhtBfvvycDyqSofLRb1yM';
    $verify_response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secret_key}&response={$recaptcha_response}");
    $response_data = json_decode($verify_response);

    if (!$response_data->success) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'reCAPTCHA verification failed.']);
    exit;
    }

    $to = "sales@amyntortech.com";
    $subject_email = "New Message from Contact Form: $subject";
    $message = "
    
    <html>
    <head><title>Contact Form Submission</title></head>
    <body>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Subject:</strong> {$subject}</p>
        <p><strong>Message:</strong><br />{$message1}</p>
    </body>
    </html>";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type: text/html; charset=utf-8" . "\r\n";
    $headers .= "From: {$email}" . "\r\n";

    if (mail($to, $subject_email, $message, $headers)) {
    echo json_encode(['status' => 'success', 'message' => 'Mail sent successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Mail sending failed.']);
    }
    } else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    }
?>
