<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

header("Content-Type: application/json");

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$subject = $data['subject'] ?? '';
$message = $data['message'] ?? '';

$mail = new PHPMailer(true);

try {
    // Server settings
        $mail->IsSMTP();
        $mail->SMTPDebug  = 0;
        $mail->Mailer = "smtp";
        $mail->SMTPAuth   = true;
        $mail->SMTPSecure = "ssl";
        $mail->Host       = "smtp.zeptomail.com";
        $mail->Port       = 465;
        $mail->AddAddress("emmacyril@gmail.com", "Emmacyril Resume");
        $mail->Username = "emailapikey";
        $mail->Password = "wSsVR612+EH2CqZ0z2etJ+wxm1oADlmkHUor3FqlvSP9F/DC9sdvxRDHAgSlHfFNFmc6EjVE9e8szh4BhGUJh90unlgACiiF9mqRe1U4J3x17qnvhDzCX2ldkRKIL48PwQpuk2VgEsgq+g==";
        $mail->Priority = 1;
        $mail->SetFrom('noreply@emmacyril.com', 'Emmacyril Resume');

    // Recipients
    // $mail->setFrom($email, $name);
    // $mail->addAddress('emmacyril@gmail.com', 'Emmacyril Resume');
    // $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = "Name: $name<br>Email: $email<br>Message: $message";
    $mail->AltBody = "Name: $name\nEmail: $email\nMessage: $message";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Message has been sent successfully.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}