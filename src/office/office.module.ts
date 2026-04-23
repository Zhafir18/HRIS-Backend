import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from 'src/entity/office.entity';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Office])],
  providers: [OfficeService],
  controllers: [OfficeController],
  exports: [OfficeService],
})
export class OfficeModule {}
