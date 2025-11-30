# 🚀 上线前检查清单

## ✅ 1. 数据库配置检查

### 关键配置
- [ ] **确认生产环境 `push: false`**
  - 文件：`src/payload.config.ts`
  - 当前状态：`push: process.env.NODE_ENV !== 'production'` ✅ 正确
  - 确保生产环境不会自动推送 schema 更改

### 迁移状态
- [ ] **检查迁移文件**
  - 文件：`src/migrations/index.ts`
  - 确认所有必要的迁移都已注册
  - 注意：`20251129_131228` 已注释（如果生产环境已有表结构，可以保持注释）

---

## ✅ 2. 环境变量检查

### 必需的环境变量（在 Vercel 中设置）

```bash
# Payload 核心配置
PAYLOAD_SECRET=<生成强随机字符串>
POSTGRES_URL=<生产数据库连接字符串>
BLOB_READ_WRITE_TOKEN=<Vercel Blob Storage Token>

# Next.js 配置
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
VERCEL_PROJECT_PRODUCTION_URL=your-project.vercel.app

# 可选
CRON_SECRET=<随机字符串>
PREVIEW_SECRET=<随机字符串>
```

### 生成 Secret 的命令
```bash
# 生成 PAYLOAD_SECRET
openssl rand -base64 32

# 生成 CRON_SECRET
openssl rand -base64 32

# 生成 PREVIEW_SECRET
openssl rand -base64 32
```

### 检查清单
- [ ] `PAYLOAD_SECRET` 已设置（强随机字符串）
- [ ] `POSTGRES_URL` 已设置（生产数据库）
- [ ] `BLOB_READ_WRITE_TOKEN` 已设置
- [ ] `NEXT_PUBLIC_SERVER_URL` 已设置（生产域名）
- [ ] `VERCEL_PROJECT_PRODUCTION_URL` 已设置（Vercel 项目 URL）

---

## ✅ 3. 构建测试

### 本地构建测试
```bash
# 清理缓存
pnpm clean

# 测试构建
pnpm build

# 检查构建输出
# 确认没有错误或警告
```

### 检查清单
- [ ] 本地构建成功（`pnpm build`）
- [ ] 没有 TypeScript 错误
- [ ] 没有构建警告
- [ ] `.next` 目录已生成

---

## ✅ 4. 数据库迁移

### 生产环境迁移策略

**选项 A：自动迁移（推荐）**
- Vercel 构建命令：`pnpm run ci`（包含 `payload migrate`）
- 确保所有迁移都是幂等的（使用 `IF NOT EXISTS`）

**选项 B：手动迁移**
```bash
# 连接到生产数据库
export POSTGRES_URL=<生产数据库连接字符串>
pnpm payload migrate
```

### 检查清单
- [ ] 确认迁移文件都是幂等的
- [ ] 测试迁移在本地运行成功
- [ ] 准备回滚计划（如果需要）

---

## ✅ 5. 代码质量检查

### 代码清理
- [ ] 检查并移除不必要的 `console.log`
  - 当前有 14 个文件包含 `console.log/error`
  - 建议：保留错误日志，移除调试日志
- [ ] 移除注释掉的调试代码
- [ ] 确认没有硬编码的敏感信息

### 检查清单
- [ ] 代码已通过 lint 检查（`pnpm lint`）
- [ ] 没有硬编码的 localhost URL（生产环境）
- [ ] 没有硬编码的 IP 地址（生产环境）

---

## ✅ 6. 安全配置

### 关键安全检查
- [ ] **检查 `next.config.js` 中的 localhost fallback**
  - 当前：`'http://localhost:3000'` 作为 fallback
  - 建议：生产环境应该抛出错误而不是使用 localhost

- [ ] **检查 `getURL.ts` 中的 localhost fallback**
  - 确保生产环境不会使用 localhost

### 检查清单
- [ ] 生产环境不会使用 localhost fallback
- [ ] 所有 API 端点都有适当的访问控制
- [ ] 敏感信息不在代码中硬编码

---

## ✅ 7. 功能测试清单

### 核心功能测试
- [ ] 首页加载正常
- [ ] 导航菜单工作正常
- [ ] About 页面加载正常（包括移动端 hero）
- [ ] Projects 列表页加载正常
- [ ] Project 详情页加载正常
- [ ] Posts 列表页加载正常
- [ ] Post 详情页加载正常
- [ ] Sketchlog 页面加载正常
- [ ] 搜索功能工作正常

### Admin 面板测试
- [ ] Admin 登录页面可访问
- [ ] 可以创建/编辑内容
- [ ] 媒体上传功能正常
- [ ] Global 配置可访问（包括 `aboutMobileHero`）

### 移动端测试
- [ ] 移动端 About 页面显示 hero 图片
- [ ] 响应式布局正常
- [ ] 触摸交互正常

---

## ✅ 8. 部署步骤

### Vercel 部署配置

1. **连接仓库**
   - [ ] GitHub/GitLab 仓库已连接
   - [ ] 自动部署已启用

2. **构建配置**
   - Build Command: `pnpm run ci`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
   - Node Version: 18.x 或更高

3. **环境变量设置**
   - [ ] 所有必需的环境变量已在 Vercel 中设置
   - [ ] 环境变量已应用到 Production 环境

4. **部署**
   - [ ] 触发部署
   - [ ] 监控构建日志
   - [ ] 确认构建成功

---

## ✅ 9. 部署后验证

### 立即检查（部署后 5 分钟内）
- [ ] 首页可以访问：`https://your-domain.com`
- [ ] Admin 面板可以访问：`https://your-domain.com/admin`
- [ ] 没有 500 错误
- [ ] 图片可以正常加载（检查 Vercel Blob URLs）

### 功能验证（部署后 30 分钟内）
- [ ] 创建第一个 admin 用户
- [ ] 测试内容创建/编辑
- [ ] 测试媒体上传
- [ ] 测试所有主要页面路由
- [ ] 检查移动端显示

### 性能检查
- [ ] 页面加载速度正常
- [ ] 图片优化工作正常
- [ ] 没有明显的性能问题

---

## ✅ 10. 监控和备份

### 监控设置
- [ ] 设置错误监控（如 Sentry）
- [ ] 设置性能监控
- [ ] 设置 Uptime 监控

### 备份策略
- [ ] 数据库备份已配置（Neon 自动备份）
- [ ] 了解如何恢复数据库
- [ ] 准备回滚计划

---

## 🚨 紧急回滚计划

如果部署后出现问题：

1. **代码回滚**
   - 在 Vercel Dashboard 中，选择之前的部署版本
   - 点击 "Promote to Production"

2. **数据库回滚（如果需要）**
   ```bash
   # 运行 down 迁移
   export POSTGRES_URL=<生产数据库连接字符串>
   pnpm payload migrate:down
   ```

3. **验证回滚**
   - 测试关键功能
   - 检查错误日志

---

## 📝 部署后待办事项

- [ ] 更新 DNS 记录（如果使用自定义域名）
- [ ] 配置 SSL 证书（Vercel 自动处理）
- [ ] 设置 Google Analytics（如果需要）
- [ ] 提交 sitemap 到搜索引擎
- [ ] 测试 SEO meta 标签
- [ ] 配置 CDN（Vercel 自动处理）

---

## ✅ 最终确认

在点击"部署"之前，确认：

- [ ] 所有环境变量已设置
- [ ] 数据库连接正常
- [ ] 本地构建测试通过
- [ ] 代码已提交到 Git
- [ ] 已准备好回滚计划
- [ ] 团队已通知部署时间

---

**准备好后，执行部署！** 🚀

