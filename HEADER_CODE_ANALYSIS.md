# Header 相关代码分析

## Header 目录下的文件

### 1. `src/Header/Component.client.tsx`
- **状态**: ✅ 已自定义 (Figma 设计)
- **已移除**: `useHeaderTheme`, `Logo` 组件
- **已添加**: 自定义 logo Media, Figma 样式
- **说明**: 完全按 Figma 设计实现

### 2. `src/Header/Component.tsx`
- **状态**: ✅ 功能性，需要保留
- **用途**: 服务端获取 Header 数据
- **说明**: 已设置 `depth=1` 获取 logo 关系

### 3. `src/Header/Nav/index.tsx`
- **状态**: ✅ 已自定义 (Figma 设计)
- **已移除**: `SearchIcon`
- **已修改**: 样式、字体、颜色完全按 Figma
- **说明**: 链接容器自适应内容宽度

### 4. `src/Header/config.ts`
- **状态**: ✅ 已修改
- **已添加**: `logo` 字段 (upload, relationTo: 'media')
- **说明**: Payload Global 配置

### 5. `src/Header/RowLabel.tsx`
- **状态**: ⚠️ 默认 Payload (Admin UI 用)
- **用途**: Admin 面板显示导航项标签
- **建议**: 保留 (不影响前端，只在 Admin 使用)

### 6. `src/Header/hooks/revalidateHeader.ts`
- **状态**: ✅ 功能性，需要保留
- **用途**: Header 更新时重新验证 Next.js 缓存
- **说明**: 确保前端及时更新 Header 变化

## HeaderTheme 相关 - 可能不需要

### 7. `src/providers/HeaderTheme/index.tsx`
- **状态**: ⚠️ 默认 Payload (dark mode 相关)
- **用途**: 管理 header 主题切换 (dark/light)
- **使用位置**:
  - `src/providers/index.tsx` (Provider)
  - `src/heros/HighImpact/index.tsx`
  - `src/app/(frontend)/search/page.client.tsx`
  - `src/app/(frontend)/posts/page.client.tsx`
  - `src/app/(frontend)/posts/[slug]/page.client.tsx`
  - `src/app/(frontend)/posts/page/[pageNumber]/page.client.tsx`
  - `src/app/(frontend)/[slug]/page.client.tsx`
- **建议**: 你已禁用 dark mode，可以考虑删除
- **注意**: 需要先移除所有使用 `useHeaderTheme` 的地方

## 总结

### 建议删除的默认 Payload 代码

1. **HeaderTheme 相关** (如果确定不需要 dark mode)
   - `src/providers/HeaderTheme/index.tsx`
   - 需要同时移除所有使用 `useHeaderTheme` 的地方
   - 影响文件: 7 个页面组件 + providers/index.tsx

2. **RowLabel.tsx** (可选)
   - 只在 Admin UI 使用
   - 不影响前端，可以保留

### 需要保留的
- `Component.tsx` (数据获取)
- `revalidateHeader.ts` (缓存重新验证)
- `config.ts` (已修改，添加了 logo 字段)
- `Component.client.tsx` (已自定义)
- `Nav/index.tsx` (已自定义)

