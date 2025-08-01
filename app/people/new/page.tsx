// app/people/new/page.tsx
import PersonForm from "@/components/PersonForm";

export default function NewPersonPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-xl font-bold">新規登録</h1>
      <PersonForm />
    </main>
  );
}
