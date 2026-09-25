import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RedisService } from '@redis';
import { redisCacheKeys } from '@constants';
import { RoleListQueryDto } from './dto';
import { RolesRepository } from './role.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class RoleService {
  constructor(
    private readonly redisService: RedisService,
    private readonly rolesRepository: RolesRepository,
  ) {}
  async create(data: CreateRoleDto) {
    const roleExists = await this.rolesRepository.getRoleByKey(data.key);

    if (roleExists) {
      throw new ConflictException('main.error.role.keyExists');
    }

    await this.rolesRepository.createRole(data);
    await this.invalidateRolesCache();

    return {};
  }

  async findAll(query: RoleListQueryDto, lang: string) {
    const version = (await this.redisService.get(redisCacheKeys.rolesVersion)) ?? '0';
    const cacheKey = `${redisCacheKeys.roles}:${version}:${query.page}:${query.perPage}:${query.key ?? ''}:${query.search ?? ''}`;
    const roleCached = await this.redisService.get(cacheKey);
    const roles = roleCached ? JSON.parse(roleCached) : await this.rolesRepository.getRoles(query);

    if (!roleCached) {
      await this.redisService.set(cacheKey, JSON.stringify(roles), 300);
    }

    return {
      ...roles,
      data: roles.data.map((role) => ({
        ...role,
        title: role.title[lang] ?? role.title.uz,
      })),
    };
  }

  async findOne(id: number, lang: string) {
    const roleCached = await this.redisService.get(`role:id:${id}`);
    if (roleCached) {
      const role = JSON.parse(roleCached);
      return { ...role, title: role.title[lang] ?? role.title.uz };
    }
    const role = await this.rolesRepository.getRoleById(id);
    if (!role) {
      throw new NotFoundException('main.error.role.notFound');
    }
    await this.redisService.set(`role:id:${id}`, JSON.stringify(role), 300);
    const title = role.title as Record<string, string>;
    return { ...role, title: title[lang] ?? title.uz };
  }

  async update(id: number, data: UpdateRoleDto) {
    const role = await this.rolesRepository.getRoleById(id);

    if (!role) {
      throw new NotFoundException('main.error.role.notFound');
    }

    const currentTitle = role.title as { uz: string; ru: string };
    await this.rolesRepository.updateRoleTitle(id, {
      title: {
        uz: data.title.uz ?? currentTitle.uz,
        ru: data.title.ru ?? currentTitle.ru,
      },
    });

    await Promise.all([this.invalidateRolesCache(), this.redisService.delete(`role:id:${id}`)]);

    return {};
  }

  async remove(id: number) {
    const roleExists = await this.rolesRepository.getRoleById(id);
    if (!roleExists) {
      throw new NotFoundException('main.error.role.notFound');
    }
    await this.rolesRepository.removeRole(id);
    await Promise.all([this.invalidateRolesCache(), this.redisService.delete(`role:id:${id}`)]);
    return {};
  }

  private async invalidateRolesCache() {
    await this.redisService.set(redisCacheKeys.rolesVersion, randomUUID());
  }
}
