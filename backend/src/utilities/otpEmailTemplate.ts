export const OtpEmailTemplate = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
    <meta charset="utf-8" />
    <title>Welcome to Glocalview HRMS</title>
    </head>

    <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
    <h1>Greetings to Glocalview HRMS</h1>
    <p>
        Here is the OTP that you requested to reset your password:
    </p>
    <p>{{ otp }}</p>
    <p>
        Please log in to your account using the link below and change your password
        immediately for security reasons.
    </p>
    <p>
        If you have any questions or issues, please don't hesitate to contact our
        support team at support@glocalviewhrms.com.
    </p>
    <p>Best regards,</p>
    <p>The Glocalview HRMS Team</p>
    </body>

    </html>
`