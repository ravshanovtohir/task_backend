import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateStaffDto, StaffListQueryDto, UpdateStaffDto } from './dto';
import { paginate } from '@helpers';
import { Prisma } from '@prisma/client';

@Injectable()
export class StaffRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getStaffByEmail(email: string) {
    return this.prisma.staff.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findRolesByIds(roleIds: number[]) {
    return this.prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
      select: {
        id: true,
        key: true,
      },
    });
  }

  async getAllStaff(query: StaffListQueryDto) {
    const { page, perPage, id, email, search } = query;

    const where: Prisma.StaffWhereInput = {
      ...(id !== undefined ? { id } : {}),

      ...(email
        ? {
            email: {
              equals: email.trim().toLowerCase(),
              mode: 'insensitive',
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                firstName: {
                  contains: search.trim(),
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: search.trim(),
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    return paginate({
      page,
      perPage,

      count: () => this.prisma.staff.count({ where }),

      findMany: (skip, take) =>
        this.prisma.staff.findMany({
          where,
          skip,
          take,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            roles: {
              select: {
                role: {
                  select: {
                    id: true,
                    key: true,
                    title: true,
                  },
                },
              },
            },
          },
        }),
    });
  }

  async getStaffById(id: number) {
    const result = await this.prisma.$queryRaw<any[]>`
    SELECT
      s.id,
      s.first_name AS "firstName",
      s.last_name AS "lastName",
      s.email,
      s.created_at AS "createdAt",

      COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'id', r.id,
            'key', r.key,
            'assignedAt', sr.assigned_at,

            'assignedBy',
              CASE
                WHEN assigned_by.id IS NULL THEN NULL
                ELSE jsonb_build_object(
                  'id', assigned_by.id,
                  'firstName', assigned_by.first_name,
                  'lastName', assigned_by.last_name,
                  'email', assigned_by.email
                )
              END
          )
          ORDER BY sr.assigned_at DESC
        ) FILTER (WHERE sr.id IS NOT NULL),
        '[]'::jsonb
      ) AS roles

    FROM staff s

    LEFT JOIN staff_role sr
      ON sr.staff_id = s.id

    LEFT JOIN "role" r
      ON r.id = sr.role_id

    LEFT JOIN staff assigned_by
      ON assigned_by.id = sr.assigned_by

    WHERE s.id = ${id}

    GROUP BY
      s.id,
      s.first_name,
      s.last_name,
      s.email,
      s.created_at

    LIMIT 1;
    `;

    return result[0] ?? null;
  }

  async createStaff(data: CreateStaffDto, hashedPassword: string, assignedBy: number) {
    return this.prisma.$transaction(async (tx) => {
      const staff = await tx.staff.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword,
        },
        select: {
          id: true,
        },
      });

      await tx.staffRole.createMany({
        data: data.roleIds.map((roleId) => ({
          staffId: staff.id,
          roleId: roleId,
          assignedBy: assignedBy,
        })),
      });
    });
  }

  async getStaffForUpdate(id: number) {
    return this.prisma.staff.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
      },
    });
  }

  async updateStaff(id: number, data: UpdateStaffDto, roleIds: number[] | undefined, assignedBy: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.staff.update({
        where: {
          id,
        },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        },
      });

      // roleIds yuborilmagan bo‘lsa, eski role’lar saqlanadi
      if (roleIds !== undefined) {
        await tx.staffRole.deleteMany({
          where: {
            staffId: id,
          },
        });

        if (roleIds.length > 0) {
          await tx.staffRole.createMany({
            data: roleIds.map((roleId) => ({
              staffId: id,
              roleId,
              assignedBy,
            })),
          });
        }
      }
    });
  }
  async deleteStaffDto(id: number) {}
}
