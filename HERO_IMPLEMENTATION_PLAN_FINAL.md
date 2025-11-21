# 首页 Hero 实现方案 (基于 Figma 结构)

## Figma 结构分析

### Hero 容器
- **Node ID**: `1007:7039`
- **名称**: `Hero`
- **尺寸**: 1440x1024
- **定位**: `relative`
- **说明**: 外层容器，作为所有子元素的定位参考

### 子元素结构 (按 z-index 从低到高)

#### 1. mainvisual - z=10
- **Node ID**: `1007:7072`
- **名称**: `mainvisual - z=10`
- **定位**: `absolute`
- **位置**: 居中 (`left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]`)
- **尺寸**: 1440x1024
- **子元素**: 
  - `main visual` (1007:7073) - 1024x1024, 居中
  - **图片字段**: `mainVisual` (upload)

#### 2. title - z=20
- **Node ID**: `1007:7067`
- **名称**: `title- z=20`
- **定位**: `absolute`
- **位置**: `left-0 top-0` (全尺寸覆盖)
- **尺寸**: 1440x1024
- **图片字段**: `titleImage` (upload)

#### 3. scroll bar - z=30
- **Node ID**: `1007:7055`
- **名称**: `scroll bar - z=30`
- **定位**: `absolute`
- **位置**: `left-0 top-0` (全尺寸容器)
- **尺寸**: 1440x1024
- **子元素**: 
  - `滚动条` (1007:7060) - 1440x149, 底部对齐 (`justify-end`)
  - **图片字段**: `scrollBar` (upload)

#### 4. decoration - z=40
- **Node ID**: `1007:7059`
- **名称**: `decoration - z=40`
- **定位**: `absolute`
- **位置**: `left-0 top-0` (全尺寸覆盖)
- **尺寸**: 1440x1024
- **图片字段**: `decorationImage` (upload)

## 一、Payload 字段结构设计

### 1. Hero Type 选项
在 `hero` 的 `type` select 中添加：
```typescript
{
  label: 'Custom Homepage',
  value: 'customHomepage',
}
```

### 2. 字段分组设计

使用 Payload 的 `group` 类型创建可折叠分组，每个分组只在 `type === 'customHomepage'` 时显示。

#### Group 1: Main Visual (mainVisualGroup)
- **类型**: `group`
- **admin.initCollapsed**: `true` (默认折叠)
- **admin.condition**: `type === 'customHomepage'`
- **Fields**:
  - `mainVisual`: `upload` (relationTo: 'media')
  - 位置和 z-index 在前端硬编码 (z=10, 居中)

#### Group 2: Title (titleGroup)
- **类型**: `group`
- **admin.initCollapsed**: `true`
- **admin.condition**: `type === 'customHomepage'`
- **Fields**:
  - `titleImage`: `upload` (relationTo: 'media')
  - 位置和 z-index 在前端硬编码 (z=20, 全尺寸覆盖)

#### Group 3: Scroll Bar (scrollBarGroup)
- **类型**: `group`
- **admin.initCollapsed**: `true`
- **admin.condition**: `type === 'customHomepage'`
- **Fields**:
  - `scrollBar`: `upload` (relationTo: 'media')
  - 位置和 z-index 在前端硬编码 (z=30, 底部对齐)

#### Group 4: Decoration (decorationGroup)
- **类型**: `group`
- **admin.initCollapsed**: `true`
- **admin.condition**: `type === 'customHomepage'`
- **Fields**:
  - `decorationImage`: `upload` (relationTo: 'media')
  - 位置和 z-index 在前端硬编码 (z=40, 全尺寸覆盖)

## 二、字段命名原则

- 所有字段名与 Figma 中的命名保持一致
- 分组名称: `mainVisualGroup`, `titleGroup`, `scrollBarGroup`, `decorationGroup`
- 图片字段: `mainVisual`, `titleImage`, `scrollBar`, `decorationImage`

## 三、位置和 z-index 控制

### 重要说明：z-index 的作用范围

**z-index 值 (10, 20, 30, 40) 仅用于 Hero 组件内部的 z 轴排序**，不是相对于整个页面的层级。

