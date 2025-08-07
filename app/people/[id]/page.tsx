import { prisma } from "@/lib/db";
import InteractionForm from "@/components/InteractionForm";

export default async function PersonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const person = await prisma.person.findUnique({
    where: { id },
    include: { interactions: { orderBy: { occurredAt: "desc" } } },
  });

  if (!person) return <main className="p-4">見つかりませんでした。</main>;

  return (
    <main className="mx-auto max-w-3xl p-4 space-y-6">
      <section className="rounded-xl border bg-white p-4">
        <h1 className="text-xl font-bold">{person.name}</h1>
        <div className="mt-1 text-sm text-gray-700">
          {person.company || ""}
        </div>

        {/* ✅ メモがある場合に表示 */}
        {person.memo && (
          <div className="mt-4 text-sm whitespace-pre-wrap text-gray-800">
            <h3 className="mb-1 font-semibold">メモ</h3>
            {person.memo}
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">面談ログを追加</h2>
        <InteractionForm personId={person.id} />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">面談ログ</h2>
        <ul className="space-y-3">
          {person.interactions.map((i) => (
            <li key={i.id} className="rounded-xl border bg-white p-4">
              <div className="text-sm text-gray-600">
                {i.occurredAt.toISOString().slice(0, 16).replace("T", " ")} / {i.place ?? ""}
              </div>
              {i.talkedAbout && (
                <div className="mt-2 whitespace-pre-wrap text-sm">{i.talkedAbout}</div>
              )}
            </li>
          ))}
          {person.interactions.length === 0 && (
            <div className="text-sm text-gray-500">まだログがありません。</div>
          )}
        </ul>
      </section>
    </main>
  );
}
