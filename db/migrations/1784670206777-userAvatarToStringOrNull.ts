import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAvatarToStringOrNull1784670206777 implements MigrationInterface {
    name = 'UserAvatarToStringOrNull1784670206777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET NOT NULL`);
    }

}
