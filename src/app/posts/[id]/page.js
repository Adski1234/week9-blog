"use server";

import pool from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function deletePost (formData) {
    "use server";
    const id = formData.get("id");
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    revalidatePath("/posts");
    redirect("/posts");
}

async function addComment (formData) {
    "use server";
    const postId = formData.get("postId");
    const author = formData.get("author");
    const body = formData.get("body");

    await pool.query("INSERT INTO comments (post_id, author, body) VALUES ($1, $2, $3)", [postId, author, body]);
    revalidatePath(`/posts/${postId}`);
}



export default async function PostPage ({ params }) {
    const { id } = (await params);
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

    <h2 className="text-xl font-bold mt-8 mb-4">Leave a Comment</h2>
        <form action={addComment} className="space-y-4">
        <input type="hidden" name="postId" value={post.id} />

    <div>
        <label className="block mb-1 font-medium text-gray-700">Your Name</label>
            <input
                type="text"
                name="author"
                placeholder="Anonymous"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
    </div>

    <div>
        <label className="block mb-1 font-medium text-gray-700">Comment</label>
        <textarea
        name="body"
        required
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
    </div>

        <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
        Post Comment
        </button>
</form>
    <form action={deletePost} className="mt-8">
    <input type="hidden" name="id" value={post.id} />
    <button
        type="submit"
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm" >
    Delete Post
  </button>
</form>
        </main> 
    );
}
