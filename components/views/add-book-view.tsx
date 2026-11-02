"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BookForm from "@/components/book-form";
import PageHeader from "@/components/page-header";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Book } from "@/types";

export default function AddBookView() {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) return null;

  return (
    <>
      <PageHeader title="Add a book" text="Share a book from your shelf. It appears on the home page the moment you save it." />
      <section className="wrap py-12 pb-24">
        <BookForm
          preview
          userName={session.user.name}
          userEmail={session.user.email}
          submitLabel="Add Book"
          onSubmit={async (values) => {
            await api<Book>("/books", { method: "POST", auth: true, body: values });
            toast.success(`"${values.title}" is on the shelf.`);
            router.push("/my-books");
          }}
        />
      </section>
    </>
  );
}
