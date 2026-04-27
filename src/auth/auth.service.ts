import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto } from "src/users/dto/users.dto";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(data: CreateUserDto) {
    return this.usersService.create(data);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    const payload = {
      id: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // For security reasons, don't reveal if user exists
      return { message: 'Jika email terdaftar, instruksi reset password akan dikirim.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    await this.usersService.update(user.id, {
      reset_password_token: token,
      reset_password_expires: expires,
    });

    await this.mailService.sendResetPasswordEmail(user.email, token);

    return { message: 'Instruksi reset password telah dikirim ke email Anda.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (!user || !user.reset_password_expires || user.reset_password_expires < new Date()) {
      throw new BadRequestException('Token tidak valid atau sudah kedaluwarsa');
    }

    await this.usersService.update(user.id, {
      password: newPassword,
      reset_password_token: null,
      reset_password_expires: null,
    });

    return { message: 'Password berhasil diubah. Silakan login kembali.' };
  }
}
