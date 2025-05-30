import * as migration_20250224_183810 from "./20250224_183810";
import * as migration_20250304_235301_add_initial_posts_table from "./20250304_235301_add_initial_posts_table";
import * as migration_20250309_214848_post_tags from "./20250309_214848_post_tags";
import * as migration_20250310_003438_create_posts_tags_table from "./20250310_003438_create_posts_tags_table";
import * as migration_20250324_000459_posts_slug_unique_not_title from "./20250324_000459_posts_slug_unique_not_title";
import * as migration_20250329_220708 from "./20250329_220708";
import * as migration_20250406_234106_add_display_image_url from "./20250406_234106_add_display_image_url";
import * as migration_20250407_181635_add_release_date from "./20250407_181635_add_release_date";
import * as migration_20250502_223324_add_highlights from "./20250502_223324_add_highlights";

export const migrations = [
  {
    up: migration_20250224_183810.up,
    down: migration_20250224_183810.down,
    name: "20250224_183810",
  },
  {
    up: migration_20250304_235301_add_initial_posts_table.up,
    down: migration_20250304_235301_add_initial_posts_table.down,
    name: "20250304_235301_add_initial_posts_table",
  },
  {
    up: migration_20250309_214848_post_tags.up,
    down: migration_20250309_214848_post_tags.down,
    name: "20250309_214848_post_tags",
  },
  {
    up: migration_20250310_003438_create_posts_tags_table.up,
    down: migration_20250310_003438_create_posts_tags_table.down,
    name: "20250310_003438_create_posts_tags_table",
  },
  {
    up: migration_20250324_000459_posts_slug_unique_not_title.up,
    down: migration_20250324_000459_posts_slug_unique_not_title.down,
    name: "20250324_000459_posts_slug_unique_not_title",
  },
  {
    up: migration_20250329_220708.up,
    down: migration_20250329_220708.down,
    name: "20250329_220708",
  },
  {
    up: migration_20250406_234106_add_display_image_url.up,
    down: migration_20250406_234106_add_display_image_url.down,
    name: "20250406_234106_add_display_image_url",
  },
  {
    up: migration_20250407_181635_add_release_date.up,
    down: migration_20250407_181635_add_release_date.down,
    name: "20250407_181635_add_release_date",
  },
  {
    up: migration_20250502_223324_add_highlights.up,
    down: migration_20250502_223324_add_highlights.down,
    name: "20250502_223324_add_highlights",
  },
];
