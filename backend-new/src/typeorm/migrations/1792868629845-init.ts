import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1792868629845 implements MigrationInterface {
    name = 'Init1792868629845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "token" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ipAddress" text, "userAgent" text, "userId" uuid NOT NULL, CONSTRAINT "UQ_232f8e85d7633bd6ddfad421696" UNIQUE ("token"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "session_userId_idx" ON "session"  ("userId") `);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL, "issuer" text NOT NULL, "accountId" text NOT NULL, "providerId" text NOT NULL, "userId" uuid NOT NULL, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" TIMESTAMP, "refreshTokenExpiresAt" TIMESTAMP, "scope" text, "password" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "account_issuer_accountId_uidx" UNIQUE ("issuer", "accountId"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "account_userId_idx" ON "account"  ("userId") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "image" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "watched" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "UserId" uuid NOT NULL, "PostItemId" uuid NOT NULL, CONSTRAINT "PK_65fdb178002df66ee591f079e6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IX_Watched_UserId" ON "watched"  ("UserId") `);
        await queryRunner.query(`CREATE INDEX "IX_Watched_PostItemId" ON "watched"  ("PostItemId") `);
        await queryRunner.query(`CREATE TABLE "post_items" ("Id" uuid NOT NULL DEFAULT uuid_generate_v4(), "Title" text NOT NULL, "Description" text, "Link" text NOT NULL, "ImageUrl" text, "PublicationDate" TIMESTAMP WITH TIME ZONE NOT NULL, "WebsiteId" uuid NOT NULL, "PostId" text NOT NULL DEFAULT '', CONSTRAINT "PK_d46c94f8a1954473b58ee6706c5" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IX_PostItems_WebsiteId" ON "post_items"  ("WebsiteId") `);
        await queryRunner.query(`CREATE TABLE "website" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "siteName" character varying NOT NULL, "rssUrl" character varying NOT NULL, "siteUrl" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "description" character varying, "imageUrl" character varying, CONSTRAINT "UQ_3e6642424fbeadd6bbc1f318dc2" UNIQUE ("siteName"), CONSTRAINT "PK_979e53e64186ccd315cf09b3b14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "followed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "UserId" uuid NOT NULL, "WebsiteId" uuid NOT NULL, CONSTRAINT "PK_88316014cdc34a15b9a19772c5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IX_Followed_UserId" ON "followed"  ("UserId") `);
        await queryRunner.query(`CREATE INDEX "IX_Followed_WebsiteId" ON "followed"  ("WebsiteId") `);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "watched" ADD CONSTRAINT "FK_8f83a734df53d29d00c2f314050" FOREIGN KEY ("UserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "watched" ADD CONSTRAINT "FK_591a27a02a0559808bf2a6dc859" FOREIGN KEY ("PostItemId") REFERENCES "post_items"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_items" ADD CONSTRAINT "FK_f3e331c782906243f8c10879b7a" FOREIGN KEY ("WebsiteId") REFERENCES "website"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "followed" ADD CONSTRAINT "FK_52d300f97964c8acae38107d28a" FOREIGN KEY ("UserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "followed" ADD CONSTRAINT "FK_8a9b4d7be73514ff591ab920cdb" FOREIGN KEY ("WebsiteId") REFERENCES "website"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "followed" DROP CONSTRAINT "FK_8a9b4d7be73514ff591ab920cdb"`);
        await queryRunner.query(`ALTER TABLE "followed" DROP CONSTRAINT "FK_52d300f97964c8acae38107d28a"`);
        await queryRunner.query(`ALTER TABLE "post_items" DROP CONSTRAINT "FK_f3e331c782906243f8c10879b7a"`);
        await queryRunner.query(`ALTER TABLE "watched" DROP CONSTRAINT "FK_591a27a02a0559808bf2a6dc859"`);
        await queryRunner.query(`ALTER TABLE "watched" DROP CONSTRAINT "FK_8f83a734df53d29d00c2f314050"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Followed_WebsiteId"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Followed_UserId"`);
        await queryRunner.query(`DROP TABLE "followed"`);
        await queryRunner.query(`DROP TABLE "website"`);
        await queryRunner.query(`DROP INDEX "public"."IX_PostItems_WebsiteId"`);
        await queryRunner.query(`DROP TABLE "post_items"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Watched_PostItemId"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Watched_UserId"`);
        await queryRunner.query(`DROP TABLE "watched"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."account_userId_idx"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP INDEX "public"."session_userId_idx"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
