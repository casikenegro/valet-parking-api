import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "@sendgrid/mail";

export type SendEmailRequest = {
  to: string;
  templateId: string;
  templateData: any;
  attachments?: {
    content: string;
    filename: string;
    type?: string;
  }[];
};

@Injectable()
export class EmailService {
  sendgrid: MailService;
  private readonly logger = new Logger(EmailService.name);
  constructor(private config: ConfigService) {
    this.sendgrid = new MailService();

    this.sendgrid.setApiKey(config.get<string>("SENDGRID_API_KEY") as string);
  }

  async sendEmail({
    templateData,
    templateId,
    to,
    attachments,
  }: SendEmailRequest) {
    try {
      const result = await this.sendgrid.send({
        to,
        from: this.config.get("SENDGRID_FROM_EMAIL") as string,
        templateId: templateId,
        dynamicTemplateData: templateData,
        attachments: attachments?.map((attachment) => ({
          ...attachment,
          disposition: "attachment",
        })),
      });
      if (result[0].statusCode === 202) {
        this.logger.debug(
          `Sending email template ${templateId} to ${to} with data: ${JSON.stringify(
            templateData,
          )}`,
        );
      } else {
        this.logger.error(
          `Error sending email template ${templateId} to ${to}`,
        );
      }
    } catch (error: any) {
      this.logger.error(`Error sending email template ${templateId} to ${to}`);
    }
  }
}
