import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });
  }

  async sendNewApplicationEmail(
    employerEmail: string,
    applicant: User,
    job: Job,
  ) {
    return this.sendMail(
      employerEmail,

      `New Application for ${job.title}`,

      `
       <h2>New Job Application</h2>

        <p>
          <strong>
            ${applicant.firstName} ${applicant.lastName}
          </strong>
          has applied for your job.
        </p>

        <p>
          <strong>Job:</strong> ${job.title}
        </p>

        <p>
          Log in to Hired to review the application.
        </p>
      `,
    );
  }

  async sendApplicationStatusEmail(
    applicantEmail: string,
    applicantfirstName: string,
    jobTitle: string,
    status: string,
  ) {
    return this.sendMail(
      applicantEmail,

      `Application Update ${jobTitle}`,

      `
      <h2>Application Status Update</h2>

      <p>
      Hello <strong>${applicantfirstName}</strong>
      <p>

      <p>
      Yoor application for <strong>${jobTitle}</strong> has been updated.
      </p>

      <p>
      <strong>Status:</strong> ${status}
      </p>


      <p>
       Log in to Hired to view more details
      </p>
      
      `,
    );
  }
}
