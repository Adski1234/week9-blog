import pool from "@/lib/db";
import Link from "next/link";

export default async function PostsPage({ searchParams }) {
    const resolvedParams = await searchParams;
    const sort = resolvedParams?.sort === "asc" ? "ASC" : "DESC";

    const result = await pool.query(`SELECT * FROM posts ORDER BY created_at ${sort}`);

  const posts = result.rows;

  return (
  <main>
    <h1 className="text-3xl font-bold mb-6">All Posts</h1>

    <div className="flex gap-4 mb-4 text-sm">
      <Link href="/posts?sort=asc" className="text-blue-600 hover:underline">Sort Ascending</Link>
      <Link href="/posts?sort=desc" className="text-blue-600 hover:underline">Sort Descending</Link>
    </div>

    <Link href="/posts/new" className="inline-block mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
      + Create New Post
    </Link>

    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post.id} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
          <Link
            href={`/posts/${post.id}`}
            className="text-lg font-semibold text-blue-700 hover:underline"
          >
            {post.title}
          </Link>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  </main>
);}