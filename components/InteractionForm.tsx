"use client";
import { useState } from "react";

export default function InteractionForm({ personId }: { personId: string }) {
  const [saving, setSaving] = useState(false);

  async function onSubmit(formData: FormData) {
    setSaving(true);
    const payload = {
      personId,
      occurredAt: toISO(formData.get("occurredAt") as string) || new Date().toISOString(),
      place: formData.get("place"),
      context: formData.get("context") || undefined,
      talkedAbout: formData.get("talkedAbout"),
      nextAction: formData.get("nextAction"),
      nextApptAt: toISO(formData.get("nextApptAt") as string),
      nextApptNote: formData.get("nextApptNote"),
      memo: formData.get("memo"),
    };
    const res = await fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data?.error || "保存に失敗しました");
      return;
    }
    // 追加後はリロードして最新表示
    location.reload();
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input name="occurredAt" label="いつ会ったか" type="datetime-local" />
        <Input name="place" label="どこで会ったか" />
      </div>
      <Select
        name="context"
        label="どういう状況"
        options={[
          ["", "選択なし"],
          ["MEAL", "会食"],["DRINKS","お酒"],["LUNCH","ランチ"],
          ["MEETING","打合せ"],["ONLINE","オンライン"],["EVENT","イベント"],["OTHER","その他"]
        ]}
      />
      <Text name="talkedAbout" label="何を話したか" />
      <Text name="nextAction" label="次のアクション" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input name="nextApptAt" label="次のアポ日時" type="datetime-local" />
        <Input name="nextApptNote" label="次アポの備考" />
      </div>
      <Text name="memo" label="その場メモ" />
      <button className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50" disabled={saving}>
        {saving ? "保存中…" : "面談ログを追加"}
      </button>
    </form>
  );
}

function Input({ name, label, type="text" }: { name:string; label:string; type?:string }) {
  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      <input name={name} type={type} className="mt-1 w-full rounded-lg border px-3 py-2"/>
    </label>
  );
}
function Text({ name, label }: { name:string; label:string }) {
  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      <textarea name={name} rows={3} className="mt-1 w-full rounded-lg border px-3 py-2"/>
    </label>
  );
}
function Select({ name, label, options }:{name:string; label:string; options:[string,string][]}) {
  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      <select name={name} className="mt-1 w-full rounded-lg border px-3 py-2">
        {options.map(([v,t]) => <option key={v} value={v}>{t}</option>)}
      </select>
    </label>
  );
}
function toISO(v?: string) {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}
