<?php
session_start();
header('Content-Type: application/json');

// Helper for JSON response
function respond($ok, $msg) {
  echo json_encode(['status' => $ok ? 'success' : 'error', 'message' => $msg]);
  exit;
}

// Require POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respond(false, 'Invalid request.');
}

// --- Rate limit: one submit per 10 s ---
$now = time();
if (!isset($_SESSION['last_submit'])) $_SESSION['last_submit'] = 0;
if ($now - $_SESSION['last_submit'] < 10) {
  respond(false, 'Please wait a few seconds before submitting again.');
}
$_SESSION['last_submit'] = $now;

// --- Clean input ---
function clean_line($v) {
  $v = trim((string)$v);
  return str_replace(["\r","\n"], ' ', $v); // block header injection
}

$name    = clean_line($_POST['name'] ?? '');
$phone   = clean_line($_POST['phone'] ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$subject = clean_line($_POST['subject'] ?? 'Website Enquiry');
$message = trim($_POST['message'] ?? '');
$userCaptcha = trim($_POST['captcha'] ?? '');

// --- Validate fields ---
if ($name==='' || $phone==='' || $email==='' || $message==='' || $userCaptcha==='') {
  respond(false, 'All fields are required.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  respond(false, 'Invalid email format.');
}

// ✅ --- Phone number must be exactly 10 digits ---
$phone = preg_replace('/\D/', '', $_POST['phone'] ?? '');
if (!preg_match('/^\d{10}$/', $phone)) {
    respond(false, 'Please enter a valid 10-digit phone number.');
}

// --- CAPTCHA check (case-sensitive) ---
$serverCaptcha = $_SESSION['captcha_text'] ?? '';
if ($serverCaptcha === '') {
    respond(false, 'Captcha expired. Please reload the page.');
}

// Use hash_equals for timing-safe, case-sensitive comparison
if (!hash_equals($serverCaptcha, $userCaptcha)) {
    unset($_SESSION['captcha_text']); // invalidate on failure
    respond(false, 'Incorrect CAPTCHA.');
}

// One-time use: clear after success
unset($_SESSION['captcha_text']);

// --- Build HTML mail body ---
$html = '<html><body>'
      . '<h3>New Contact Form Message</h3>'
      . '<p><strong>Name:</strong> '.htmlspecialchars($name).'</p>'
      . '<p><strong>Email:</strong> '.htmlspecialchars($email).'</p>'
      . '<p><strong>Phone:</strong> '.htmlspecialchars($phone).'</p>'
      . '<p><strong>Subject:</strong> '.htmlspecialchars($subject).'</p>'
      . '<p><strong>Message:</strong><br>'.nl2br(htmlspecialchars($message)).'</p>'
      . '</body></html>';

// --- Send mail (native PHP mail) ---
$to = 'sales@amyntortech.com';
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: AI AmyntorTech <noreply@ai.amyntortech.com>\r\n";
$headers .= "Reply-To: ".$name." <".$email.">\r\n";

if (@mail($to, $subject, $html, $headers)) {
  respond(true, 'Mail sent successfully.');
} else {
  $err = error_get_last();
  respond(false, 'Mail sending failed.'.(isset($err['message']) ? ' '.$err['message'] : ''));
}
?>
