export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
      {children}
    </span>
  );
}
