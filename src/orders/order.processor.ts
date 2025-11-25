import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('notifications-queue')
export class OrderProcessor extends WorkerHost {
    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case 'send_confirmation_email':
                await this.sendConfirmationEmail(job.data);
                break;
        }
    }

    private async sendConfirmationEmail(data: any) {
        console.log(`⏳ STARTING: Sending email to ${data.email}...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log(`✅ COMPLETED: Email sent to ${data.email}`);
    }
}
