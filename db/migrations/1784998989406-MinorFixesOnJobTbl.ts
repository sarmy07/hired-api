import { MigrationInterface, QueryRunner } from "typeorm";

export class MinorFixesOnJobTbl1784998989406 implements MigrationInterface {
    name = 'MinorFixesOnJobTbl1784998989406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_e66170573cabd565dab1132727d"`);
        await queryRunner.query(`CREATE TABLE "job_skills_skill" ("jobId" uuid NOT NULL, "skillId" uuid NOT NULL, CONSTRAINT "PK_27773e917c7fc5b92dee508ed56" PRIMARY KEY ("jobId", "skillId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f0160506793da667b04476540" ON "job_skills_skill"  ("jobId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ae25ea346c558d8cc5bcba6ff6" ON "job_skills_skill"  ("skillId") `);
        await queryRunner.query(`ALTER TABLE "skill" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "job" ADD "responsibilities" text`);
        await queryRunner.query(`ALTER TABLE "job" ADD "requirements" text`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "UQ_0f49a593960360f6f85b692aca8" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "salaryMin"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "salaryMin" numeric(12,2)`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "salaryMax"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "salaryMax" numeric(12,2)`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "deadline"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "deadline" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_e66170573cabd565dab1132727d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_skills_skill" ADD CONSTRAINT "FK_7f0160506793da667b044765400" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "job_skills_skill" ADD CONSTRAINT "FK_ae25ea346c558d8cc5bcba6ff6f" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_skills_skill" DROP CONSTRAINT "FK_ae25ea346c558d8cc5bcba6ff6f"`);
        await queryRunner.query(`ALTER TABLE "job_skills_skill" DROP CONSTRAINT "FK_7f0160506793da667b044765400"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_e66170573cabd565dab1132727d"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "deadline"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "deadline" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "salaryMax"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "salaryMax" integer`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "salaryMin"`);
        await queryRunner.query(`ALTER TABLE "job" ADD "salaryMin" integer`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "UQ_0f49a593960360f6f85b692aca8"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "requirements"`);
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "responsibilities"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ae25ea346c558d8cc5bcba6ff6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f0160506793da667b04476540"`);
        await queryRunner.query(`DROP TABLE "job_skills_skill"`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_e66170573cabd565dab1132727d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
