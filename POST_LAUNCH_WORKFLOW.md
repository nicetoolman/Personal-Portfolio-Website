# 上线后的开发与部署工作流程

## ✅ 是的，你仍然可以使用 `pnpm dev`！

上线后，本地开发环境完全独立于生产环境，你可以随时使用 `pnpm dev` 进行开发和测试。

---

## 🔄 标准开发流程

### 1. **本地开发**（不影响生产环境）

```bash
# 启动本地开发服务器
pnpm dev
```

**重要说明：**
- 本地开发使用 `.env.local` 或 `.env` 中的环境变量
- 默认连接到本地数据库（如果配置了本地数据库）或开发数据库
- 修改代码后，Next.js 会自动热重载
- 你可以在 `http://localhost:3000` 查看效果

### 2. **测试修改**

在本地开发时：
- ✅ 修改代码、组件、样式
- ✅ 在 Payload Admin (`http://localhost:3000/admin`) 中测试内容管理
- ✅ 检查所有页面是否正常显示
- ✅ 测试移动端响应式布局

### 3. **提交代码**

```bash
# 查看修改的文件
git status

# 添加修改的文件
git add .

# 提交更改
git commit -m "描述你的修改内容"

# 推送到远程仓库
git push
```

---

## 🚀 部署到生产环境

### 方式 1：自动部署（推荐）

如果你使用的是 **Vercel** 或其他支持 Git 集成的平台：

1. **推送代码到 Git 仓库**
   ```bash
   git push origin main  # 或你的主分支名
   ```

2. **平台自动构建和部署**
   - Vercel 会自动检测到新的提交
   - 自动运行 `pnpm build`
   - 自动部署到生产环境

3. **检查部署状态**
   - 在 Vercel Dashboard 查看构建日志
   - 确认部署成功

### 方式 2：手动部署

如果需要手动触发部署：

```bash
# 1. 确保代码已提交并推送
git push

# 2. 在 Vercel Dashboard 手动触发部署
# 或使用 Vercel CLI
vercel --prod
```

---

## ⚠️ 重要注意事项

### 1. **环境变量**

确保生产环境的环境变量已正确配置：

- `DATABASE_URI` - 生产数据库连接
- `PAYLOAD_SECRET` - Payload 密钥
- `NEXT_PUBLIC_SERVER_URL` - 生产环境 URL
- `VERCEL_BLOB_STORAGE_TOKEN` - 媒体存储令牌（如果使用）
- 其他必要的环境变量

**检查位置：**
- Vercel: Project Settings → Environment Variables
- 其他平台：相应的环境变量配置页面

### 2. **数据库迁移**

如果修改了 Payload 的 Collection 或 Global 结构：

```bash
# 本地测试迁移
pnpm payload migrate

# 生产环境迁移
# 通常在生产环境构建时自动执行（如果配置了）
# 或通过 Vercel 的构建命令：pnpm ci
```

### 3. **类型生成**

修改了 Payload 配置后，记得生成类型：

```bash
pnpm generate:types
```

然后提交生成的类型文件：
```bash
git add src/payload-types.ts
git commit -m "Update Payload types"
git push
```

### 4. **构建测试**

在推送前，建议本地测试构建：

```bash
# 清理缓存
pnpm clean

# 构建项目
pnpm build

# 如果构建成功，再推送代码
```

---

## 📋 常见修改场景

### 场景 1：修改样式或组件

```bash
# 1. 本地开发
pnpm dev

# 2. 修改文件（如 components/xxx.tsx）

# 3. 测试效果

# 4. 提交并推送
git add .
git commit -m "Update component styles"
git push
```

### 场景 2：添加新的 Payload Collection/Global

```bash
# 1. 创建新的 Collection/Global 文件
# 2. 在 payload.config.ts 中注册
# 3. 生成类型
pnpm generate:types

# 4. 本地测试
pnpm dev

# 5. 提交所有更改
git add .
git commit -m "Add new collection/global"
git push
```

### 场景 3：修改数据库结构

```bash
# 1. 修改 Collection/Global 字段
# 2. 生成迁移文件（如果需要）
pnpm payload migrate:create

# 3. 本地测试迁移
pnpm payload migrate

# 4. 生成类型
pnpm generate:types

# 5. 测试
pnpm dev

# 6. 提交
git add .
git commit -m "Update database schema"
git push
```

### 场景 4：仅修改内容（通过 Payload Admin）

1. 访问生产环境的 Payload Admin：`https://你的域名.com/admin`
2. 直接编辑内容
3. **无需代码部署**，内容会立即更新

---

## 🔍 调试生产问题

### 查看生产环境日志

- **Vercel**: Dashboard → Project → Deployments → 选择部署 → Logs
- **其他平台**: 查看相应的日志面板

### 本地复现生产问题

```bash
# 使用生产环境变量（但连接到本地数据库）
# 创建 .env.local.production（仅用于调试）
# 复制生产环境的关键变量

# 然后运行
pnpm dev
```

---

## 🎯 最佳实践

1. **小改动频繁部署** ✅
   - 每次修改后立即测试和部署
   - 避免积累大量修改

2. **使用 Git 分支** ✅
   - 创建功能分支进行开发
   - 测试通过后再合并到主分支

3. **本地测试构建** ✅
   - 推送前运行 `pnpm build` 确保没有构建错误

4. **检查类型错误** ✅
   - 运行 `pnpm lint` 检查代码质量

5. **备份重要数据** ✅
   - 修改数据库结构前，确保有备份

---

## 📞 遇到问题？

1. **构建失败**
   - 检查构建日志中的错误信息
   - 本地运行 `pnpm build` 复现问题
   - 检查环境变量是否正确

2. **部署后页面不更新**
   - 清除浏览器缓存
   - 检查 CDN 缓存（Vercel 会自动处理）
   - 确认部署确实成功

3. **数据库连接问题**
   - 检查生产环境的 `DATABASE_URI`
   - 确认数据库服务正常运行

---

## 🎉 总结

**上线后，你的开发流程基本不变：**

1. `pnpm dev` → 本地开发
2. 修改代码 → 测试
3. `git push` → 自动部署
4. 完成！✨

**唯一需要注意的是：**
- 确保生产环境变量正确配置
- 修改数据库结构时记得迁移
- 修改 Payload 配置后生成类型

祝你开发顺利！🚀

