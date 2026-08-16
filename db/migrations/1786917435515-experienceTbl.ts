import { MigrationInterface, QueryRunner } from "typeorm";

export class ExperienceTbl1786917435515 implements MigrationInterface {
    name = 'ExperienceTbl1786917435515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "startDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "endDate" date`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "currentlyWorking" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" ADD CONSTRAINT "FK_cbfb1d1219454c9b45f1b3c4274" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" DROP CONSTRAINT "FK_cbfb1d1219454c9b45f1b3c4274"`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "currentlyWorking" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "endDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "startDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "createdAt"`);
    }

}
