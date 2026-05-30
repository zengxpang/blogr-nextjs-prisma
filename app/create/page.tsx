import Link from "next/link";
import { createPost } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";

export default async function CreatePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="panel">
        <h1>新建帖子</h1>
        <p>创建帖子前需要先登陆</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <form action={createPost} className="form">
        <h1>新建帖子</h1>
        <label className="field">
          <span>标题</span>
          <input autoFocus name="title" placeholder="Title" required />
        </label>
        <label className="field">
          <span>内容</span>
          <textarea name="content" placeholder="Content" required />
        </label>
        <div className="actions">
          <button type="submit">提交</button>
          <Link className="button secondary" href="/">
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
