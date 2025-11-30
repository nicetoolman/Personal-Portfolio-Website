# Design Tokens Draft

> 扫描范围：`tailwind.config.mjs`, `src/app/(frontend)/**`, `src/components/**`, 以及 `globals.css`。以下仅为现状记录，尚未统一命名或抽象为真实 token。

---

## Colors

| Token / Variable | Current Value | Defined In | 典型用途 |
| --- | --- | --- | --- |
| `--background` / Tailwind `bg-background` | `hsl(34 71% 88%)` | `globals.css`, `tailwind.config.mjs` | 站点背景、卡片底色 |
| `--foreground` / `text-foreground` | `hsl(0 0% 0%)` | 同上 | 全局正文颜色 |
| `--card`, `--card-foreground` | `hsl(34 71% 88%)` / `hsl(0 0% 0%)` | 同上 | `card` 组件背景 / 文本 |
| `--accent`, `--accent-foreground` | `hsl(24 64% 66%)` / `hsl(0 0% 0%)` | 同上 | ProjectShowcase 导航按钮、强调色 |
| `--primary`, `--primary-foreground` | `hsl(0 0% 0%)` / `hsl(34 71% 88%)` | 同上 | 主要 CTA、按钮 |
| `--secondary` | `hsla(0 0% 0% / 0.5)` | 同上 | 次级文字、导航次要色 |
| `--muted`, `--muted-foreground` | `hsl(34 71% 88%)` / `hsl(0 0% 0%)` | 同上 | 背景块、分隔区域 |
| `--ring`, `--border`, `--input` | `hsl(0 0% 0%)` 或 `hsla` 版本 | 同上 | 表单、边框统一颜色 |
| `--success`, `--warning`, `--error` | `hsl(196 52% 74%)` / `hsl(34 89% 85%)` / `hsl(10 100% 86%)` | 同上 | 状态色（少量表单/消息） |
| 直接写死的颜色 | 例如 `border-[hsl(var(--accent))]`, `text-black`, `text-black/40`, `text-[#333333]` | 多个组件 | 临时强调、占位文本（需收敛） |

---

## Typography

### Font Families

| Token | Value | Source | Notes |
| --- | --- | --- | --- |
| `font-sans` | `var(--font-roboto), var(--font-noto-sans-jp), sans-serif` | `tailwind.config.mjs` | 全局正文 |
| `font-condensed` | `var(--font-roboto-condensed)` | 同上 | StepBlock / 标题 |
| `font-mono` | `var(--font-geist-mono)` | 同上 | 代码片段、少量 UI |

### Tailwind Font Sizes（需统一）

当前 `theme.extend.fontSize` 没有自定义，项目中零散使用的字号如下：

| 大小 | 值 | 使用位置示例 |
| --- | --- | --- |
| `text-[40px]` | 40px / 行高紧凑 | `ProjectIntro` 标题 |
| `text-[32px]` | 32px / Leading 38px | StepBlock 标题、副标题 |
| `text-[24px]` | 24px / Leading 30px | StepBlock subtitle |
| `text-[20px]` | 20px / Leading 28px | Step正文、meta 标题 |
| `text-[18px]` | 18px / Leading relaxed | Intro 内容块 |
| `text-[16px]` | 16px / Leading 28px 或 normal | StepSidebar、ProjectCard 元信息 |
| `text-[14px]` | 14px | Footer、Mobile nav（来自 CSS 变量） |
| `text-xs` / `text-sm` | Tailwind 原生 | Showcase 导航按钮、Tag 列表 |

> Typography Plugin (`tailwindcss/typography`) 在 `tailwind.config.mjs` 中有定制：  
> - `DEFAULT`: 取消 H1/H2 默认粗体，微调 margin  
> - `base`: `h1 = 2.5rem`, `h2 = 1.25rem`  
> - `md`: `h1 = 3.5rem`, `h2 = 1.5rem`

---

## Spacing (Padding / Margin / Gap)

