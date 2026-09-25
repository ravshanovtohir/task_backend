import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffRepository } from './staff.repository';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT } from '@constants';
import { RoleKey } from '@decorators';
import { StaffListQueryDto } from './dto';
import { RedisService } from '@redis';
@Injectable()
export class StaffService {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly redisService: RedisService,
  ) {}
  async create(data: CreateStaffDto, staffId: number) {
    const emailExists = await this.staffRepository.getStaffByEmail(data.email);

    if (emailExists) {
      throw new ConflictException('main.error.staff.emailExists');
    }

    const roles = await this.staffRepository.findRolesByIds(data.roleIds);
    if (data.roleIds.length !== roles.length) {
      throw new BadRequestException('main.error.staff.roleNotFound');
    }

    const hasAdminRole = roles.some((role) => role.key === RoleKey.ADMIN);

    if (hasAdminRole) {
      throw new ForbiddenException('main.error.staff.adminRoleForbidden');
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT);

    await this.staffRepository.createStaff(data, hashedPassword, staffId);
    return {};
  }

  async findAll(query: StaffListQueryDto) {
    const staff = await this.staffRepository.getAllStaff(query);
    return staff;
  }

  async findOne(id: number) {
    const staff = await this.staffRepository.getStaffById(id);
    if (!staff) {
      throw new NotFoundException('main.error.staff.notFound');
    }
    return staff;
  }

  async update(id: number, data: UpdateStaffDto, assignedBy: number) {
    const staff = await this.staffRepository.getStaffForUpdate(id);

    if (!staff) {
      throw new NotFoundException('main.error.staff.notFound');
    }

    if (staff.roles.some((item) => item.role.key === RoleKey.ADMIN)) {
      throw new ForbiddenException('main.error.staff.adminProtected');
    }

    if (data.email && data.email !== staff.email) {
      const emailOwner = await this.staffRepository.getStaffByEmail(data.email);

      if (emailOwner) {
        throw new ConflictException('main.error.staff.emailExists');
      }
    }

    if (data.roleIds !== undefined) {
      const roles = await this.staffRepository.findRolesByIds(data.roleIds);

      if (roles.length !== data.roleIds.length) {
        throw new BadRequestException('main.error.staff.roleNotFound');
      }

      if (roles.some((role) => role.key === RoleKey.ADMIN)) {
        throw new ForbiddenException('main.error.staff.adminRoleForbidden');
      }
    }

    const correctData = {
      firstName: data.firstName ?? staff.firstName,
      lastName: data.lastName ?? staff.lastName,
      email: data.email?.toLowerCase() ?? staff.email,
      password: data.password ? await bcrypt.hash(data.password, BCRYPT_SALT) : staff.password,
    };

    await this.staffRepository.updateStaff(id, correctData, data.roleIds, assignedBy);

    return {};
  }

  async remove(id: number) {
    const staff = await this.staffRepository.getStaffForUpdate(id);
    if (!staff) {
      throw new NotFoundException('main.error.staff.notFound');
    }

    if (staff.roles.some((item) => item.role.key === RoleKey.ADMIN)) {
      throw new ForbiddenException('main.error.staff.adminProtected');
    }

    await this.staffRepository.deleteStaffDto(id);
    await this.redisService.delete(`admin:active_session:${id}`);
    return {};
  }
}
