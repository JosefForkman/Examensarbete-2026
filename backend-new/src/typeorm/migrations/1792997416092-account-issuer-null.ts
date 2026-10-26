import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountIssuerNull1792997416092 implements MigrationInterface {
  name = 'AccountIssuerNull1792997416092';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "account_issuer_accountId_uidx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "issuer" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "account_issuer_accountId_uidx" UNIQUE ("issuer", "accountId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "account_issuer_accountId_uidx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "issuer" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "account_issuer_accountId_uidx" UNIQUE ("issuer", "accountId")`,
    );
  }
}
