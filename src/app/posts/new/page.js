"use server";

import { redirect } from "next/navigation";
import pool from "@lib/db";
import { revalidatePath } from "next/cache";

async function createPost (formData) {
    const title = formData.get("title");
    const content = formData.get("content");

    await pool.query("INSERT INTO posts (title, content) VALUES ($1, $2)", [title, content]);
    revalidatePath("/posts");
    redirect("/posts");
}

export default function NewPostPage() {
    return (
        <main>
            <h1>Create New Post</h1>
            <form action={createPost}>
                <label>
                    Title
                    <input type="text" name="title" required />
                </label>
                <label>
                    Content
                    <textarea name="content" required />
                </label>
                <button type="submit">Create Post</button>
            </form>
        </main>
    );
}