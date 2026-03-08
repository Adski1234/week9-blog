"use server";

import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

async function createPost (formData) {
    "use server";
    const title = formData.get("title");
    const content = formData.get("content");

    await pool.query("INSERT INTO posts (title, content) VALUES ($1, $2)", [title, content]);
    revalidatePath("/posts");
    redirect("/posts");
}

export default function NewPostPage() {
  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form action={createPost} className="space-y-4">

        <div>
          <label className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Content</label>
          <textarea
            name="content"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Publish Post
        </button>

      </form>
    </main>
  );
}