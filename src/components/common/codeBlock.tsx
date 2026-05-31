import { CopyButton } from "@/components/common/copyButton";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-slate-950 text-slate-50">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs text-slate-400">{language ?? "code"}</span>
        <CopyButton
          value={code}
          className="text-slate-400 hover:bg-white/10 hover:text-white"
        />
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
