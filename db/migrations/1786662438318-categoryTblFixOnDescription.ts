import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryTblFixOnDescription1786662438318 implements MigrationInterface {
    name = 'CategoryTblFixOnDescription1786662438318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "UQ_7b7115fda47b20b277b8ca6f89f"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "UQ_7b7115fda47b20b277b8ca6f89f" UNIQUE ("description")`);
    }

}
