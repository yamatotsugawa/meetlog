import Link from "next/link";
import type { Person } from "@prisma/client";
import { Badge } from "./_ui/Badge";
import { getInitials, fmtDate } from "../lib/ui";

export default function PersonCard({
  person,
  subtitle,
}: {
  person: Person;
  subtitle?: string;
}) {
  const tags = Array.isArray(person.tags) ? (person.tags as string[]) : [];

  return (
    <Link
      href={`/people/${person.id}`}
      className="group block rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gray-900 text-xs font-semibold text-white">
          {getInitials(person.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-semibold">{person.name}</h3>
            {person.nextApptAt && (
              <span className="shrink-0 rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                次アポ {fmtDate(person.nextApptAt)}
              </span>
            )}
          </div>
          <p className="truncate text-sm text-gray-600">
            {person.company || "（会社未登録）"}
          </p>
          {subtitle && (
            <p className="mt-1 truncate text-xs text-gray-500">{subtitle}</p>
          )}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
              {tags.length > 4 && <Badge>+{tags.length - 4}</Badge>}
            </div>
          )}
        </div>
      </div>

      {/* ✅ 修正：impression → memo に変更 */}
      {person.memo && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-700">{person.memo}</p>
      )}
    </Link>
  );
}
