import * as migration_20250714_175425_initial from './20250714_175425_initial'
import * as migration_20251127_211000_add_step_image_caption from './20251127_211000_add_step_image_caption'
import * as migration_20251127_212500_add_version_step_image_caption from './20251127_212500_add_version_step_image_caption'

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
]
