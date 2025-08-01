"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PersonForm() {
  const r = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // 画面遷移のデフォルト送信を止める
    const fd = new FormData(e.currentTarget);
    setSaving(true);

    const payload = {
      name: fd.get("name"),
      company: fd.get("company"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      mainContactTool: fd.get("mainContactTool") || undefined,
      facebookUrl: fd.get("facebookUrl"),
      firstMetAt: toISO(fd.get("firstMetAt") as string),
      firstMetHow: fd.get("firstMetHow"),
      leadType: fd.get("leadType") || undefined,
      appearance: fd.get("appearance"),
      personality: fd.get("personality"),
      impression: fd.get("impression"),
      followupPlan: fd.get("followupPlan"),
      nextApptAt: toISO(fd.get("nextApptAt") as string),
      nextApptNote: fd.get("nextApptNote"),
      tags: splitTags(fd.get("tags") as string),
    };

    try {
      const res = await fetch("/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "保存に失敗しました");
        return;
      }
      r.push(`/people/${data.id}`); // 詳細へ遷移
    // 中略...
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "不明なエラー";
      alert("通信エラー: " + message);
    } finally {
      setSaving(false);
    }
// 中略...

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input name="name" label="名前 *" required />
      <Input name="company" label="会社名" />
      <Input name="email" label="メールアドレス" type="email" />
      <Input name="phone" label="電話番号" />
      <Select
        name="mainContactTool"
        label="主な連絡ツール"
        options={[
          ["", "選択なし"],
          ["LINE", "LINE"],
          ["EMAIL", "メール"],
          ["MESSENGER", "メッセンジャー"],
          ["DM", "DM"],
          ["OTHER", "その他"],
        ]}
      />
      <Input name="facebookUrl" label="Facebookリンク" />
      <Input name="firstMetAt" label="初回：いつ会ったか" type="datetime-local" />
      <Input name="firstMetHow" label="どうやって出会ったか（紹介・イベントなど）" />
      <Select
        name="leadType"
        label="相手の属性"
        options={[
          ["", "選択なし"],
          ["SUPPLIER", "取引先"],
          ["PROSPECT", "見込み顧客"],
          ["FRIEND", "友人"],
          ["PARTNER", "パートナー"],
          ["OTHER", "その他"],
        ]}
      />
      <Text name="appearance" label="見た目の特徴" />
      <Text name="personality" label="性格" />
      <Text name="impression" label="個人的な印象" />
      <Text name="followupPlan" label="今後の対応（もう会わなくて良い等）" />
      <Input name="nextApptAt" label="次のアポ日時" type="datetime-local" />
      <Input name="nextApptNote" label="次アポの備考" />
      <Input name="tags" label="タグ（スペース or カンマ区切り）" />

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {saving ? "保存中…" : "保存"}
      </button>
    </form>
  );
}

/* ---- 小さなUI部品 ---- */
function Input({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-lg border px-3 py-2"
      />
    </label>
  );
}
function Text({ name, label }: { name: string; label: string }) {
  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      <textarea name={name} rows={3} className="mt-1 w-full rounded-lg border px-3 py-2" />
    </label>
  );
}
function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      <select name={name} className="mt-1 w-full rounded-lg border px-3 py-2">
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---- ヘルパー ---- */
function toISO(v?: string) {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}
function splitTags(v?: string) {
  if (!v) return [];
  return v
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
