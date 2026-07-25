import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCompanyTbl1784907046495 implements MigrationInterface {
    name = 'AddedCompanyTbl1784907046495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" ADD "companyId" uuid`);
        await queryRunner.query(`ALTER TABLE "company" ADD "ownerId" uuid`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "website" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "industry" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "location" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "logo" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "size" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_e66170573cabd565dab1132727d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_ee87438803acb531639e8284be0" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_ee87438803acb531639e8284be0"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_e66170573cabd565dab1132727d"`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "size" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "logo" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "location" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "industry" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "website" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "companyId"`);
    }

}
