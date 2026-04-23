import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Roles } from './entity/roles.entity';
import { Department } from './entity/department.entity';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const rolesRepository = app.get<Repository<Roles>>(getRepositoryToken(Roles));
  const departmentRepository = app.get<Repository<Department>>(getRepositoryToken(Department));
  const usersRepository = app.get<Repository<Users>>(getRepositoryToken(Users));

  console.log('Seed started...');

  // 1. Seed Roles
  const roles = ['Admin', 'Employee'];
  const seededRoles: Record<string, Roles> = {};

  for (const roleName of roles) {
    let role = await rolesRepository.findOne({ where: { name: roleName } });
    if (!role) {
      role = rolesRepository.create({ name: roleName });
      role = await rolesRepository.save(role);
      console.log(`Role ${roleName} created.`);
    } else {
      console.log(`Role ${roleName} already exists.`);
    }
    seededRoles[roleName] = role;
  }

  // 2. Seed Departments
  const departments = [
    { name: 'IT', description: 'Information Technology' },
    { name: 'HR', description: 'Human Resources' },
    { name: 'Finance', description: 'Financial Department' },
    { name: 'Operations', description: 'Operations and Logistics' },
  ];
  const seededDepartments: Record<string, Department> = {};

  for (const deptData of departments) {
    let dept = await departmentRepository.findOne({ where: { name: deptData.name } });
    if (!dept) {
      dept = departmentRepository.create(deptData);
      dept = await departmentRepository.save(dept);
      console.log(`Department ${deptData.name} created.`);
    } else {
      console.log(`Department ${deptData.name} already exists.`);
    }
    seededDepartments[deptData.name] = dept;
  }

  // 3. Seed Users
  const password = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      username: 'admin',
      email: 'admin@hris.com',
      password,
      role_id: seededRoles['Admin'].id,
    },
    {
      username: 'johndoe',
      email: 'john@hris.com',
      password,
      role_id: seededRoles['Employee'].id,
      department_id: seededDepartments['IT'].id,
    },
    {
      username: 'janesmith',
      email: 'jane@hris.com',
      password,
      role_id: seededRoles['Employee'].id,
      department_id: seededDepartments['HR'].id,
    }
  ];

  for (const userData of users) {
    const existingUser = await usersRepository.findOne({ where: { email: userData.email } });
    if (!existingUser) {
      const user = usersRepository.create(userData);
      await usersRepository.save(user);
      console.log(`User ${userData.username} created.`);
    } else {
      console.log(`User ${userData.username} already exists.`);
    }
  }

  console.log('Seed completed successfully.');
  await app.close();
}

bootstrap();
