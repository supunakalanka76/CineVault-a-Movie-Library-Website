<?php
declare(strict_types=1);
$data = $templateData ?? [];
$firstName = htmlspecialchars((string)($data['firstName'] ?? ''), ENT_QUOTES, 'UTF-8');
$lastName = htmlspecialchars((string)($data['lastName'] ?? ''), ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars((string)($data['email'] ?? ''), ENT_QUOTES, 'UTF-8');
$phoneRaw = trim((string)($data['phone'] ?? ''));
$phone = htmlspecialchars($phoneRaw !== '' ? $phoneRaw : 'Not provided', ENT_QUOTES, 'UTF-8');
$comments = nl2br(htmlspecialchars((string)($data['comments'] ?? ''), ENT_QUOTES, 'UTF-8'));
$submissionId = htmlspecialchars((string)($data['submissionId'] ?? ''), ENT_QUOTES, 'UTF-8');
$submittedAt = htmlspecialchars((string)($data['submittedAt'] ?? ''), ENT_QUOTES, 'UTF-8');

return <<<HTML
<!doctype html><html lang="en"><body style="margin:0;padding:0;background:#090b10;font-family:Arial,Helvetica,sans-serif;color:#f4f4f5;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090b10;"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#11141b;border:1px solid #252a35;border-radius:20px;">
<tr><td style="padding:34px 36px;background:#0d0f14;border-bottom:1px solid #252a35;">
<div style="font-size:26px;font-weight:800;letter-spacing:3px;color:#fff;">CINE<span style="color:#e5ad00;">VAULT</span></div>
<div style="margin-top:7px;font-size:11px;letter-spacing:2px;color:#8e95a3;">DISCOVER • COLLECT • WATCH</div></td></tr>
<tr><td style="padding:36px;">
<span style="display:inline-block;padding:7px 12px;background:#2a2105;border:1px solid #5a4708;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;color:#f2c94c;">NEW MESSAGE RECEIVED</span>
<h1 style="margin:22px 0 8px;font-size:28px;color:#fff;">New contact submission</h1>
<p style="margin:0 0 28px;font-size:15px;line-height:24px;color:#a8afbd;">A visitor has submitted a message through the CineVault website.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#171a22;border:1px solid #292e3a;border-radius:14px;">
<tr><td style="padding:20px 24px;border-bottom:1px solid #292e3a;color:#777f8e;font-size:11px;">NAME<br><strong style="display:inline-block;margin-top:7px;font-size:16px;color:#fff;">{$firstName} {$lastName}</strong></td></tr>
<tr><td style="padding:20px 24px;border-bottom:1px solid #292e3a;color:#777f8e;font-size:11px;">EMAIL<br><span style="display:inline-block;margin-top:7px;font-size:15px;color:#e5ad00;">{$email}</span></td></tr>
<tr><td style="padding:20px 24px;color:#777f8e;font-size:11px;">PHONE<br><span style="display:inline-block;margin-top:7px;font-size:15px;color:#f4f4f5;">{$phone}</span></td></tr>
</table>
<div style="margin-top:22px;padding:24px;background:#171a22;border-left:4px solid #e5ad00;border-radius:12px;">
<div style="font-size:11px;color:#777f8e;">MESSAGE</div><div style="margin-top:10px;font-size:15px;line-height:25px;color:#e5e7eb;">{$comments}</div></div>
<table role="presentation" width="100%" style="margin-top:24px;"><tr>
<td style="font-size:12px;line-height:20px;color:#777f8e;">SUBMISSION ID<br><span style="color:#b9bfca;">{$submissionId}</span></td>
<td align="right" style="font-size:12px;line-height:20px;color:#777f8e;">SUBMITTED<br><span style="color:#b9bfca;">{$submittedAt}</span></td>
</tr></table>
<p style="margin:28px 0 0;font-size:13px;color:#777f8e;">Reply directly to this email to respond to the visitor.</p>
</td></tr>
<tr><td align="center" style="padding:24px;background:#0d0f14;border-top:1px solid #252a35;font-size:11px;letter-spacing:1px;color:#6f7683;">CINEVAULT &bull; DISCOVER • COLLECT • WATCH</td></tr>
</table></td></tr></table></body></html>
HTML;
