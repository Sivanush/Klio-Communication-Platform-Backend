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
              <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h1 style="color: #333;">Your OTP Code</h1>
                <p style="font-size: 16px;">Use the following OTP code to complete your authentication:</p>
                <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otp}</p>
                <p style="font-size: 14px; color: #777;">This OTP is valid for 1 minute.</p>
                <div style="margin-top: 20px;">
                  <a href="http://localhost:4200/otp" style="text-decoration: none; background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px;">Verify Now</a>
                </div>
                <p style="font-size: 12px; color: #aaa; margin-top: 20px;">If you did not request this OTP, please ignore this email.</p>
              </div>
            `,
        }

        try {
            await this.transporter.sendMail(options)
        } catch (err) {
            console.error('Error in NodeMailer:', err);
            throw new Error('Could Not Send OTP Via Email');
        }
    }


    async sendEmailForToken(email:string,token:string){
        const options = {
            from: 'your_email@example.com',
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p style="font-size: 16px;">You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p style="font-size: 16px;">Please click on the following link, or paste this into your browser to complete the process:</p>
                <p><a href="http://localhost:4200/reset-password/${token}" style="color: blue; font-size: 18px;">Reset Password</a></p>
                <p style="font-size: 16px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        }

        try {
            await this.transporter.sendMail(options)
        } catch (err) {
            console.error('Error in NodeMailer:', err);
            throw new Error('Could Not Send OTP Via Email');
        }
    }


}