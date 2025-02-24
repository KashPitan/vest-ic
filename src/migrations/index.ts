import * as migration_20250224_183810 from './20250224_183810';

export const migrations = [
  {
    up: migration_20250224_183810.up,
    down: migration_20250224_183810.down,
    name: '20250224_183810'
  },
];
