"use client";

import { useRef } from "react";
import { Tag } from "../../types/note";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import { toast } from "react-hot-toast";

export default function NoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  const { mutate, status } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      formRef.current?.reset();
      window.location.href = "/notes/filter/all";
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  async function handleSubmit(formData: FormData) {
    const title = formData.get("title")?.toString().trim() || "";
    const content = formData.get("content")?.toString().trim() || "";
    const tag = formData.get("tag")?.toString() as Tag;

    if (!title || title.length < 3 || title.length > 50) {
      toast.error("Title must be 3-50 characters long");
      return;
    }

    if (content.length > 500) {
      toast.error("Content must contain no more than 500 characters");
      return;
    }

    if (!Object.values(Tag).includes(tag)) {
      toast.error("Invalid tag");
      return;
    }

    mutate({ title, content, tag });
  }

  return (
    <form ref={formRef} className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          rows={8}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={Tag.Todo}
          required
        >
          {Object.values(Tag).map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="reset"
          className={css.cancelButton}
          disabled={status === "pending"}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={status === "pending"}
        >
          {status === "pending" ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
