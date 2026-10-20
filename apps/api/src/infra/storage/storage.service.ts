import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import type { Readable } from 'node:stream';
import { InjectConfig, type Env } from '../../config/config.module';

/**
 * Private object storage (MinIO, S3-compatible) for proof-of-delivery files (ADR-0005).
 * Buckets are PRIVATE. Never hand out raw object URLs — stream files through an API endpoint
 * that performs the authorization check. Owner: M6.
 */
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Client;

  constructor(@InjectConfig() private readonly config: Env) {
    this.client = new Client({
      endPoint: config.S3_ENDPOINT,
      port: config.S3_PORT,
      useSSL: config.S3_USE_SSL,
      accessKey: config.S3_ACCESS_KEY,
      secretKey: config.S3_SECRET_KEY,
      region: 'us-east-1',
    });
  }

  async onModuleInit() {
    try {
      const bucket = this.config.S3_BUCKET_POD;
      if (!(await this.client.bucketExists(bucket))) await this.client.makeBucket(bucket);
    } catch (err) {
      this.logger.warn(`Object storage not reachable yet: ${(err as Error).message}`);
    }
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.putObject(this.config.S3_BUCKET_POD, key, body, body.length, {
      'Content-Type': contentType,
    });
  }

  get(key: string): Promise<Readable> {
    return this.client.getObject(this.config.S3_BUCKET_POD, key);
  }

  async remove(key: string): Promise<void> {
    await this.client.removeObject(this.config.S3_BUCKET_POD, key);
  }

  async ping(): Promise<boolean> {
    try {
      await this.client.bucketExists(this.config.S3_BUCKET_POD);
      return true;
    } catch {
      return false;
    }
  }
}
