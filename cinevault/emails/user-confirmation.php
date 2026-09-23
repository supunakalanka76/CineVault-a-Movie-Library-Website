<?php
declare(strict_types=1);
$data = $templateData ?? [];
$firstName = htmlspecialchars((string)($data['firstName'] ?? ''), ENT_QUOTES, 'UTF-8');
$comments = nl2br(htmlspecialchars((string)($data['comments'] ?? ''), ENT_QUOTES, 'UTF-8'));

return <<<HTML
<!doctype html><html lang="en"><body style="margin:0;padding:0;background:#090b10;font-family:Arial,Helvetica,sans-serif;color:#f4f4f5;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090b10;"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#11141b;border:1px solid #252a35;border-radius:20px;">
<tr><td align="center" style="padding:38px 36px;background:#0d0f14;border-bottom:1px solid #252a35;">
<div style="font-size:28px;font-weight:800;letter-spacing:3px;color:#fff;">CINE<span style="color:#e5ad00;">VAULT</span></div>
<div style="margin-top:8px;font-size:11px;letter-spacing:2px;color:#8e95a3;">DISCOVER &bull; COLLECT &bull; WATCH</div></td></tr>
<tr><td style="padding:42px 36px;">
<span style="display:inline-block;padding:7px 12px;background:#17251c;border:1px solid #284632;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;color:#79d494;">MESSAGE RECEIVED</span>
<h1 style="margin:22px 0 14px;font-size:30px;line-height:38px;color:#fff;">Thanks for getting in touch.</h1>
<p style="font-size:16px;line-height:27px;color:#c2c7d0;">Hi <strong style="color:#fff;">{$firstName}</strong>,</p>
<p style="font-size:15px;line-height:26px;color:#aeb5c1;">We've received your message successfully. The CineVault team will review your enquiry and get back to you as soon as possible.</p>
<div style="margin-top:30px;padding:24px;background:#171a22;border:1px solid #292e3a;border-radius:14px;">
<div style="font-size:11px;letter-spacing:1px;color:#e5ad00;font-weight:700;">YOUR MESSAGE</div>
<div style="margin-top:12px;font-size:15px;line-height:25px;color:#e5e7eb;">{$comments}</div></div>
<div style="margin-top:32px;padding-top:24px;border-top:1px solid #292e3a;">
<p style="margin:0;font-size:15px;line-height:25px;color:#aeb5c1;">Thank you for choosing CineVault.</p>
<p style="margin:8px 0 0;font-size:15px;font-weight:700;color:#fff;">CineVault Team</p></div>
</td></tr>
<tr><td align="center" style="padding:26px;background:#0d0f14;border-top:1px solid #252a35;">
<div style="font-size:12px;font-weight:700;letter-spacing:1.5px;color:#e5ad00;">DISCOVER. COLLECT. WATCH.</div>
<div style="margin-top:7px;font-size:11px;color:#666e7b;">This is an automatic confirmation from CineVault.</div>
</td></tr></table></td></tr></table></body></html>
HTML;
