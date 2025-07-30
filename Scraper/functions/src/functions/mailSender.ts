import { MailTypes } from './../helpers/types';
import { EmailService } from './../services/email-service';
import { MailListManager } from './../managers/mail-list-manager';
import { onSchedule } from "firebase-functions/v2/scheduler";

export const MailSender = onSchedule({ schedule: "*/10 * * * *", timeoutSeconds: 540 }, async (_) => {

    const emailService = new EmailService();
    const mailListManager = new MailListManager();

    const list = await mailListManager.getList();
    const notSent = list.filter((data: any) => !data?.emailSent).slice(0, 10);

    for (const instance of notSent) {

        const sendTo: MailTypes = instance?.notify;

        if (sendTo === "ADMIN") {
            await emailService.notifyAdmin(instance?.email, instance?.restaurantName, instance?.link);
            await mailListManager.markEmailSent(instance?.id);
        } else {
            await emailService.sendInvitationMail(instance?.email, instance?.restaurantName, instance?.link);
            await mailListManager.markEmailSent(instance?.id);
        }
    }
});
