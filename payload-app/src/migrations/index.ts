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

import * as newBlockTables from './20261102_000000_new_block_tables';
import * as fixRichTextBody from './20261103_000000_fix_richtext_body_migration';
import * as bentoSplitBlocks from './20261103_010000_bento_split_blocks';
import * as renormalizeRichText from './20261103_020000_renormalize_richtext_via_api';
import * as rollbackRichtextToTextarea from './20261103_030000_rollback_richtext_to_textarea';
import * as renameBodyFields from './20261103_040000_rename_body_fields';
import * as repairTextColumns from './20261103_050000_repair_text_columns';
import * as caseStudiesCollection from './20261103_060000_case_studies_collection';
import * as renamePagesMediaGroupTables from './20261104_000000_rename_pages_media_group_tables';
import * as forceRenameMediaGroupTables from './20261104_200000_force_rename_media_group_tables';
import * as fixMediaGroupAndCaseStudiesVSchema from './20261105_000000_fix_media_group_and_case_studies_v_schema';
import * as addCaseStudyTemplateAndArticles from './20261105_010000_add_case_study_template_and_articles';
import * as addCaseStudySlidesAndTemplateLock from './20261105_020000_add_case_study_slides_and_template_lock';
import * as enableAutosaveLivePreview from './20261105_030000_enable_autosave_live_preview';

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
  { up: newBlockTables.up, down: newBlockTables.down, name: '20261102_000000_new_block_tables' },
  { up: fixRichTextBody.up, down: fixRichTextBody.down, name: '20261103_000000_fix_richtext_body_migration' },
  { up: bentoSplitBlocks.up, down: bentoSplitBlocks.down, name: '20261103_010000_bento_split_blocks' },
  { up: renormalizeRichText.up, down: renormalizeRichText.down, name: '20261103_020000_renormalize_richtext_via_api' },
  { up: rollbackRichtextToTextarea.up, down: rollbackRichtextToTextarea.down, name: '20261103_030000_rollback_richtext_to_textarea' },
  { up: renameBodyFields.up, down: renameBodyFields.down, name: '20261103_040000_rename_body_fields' },
  { up: repairTextColumns.up, down: repairTextColumns.down, name: '20261103_050000_repair_text_columns' },
  { up: caseStudiesCollection.up, down: caseStudiesCollection.down, name: '20261103_060000_case_studies_collection' },
  { up: renamePagesMediaGroupTables.up, down: renamePagesMediaGroupTables.down, name: '20261104_000000_rename_pages_media_group_tables' },
  { up: forceRenameMediaGroupTables.up, down: forceRenameMediaGroupTables.down, name: '20261104_200000_force_rename_media_group_tables' },
  { up: fixMediaGroupAndCaseStudiesVSchema.up, down: fixMediaGroupAndCaseStudiesVSchema.down, name: '20261105_000000_fix_media_group_and_case_studies_v_schema' },
  { up: addCaseStudyTemplateAndArticles.up, down: addCaseStudyTemplateAndArticles.down, name: '20261105_010000_add_case_study_template_and_articles' },
  { up: addCaseStudySlidesAndTemplateLock.up, down: addCaseStudySlidesAndTemplateLock.down, name: '20261105_020000_add_case_study_slides_and_template_lock' },
  { up: enableAutosaveLivePreview.up, down: enableAutosaveLivePreview.down, name: '20261105_030000_enable_autosave_live_preview' },
];
