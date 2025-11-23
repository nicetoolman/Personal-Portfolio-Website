import React from 'react'

/**
 * AboutContent Component
 * 
 * 静态的 About 页面内容组件
 * 
 * 视窗规格：
 * - 宽度：视口宽度 * 890/1440（响应式）
 * - 高度：视口宽度 * 633/1440（保持 890/633 比例）
 * - 顶部间距：64px + navbar高度
 * - 底部间距：64px
 * - 水平居中
 */
export default function AboutContent() {
  return (
    <div className="w-full flex justify-center">
      {/* 视窗容器：响应式宽度，固定比例 890/633 */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          width: 'calc(100vw * 890 / 1440)',
          height: 'calc(100vw * 633 / 1440)',
          marginTop: 'calc(64px + var(--navbar-height))',
          marginBottom: '64px',
        }}
      >
        {/* 滚动容器 */}
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
          {/* 内容容器：居中，宽度等于视窗宽度，高度自适应 */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 top-0 min-h-full"
            style={{ width: 'calc(100vw * 890 / 1440)' }}
          >
            {/* About 内容将从这里开始逐步添加 */}
            <div className="w-full h-[3721px] bg-background">
              {/* 占位内容，后续会被实际内容替换 */}
              <div className="p-8 text-foreground">
                <p>About 内容区域（可滚动查看）</p>
                <p className="mt-4">总高度：3721px</p>
                <p className="mt-4">视窗高度：633px（响应式）</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