- Hero 组件内的元素通过 z-index 控制相互之间的层叠顺序
- **所有 Hero 元素都显示在 nav bar 以下**（nav bar 使用 `z-30`，Hero 内部 z-index 不影响与 nav bar 的层级关系）
- Hero 组件本身位于 nav bar 下方，通过页面布局顺序（DOM 顺序）控制，不依赖 z-index 竞争
- z-index 值 (10, 20, 30, 40) 只是示意，仅用于 Hero 内部元素的相对排序
- Hero 内部的 z-index 值与 nav bar 的 z-index 是独立的，不会产生冲突
- 即使 Hero 内部有元素使用 z-30 或更高值，也不会覆盖 nav bar，因为 Hero 组件整体在 nav bar 下方

### 位置硬编码 (相对于 Hero 区域)

1. **mainvisual (z=10)**:
   - 位置: 容器居中 (`left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`)
   - 尺寸: 1440x1024 (容器), 内部 main visual 1024x1024
   - 内部布局: `flex flex-col items-end justify-center` (main visual 右对齐)
   - z-index: 10 (仅 Hero 内部排序，显示在 nav bar 以下)

2. **title (z=20)**:
   - 位置: `left-0 top-0` (全尺寸覆盖)
   - 尺寸: 1440x1024
   - z-index: 20 (仅 Hero 内部排序，显示在 nav bar 以下)

3. **scroll bar (z=30)**:
   - 位置: `left-0 top-0` (容器), 内部滚动条底部对齐
   - 尺寸: 1440x1024 (容器), 内部滚动条 1440x149
   - z-index: 30 (仅 Hero 内部排序，显示在 nav bar 以下)

4. **decoration (z=40)**:
   - 位置: `left-0 top-0` (全尺寸覆盖)
   - 尺寸: 1440x1024
   - z-index: 40 (仅 Hero 内部排序，显示在 nav bar 以下)

## 四、前端组件实现

### 1. 创建 CustomHomepageHero 组件
- **位置**: `src/heros/CustomHomepage/index.tsx`
- **类型**: Client Component (`'use client'`)

### 2. 组件结构
基于 Figma 生成的代码，精确实现：

```tsx
'use client'
import React from 'react'
import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'

export const CustomHomepageHero: React.FC<Page['hero']> = (props) => {
  const { mainVisualGroup, titleGroup, scrollBarGroup, decorationGroup } = props || {}
  
  const mainVisual = mainVisualGroup?.mainVisual
  const titleImage = titleGroup?.titleImage
  const scrollBar = scrollBarGroup?.scrollBar
  const decorationImage = decorationGroup?.decorationImage

  return (
    <div className="relative w-full h-full" style={{ aspectRatio: '1440/1024' }}>
      {/* mainvisual - z=10: 容器居中，内部 main visual 右对齐，使用相对单位保持比例 */}
      {mainVisual && typeof mainVisual === 'object' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full h-full flex flex-col items-end justify-center gap-[10px] overflow-clip">
          <div className="relative w-[71.1111%] aspect-square shrink-0">
            <Media
              resource={mainVisual}
              htmlElement="div"
              className="absolute inset-0"
              imgClassName="object-[50%_50%] object-cover w-full h-full pointer-events-none"
              fill
              priority
            />
          </div>
        </div>
      )}
      
      {/* title - z=20: 全尺寸覆盖 */}
      {titleImage && typeof titleImage === 'object' && (
        <div className="absolute left-0 top-0 w-full h-full z-20">
          <Media
            resource={titleImage}
            htmlElement="div"
            className="absolute inset-0"
            imgClassName="object-[50%_50%] object-cover w-full h-full pointer-events-none"
            fill
            priority
          />
        </div>
      )}
      
      {/* scroll bar - z=30: 底部对齐，使用相对高度保持比例 */}
      {scrollBar && typeof scrollBar === 'object' && (
        <div className="absolute left-0 top-0 w-full h-full z-30 flex flex-col items-center justify-end gap-[10px] overflow-clip">
          <div className="w-full h-[14.5508%] relative shrink-0">
            <Media
              resource={scrollBar}
              htmlElement="div"
              className="absolute inset-0"
              imgClassName="object-[50%_50%] object-cover w-full h-full pointer-events-none"
              fill
            />
          </div>
        </div>
      )}
      
      {/* decoration - z=40: 全尺寸覆盖 */}
      {decorationImage && typeof decorationImage === 'object' && (
        <div className="absolute left-0 top-0 w-full h-full z-40">
          <Media
            resource={decorationImage}
            htmlElement="div"
            className="absolute inset-0"
            imgClassName="object-[50%_50%] object-cover w-full h-full pointer-events-none"
            fill
            priority
          />
        </div>
      )}
    </div>
  )
}
```