| 值 | 出现方式 | 代表组件 / 文件 |
| --- | --- | --- |
| `px-2` / `py-1` | Tailwind | StepBlock 外层、ProjectCard 区块 |
| `px-[8px]` / `py-[3px]` | 自定义 | StepBlock 在 `md` 断点的 padding |
| `gap-[6px]` | 自定义 | StepBlock Grid、StepSidebar 内部 |
| `gap-[9px]` | 自定义 | Step 正文段落之间的距离 |
| `gap-2`, `gap-4`, `gap-6`, `gap-10` | Tailwind | Intro 区块、Meta Grid、Footer 区域 |
| `space-y-?`（极少） | Tailwind | 极少使用，主要在 RichText 输出 |
| `padding: calc(100% * 8 / 890)` | 内联 style | ProjectIntro 视口与 StepBlock Canvas 使用等比 padding |
| `mt-[calc(64px+var(--navbar-height))]` | LayoutViewport | 所有页面的顶部留白 |

---

## Layout (Widths / Heights / Viewports)

| Token / 数值 | 说明 | 所在文件 / 用途 |
| --- | --- | --- |
| `890px` | `LayoutViewport` narrow 宽度、StepBlock 主内容宽 | `LayoutViewport`, `StepBlockViewport`, `ProjectIntro` |
| `1440px` | StepBlock 逻辑画布宽度 | `StepBlockViewport` |
| `633px` | LayoutViewport 固定高度 | `LayoutViewport` |
| `min-h-[280px]` | StepBlock 图像槽高度 | `ProjectStepBlock` |
| `w-[253px]` | StepSidebar 卡片宽度 | `StepSidebar` |
| `aspectRatio: '16/9'` | ProjectIntro hero 视口 | `ProjectIntro` |
| `aspectRatio: '874/260'` | ProjectCard | `ProjectCard` |
| `calc(100% * 197 / 260)` 等 | ProjectCard 内部尺寸拆分 | `ProjectCard` |
| `w-[350px]/w-[524px]` (通过 calc) | ProjectCard 左右列划分 | `ProjectCard` |
| `StepBlockViewport` scale | `vw / 890` | 保证 StepBlock 等比缩放 |

---

## Border & Radius

| Token / 值 | 描述 | 出现位置 |
| --- | --- | --- |
| `border-2` | 2px 黑色边框为主 | StepBlock 图像、StepSidebar 外壳、多个卡片 |
| `border` (1px) | 辅助分隔线 | ProjectCard section 分割、ProjectIntro hero |
| `border-[3px]` | Hover 态加粗 | `ProjectCard` hover 边框 |
| `border-content` | 对应 `var(--border-width-content)` | Tailwind `extend.borderWidth` |
| `rounded-[10px]` | StepSidebar 卡片、占位 | `StepSidebar` |
| `rounded-full` | Showcase Nav Button | `ProjectShowcase` |

---

## Navbar / Footer / Icon 尺寸 (CSS Variables)

| 变量 | 当前值 | 作用 |
| --- | --- | --- |
| `--navbar-height` | 80px | 桌面导航高度 |
| `--navbar-font-size` | 16px | 桌面菜单字号 |
| `--navbar-side-padding` | 16px | 桌面左右 padding |
| `--navbar-icon-height` | 80px | Logo 区高度 |
| `--navbar-icon-scale` | 0.85 | Logo 缩放 |
| `--navbar-gap` | 24px | 菜单项间距 |
| `--navbar-mobile-height` | 64px | 移动端导航 |
| `--navbar-mobile-font-size` | 14px | 移动端文字 |
| `--navbar-mobile-link-padding` | 16px | 移动端菜单 padding |
| `--footer-padding-y` | 8px | Footer 内边距 |
| `--footer-gap` | 16px | Footer 元素间隙 |
| `--footer-title-font-size` | 16px (继承 navbar) | Footer 标题字号 |
| `--footer-content-font-size` | 16px | Footer 文本字号 |
| `--footer-identity-icon-size` | 60px | Footer Icon |
| `--footer-social-icon-size` | 38px | 社交 Icon |
| `--footer-copyright-font-size` | 14px (mobile) / 16px (>=768px) | Footer 底部文字 |

---

## 其他观察

- **线性渐变 / calc**：ProjectIntro、StepBlock extensively 使用 `calc(100% * … / 890)` 的等比计算，需要纳入 Layout tokens。
- **颜色写死**：`text-black`, `text-black/40`, `bg-gray-200` 等随处可见，建议未来映射回 CSS 变量或 Tailwind token。
- **Typography plugin & RichText**：许多富文本输出仍写死 `text-[18px]`、`leading-relaxed`，后续如需响应式/主题切换，需要统一到 token。

