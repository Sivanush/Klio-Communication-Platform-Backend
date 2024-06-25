import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


export class MailerService {
    private transporter
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,

            }
        })
    }


    async sendEmail(email: string, otp: string) {
        const options = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            html: `
             <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
                    <div style="padding: 20px; text-align: center;">
                        <h1 style="color: #333;">Your OTP Code</h1>
                        <p style="font-size: 16px;">Use the following OTP code to complete your authentication:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #000000 ;">${otp}</p>
                        <p style="font-size: 14px; color: #777;">This OTP is valid for 1 minute.</p>
                        <div style="margin-top: 20px;">
                            <a href="http://localhost:4200/otp" style="text-decoration: none; background: #000000; color: white; padding: 10px 20px; border-radius: 5px;">Verify Now</a>
                        </div>
                        <p style="font-size: 12px; color: #aaa; margin-top: 20px;">If you did not request this OTP, please ignore this email.</p>
                    </div>
                    <div style="text-align: center; padding: 10px 0; border-top: 1px solid #eaeaea; color: #999999;">
                        <p style="margin: 5px 0;">&copy; 2024 Your Company Name. All rights reserved.</p>
                        <p style="margin: 5px 0;"><a href="#" style="color: #999999;">Privacy Policy</a> | <a href="#" style="color: #999999;">Contact Us</a></p>
                    </div>
                </div>
            </body>

            `,
        }

        try {
            await this.transporter.sendMail(options)
        } catch (err) {
            console.error('Error in NodeMailer:', err);
            throw new Error('Could Not Send OTP Via Email');
        }
    }


    async sendEmailForToken(email: string, token: string) {
        const options = {
            from: 'your_email@example.com',
            to: email,
            subject: 'Password Reset Request',
            html: `
               <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
                    <!--<div style="text-align: center; padding: 10px 0; border-bottom: 1px solid #eaeaea;">-->
                    <!--    <img src="https://via.placeholder.com/150" alt="Your Logo" style="max-width: 150px;">-->
                    <!--</div>-->
                    <div style="padding: 20px; text-align: center;">
                        <h1 style="color: #333333;">Password Reset Request</h1>
                        <p style="color: #666666;">Hello,</p>
                        <p style="color: #666666;">You recently requested to reset your password for your account. Click the button below to reset it.</p>
                        <a href="http://localhost:4200/reset-password/${token}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                        <p style="color: #666666;">If you did not request a password reset, please ignore this email or reply to let us know.</p>
                        <p style="color: #666666;">Thank you,<br>Team Console</p>
                    </div>
                    <div style="text-align: center; padding: 10px 0; border-top: 1px solid #eaeaea; color: #999999;">
                        <p style="margin: 5px 0;">&copy; 2024 Console. All rights reserved.</p>
                        <p style="margin: 5px 0;"><a href="#" style="color: #999999;">Privacy Policy</a> | <a href="#" style="color: #999999;">Contact Us</a></p>
                    </div>
                </div>
            </body>`,
        }

        try {
            await this.transporter.sendMail(options)
        } catch (err) {
            console.error('Error in NodeMailer:', err);
            throw new Error('Could Not Send OTP Via Email');
        }
    }


}