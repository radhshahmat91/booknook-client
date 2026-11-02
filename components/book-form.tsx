"use client";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Field } from "./field";
import BookCard from "./book-card";
import { uploadImage } from "@/lib/upload";
import { CATEGORIES, cn, type Category } from "@/lib/utils";
import type { BookInput } from "@/types";

type Props = {
  initial?: BookInput;
  userName: string;
  userEmail: string;
  submitLabel: string;
  onSubmit: (values: BookInput) => Promise<void>;
  preview?: boolean; // show a live book card next to the form
};

const MAX_MB = 5;

export default function BookForm({ initial, userName, userEmail, submitLabel, onSubmit, preview = false }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "Fiction");
  const [copies, setCopies] = useState(String(initial?.totalCopies ?? 1));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => { if (fileUrl) URL.revokeObjectURL(fileUrl); }, [fileUrl]);
  const image = fileUrl || initial?.image || "";

  function pick(f?: File) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return void setErrors((e) => ({ ...e, image: "Choose an image file (JPG, PNG or WebP)." }));
    if (f.size > MAX_MB * 1024 * 1024) return void setErrors((e) => ({ ...e, image: `Images must be smaller than ${MAX_MB} MB.` }));
    setErrors((e) => ({ ...e, image: "" }));
    setFile(f);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (title.trim().length < 2) e.title = "Enter the book's title.";
    if (author.trim().length < 2) e.author = "Enter the author's name.";
    if (description.trim().length < 10) e.description = "Write at least 10 characters about the book.";
    const n = Number(copies);
    if (!Number.isInteger(n) || n < 1 || n > 99) e.copies = "Use a whole number from 1 to 99.";
    if (!file && !initial?.image) e.image = "Upload a cover image.";
    return e;
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setBusy(true);
    try {
      const url = file ? await uploadImage(file) : (initial?.image ?? "");
      await onSubmit({ title: title.trim(), author: author.trim(), category, image: url, description: description.trim(), totalCopies: Number(copies) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const readOnly = "input w-full cursor-not-allowed bg-base-200 opacity-80";

  const form = (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Book title" htmlFor="title" error={errors.title}>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="The Great Gatsby" className={cn("input w-full", errors.title && "input-error")} />
        </Field>
        <Field label="Author name" htmlFor="author" error={errors.author}>
          <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={80} placeholder="F. Scott Fitzgerald" className={cn("input w-full", errors.author && "input-error")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" htmlFor="category">
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className="select w-full">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Total copies" htmlFor="copies" error={errors.copies}>
          <input id="copies" type="number" min={1} max={99} value={copies} onChange={(e) => setCopies(e.target.value)} className={cn("input w-full", errors.copies && "input-error")} />
        </Field>
      </div>

      <Field label="Book image" error={errors.image}>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }}
          className={cn(
            "grid place-items-center rounded-box border-2 border-dashed p-6 text-center transition-colors",
            dragging ? "border-primary bg-primary/10" : "border-base-300",
            errors.image && "border-error",
          )}
        >
          {image ? (
            <div className="flex items-center gap-5 text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Selected cover" className="h-28 w-20 rounded object-cover shadow-md" />
              <div>
                <p className="line-clamp-1 font-display font-bold">{file?.name ?? "Current cover"}</p>
                <button type="button" onClick={() => fileInput.current?.click()} className="btn btn-outline btn-sm mt-3 rounded-full">
                  Replace image
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => fileInput.current?.click()} className="flex flex-col items-center gap-2 py-4">
              <ImagePlus className="h-9 w-9 text-primary" aria-hidden="true" />
              <span className="font-display font-bold">Drop a cover here or click to upload</span>
              <span className="text-sm text-base-content/60">JPG, PNG or WebP, up to {MAX_MB} MB</span>
            </button>
          )}
          <input ref={fileInput} type="file" accept="image/*" className="sr-only" aria-label="Book image" onChange={(e) => pick(e.target.files?.[0])} />
        </div>
      </Field>

      <Field label="Short description" htmlFor="description" error={errors.description} hint={`${description.length} / 1000`}>
        <textarea id="description" rows={4} maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this book about, and why would someone enjoy it?" className={cn("textarea w-full", errors.description && "textarea-error")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="user-name">
          <input id="user-name" value={userName} readOnly className={readOnly} />
        </Field>
        <Field label="Your email" htmlFor="user-email">
          <input id="user-email" value={userEmail} readOnly className={readOnly} />
        </Field>
      </div>

      <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full rounded-full sm:w-auto sm:px-12">
        {busy ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" /> Saving
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );

  if (!preview) return form;
  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px]">
      {form}
      <aside className="hidden lg:block" aria-label="Live preview">
        <div className="sticky top-28">
          <p className="mb-6 font-display font-bold text-base-content/60">Live preview</p>
          <BookCard preview book={{ title, author, category, image }} />
        </div>
      </aside>
    </div>
  );
}
