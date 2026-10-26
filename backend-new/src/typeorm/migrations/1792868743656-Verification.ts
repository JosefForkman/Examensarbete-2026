import { MigrationInterface, QueryRunner } from 'typeorm';

export class Verification1792868743656 implements MigrationInterface {
  name = 'Verification1792868743656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "verification" ("id" uuid NOT NULL, "identifier" text NOT NULL, "value" text NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "verification_identifier_idx" ON "verification"  ("identifier") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."verification_identifier_idx"`,
    );
    await queryRunner.query(`DROP TABLE "verification"`);
  }
}
