import pool from "@/lib/db";
import Link from "next/link";

export default async function PostsPage({ searchParams }) {
    const sort = searchParams?.sort === "asc" ? "ASC" : "DESC";

    const result = await pool.query(`SELECT * FROM posts ORDER BY created_at ${sort}`);

  const posts = result.rows;

    return (
        <main>
            <h1>All Posts</h1>
            <div>
                <Link href="/posts?sort=asc">Sort Ascending</Link>
                <Link href="/posts?sort=desc">Sort Descending</Link>
            </div>
            <Link href="/posts/new">Create New Post</Link>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link href={`/posts/${post.id}`}>{post.title}</Link>
                        <span>{new Date(post.created_at).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </main>
    );
}