import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ROLE_HOME } from '@swiftdrop/contracts';
import { IsEmail } from 'class-validator';
import type { Response } from 'express';
import { Public, TokenService } from '../../common/auth';
import { notFound } from '../../common/errors/app-error';
import { InjectConfig, type Env } from '../../config/config.module';
import { PrismaService } from '../../infra/prisma';

class DevLoginDto {
  @ApiProperty({ example: 'customer@swiftdrop.test' })
  @IsEmail()
  email: string;
}

/**
 * DEV ONLY — sign in as any seeded user without a password so frontend and API work can start
 * before real auth (M2) is finished. Disabled unless ENABLE_DEV_LOGIN=true; refused in production
 * at config load. Owner: M1. Remove the dev login UI link before the final demo.
 */
@ApiTags('dev')
@Controller('dev')
@Public()
export class DevLoginController {
  constructor(
    @InjectConfig() private readonly config: Env,
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
  ) {}

  @Get('users')
  @ApiOperation({ summary: '[dev] List seeded accounts you can log in as' })
  async users() {
    this.assertEnabled();
    return this.prisma.user.findMany({
      where: { email: { endsWith: '@swiftdrop.test' } },
      select: { email: true, name: true, role: true },
      orderBy: { role: 'asc' },
    });
  }

  @Post('login-as')
  @HttpCode(200)
  @ApiOperation({ summary: '[dev] Sign in as a user by email (sets the sd_access cookie)' })
  async loginAs(@Body() dto: DevLoginDto, @Res({ passthrough: true }) res: Response) {
    this.assertEnabled();
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw notFound('User');
    const authUser = { id: user.id, email: user.email, role: user.role };
    this.tokens.setAccessCookie(res, await this.tokens.signAccessToken(authUser));
    return { user: authUser, home: ROLE_HOME[user.role] };
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: '[dev] Clear auth cookies' })
  logout(@Res({ passthrough: true }) res: Response) {
    this.assertEnabled();
    this.tokens.clearAuthCookies(res);
  }

  private assertEnabled() {
    if (!this.config.ENABLE_DEV_LOGIN || this.config.NODE_ENV === 'production') {
      throw notFound('Route');
    }
  }
}
