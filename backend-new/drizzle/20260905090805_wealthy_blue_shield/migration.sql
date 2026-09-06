ALTER TABLE "Websites" ALTER COLUMN "CreatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Websites" ADD CONSTRAINT "Websites_SiteName_key" UNIQUE("SiteName");