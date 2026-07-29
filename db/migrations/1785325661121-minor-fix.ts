import { MigrationInterface, QueryRunner } from "typeorm";

export class MinorFix1785325661121 implements MigrationInterface {
    name = 'MinorFix1785325661121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "saved_job" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "jobId" uuid, CONSTRAINT "UQ_e78c19878d2e6143e4c6140c81c" UNIQUE ("userId", "jobId"), CONSTRAINT "PK_eec7a26a4f0a651ab3d63c2a4a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "job" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "saved_job" ADD CONSTRAINT "FK_65314280f947dd20a26faf013d2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_job" ADD CONSTRAINT "FK_ceb2154a962ca924a284f15c2e7" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_job" DROP CONSTRAINT "FK_ceb2154a962ca924a284f15c2e7"`);
        await queryRunner.query(`ALTER TABLE "saved_job" DROP CONSTRAINT "FK_65314280f947dd20a26faf013d2"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP TABLE "saved_job"`);
    }

}
