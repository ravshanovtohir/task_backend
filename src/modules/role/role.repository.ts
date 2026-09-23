import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { Prisma, Session } from '@prisma/client';
import { CreateRoleDto, RoleListQueryDto, UpdateRoleDto } from './dto';
import { paginate } from '@helpers';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(query: RoleListQueryDto, lang: string) {
    const { page, perPage, search, key } = query;

    const where: Prisma.RoleWhereInput = {
      ...(key
        ? {
            key: {
              equals: key.trim().toUpperCase(),
              mode: 'insensitive',
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                key: {
                  contains: search.trim(),
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: search.trim(),
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };
    return await paginate({
      page,
      perPage,
      count: () => this.prisma.role.count({ where }),
      findMany: (skip, take) =>
        this.prisma.role.findMany({
          select: {
            id: true,
            title: true,
            key: true,
            description: true,
            createdAt: true,
          },
          where,
          skip,
          take,
          orderBy: {
            createdAt: 'desc',
          },
        }),
    });
  }

  async getRoleById(id: number) {
    return this.prisma.role.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        key: true,
        description: true,
        createdAt: true,
      },
    });
  }

  async getRoleByKey(key: string) {
    return this.prisma.role.findUnique({
      where: {
        key: key,
      },
      select: {
        id: true,
        title: true,
        key: true,
        description: true,
        createdAt: true,
      },
    });
  }

  async createRole(data: CreateRoleDto) {
    return await this.prisma.role.create({
      data: {
        title: {
          uz: data.title.uz,
          ru: data.title.ru,
          en: data.title.en,
        },
        key: data.key,
      },
    });
  }

  async updateRoleTitle(id: number, data: UpdateRoleDto) {
    return this.prisma.role.update({
      where: {
        id,
      },
      data: {
        title: {
          uz: data.title.uz,
          ru: data.title.ru,
          en: data.title.en,
        },
      },
      select: {
        id: true,
        title: true,
        key: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async removeRole(id: number) {
    return await this.prisma.role.delete({
      where: {
        id: id,
      },
    });
  }
}
