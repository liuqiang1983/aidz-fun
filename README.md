# AIDZ.FUN

AI 工具教程与 Prompt 资源库 - 基于 Next.js 14 + Tailwind CSS + MDX 构建。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📁 项目结构

```
aidz-fun/
├── app/                    # Next.js App Router
│   ├── page.tsx          # 首页
│   ├── search/           # 搜索页
│   └── tutorials/        # 教程页面
│       ├── [category]/   # 分类列表
│       └── [category]/
│           └── [slug]/  # 文章详情
├── components/           # React 组件
│   ├── ui/              # 基础 UI 组件
│   ├── layout/          # 布局组件
│   └── article/         # 文章相关组件
├── content/posts/       # MDX 文章内容
├── lib/                  # 工具库
│   ├── mdx.ts          # MDX 处理
│   └── utils.ts        # 通用工具
└── public/              # 静态资源
```

## 🎨 设计规范

- **主色**: #2563EB
- **成功色**: #10B981
- **容器宽度**: 1280px
- **阅读区宽度**: 720px
- **圆角**: 12px
- **深色模式**: 支持

## 📝 内容创作

文章使用 MDX 格式，放在 `content/posts/` 目录下：

```mdx
---
title: "文章标题"
description: "文章描述"
date: "2025-01-01"
category: "agent-platform"
tags: ["Tag1", "Tag2"]
featured: true
---

# 文章内容

<PromptBlock content="Prompt 内容" />
```

## 🚢 部署

项目已配置好 Vercel 部署，推送到 GitHub 后会自动部署。

## 📄 License

MIT
