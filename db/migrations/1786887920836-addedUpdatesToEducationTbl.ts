import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUpdatesToEducationTbl1786887920836 implements MigrationInterface {
    name = 'AddedUpdatesToEducationTbl1786887920836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "education" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "education" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "education" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "education" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "startDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "endDate" date`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_723e67bde13b73c5404305feb14" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_723e67bde13b73c5404305feb14"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "endDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "startDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "description"`);
    }

}
