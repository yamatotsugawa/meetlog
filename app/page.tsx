import { prisma } from "@/lib/db";
import SearchBar from "@/components/SearchBar";
import PersonCard from "@/components/PersonCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const recent = await prisma.interaction.findMany({
    orderBy: { occurredAt: "desc" },
    take: 12,
    include: { person: true },
  });

  return (
    <main className="space-y-8">
      <section className="rounded-2xl border bg-white p-4 sm:p-6">
        <h1 className="mb-3 text-xl font-semibold tracking-tight sm:text-2xl">
          最近会った人を忘れず、すぐ検索。
        </h1>
        <SearchBar />
        <p className="mt-2 text-xs text-gray-500">名前・会社・属性・「話した内容」まで横断検索できます。</p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">最近あった人</h2>
          <Link href="/people/new" className="text-sm text-blue-600 underline-offset-2 hover:underline">
            すぐ登録する
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white p-6 text-center text-sm text-gray-500">
            まだ面談ログがありません。<Link href="/people/new" className="text-blue-600 underline">新規登録</Link>から始めましょう。
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r) => (
              <PersonCard
                key={r.id}
                person={r.person}
                subtitle={`${formatDateTime(r.occurredAt)} / ${r.place ?? ""}`}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function formatDateTime(d: Date) {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 16).replace("T", " ");
  }
}
