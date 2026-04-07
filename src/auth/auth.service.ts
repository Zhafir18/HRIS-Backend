import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entity/users.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
      select: ['id', 'email', 'password'],
    });

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
}
