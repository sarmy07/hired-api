import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationTbl1785271358365 implements MigrationInterface {
    name = 'NotificationTbl1785271358365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "recipientId" uuid`);
        await queryRunner.query(`ALTER TABLE "application" ADD "applicantId" uuid`);
        await queryRunner.query(`ALTER TABLE "application" ADD "jobId" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('JOB_APPLICATION', 'APPLICATION_STATUS', 'NEW_JOB', 'GENERAL', 'withdrawn')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum" USING "type"::"text"::"public"."notification_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "application" DROP COLUMN "coverLetter"`);
        await queryRunner.query(`ALTER TABLE "application" ADD "coverLetter" text`);
        await queryRunner.query(`ALTER TABLE "application" ALTER COLUMN "resumeSnapshot" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_ab7cbe7a013ecac5da0a8f88884" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_81c8e4a8a8ce63faba03cbd769e" FOREIGN KEY ("applicantId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_dbc0341504212f830211b69ba0c" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_dbc0341504212f830211b69ba0c"`);
        await queryRunner.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_81c8e4a8a8ce63faba03cbd769e"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_ab7cbe7a013ecac5da0a8f88884"`);
        await queryRunner.query(`ALTER TABLE "application" ALTER COLUMN "resumeSnapshot" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "application" DROP COLUMN "coverLetter"`);
        await queryRunner.query(`ALTER TABLE "application" ADD "coverLetter" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum_old" AS ENUM('email', 'sms')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`);
        await queryRunner.query(`ALTER TABLE "application" DROP COLUMN "jobId"`);
        await queryRunner.query(`ALTER TABLE "application" DROP COLUMN "applicantId"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "recipientId"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "createdAt"`);
    }

}
