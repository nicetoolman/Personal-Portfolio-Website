# 主题代码删除检查清单

## 影响分析

### ✅ 不会影响的功能
1. **Header 功能** - 已自定义，不依赖 Theme
2. **Footer 功能** - 只是移除 ThemeSelector UI
3. **页面渲染** - 只是移除 setHeaderTheme 调用
4. **其他组件** - 不受影响

### ⚠️ 需要注意
1. `dark:` 前缀的 Tailwind 类会失效（但不报错）
2. 建议清理这些类，保持代码整洁
3. `data-theme` 属性相关的 CSS 需要移除

## 需要删除的目录/文件

1. `src/providers/Theme/` (整个目录)
2. `src/providers/HeaderTheme/` (整个目录)

## 需要修改的文件

### 1. `src/providers/index.tsx`
- 移除 `ThemeProvider` 和 `HeaderThemeProvider` 导入
- 移除 Provider 包装，直接返回 children

### 2. `src/app/(frontend)/layout.tsx`
- 移除 `InitTheme` 导入
- 移除 `<InitTheme />` 组件

### 3. `src/Footer/Component.tsx`
- 移除 `ThemeSelector` 导入
- 移除 `<ThemeSelector />` 组件

### 4. 移除 `useHeaderTheme` 的文件
- `src/heros/HighImpact/index.tsx`
- `src/app/(frontend)/search/page.client.tsx`
- `src/app/(frontend)/posts/page.client.tsx`
- `src/app/(frontend)/posts/[slug]/page.client.tsx`
- `src/app/(frontend)/posts/page/[pageNumber]/page.client.tsx`
- `src/app/(frontend)/[slug]/page.client.tsx`

**操作**: 移除 `useHeaderTheme` 导入和 `setHeaderTheme` 调用

### 5. `src/app/(frontend)/globals.css`
- 移除 `[data-theme='dark']` 和 `[data-theme='light']` 相关 CSS

### 6. 清理 `dark:` 前缀的 Tailwind 类（可选但建议）
- `src/app/(frontend)/search/page.tsx` - `dark:prose-invert`
- `src/app/(frontend)/posts/page.tsx` - `dark:prose-invert`
- `src/app/(frontend)/posts/page/[pageNumber]/page.tsx` - `dark:prose-invert`
- `src/Footer/Component.tsx` - `dark:bg-card`
- `src/components/RichText/index.tsx` - `dark:prose-invert`
- `src/heros/HighImpact/index.tsx` - `data-theme="dark"`

## 结论

✅ **可以安全删除，不会破坏现有功能**

删除后：
- 所有功能正常工作
- 只是移除了 dark/light 主题切换能力
- `dark:` 前缀的类不会生效，但也不会报错
- 建议清理这些类以保持代码整洁

