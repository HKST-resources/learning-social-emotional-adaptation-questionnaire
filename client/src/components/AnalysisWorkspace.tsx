/**
 * Design reminder — Bright Clinical Studio:
 * Analysis is a focused white workspace with vibrant gradient cues only for navigation,
 * filters, shared patterns, and selected targets. Content remains the dominant visual.
 */
import { ArrowLeft, Check, FileSpreadsheet, Filter, Printer, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

type Rating = 0 | 1 | 2;

type ItemWithContext = {
  id: string;
  text: string;
  category: string;
  context: string;
  group: string;
};

type ChildAnalysis = {
  name: string;
  groups: { score: Rating; items: ItemWithContext[] }[];
};

type AnalysisWorkspaceProps = {
  ratingDate: string;
  childNames: string[];
  individualAnalysis: ChildAnalysis[];
  selectedGoals: string[];
  onToggleGoal: (itemId: string, childIndex: number) => void;
  onBack: () => void;
  onExportExcel: () => void;
};

const scoreMeta: Record<Rating, { title: string; colour: string; pill: string }> = {
  0: { title: "未能做到", colour: "border-[#FFB4B4]", pill: "bg-[#FFE6E6] text-[#B73348]" },
  1: { title: "有時或支援下做到", colour: "border-[#FFD35A]", pill: "bg-[#FFF4C7] text-[#9A6300]" },
  2: { title: "時常做到", colour: "border-[#83E1BE]", pill: "bg-[#E2FFF3] text-[#147B5D]" },
};

function GoalKey(itemId: string, childIndex: number) {
  return `${itemId}::${childIndex}`;
}

function ItemText({ text }: { text: string }) {
  return <span className="whitespace-pre-line">{text}</span>;
}

export default function AnalysisWorkspace({
  ratingDate,
  childNames,
  individualAnalysis,
  selectedGoals,
  onToggleGoal,
  onBack,
  onExportExcel,
}: AnalysisWorkspaceProps) {
  const [scoreFilter, setScoreFilter] = useState<Rating>(1);
  const filteredChildren = useMemo(
    () => individualAnalysis.map((child) => ({ ...child, items: child.groups.find((group) => group.score === scoreFilter)?.items ?? [] })),
    [individualAnalysis, scoreFilter],
  );

  const sharedCounts = useMemo(() => {
    const counts = new Map<string, number>();
    filteredChildren.forEach((child) => child.items.forEach((item) => counts.set(item.id, (counts.get(item.id) ?? 0) + 1)));
    return counts;
  }, [filteredChildren]);

  const sharedItems = useMemo(
    () => Array.from(sharedCounts.entries()).filter(([, count]) => count >= 2).map(([id, count]) => ({ item: filteredChildren.flatMap((child) => child.items).find((item) => item.id === id), count })),
    [filteredChildren, sharedCounts],
  );

  return (
    <div className="min-h-screen bg-white text-[#20264A]">
      <header className="border-b border-[#E8E9F5] bg-white px-4 py-4 sm:px-7">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border border-[#D8DBEE] bg-white px-3 py-2 text-[13px] font-bold text-[#4B5482] transition hover:border-[#7D89FF] hover:bg-[#F6F7FF] active:scale-[0.98]"><ArrowLeft className="h-4 w-4" />返回評分表</button>
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#68709A]"><span>{ratingDate}</span><span className="h-4 w-px bg-[#D9DCEC]" /><span>{childNames.length} 位兒童</span></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 pb-10 pt-6 sm:px-7 sm:pt-8">
        <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#6D5DFB_0%,#9978FF_44%,#F96EA5_100%)] px-5 py-6 text-white shadow-[0_18px_44px_rgba(109,93,251,0.23)] sm:px-7 sm:py-7">
          <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border-[22px] border-white/20" />
          <div className="pointer-events-none absolute right-24 top-14 h-24 w-24 rounded-full border-[14px] border-white/15" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-[0.12em]"><Sparkles className="h-3.5 w-3.5" />PERFORMANCE ANALYSIS</p>
              <h1 className="mt-3 text-[30px] font-bold tracking-tight sm:text-[38px]">各兒童表現分析</h1>
              <p className="mt-2 max-w-2xl text-[15px] leading-6 text-white/88">選擇分數以橫向比較每位兒童的項目。相同分數的共同項目會以亮色標示，並可直接為個別兒童勾選學習目標。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[13px] font-bold text-[#5B50D8] transition hover:bg-[#F5F4FF] active:scale-[0.98]"><Printer className="h-4 w-4" />PDF 報告</button>
              <button type="button" onClick={onExportExcel} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 text-[13px] font-bold text-white transition hover:bg-white/20 active:scale-[0.98]"><FileSpreadsheet className="h-4 w-4" />Excel 報告</button>
            </div>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#E7E8F3] bg-white p-4 shadow-[0_8px_24px_rgba(42,45,88,0.06)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[13px] font-bold text-[#404A78]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EFFF] text-[#6D5DFB]"><Filter className="h-4 w-4" /></span>篩選顯示的分數</div>
          <div className="flex rounded-xl bg-[#F5F5FD] p-1" role="tablist" aria-label="分數篩選">
            {([0, 1, 2] as Rating[]).map((score) => (
              <button key={score} type="button" onClick={() => setScoreFilter(score)} role="tab" aria-selected={scoreFilter === score} className={`rounded-lg px-3 py-2 text-[12px] font-bold transition sm:px-4 ${scoreFilter === score ? "bg-white text-[#343B6B] shadow-[0_2px_8px_rgba(45,47,87,0.12)]" : "text-[#7C84A9] hover:text-[#454E7F]"}`}><span className={`mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full ${scoreMeta[score].pill}`}>{score}</span>{scoreMeta[score].title}</button>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-[20px] font-bold text-[#31395F]">橫向比較</h2><p className="text-[12px] text-[#7B83A8]">亮色卡片 = 最少兩位兒童有相同評分</p></div>
          <div className="overflow-x-auto pb-2"><div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(Math.max(filteredChildren.length, 1), 4)}, minmax(0, 1fr))`, minWidth: filteredChildren.length > 2 ? "840px" : undefined }}>
            {filteredChildren.map((child, childIndex) => (
              <article key={`${child.name}-${childIndex}`} className={`min-w-0 overflow-hidden rounded-2xl border-2 ${scoreMeta[scoreFilter].colour} bg-white shadow-[0_8px_22px_rgba(42,45,88,0.07)]`}>
                <div className="flex items-center justify-between border-b border-[#ECEEF7] bg-[#FBFBFF] px-4 py-3"><div><p className="text-[11px] font-bold tracking-[0.12em] text-[#858DB3]">兒童 {childIndex + 1}</p><h3 className="mt-0.5 text-[17px] font-bold text-[#31395F]">{child.name}</h3></div><span className={`rounded-full px-2 py-1 text-[11px] font-bold ${scoreMeta[scoreFilter].pill}`}>{child.items.length} 項</span></div>
                <div className="max-h-[62vh] space-y-2 overflow-y-auto p-3">
                  {child.items.length ? child.items.map((item) => {
                    const repeated = (sharedCounts.get(item.id) ?? 0) >= 2;
                    const checked = selectedGoals.includes(GoalKey(item.id, childIndex));
                    return (
                      <div key={item.id} className={`relative rounded-xl border p-3 pr-10 text-[14px] leading-6 transition ${repeated ? "border-[#A99DFF] bg-[linear-gradient(135deg,#F2F0FF_0%,#FFF0F7_100%)] shadow-[0_4px_14px_rgba(118,93,251,0.11)]" : "border-[#E8E9F2] bg-white"}`}>
                        {repeated && <span className="mb-1.5 inline-flex rounded-full bg-[#6D5DFB] px-2 py-0.5 text-[10px] font-bold text-white">{sharedCounts.get(item.id)} 位兒童相同</span>}
                        <p className="mb-1 text-[10px] font-bold tracking-[0.1em] text-[#7C85A9]">{item.context} · {item.group.replaceAll("\n", " ")}</p>
                        <ItemText text={item.text} />
                        <button type="button" onClick={() => onToggleGoal(item.id, childIndex)} aria-pressed={checked} aria-label={`選擇 ${child.name} 的目標：${item.text.split("\n")[0]}`} className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${checked ? "border-[#5E53D8] bg-[#6D5DFB] text-white" : "border-[#C8CCE1] bg-white text-transparent hover:border-[#6D5DFB]"}`}><Check className="h-3.5 w-3.5" /></button>
                      </div>
                    );
                  }) : <p className="rounded-xl bg-[#F7F7FC] px-3 py-5 text-center text-[13px] text-[#8A91B1]">沒有此分數的項目。</p>}
                </div>
              </article>
            ))}
          </div></div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#E7E8F3] bg-[#FCFCFF] p-4 sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[11px] font-bold tracking-[0.12em] text-[#787FA7]">本次篩選的共同點</p><h2 className="mt-1 text-[18px] font-bold text-[#333C64]">{sharedItems.length} 個項目由最少兩位兒童共同評為 {scoreFilter} 分</h2></div><p className="rounded-xl bg-[#E9E7FF] px-3 py-2 text-[12px] font-bold text-[#5C50D5]">已選 {selectedGoals.length} 項個別目標</p></div>
          {sharedItems.length ? <div className="mt-4 flex flex-wrap gap-2">{sharedItems.map(({ item, count }) => item ? <span key={item.id} className="rounded-xl border border-[#C9C2FF] bg-white px-3 py-2 text-[12px] text-[#4B4B78]"><strong className="mr-1 text-[#6858E8]">{count} 位：</strong>{item.text.split("\n")[0]}</span> : null)}</div> : <p className="mt-3 text-[13px] text-[#838AAA]">這個分數下暫未有兩位或以上兒童相同的項目。</p>}
        </section>
      </main>
    </div>
  );
}
