import * as migration_20250224_183810 from './20250224_183810';
import * as migration_20250304_235301_add_initial_posts_table from './20250304_235301_add_initial_posts_table';
import * as migration_20250309_214848_post_tags from './20250309_214848_post_tags';

export const migrations = [
  {
    up: migration_20250224_183810.up,
    down: migration_20250224_183810.down,
    name: '20250224_183810',
  },
  {
    up: migration_20250304_235301_add_initial_posts_table.up,
    down: migration_20250304_235301_add_initial_posts_table.down,
    name: '20250304_235301_add_initial_posts_table',
  },
  {
    up: migration_20250309_214848_post_tags.up,
    down: migration_20250309_214848_post_tags.down,
    name: '20250309_214848_post_tags'
  },
];
