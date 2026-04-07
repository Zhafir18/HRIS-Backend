import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { Roles } from './entity/roles.entity';
import { AttendanceModule } from './attendance/attendance.module';
import { Attendance } from './entity/attendance.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'Zhafir',
      password: '123456',
      database: 'Hris',
      entities: [Users, Roles, Attendance],
      synchronize: false,
      options: {
        encrypt: false,
      },
    }),
    UsersModule,
    RolesModule,
    AttendanceModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'assets'),
      serveRoot: '/assets',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
