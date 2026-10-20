import { Injectable, Logger } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import { InjectConfig, type WorkerEnv } from '../../config/config.module';

/**
 * Email via SMTP (Mailpit in dev — open http://localhost:8025 to see messages) and a mock SMS
 * provider that only logs a masked line. Owner: M8.
 */
@Injectable()
export class MailProvider {
  private readonly logger = new Logger(MailProvider.name);
  private readonly transport: Transporter;

  constructor(@InjectConfig() private readonly config: WorkerEnv) {
    this.transport = createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: false,
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    await this.transport.sendMail({ from: this.config.MAIL_FROM, to, subject, text, html });
  }

  /** Mock SMS: logs only the last 3 digits of the number. */
  async sendSms(phone: string, text: string): Promise<void> {
    this.logger.log(`[mock-sms] to ***${phone.slice(-3)}: ${text}`);
  }
}
