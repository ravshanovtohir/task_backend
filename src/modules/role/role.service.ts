import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '@prisma';
import { RedisService } from '@redis';
import { redisCacheKeys } from '@constants';
import { RoleListQueryDto } from './dto';
import { RolesRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly rolesRepository: RolesRepository,
  ) {}
  async create(data: CreateRoleDto) {
    const roleExists = await this.rolesRepository.getRoleByKey(data.key)

    if (roleExists) {
      throw new ConflictException('Role with this key already exists!');
    }

    await this.rolesRepository.createRole(data);
    await this.redisService.delete(redisCacheKeys.roles);

    return {};
  }

  async findAll(query: RoleListQueryDto, lang: string) {
    const roleCached = await this.redisService.get(redisCacheKeys.roles);
    const roles = roleCached ? JSON.parse(roleCached) : await this.rolesRepository.getRoles(query, lang);

    if (!roleCached) {
      await this.redisService.set(redisCacheKeys.roles, JSON.stringify(roles), 300);
    }

    return {
      ...roles,
      data: roles.data.map((role) => ({
        ...role,
        title: role.title[lang],
      })),
    };

    // return {
    //   data: roles.data.map((role) => ({
    //     ...role,
    //     title: role.title[lang],
    //   })),
    //   totalItems: roles.totalItems,
    //   currentPage: roles.currentPage,
    //   perPage: roles.perPage,
    // };
  }

  async findOne(id: number) {
    const roleCached = await this.redisService.get(`role:id:${id}`);
    if (roleCached) {
      return JSON.parse(roleCached);
    }
    const role = await this.rolesRepository.getRoleById(id);
    if (!role) {
      throw new NotFoundException();
    }
    await this.redisService.set(`role:id:${id}`, JSON.stringify(role));
    return role;
  }

  async update(id: number, data: UpdateRoleDto) {
    const role = await this.rolesRepository.getRoleById(id);

    if (!role) {
      throw new NotFoundException('Role topilmadi');
    }

    const updatedRole = await this.rolesRepository.updateRoleTitle(id, data);

    await Promise.all([this.redisService.delete(redisCacheKeys.roles), this.redisService.delete(`role:id:${id}`)]);

    return {};
  }

  async remove(id: number) {
    const roleExists = await this.rolesRepository.getRoleById(id);
    if (!roleExists) {
      throw new NotFoundException();
    }
    await this.rolesRepository.removeRole(id);
    return {};
  }
}