> 下一步建议：基于本表整理命名规范，将高频值（如 6px gap、10px radius、1440/890 布局宽度、20/24/32 字号）抽离为 `--token` 或 Tailwind 插件，再在组件内替换具体数值，以便做更细的响应式与主题化。

---

## Proposed Canonical Tokens

> 以下为基于实际使用数值整理出的桌面端基准 Design Tokens 方案。所有 token 均以桌面端为基准，后续响应式适配时再基于此做断点缩放。

### Typography

| Token 名称 | 值 | 用途说明 |
| --- | --- | --- |
| `fontSize.display` | `40px` | ProjectIntro 主标题、首页大标题 |
| `fontSize.heading-lg` | `32px` (line-height: `38px`) | ProjectDetail StepBlock 主标题、ProjectIntro 副标题 |
| `fontSize.heading-md` | `24px` (line-height: `30px`) | StepBlock subtitle、section 标题 |
| `fontSize.heading-sm` | `20px` (line-height: `28px`) | Meta 标题、StepBlock 正文标题、ProjectCard 标题 |
| `fontSize.body-lg` | `18px` (line-height: `relaxed`) | ProjectIntro 内容块、引导性正文 |
| `fontSize.body` | `16px` (line-height: `28px` 或 `normal`) | 标准正文、StepSidebar 文本、ProjectCard 元信息 |
| `fontSize.caption` | `14px` | Footer 版权、移动端导航、辅助 meta 信息 |

**映射表：当前数值/类名 → 推荐 token**

| 当前写法 | 推荐 token |
| --- | --- |
| `text-[40px]` | `fontSize.display` |
| `text-[32px]` | `fontSize.heading-lg` |
| `text-[24px]` | `fontSize.heading-md` |
| `text-[20px]` | `fontSize.heading-sm` |
| `text-[18px]` | `fontSize.body-lg` |
| `text-[16px]` | `fontSize.body` |
| `text-[14px]` / `text-sm` | `fontSize.caption` |
| `text-xs` | `fontSize.caption` (或新增 `fontSize.caption-sm` 如需要) |

---

### Spacing

| Token 名称 | 值 | 用途说明 |
| --- | --- | --- |
| `spacing.xs` | `4px` | 极小间距、紧密排列元素 |
| `spacing.sm` | `6px` | StepBlock Grid、StepSidebar 内部间距、小元素 gap |
| `spacing.md` | `8px` | StepBlock 外层 padding（md 断点）、基础组件间距 |
| `spacing.paragraph` | `9px` | **内容节奏间距**：StepBlock 段落间距、StepBlock 之间间距、RichText 段落、所有内容型模块的段落/行距区块 |
| `spacing.lg` | `16px` | Footer gap、Navbar padding、标准组件间距 |
| `spacing.xl` | `24px` | Navbar gap、较大区块间距 |
| `spacing.2xl` | `32px` | 大区块间距（较少使用） |
| `spacing.3xl` | `40px` | 超大间距（极少使用） |

**关于 `spacing.paragraph` (9px) 的说明：**

9px 是内容型间距层级（Content Rhythm Spacing），与 UI spacing 语义不同：
- **UI spacing**：遵循 4/8/12/16 网格系统，用于组件与组件之间
- **Content spacing**：遵循阅读体验的行距逻辑，用于段落与段落之间

9px 是 StepBlock 内容结构的一部分，保证整个项目的内容区块拥有一致的视觉节奏。后续响应式适配时，UI spacing 和内容 spacing 可以独立处理。

**映射表：当前数值/类名 → 推荐 token**

| 当前写法 | 推荐 token |
| --- | --- |
| `px-2` / `py-1` (8px/4px) | `spacing.xs` / `spacing.md` |
| `px-[8px]` / `py-[3px]` | `spacing.md` / `spacing.xs` |
| `gap-[6px]` | `spacing.sm` |
| `gap-[9px]` | `spacing.paragraph` ⭐ |
| `gap-2` (8px) | `spacing.md` |
| `gap-4` (16px) | `spacing.lg` |
| `gap-6` (24px) | `spacing.xl` |
| `gap-10` (40px) | `spacing.3xl` |

---

### Layout

