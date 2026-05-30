import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const authors = [
  {
    vercelId: "seed-author-zhang",
    name: "张明",
    email: "zhangming@example.com",
  },
  {
    vercelId: "seed-author-li",
    name: "李雨桐",
    email: "liyutong@example.com",
  },
  {
    vercelId: "seed-author-wang",
    name: "王浩然",
    email: "wanghaoran@example.com",
  },
] as const;

const posts = [
  {
    title: "用 Next.js 搭建你的第一个全栈博客",
    content:
      "从 `create-next-app` 开始，一步步接入 **App Router**、服务端组件与 API 路由，适合零基础入门。",
    published: true,
    authorIndex: 0,
  },
  {
    title: "Prisma 与 PostgreSQL：开发环境最佳实践",
    content:
      "介绍如何用 Prisma Migrate 管理 schema、用 `prisma studio` 查看数据，以及本地 Docker 数据库的常见坑。",
    published: true,
    authorIndex: 0,
  },
  {
    title: "React Server Components 到底解决了什么？",
    content:
      "对比传统 CSR：更少 JavaScript 下发、数据在服务端就近获取，并讨论何时仍需要客户端组件。",
    published: true,
    authorIndex: 1,
  },
  {
    title: "TypeScript 严格模式下的 5 个常见报错",
    content:
      "`strictNullChecks`、`noImplicitAny` 等选项开启后，如何系统性修复旧代码而不一次改崩。",
    published: true,
    authorIndex: 1,
  },
  {
    title: "Markdown 在博客正文里的排版技巧",
    content:
      "标题层级、代码块高亮、外链与图片说明；配合 `react-markdown` 时注意 XSS 与安全渲染。",
    published: true,
    authorIndex: 2,
  },
  {
    title: "数据库索引入门：别让列表页越查越慢",
    content:
      "为 `published`、`created_at` 等高频过滤字段建索引；用 `EXPLAIN` 看懂查询计划。",
    published: true,
    authorIndex: 2,
  },
  {
    title: "环境变量与密钥：`.env` 不要提交到 Git",
    content:
      "区分 `DATABASE_URL`、公开配置与私密密钥；生产环境用平台提供的 Secret 管理。",
    published: true,
    authorIndex: 0,
  },
  {
    title: "帖子：计划中的「评论系统」设计笔记",
    content:
      "暂存想法：楼中楼、审核流、与现有 Post / User 模型的关系——尚未实现。",
    published: false,
    authorIndex: 1,
  },
  {
    title: "从 0 到 1 部署到 Vercel 的检查清单",
    content:
      "构建命令、`prisma generate`、数据库连接串、迁移策略，以及首次上线后的监控项。",
    published: true,
    authorIndex: 2,
  },
  {
    title: "学习笔记：一周复盘与下周计划",
    content:
      "本周完成：Schema、Seed、列表页接库。下周：详情页优化、帖子发布流程、简单后台。",
    published: true,
    authorIndex: 0,
  },
] as const;

async function main() {
  console.log("开始填充种子数据…");

  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const createdAuthors = await Promise.all(
    authors.map((author) => prisma.user.create({ data: author })),
  );

  await prisma.post.createMany({
    data: posts.map((post) => ({
      title: post.title,
      content: post.content,
      published: post.published,
      authorId: createdAuthors[post.authorIndex].id,
    })),
  });

  const publishedCount = posts.filter((p) => p.published).length;
  console.log(
    `完成：${createdAuthors.length} 位作者，${posts.length} 篇帖子（其中 ${publishedCount} 篇已发布）。`,
  );
}

main()
  .catch((error) => {
    console.error("种子脚本执行失败：", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
