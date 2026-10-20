import { Module } from '@nestjs/common';
import { DevLoginController } from './dev-login.controller';

@Module({ controllers: [DevLoginController] })
export class DevLoginModule {}
