CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"issuer" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Followed" (
	"Id" serial PRIMARY KEY,
	"UserId" text NOT NULL,
	"WebsiteId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PostItems" (
	"Id" serial PRIMARY KEY,
	"Title" text NOT NULL,
	"Description" text,
	"Link" text NOT NULL,
	"ImageUrl" text,
	"PublicationDate" timestamp with time zone NOT NULL,
	"WebsiteId" integer NOT NULL,
	"PostId" text DEFAULT '' NOT NULL,
	CONSTRAINT "CK_PostItems_PublicationDate_NotInFuture" CHECK ("PublicationDate" <= CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE "Watched" (
	"Id" serial PRIMARY KEY,
	"UserId" text NOT NULL,
	"PostItemId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Websites" (
	"Id" serial PRIMARY KEY,
	"SiteName" text NOT NULL,
	"RSSUrl" text NOT NULL,
	"SiteUrl" text NOT NULL,
	"CreatedAt" timestamp with time zone DEFAULT TIMESTAMPTZ '-infinity' NOT NULL,
	"Description" text,
	"ImageUrl" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account" ("issuer","account_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
CREATE INDEX "IX_Followed_UserId" ON "Followed" ("UserId");--> statement-breakpoint
CREATE INDEX "IX_Followed_WebsiteId" ON "Followed" ("WebsiteId");--> statement-breakpoint
CREATE INDEX "IX_PostItems_WebsiteId" ON "PostItems" ("WebsiteId");--> statement-breakpoint
CREATE INDEX "IX_Watched_PostItemId" ON "Watched" ("PostItemId");--> statement-breakpoint
CREATE INDEX "IX_Watched_UserId" ON "Watched" ("UserId");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Followed" ADD CONSTRAINT "Followed_UserId_user_id_fkey" FOREIGN KEY ("UserId") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Followed" ADD CONSTRAINT "Followed_WebsiteId_Websites_Id_fkey" FOREIGN KEY ("WebsiteId") REFERENCES "Websites"("Id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "PostItems" ADD CONSTRAINT "PostItems_WebsiteId_Websites_Id_fkey" FOREIGN KEY ("WebsiteId") REFERENCES "Websites"("Id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Watched" ADD CONSTRAINT "Watched_UserId_user_id_fkey" FOREIGN KEY ("UserId") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Watched" ADD CONSTRAINT "Watched_PostItemId_PostItems_Id_fkey" FOREIGN KEY ("PostItemId") REFERENCES "PostItems"("Id") ON DELETE CASCADE;