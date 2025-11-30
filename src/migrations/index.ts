import * as migration_20250714_175425_initial from './20250714_175425_initial';
import * as migration_20251127_211000_add_step_image_caption from './20251127_211000_add_step_image_caption';
import * as migration_20251127_212500_add_version_step_image_caption from './20251127_212500_add_version_step_image_caption';
import * as migration_20251127_213500_add_sidebar_variants_locked_rels from './20251127_213500_add_sidebar_variants_locked_rels';
import * as migration_20251127_215500_add_sidebar_variant_relationships from './20251127_215500_add_sidebar_variant_relationships';
// import * as migration_20251129_131228 from './20251129_131228'; // 暂时禁用：push 模式已创建所有内容
import * as migration_20251129_140000_fix_sketchlogs_locked_rels from './20251129_140000_fix_sketchlogs_locked_rels';

export const migrations = [
  {
    up: migration_20250714_175425_initial.up,
    down: migration_20250714_175425_initial.down,
    name: '20250714_175425_initial',
  },
  {
    up: migration_20251127_211000_add_step_image_caption.up,
    down: migration_20251127_211000_add_step_image_caption.down,
    name: '20251127_211000_add_step_image_caption',
  },
  {
    up: migration_20251127_212500_add_version_step_image_caption.up,
    down: migration_20251127_212500_add_version_step_image_caption.down,
    name: '20251127_212500_add_version_step_image_caption',
  },
  {
    up: migration_20251127_213500_add_sidebar_variants_locked_rels.up,
    down: migration_20251127_213500_add_sidebar_variants_locked_rels.down,
    name: '20251127_213500_add_sidebar_variants_locked_rels',
  },
  {
    up: migration_20251127_215500_add_sidebar_variant_relationships.up,
    down: migration_20251127_215500_add_sidebar_variant_relationships.down,
    name: '20251127_215500_add_sidebar_variant_relationships',
  },
  // {
  //   up: migration_20251129_131228.up,
  //   down: migration_20251129_131228.down,
  //   name: '20251129_131228'
  // }, // 暂时禁用：push 模式已创建所有内容
  {
    up: migration_20251129_140000_fix_sketchlogs_locked_rels.up,
    down: migration_20251129_140000_fix_sketchlogs_locked_rels.down,
    name: '20251129_140000_fix_sketchlogs_locked_rels',
  },
];
