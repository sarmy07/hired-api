import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsActiveTOUserTbl1785773288845 implements MigrationInterface {
    name = 'AddedIsActiveTOUserTbl1785773288845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "isVerified" TO "isActive"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "isActive" TO "isVerified"`);
    }

}