| Token 名称 | 值 | 用途说明 |
| --- | --- | --- |
| `layout.contentWidth` | `890px` | LayoutViewport narrow 宽度、StepBlock 主内容宽、ProjectIntro 最大宽度 |
| `layout.canvasWide` | `1440px` | StepBlock 逻辑画布宽度 |
| `layout.viewportHeight` | `633px` | LayoutViewport 固定高度（aspect ratio 基准） |
| `layout.sidebarWidth` | `253px` | StepSidebar 卡片宽度 |
| `layout.imageMinHeight` | `280px` | StepBlock 图像槽最小高度 |
| `layout.cardRatio16_9` | `16 / 9` | ProjectIntro hero 视口比例 |
| `layout.cardRatioProject` | `874 / 260` | ProjectCard 卡片比例 |
| `layout.navbarTopOffset` | `calc(64px + var(--navbar-height))` | LayoutViewport 顶部留白（移动端 64px + 桌面端 80px） |

**映射表：当前数值/类名 → 推荐 token**

| 当前写法 | 推荐 token |
| --- | --- |
| `max-w-[890px]` | `layout.contentWidth` |
| `w-[1440px]` (StepBlockViewport) | `layout.canvasWide` |
| `h-[633px]` (aspect ratio) | `layout.viewportHeight` |
| `w-[253px]` | `layout.sidebarWidth` |
| `min-h-[280px]` | `layout.imageMinHeight` |
| `aspectRatio: '16/9'` | `layout.cardRatio16_9` |
| `aspectRatio: '874/260'` | `layout.cardRatioProject` |
| `mt-[calc(64px+var(--navbar-height))]` | `layout.navbarTopOffset` |

---

### Border & Radius

| Token 名称 | 值 | 用途说明 |
| --- | --- | --- |
| `borderWidth.thin` | `1px` | 辅助分隔线、ProjectCard section 分割、ProjectIntro hero |
| `borderWidth.base` | `2px` | 标准边框：StepBlock 图像、StepSidebar 外壳、卡片边框 |
| `borderWidth.strong` | `3px` | Hover 态加粗：ProjectCard hover 边框 |
| `borderWidth.content` | `var(--border-width-content)` (2px) | 内容区域边框（通用，可设置为 0px 取消） |
| `radius.sm` | `4px` | 小圆角（较少使用） |
| `radius.md` | `10px` | StepSidebar 卡片、占位区域 |
| `radius.lg` | `16px` | 大圆角（较少使用） |
| `radius.full` | `9999px` | 完全圆形：Showcase Nav Button |

**映射表：当前数值/类名 → 推荐 token**

| 当前写法 | 推荐 token |
| --- | --- |
| `border` (1px) | `borderWidth.thin` |
| `border-2` | `borderWidth.base` |
| `border-[3px]` | `borderWidth.strong` |
| `border-content` | `borderWidth.content` |
| `rounded-[10px]` | `radius.md` |
| `rounded-full` | `radius.full` |

---

### Colors

#### Base Colors

| Token 名称 | CSS 变量 | 当前值 | 用途说明 |
| --- | --- | --- | --- |
| `color.background` | `--background` | `hsl(34 71% 88%)` | 站点背景、卡片底色 |
| `color.foreground` | `--foreground` | `hsl(0 0% 0%)` | 全局正文颜色 |
| `color.card` | `--card` | `hsl(34 71% 88%)` | Card 组件背景 |
| `color.cardForeground` | `--card-foreground` | `hsl(0 0% 0%)` | Card 组件文本 |
| `color.primary` | `--primary` | `hsl(0 0% 0%)` | 主要 CTA、按钮 |
| `color.primaryForeground` | `--primary-foreground` | `hsl(34 71% 88%)` | 主要按钮文本 |
| `color.secondary` | `--secondary` | `hsla(0 0% 0% / 0.5)` | 次级文字、导航次要色 |
| `color.accent` | `--accent` | `hsl(24 64% 66%)` | ProjectShowcase 导航按钮、强调色 |
| `color.accentForeground` | `--accent-foreground` | `hsl(0 0% 0%)` | 强调色文本 |
| `color.muted` | `--muted` | `hsl(34 71% 88%)` | 背景块、分隔区域 |
| `color.mutedForeground` | `--muted-foreground` | `hsl(0 0% 0%)` | 背景块文本 |
| `color.border` | `--border` | `hsl(0 0% 0%)` | 表单、边框统一颜色 |
| `color.input` | `--input` | `hsl(0 0% 0%)` | 输入框边框 |
| `color.ring` | `--ring` | `hsl(0 0% 0%)` | 焦点环颜色 |

