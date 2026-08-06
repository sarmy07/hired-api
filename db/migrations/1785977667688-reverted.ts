import { MigrationInterface, QueryRunner } from "typeorm";

export class Reverted1785977667688 implements MigrationInterface {
    name = 'Reverted1785977667688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "portfolioUrl"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "githubUrl"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "linkedinUrl"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "resumeUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_9466682df91534dd95e4dbaa616"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileId"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "github" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "linkedIn" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "portofolio" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "UQ_a24972ebd73b106250713dcddd9" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "portfolioUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "githubUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "linkedinUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "resumeUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "bio" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "bio" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resumeUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedinUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "githubUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "portfolioUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "UQ_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "portofolio"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "linkedIn"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "github"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_9466682df91534dd95e4dbaa616" UNIQUE ("profileId")`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "resumeUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "linkedinUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "githubUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "portfolioUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
