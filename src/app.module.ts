import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { DepartmentModule } from './department/department.module';
import { OfficeModule } from './office/office.module';
import { Roles } from './entity/roles.entity';
import { AttendanceModule } from './attendance/attendance.module';
import { Attendance } from './entity/attendance.entity';
import { Department } from './entity/department.entity';
import { Office } from './entity/office.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LeaveModule } from './leave/leave.module';
import { LeaveRequest } from './entity/leave-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Users, Roles, Attendance, Department, Office, LeaveRequest],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        options: {
          encrypt: false,
        },
      }),
    }),
    UsersModule,
    RolesModule,
    DepartmentModule,
    OfficeModule,
    AttendanceModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'assets'),
      serveRoot: '/assets',
    }),
    LeaveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
