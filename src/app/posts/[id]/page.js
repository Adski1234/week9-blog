import pool from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function deletePost (formData) {
    const id = formData.get("id");
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    revalidatePath("/posts");
    redirect("/posts");
}

async function addComment (formData) {
    const postId = formData.get("postId");
    const author = formData.get("author");
    const body = formData.get("body");

    await pool.query("INSERT INTO comments (post_id, author, body) VALUES ($1, $2, $3)", [postId, author, body]);
    revalidatePath(`/posts/${postId}`);
}



export default async function PostPage ({ params }) {
    const { id } = params;
    const postResult = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);

    if (postResult.rows.length === 0) return notFound();
    const post = postResult.rows[0];

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

    <h2>Add a Comment</h2>
    <form action={addComment}>
        <input type="hidden" name="postId" value={id} />
        <label>
            Name
            <input type="text" name="author" placeholder="Anonymous"/>
        </label>
        <label>
            Comment
            <textarea name="body" required />
        </label>
        <button type="submit">Add Comment</button>
    </form>
            <form action={deletePost}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit">Delete Post</button>
            </form>
        </main> 
    );
}