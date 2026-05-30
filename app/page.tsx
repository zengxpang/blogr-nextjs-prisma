import PostCard, { type PostCardData } from "@/components/post-card";
import prisma from "@/lib/prisma";

export const revalidate = 10; // 10秒后重新更新

export default async function FeedPage() {
  const feed: PostCardData[] = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: { id: "desc" },
  });

  return (
    <div className="stack">
      <h1>已发布的帖子</h1>
      {feed.length ? (
        feed.map((post: PostCardData) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="panel">暂无已发布的帖子</div>
      )}
    </div>
  );
}
