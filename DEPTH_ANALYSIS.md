# Depth 增加优劣分析

## 数据结构分析

### AboutMobileHero 结构
```typescript
{
  image: upload (relationTo: 'media')  // 单层关系
}
```

### Media Collection 结构
```typescript
{
  alt: text,
  caption: richText,  // 不是关系字段
  // 没有其他关系字段
}
```

## Payload CMS Depth 工作原理

- **depth: 0** - 返回 ID（number）
- **depth: 1** - 展开第一层关系，`upload` 字段返回完整的 Media 对象
- **depth: 2** - 展开两层关系，如果 Media 内部还有关系字段，也会展开

## 结论

### 对于 AboutMobileHero：
- **depth: 1 应该足够**，因为：
  - `image` 是单层关系（Global → Media）
  - `Media` collection 没有关系字段
  - 不需要展开嵌套关系

### 对比：fetchProjectPage 使用 depth: 2
- 需要 `intro` 和 `steps` 中的嵌套关系
- 有复杂的嵌套结构，需要 depth: 2

## 改动必要性评估

### ✅ **必需改动**

1. **添加 `revalidate: 60` 到 `getCachedGlobal`**
   - **原因**：Preview 能工作但生产不行，说明是缓存问题
   - **影响**：确保生产环境缓存每 60 秒更新
   - **必要性**：100% 必需

### ❓ **可能不必要的改动**

2. **增加 depth 从 1 到 2**
   - **原因**：理论上 depth: 1 应该足够
   - **影响**：
     - 优点：可能在某些边缘情况下更安全
     - 缺点：增加数据库查询复杂度，可能影响性能
   - **必要性**：可能不必要，但作为防御性措施可以保留

3. **添加 Vercel Blob Storage 配置**
   - **原因**：Preview 能工作说明图片 URL 应该是正确的
   - **影响**：如果图片确实存储在 Vercel Blob，这是必需的
   - **必要性**：如果图片 URL 是 Vercel Blob 格式，则必需；否则不必要

4. **简化 DOM 结构**
   - **原因**：Preview 能工作说明原结构没问题
   - **影响**：代码更简洁，但可能不是必需的
   - **必要性**：不必要，但可以保留（代码更简洁）

## 建议

### 最小化改动方案（推荐）
1. ✅ 保留 `revalidate: 60` - **必需**
2. ❓ 回退 depth 到 1 - 测试是否足够
3. ❓ 保留 Vercel Blob Storage 配置 - 作为预防措施
4. ❓ 保留简化的 DOM 结构 - 代码更简洁

### 保守方案
1. ✅ 保留所有改动 - 作为防御性措施
2. 监控性能影响
3. 如果性能有问题，再回退 depth 到 1

## 性能影响

### depth: 1 vs depth: 2
- **查询复杂度**：depth: 2 需要额外的数据库查询
- **数据传输量**：depth: 2 传输更多数据
- **实际影响**：对于简单的 `AboutMobileHero`，影响应该很小

## 测试建议

1. 先测试 depth: 1 是否足够
2. 如果生产环境仍然有问题，再增加到 depth: 2
3. 监控数据库查询性能

