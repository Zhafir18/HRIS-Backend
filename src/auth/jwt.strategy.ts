import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Users } from 'src/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET_KEY')!,
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      ...user,
    };
  }
}
