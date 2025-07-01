import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { Tag, type CreateNoteData, type Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import { toast } from "react-hot-toast";

interface NoteFormProps {
  onClose: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: Tag;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must contain no more than 50 characters")
    .required("Title is required"),
  content: Yup.string().max(
    500,
    "Content must contain no more than 500 characters",
  ),
  tag: Yup.string()
    .oneOf(Object.values(Tag), "Invalid tag")
    .required("Tag is required"),
});

export const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const { mutate, status } = useMutation<Note, Error, CreateNoteData>({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const initialValues: FormValues = {
    title: "",
    content: "",
    tag: Tag.Todo,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => mutate(values)}
    >
      <Form className={css.form} noValidate>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            {Object.values(Tag).map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onClose}
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
      </Form>
    </Formik>
  );
};