#### Status Colors

| Token 名称 | CSS 变量 | 当前值 | 用途说明 |
| --- | --- | --- | --- |
| `color.success` | `--success` | `hsl(196 52% 74%)` | 成功状态 |
| `color.warning` | `--warning` | `hsl(34 89% 85%)` | 警告状态 |
| `color.error` | `--error` | `hsl(10 100% 86%)` | 错误状态 |

**映射表：当前写法 → 推荐 token**

| 当前写法 | 推荐 token |
| --- | --- |
| `bg-background` / `bg-[hsl(var(--background))]` | `color.background` |
| `text-foreground` | `color.foreground` |
| `text-black` | `color.foreground` (需统一) |
| `text-black/40` | `color.secondary` (需统一) |
| `border-[hsl(var(--accent))]` | `color.accent` |
| `bg-gray-200` | `color.muted` (需统一) |

---

### Navbar & Footer

#### Navbar Tokens

| Token 名称 | CSS 变量 | 当前值 | 用途说明 |
| --- | --- | --- | --- |
| `navbar.height` | `--navbar-height` | `80px` | 桌面导航高度 |
| `navbar.fontSize` | `--navbar-font-size` | `16px` | 桌面菜单字号 |
| `navbar.sidePadding` | `--navbar-side-padding` | `16px` | 桌面左右 padding |
| `navbar.iconHeight` | `--navbar-icon-height` | `80px` | Logo 区高度 |
| `navbar.iconScale` | `--navbar-icon-scale` | `0.85` | Logo 缩放 |
| `navbar.gap` | `--navbar-gap` | `24px` | 菜单项间距 |
| `navbar.mobileHeight` | `--navbar-mobile-height` | `64px` | 移动端导航 |
| `navbar.mobileFontSize` | `--navbar-mobile-font-size` | `14px` | 移动端文字 |
| `navbar.mobileLinkPadding` | `--navbar-mobile-link-padding` | `16px` | 移动端菜单 padding |

#### Footer Tokens

| Token 名称 | CSS 变量 | 当前值 | 用途说明 |
| --- | --- | --- | --- |
| `footer.paddingY` | `--footer-padding-y` | `8px` | Footer 内边距 |
| `footer.paddingX` | `--footer-padding-x` | `16px` | Footer 左右 padding |
| `footer.gap` | `--footer-gap` | `16px` | Footer 元素间隙 |
| `footer.columnGap` | `--footer-column-gap` | `24px` | 列之间的间隔 |
| `footer.titleFontSize` | `--footer-title-font-size` | `16px` | Footer 标题字号 |
| `footer.contentFontSize` | `--footer-content-font-size` | `16px` | Footer 文本字号 |
| `footer.copyrightFontSize` | `--footer-copyright-font-size` | `14px` (mobile) / `16px` (>=768px) | Footer 底部文字 |
| `footer.identityIconSize` | `--footer-identity-icon-size` | `60px` | Footer Icon |
| `footer.socialIconSize` | `--footer-social-icon-size` | `38px` | 社交 Icon |
| `footer.identityPaddingX` | `--footer-identity-padding-x` | `40px` | Slogan 左右的 padding |

**映射表：当前写法 → 推荐 token**

| 当前写法 | 推荐 token |
| --- | --- |
| `h-[var(--navbar-height)]` | `navbar.height` |
| `text-[var(--navbar-font-size)]` | `navbar.fontSize` |
| `px-[var(--navbar-side-padding)]` | `navbar.sidePadding` |
| `gap-[var(--navbar-gap)]` | `navbar.gap` |
| `text-[var(--footer-title-font-size)]` | `footer.titleFontSize` |
| `text-[var(--footer-content-font-size)]` | `footer.contentFontSize` |

---

## 下一步行动建议

1. **确认 token 命名**：审阅上述命名是否符合项目语义，调整后锁定。
2. **注册到 Tailwind**：将确认的 token 写入 `tailwind.config.mjs` 的 `theme.extend`。
3. **创建 CSS 变量**：在 `globals.css` 中为所有 token 创建对应的 CSS 变量（如 `--font-size-display: 40px`）。
4. **组件替换**：按映射表逐步将硬编码值替换为 token 引用。
5. **响应式适配**：基于桌面端 token，为移动端/平板端定义断点缩放规则。

