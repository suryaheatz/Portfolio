import * as migration_20261028_125058 from './20261028_125058';
import * as migration_20261029_000000_r2_media_objectkey from './20261029_000000_r2_media_objectkey';

import * as migration_20261029_160000_case_study_blocks from './20261029_160000_case_study_blocks';

import * as migration_20261029_210000_case_media_source from './20261029_210000_case_media_source';

import * as migration_20261030_010000_media_import_pilot from './20261030_010000_media_import_pilot';

import * as migration_20261030_020000_import_all_case_media from './20261030_020000_import_all_case_media';

import * as mediaPresentation from './20261030_030000_media_presentation';

import * as repairCasePages from './20261030_040000_repair_payload_page_documents';

import * as layoutReadAudit from './20261030_060000_layout_read_audit';

import * as nestedCascade from './20261030_090000_fix_nested_block_cascade';

export const migrations = [
  { up: migration_20261028_125058.up, down: migration_20261028_125058.down, name: '20261028_125058' },
  { up: migration_20261029_000000_r2_media_objectkey.up, down: migration_20261029_000000_r2_media_objectkey.down, name: '20261029_000000_r2_media_objectkey' },  { up: migration_20261029_160000_case_study_blocks.up, down: migration_20261029_160000_case_study_blocks.down, name: '20261029_160000_case_study_blocks' },
  { up: migration_20261029_210000_case_media_source.up, down: migration_20261029_210000_case_media_source.down, name: '20261029_210000_case_media_source' },
  { up: migration_20261030_010000_media_import_pilot.up, down: migration_20261030_010000_media_import_pilot.down, name: '20261030_010000_media_import_pilot' },
  { up: migration_20261030_020000_import_all_case_media.up, down: migration_20261030_020000_import_all_case_media.down, name: '20261030_020000_import_all_case_media' },
  { up: mediaPresentation.up, down: mediaPresentation.down, name: '20261030_030000_media_presentation' },
  { up: repairCasePages.up, down: repairCasePages.down, name: '20261030_040000_repair_payload_page_documents' },
  { up: layoutReadAudit.up, down: layoutReadAudit.down, name: '20261030_060000_layout_read_audit' },
  { up: nestedCascade.up, down: nestedCascade.down, name: '20261030_090000_fix_nested_block_cascade' },
];
