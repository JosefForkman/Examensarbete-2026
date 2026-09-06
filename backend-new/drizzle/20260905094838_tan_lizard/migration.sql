-- Disable constraints tillfälligt
SET CONSTRAINTS ALL DEFERRED;

----------------------------------------------------
-- 1. TA BORT GAMLA FOREIGN KEYS
----------------------------------------------------
ALTER TABLE "Followed" DROP CONSTRAINT IF EXISTS "Followed_WebsiteId_Websites_Id_fk";
ALTER TABLE "PostItems" DROP CONSTRAINT IF EXISTS "PostItems_WebsiteId_Websites_Id_fk";
ALTER TABLE "Watched" DROP CONSTRAINT IF EXISTS "Watched_PostItemId_PostItems_Id_fk";

----------------------------------------------------
-- 2. TA BORT KOLUMNERNA MED CASCADE (Rensar sekvenser automatiskt)
----------------------------------------------------
-- Websites
ALTER TABLE "Websites" DROP COLUMN IF EXISTS "Id" CASCADE;

-- Followed
ALTER TABLE "Followed" DROP COLUMN IF EXISTS "Id" CASCADE;
ALTER TABLE "Followed" DROP COLUMN IF EXISTS "WebsiteId" CASCADE;

-- PostItems
ALTER TABLE "PostItems" DROP COLUMN IF EXISTS "Id" CASCADE;
ALTER TABLE "PostItems" DROP COLUMN IF EXISTS "WebsiteId" CASCADE;

-- Watched
ALTER TABLE "Watched" DROP COLUMN IF EXISTS "Id" CASCADE;
ALTER TABLE "Watched" DROP COLUMN IF EXISTS "PostItemId" CASCADE;

----------------------------------------------------
-- 3. LÄGG TILL DE NYA UUID-KOLUMNERNA
----------------------------------------------------
-- Websites
ALTER TABLE "Websites" ADD COLUMN "Id" uuid PRIMARY KEY DEFAULT gen_random_uuid();

-- Followed
ALTER TABLE "Followed" ADD COLUMN "Id" uuid PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE "Followed" ADD COLUMN "WebsiteId" uuid NOT NULL;

-- PostItems
ALTER TABLE "PostItems" ADD COLUMN "Id" uuid PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE "PostItems" ADD COLUMN "WebsiteId" uuid NOT NULL;

-- Watched
ALTER TABLE "Watched" ADD COLUMN "Id" uuid PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE "Watched" ADD COLUMN "PostItemId" uuid NOT NULL;

----------------------------------------------------
-- 4. ÅTERSKAPA FOREIGN KEYS
----------------------------------------------------
ALTER TABLE "Followed" ADD CONSTRAINT "Followed_WebsiteId_Websites_Id_fk" 
  FOREIGN KEY ("WebsiteId") REFERENCES "Websites"("Id") ON DELETE CASCADE;

ALTER TABLE "PostItems" ADD CONSTRAINT "PostItems_WebsiteId_Websites_Id_fk" 
  FOREIGN KEY ("WebsiteId") REFERENCES "Websites"("Id") ON DELETE CASCADE;

ALTER TABLE "Watched" ADD CONSTRAINT "Watched_PostItemId_PostItems_Id_fk" 
  FOREIGN KEY ("PostItemId") REFERENCES "PostItems"("Id") ON DELETE CASCADE;