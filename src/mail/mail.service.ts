import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // For production, you would use real SMTP settings
    // For development, we can use Ethereal or just log to console
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST') || 'smtp.ethereal.email',
      port: this.configService.get('MAIL_PORT') || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER') || 'fake@ethereal.email',
        pass: this.configService.get('MAIL_PASS') || 'fake_pass',
      },
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:5173'}/reset-password/${token}`;
    
    const mailOptions = {
      from: '"HRIS System" <noreply@hris.com>',
      to: email,
      subject: 'Reset Password - HRIS',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Reset Password</h2>
          <p>Anda menerima email ini karena Anda (atau orang lain) meminta pengaturan ulang kata sandi untuk akun Anda.</p>
          <p>Silakan klik tombol di bawah ini untuk mengatur ulang kata sandi Anda. Tautan ini akan kedaluwarsa dalam 1 jam.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>Jika Anda tidak meminta ini, abaikan email ini dan kata sandi Anda tidak akan berubah.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777;">Tautan ini juga dapat disalin secara manual: <br/> ${resetUrl}</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      // If using Ethereal, log the preview URL
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error sending email:', error);
      // Even if email fails in dev, we want to see the token in console
      console.log('FALLBACK: Reset Token is', token);
      console.log('FALLBACK: Reset URL is', resetUrl);
    }
  }
}
