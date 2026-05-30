import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { deletePost, publishPost } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  const [user, post] = await Promise.all([
    getCurrentUser(),
    prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    }),
  ]);

  if (!post) {
    notFound();
  }

  const postBelongsToUser = user?.id === post.authorId;
  const title = post.published ? post.title : `${post.title} (Draft)`;

  return (
    <article className="panel">
      <h1>{title}</h1>
      <p className="meta">By {post.author?.name ?? "匿名"}</p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
      {postBelongsToUser ? (
        <div className="actions">
          {!post.published ? (
            //  bind方法用于携带自定义参数
            <form action={publishPost.bind(null, post.id)}>
              <button type="submit">发布</button>
            </form>
          ) : null}
          <form action={deletePost.bind(null, post.id)}>
            <button className="secondary" type="submit">
              删除
            </button>
          </form>
        </div>
      ) : null}
    </article>
  );
}
