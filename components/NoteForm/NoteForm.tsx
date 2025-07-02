"use client";

import { useRef } from "react";
import { Tag } from "../../types/note";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import { toast } from "react-hot-toast";
import { useNoteStore } from "../../lib/store/noteStore";
import { useRouter } from "next/navigation";

export default function NoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const { mutate, status } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft(); // очищаємо чернетку
      formRef.current?.reset();
      router.push("/notes/filter/all");
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  // Прив'язка чернетки до полів форми

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

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setDraft({ [name]: value });
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
          onChange={handleChange}
          defaultValue={draft.title}
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
          onChange={handleChange}
          defaultValue={draft.content}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          required
          onChange={handleChange}
          defaultValue={draft.tag}
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
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()} // Повернення назад без очищення
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
