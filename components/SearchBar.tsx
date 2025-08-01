"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Person = {
  id: string;
  name: string;
  company?: string | null;
  interactions?: { occurredAt: string }[];
};

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Person[]>([]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="w-full">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="検索：名前 / 会社 / 属性 / 話した内容…"
        className="w-full rounded-lg border px-4 py-3 text-base outline-none focus:ring"
      />
      {loading && <div className="text-sm mt-2">検索中…</div>}
      {!loading && results.length > 0 && (
        <ul className="mt-3 divide-y rounded-lg border bg-white">
          {results.map((p) => (
            <li key={p.id} className="p-3 hover:bg-gray-50">
              <Link href={`/people/${p.id}`} className="flex justify-between">
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-gray-500">{p.company || ""}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
