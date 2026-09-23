<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

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

sendResponse(
    201,
    true,
    'Thank you! Your message has been submitted successfully.'
);
