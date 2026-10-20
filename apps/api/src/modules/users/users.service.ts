import { Injectable } from '@nestjs/common';
import type { Role } from '@swiftdrop/contracts';
import type { User } from '@swiftdrop/db';
import { notFound, notImplemented } from '../../common/errors/app-error';
import { PrismaService } from '../../infra/prisma';
import type {
  AdminCreateUserDto,
  AdminUpdateUserDto,
  ListUsersQuery,
  UpdateMeDto,
  UserDto,
} from './dto/user.dto';

export interface CreateUserInput {
  email: string;
  name: string;
  role: Role;
  /** Plain password — hashed here with argon2id. Omit for OAuth-only users. */
  password?: string;
  phone?: string;
}

/**
 * PUBLIC SERVICE (exported) — other modules may call: findById, findByEmail, createUser, toDto.
 * Owner: M2.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async getMe(userId: string): Promise<UserDto> {
    const user = await this.findById(userId);
    if (!user) throw notFound('User');
    return this.toDto(user);
  }

  /** Used by auth registration (M2) and merchant registration (M5). */
  async createUser(_input: CreateUserInput): Promise<User> {
    notImplemented('M2'); // TODO(M2): normalise email, argon2id hash, handle EMAIL_TAKEN
  }

  async updateMe(_userId: string, _dto: UpdateMeDto): Promise<UserDto> {
    notImplemented('M2');
  }

  async adminList(_q: ListUsersQuery) {
    notImplemented('M2');
  }

  async adminCreate(_dto: AdminCreateUserDto): Promise<UserDto> {
    notImplemented('M2'); // TODO(M2): if role=COURIER also create CourierProfile; audit log (M9)
  }

  async adminUpdate(_id: string, _dto: AdminUpdateUserDto): Promise<UserDto> {
    notImplemented('M2'); // TODO(M2): audit log; revoke sessions when deactivated
  }

  toDto(u: User): UserDto {
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
    };
  }
}
