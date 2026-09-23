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
@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}
  async create(data: CreateStaffDto, staffId: number) {
    const emailExists = await this.staffRepository.getStaffByEmail(data.email);

    if (emailExists) {
      throw new ConflictException();
    }

    const roles = await this.staffRepository.findRolesByIds(data.roleIds);
    if (data.roleIds.length !== roles.length) {
      throw new BadRequestException('ROle noe found');
    }

    const hasAdminRole = roles.some((role) => role.key === RoleKey.ADMIN);

    if (hasAdminRole) {
      throw new ForbiddenException('Yangi foydalanuvchiga ADMIN roli biriktirilmaydi');
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
      throw new NotFoundException();
    }
    return staff;
  }

  async update(id: number, data: UpdateStaffDto, assignedBy: number) {
    const staff = await this.staffRepository.getStaffForUpdate(id);

    if (!staff) {
      throw new NotFoundException('');
    }

    if (data.email && data.email !== staff.email) {
      const emailOwner = await this.staffRepository.getStaffByEmail(data.email);

      if (emailOwner) {
        throw new ConflictException('');
      }
    }

    if (data.roleIds !== undefined) {
      const roles = await this.staffRepository.findRolesByIds(data.roleIds);

      if (roles.length !== data.roleIds.length) {
        throw new BadRequestException('Yuborilgan rolelardan biri topilmadi');
      }

      if (roles.some((role) => role.key === RoleKey.ADMIN)) {
        throw new ForbiddenException('Foydalanuvchiga ADMIN roli biriktirilmaydi');
      }
    }

    const correctData = {
      firstName: data.firstName ?? staff.firstName,
      lastName: data.lastName ?? staff.lastName,
      email: data.email?.toLowerCase() ?? staff.email,
      password: data.password ? await bcrypt.hash(data.password, 12) : staff.password,
    };

    await this.staffRepository.updateStaff(id, correctData, data.roleIds, assignedBy);

    return {};
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
