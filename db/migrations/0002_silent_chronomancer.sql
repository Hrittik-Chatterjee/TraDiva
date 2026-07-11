ALTER TABLE "brands" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "brands" CASCADE;--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_brand_id_brands_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "brand_id";