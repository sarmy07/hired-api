import { MigrationInterface, QueryRunner } from "typeorm";

export class FixOnProfileTbl1785978875331 implements MigrationInterface {
    name = 'FixOnProfileTbl1785978875331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "portfolioUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "githubUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedinUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resumeUrl"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "avatar" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "bio" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "address" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "bio" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "resumeUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "linkedinUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "githubUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "portfolioUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
    }

}
