import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { adminSession } from "@prisma/client";

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async deActivateAllSessions(staffId: number): Promise<number> {
    const affectedCount = await this.prisma.$executeRaw`
      UPDATE admin_session
      SET 
        is_active = false
      WHERE 
        staff_id = ${staffId} AND is_active = true
      ;
    `
    return affectedCount
  }

  async creaetNewSession(data: {
    staffId: number;
    refreshTokenHash: string;
    ipAddress?: string;
    userAgent?: string;
    isActive: boolean;
    expiresAt: Date;
  }){
    const [createdSession] = await this.prisma.$queryRaw<adminSession[]>`
      INSERT INTO admin_session (
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
    `

    return createdSession
  }

  async findByTokenHash(hash: string) {
    return this.prisma.adminSession.findFirst(
      {
         where: {
          refreshTokenHash: hash
         }
      }
    )
  }

  async findSessionById(id: number){
    return this.prisma.adminSession.findUnique({
      where: { 
        id: id 
      },
    });
  }

  async deactivateSession(sessionId: number){
    return this.prisma.adminSession.update({
      where: {
         id: sessionId 
      },
      data: { isActive: false },
    });
  }
}