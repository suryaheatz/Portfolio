import * as migration_20261028_125058 from './20261028_125058';

import * as migration_20261029_000000_r2_media_objectkey from './20261029_000000_r2_media_objectkey';

export const migrations = [
  { up: migration_20261029_000000_r2_media_objectkey.up, down: migration_20261029_000000_r2_media_objectkey.down, name: '20261029_000000_r2_media_objectkey' },
  {
    up: migration_20261028_125058.up,
    down: migration_20261028_125058.down,
    name: '20261028_125058'
  },
];
