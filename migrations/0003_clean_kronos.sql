CREATE TABLE "fund_data_audit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"upload_date" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
