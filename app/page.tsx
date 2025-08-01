import { prisma } from "@/lib/db";
import SearchBar from "@/components/SearchBar";
import PersonCard from "@/components/PersonCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const recent = await prisma.interaction.findMany({
    orderBy: { occurredAt: "desc" },
    take: 10,
    include: { person: true },
  });

  return (
    <main className="mx-auto max-w-3xl p-4 space-y-6">
      <h1 className="text-2xl font-bold">会った人メモ</h1>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">検索</h2>
          <a href="/people/new" className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
            新規登録
          </a>
        </div>
        <SearchBar />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">最近あった人</h2>
        <div className="grid gap-3">
          {recent.map((r) => (
            <PersonCard
              key={r.id}
              person={r.person}
              subtitle={`${r.occurredAt.toISOString().slice(0, 16).replace("T"," ")} / ${r.place ?? ""}`}
            />
          ))}
          {recent.length === 0 && <div className="text-sm text-gray-500">まだ面談ログがありません。</div>}
        </div>
      </section>
    </main>
  );
}
