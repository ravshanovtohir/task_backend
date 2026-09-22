import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { Session } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deActivateAllSessions(staffId: number): Promise<number> {
    const affectedCount = await this.prisma.$executeRaw`
      UPDATE staff_session
      SET 
        is_active = false
      WHERE 
        staff_id = ${staffId} AND is_active = true
      ;
    `;
    return affectedCount;
  }

  async creaetNewSession(data: {
    staffId: number;
    refreshTokenHash: string;
    ipAddress?: string;
    userAgent?: string;
    isActive: boolean;
    expiresAt: Date;
  }) {
    const [createdSession] = await this.prisma.$queryRaw<Session[]>`
      INSERT INTO staff_session (
        staff_id,
        refresh_token_hash,
        ip_address,
        user_agent,
        is_active,
        expires_at,
        created_at
      )
      VALUES (
        ${data.staffId},
        ${data.refreshTokenHash},
        ${data.ipAddress ?? null},
        ${data.userAgent ?? null},
        ${data.isActive ?? true},
        ${data.expiresAt},
        NOW()
      )
      RETURNING
      id
    `;

    return createdSession;
  }

  async findByTokenHash(hash: string) {
    return this.prisma.session.findFirst({
      where: {
        refreshTokenHash: hash,
      },
    });
  }

  async findSessionById(id: string) {
    return this.prisma.session.findUnique({
      where: {
        id: id,
      },
    });
  }

  async deactivateSession(sessionId: string) {
    return this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: { isActive: false },
    });
  }

  async getStaffById(staffId: number) {
    return this.prisma.staff.findUnique({
      where: {
        id: staffId,
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
                key: true,
              },
            },
          },
        },
      },
    });
  }

  async updateRefreshTokenHash(sessionId: string, refreshTokenHash: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { refreshTokenHash },
    });
  }
}
