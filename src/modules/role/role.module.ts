import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaModule } from '@prisma';
import { RedisModule } from '@redis';
import { RolesRepository } from './role.repository';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [RoleController],
  providers: [RoleService, RolesRepository],
})
export class RoleModule {}
