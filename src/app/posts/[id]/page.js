import pool from "@lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostPage ({ params }) {
    const { id } = params;
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);

    if (postResult.rows.length === 0) return notFound();
    const post = result.rows[0];

    const commentsResults = await pool.query("SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC", [id]);
    const comments = commentsResults.rows;

    return (
        <main>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <h2>Comments ({comments.length})</h2>
            {comments.map ((c) => (
                <div key={c.id}>
                    <strong>{c.author || "Anonymous"}</strong>
                    <p>{c.body}</p>
                </div>      
 ))}
        </main> 
    );
}