### 3. 渲染逻辑
- **外层容器**: `relative` 定位，作为所有子元素的定位参考
- **各层元素**: `absolute` 定位，位置相对于 Hero 容器
- **位置硬编码**: 根据 Figma 设计，直接在组件中硬编码位置样式
- **z-index 硬编码**: 10, 20, 30, 40 (仅用于 Hero 内部元素排序)
- **与 nav bar 的关系**: 所有 Hero 元素显示在 nav bar 以下，Hero 组件本身不受 nav bar z-index 影响
- **响应式**: 使用相对单位或 aspect-ratio 保持比例
- 使用 `Media` 组件渲染图片

### 4. 在 RenderHero 中注册
- 添加 `customHomepage: CustomHomepageHero` 映射

## 五、实现步骤

1. 修改 `hero config`，添加 `customHomepage` type 和 4 个字段组
2. 运行 `payload generate:types` 生成类型
3. 创建 `CustomHomepageHero` 组件，硬编码位置和 z-index
4. 在 `RenderHero` 中注册
5. 测试和调整

## 五.1、在 Payload Admin 中的使用方法

### 如何选择 Custom Homepage Hero

1. **进入 Pages collection**，编辑首页（或需要使用的页面）
2. **找到 Hero 字段组**
3. **在 Type 下拉菜单中选择 "Custom Homepage"**（对应 value: `customHomepage`）
4. **选择后会自动显示 4 个图片上传字段组**：
   - Main Visual Group (主视觉图片)
   - Title Group (标题图片)
   - Scroll Bar Group (滚动条图片)
   - Decoration Group (装饰图片)
5. **上传对应的图片**，每个组内有一个 upload 字段
6. **保存页面**，前端会自动渲染 CustomHomepageHero 组件

### 注意事项
- Type 下拉菜单中会显示 "Custom Homepage" 选项（需要在 `src/heros/config.ts` 的 `options` 中添加）
- 只有选择 `customHomepage` 时，4 个图片字段组才会显示（通过 `admin.condition` 控制）
- 图片上传后会自动关联到 Media collection

## 六、关键设计决策

1. **位置硬编码**: 移除 position 字段，在前端硬编码位置
2. **相对定位**: 所有位置相对于 Hero 外层容器
3. **字段命名**: 与 Figma 保持一致
4. **4 个独立图片字段**: mainVisual, titleImage, scrollBar, decorationImage
5. **z-index 固定**: 10, 20, 30, 40 (仅 Hero 内部排序，所有元素显示在 nav bar 以下)
6. **响应式缩放**: 使用相对单位（百分比）而非固定像素，确保所有元素按比例缩放
7. **z-index 作用范围**: z-index 值仅用于 Hero 组件内部的 z 轴排序，不影响与 nav bar 的层级关系

## 七、响应式缩放方案

### 问题
当设备宽度不是 1440px 时，Hero 容器会按 aspect-ratio 缩放，但内部使用固定像素的元素（如 `w-[1440px]`, `w-[1024px]`）不会缩放，导致视觉效果不一致。

### 推荐解决方案：相对单位 + 百分比

**核心思路**: 所有内部元素的尺寸和位置都使用相对单位，相对于 Hero 容器大小。

#### 尺寸转换（基于 1440x1024 设计）
- **mainvisual 容器**: `w-full h-full` (100% × 100%，替代固定 1440×1024px)
- **main visual**: `w-[71.1111%] aspect-square` (1024/1440 = 71.1111%，保持 1:1 比例，替代固定 1024×1024px)
- **scroll bar 高度**: `h-[14.5508%]` (149/1024 = 14.5508%，替代固定 149px)
- **title/decoration**: `w-full h-full` (已使用相对单位，无需改动)

> **注**: 百分比值基于精确计算，确保在不同设备上保持 Figma 设计的原始比例关系。

#### 位置保持
- **mainvisual 居中**: 保持 `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`
- **main visual 右对齐**: 保持 `items-end` (flex-col) 或使用 `ml-auto`
- **scroll bar 底部**: 保持 `justify-end` (flex-col)

#### 实现优势
- ✅ 所有元素按相同比例缩放
- ✅ 相对位置和视觉比例保持不变
- ✅ 在不同设备上视觉效果一致
- ✅ 纯 CSS 实现，性能好
- ✅ 无需 JavaScript 计算

