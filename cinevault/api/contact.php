<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=UTF-8');

require dirname(__DIR__) . '/vendor/autoload.php';

function sendResponse(
    int $statusCode,
    bool $success,
    string $message,
    array $errors = []
): void {
    http_response_code($statusCode);

    echo json_encode([
        'success' => $success,
        'message' => $message,
        'errors' => $errors
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    exit;
}

function createMailer(array $config): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = (int) $config['port'];
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from_email'], $config['from_name']);
    return $mail;
}

$mailConfigPath = dirname(__DIR__) . '/config/mail.php';

if (!file_exists($mailConfigPath)) {
    sendResponse(500, false, 'Mail configuration is missing.');
}

$mailConfig = require $mailConfigPath;

if (!is_array($mailConfig)) {
    sendResponse(500, false, 'Mail configuration is invalid.');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, false, 'Method not allowed.');
}

$rawInput = file_get_contents('php://input');

if ($rawInput === false || trim($rawInput) === '') {
    sendResponse(400, false, 'No submission data was received.');
}

$data = json_decode($rawInput, true);

if (!is_array($data)) {
    sendResponse(400, false, 'Invalid request data.');
}

$firstName = trim((string) ($data['firstName'] ?? ''));
$lastName = trim((string) ($data['lastName'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
$comments = trim((string) ($data['comments'] ?? ''));

$errors = [];

if ($firstName === '') {
    $errors['firstName'] = 'First name is required.';
} elseif (strlen($firstName) < 2 || strlen($firstName) > 50) {
    $errors['firstName'] = 'First name must contain between 2 and 50 characters.';
}

if ($lastName === '') {
    $errors['lastName'] = 'Last name is required.';
} elseif (strlen($lastName) < 2 || strlen($lastName) > 50) {
    $errors['lastName'] = 'Last name must contain between 2 and 50 characters.';
}

if ($email === '') {
    $errors['email'] = 'Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address.';
}

if ($phone !== '') {
    if (
        strlen($phone) < 7 ||
        strlen($phone) > 20 ||
        !preg_match('/^[0-9+\-\s()]+$/', $phone)
    ) {
        $errors['phone'] = 'Please enter a valid phone number.';
    }
}

if ($comments === '') {
    $errors['comments'] = 'Comments are required.';
} elseif (strlen($comments) < 10 || strlen($comments) > 1000) {
    $errors['comments'] = 'Comments must contain between 10 and 1000 characters.';
}

if (!empty($errors)) {
    sendResponse(
        422,
        false,
        'Please correct the submitted information.',
        $errors
    );
}

$submission = [
    'id' => bin2hex(random_bytes(8)),
    'firstName' => $firstName,
    'lastName' => $lastName,
    'email' => $email,
    'phone' => $phone,
    'comments' => $comments,
    'submittedAt' => date('c')
];

$dataDirectory = dirname(__DIR__) . '/data';
$filePath = $dataDirectory . '/submissions.json';

if (!is_dir($dataDirectory) && !mkdir($dataDirectory, 0755, true)) {
    sendResponse(500, false, 'Unable to prepare submission storage.');
}

$file = fopen($filePath, 'c+');

if ($file === false) {
    sendResponse(500, false, 'Unable to access submission storage.');
}

if (!flock($file, LOCK_EX)) {
    fclose($file);
    sendResponse(500, false, 'Unable to lock submission storage.');
}

rewind($file);
$existingJson = stream_get_contents($file);
$submissions = [];

if ($existingJson !== false && trim($existingJson) !== '') {
    $decoded = json_decode($existingJson, true);

    if (!is_array($decoded)) {
        flock($file, LOCK_UN);
        fclose($file);
        sendResponse(500, false, 'Submission storage contains invalid data.');
    }

    $submissions = $decoded;
}

$submissions[] = $submission;

$updatedJson = json_encode(
    $submissions,
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);

if ($updatedJson === false) {
    flock($file, LOCK_UN);
    fclose($file);
    sendResponse(500, false, 'Unable to prepare submission data.');
}

rewind($file);

if (!ftruncate($file, 0)) {
    flock($file, LOCK_UN);
    fclose($file);
    sendResponse(500, false, 'Unable to update submission storage.');
}

if (fwrite($file, $updatedJson) === false) {
    flock($file, LOCK_UN);
    fclose($file);
    sendResponse(500, false, 'Unable to save your submission.');
}

fflush($file);
flock($file, LOCK_UN);
fclose($file);

// ========================================
// Email Template Data
// ========================================

$emailTemplateData = [
    'firstName' => $firstName,
    'lastName' => $lastName,
    'email' => $email,
    'phone' => $phone,
    'comments' => $comments,
    'submissionId' => $submission['id'],
    'submittedAt' => $submission['submittedAt']
];

$adminTemplatePath = dirname(__DIR__) . '/emails/admin-notification.php';
$userTemplatePath = dirname(__DIR__) . '/emails/user-confirmation.php';

if (!file_exists($adminTemplatePath) || !file_exists($userTemplatePath)) {
    sendResponse(500, false, 'Your message was saved, but an email template is missing.');
}

try {
    $adminMail = createMailer($mailConfig);
    $adminMail->addAddress($mailConfig['admin_email'], $mailConfig['admin_name']);
    $adminMail->addReplyTo($email, $firstName . ' ' . $lastName);
    $adminMail->isHTML(true);
    $adminMail->Subject = 'New CineVault Contact Form Submission';

    $templateData = $emailTemplateData;
    $adminMail->Body = require $adminTemplatePath;

    $adminMail->AltBody =
        "New CineVault Contact Submission\n\n" .
        "Submission ID: {$submission['id']}\n" .
        "Name: {$firstName} {$lastName}\n" .
        "Email: {$email}\n" .
        "Phone: " . ($phone !== '' ? $phone : 'Not provided') . "\n" .
        "Submitted: {$submission['submittedAt']}\n\n" .
        "Message:\n{$comments}";

    $adminMail->send();

    $userMail = createMailer($mailConfig);
    $userMail->addAddress($email, $firstName . ' ' . $lastName);
    $userMail->isHTML(true);
    $userMail->Subject = 'Thank you for contacting CineVault';

    $templateData = $emailTemplateData;
    $userMail->Body = require $userTemplatePath;

    $userMail->AltBody =
        "Hi {$firstName},\n\n" .
        "Thank you for contacting CineVault. We have received your message successfully.\n\n" .
        "Your message:\n{$comments}\n\n" .
        "Our team will review your enquiry and get back to you as soon as possible.\n\n" .
        "Discover. Collect. Watch.\nCineVault Team";

    $userMail->send();

} catch (Exception $exception) {
    error_log('CineVault email error: ' . $exception->getMessage());
    sendResponse(500, false, 'Your message was saved, but the confirmation email could not be sent.');
}


sendResponse(
    201,
    true,
    'Thank you! Your message has been submitted successfully. A confirmation email has been sent to you.'
);
