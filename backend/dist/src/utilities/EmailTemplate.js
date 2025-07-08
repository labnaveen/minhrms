"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnniversaryTemplate = exports.BirthdayTemplate = exports.EmailTemplate = void 0;
exports.EmailTemplate = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
    <meta charset="utf-8" />
    <title>Welcome to Glocalview HRMS</title>
    </head>

    <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
    <h1>Welcome to Glocalview HRMS</h1>
    <p>
        Congratulations! You have been added as a user to Glocalview HRMS. Your
        login credentials are below:
    </p>
    <ul>
        <li>Email: {{ email }}</li>
        <li>Password: {{ password }}</li>
    </ul>
    <p>
        Please log in to your account using the link below and change your password
        immediately for security reasons.
    </p>
    <a href="{{ loginUrl }}">Log in to Glocalview HRMS</a>
    <p>
        If you have any questions or issues, please don't hesitate to contact our
        support team at support@glocalviewhrms.com.
    </p>
    <p>Best regards,</p>
    <p>The Glocalview HRMS Team</p>
    </body>

    </html>
`;
exports.BirthdayTemplate = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="font-family: cursive; font-style: normal; width: 100%; height: fit-content; border-collapse: collapse">
            <div
                style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    max-width: 700px;
                    align-items: center;
                    margin-left: auto;
                    margin-right: auto;
                "
            >
                <div style="width: 100%; display: flex; flex-direction: column; background-color: #dcd3f4">
                    <p style="text-align: center; font-size: 30px; font-weight: bold; color: white">Happy Birthday!</p>
                    <img src="cid:birthdayBanner" style="width: 100%" />
                    <div style="display: flex; justify-content: space-between; padding: 5%; gap: 20%">
                        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: start">
                            <p style="font-weight: 600; font-size: 14px; color: gray">
                                <span style="font-weight: 800; font-size: 14px">Dear {{Username}},</span><br /><br />
                                Wishing you a wonderful Birthday,<br />and a year of good health, happiness and success.<br /><br />
                                Happy Birthday!
                            </p>
                        </div>
                        <div style="display: flex; width: 100%; height: 100%; justify-content: end; align-items: center">
                            <img style="width: 175px; height: 175px; border-radius: 50%; background-color: white" src="cid:profileImage" />
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>
`;
exports.AnniversaryTemplate = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="font-family: cursive; font-style: normal; width: 100%; height: fit-content; border-collapse: collapse">
            <div
                style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    max-width: 700px;
                    align-items: center;
                    margin-left: auto;
                    margin-right: auto;
                "
            >
                <div style="width: 100%; display: flex; flex-direction: column; background-color: #dcd3f4">
                    <p style="text-align: center; font-size: 30px; font-weight: bold; color: white">Happy Birthday!</p>
                    <img src="cid:birthdayBanner" style="width: 100%" />
                    <div style="display: flex; justify-content: space-between; padding: 5%; gap: 20%">
                        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: start">
                            <p style="font-weight: 600; font-size: 14px; color: gray">
                                <span style="font-weight: 800; font-size: 14px">Dear {{Username}},</span><br /><br />
                                Wishing you a wonderful Birthday,<br />and a year of good health, happiness and success.<br /><br />
                                Happy Birthday!
                            </p>
                        </div>
                        <div style="display: flex; width: 100%; height: 100%; justify-content: end; align-items: center">
                            <img style="width: 175px; height: 175px; border-radius: 50%; background-color: white" src="cid:profileImage" />
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>
`;
