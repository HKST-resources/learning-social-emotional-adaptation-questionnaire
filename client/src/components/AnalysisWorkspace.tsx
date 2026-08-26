/**
 * Design reminder — Bright Clinical Studio:
 * Analysis uses fixed, evidence-led comparison tables. Colour identifies selected ratings
 * and each child's lowest-priority areas; it never replaces readable written structure.
 */
import { ArrowLeft, Check, ChevronDown, FileSpreadsheet, Filter, Printer } from "lucide-react";
import { useMemo, useState } from "react";

export type Rating = 0 | 1 | 2;

export type AnalysisItem = {
  id: string;
  text: string;
  category: string;
  context: string;
  group: string;
};

export type AnalysisRatingData = Record<string, { score?: Rating; remark: string }>;

export type AreaScore = {
  lowest?: Rating;
  average?: number;
  ratedCount: number;
};

export type SummaryArea = {
  key: string;
  category: string;
  context: string;
  group: string;
  items: AnalysisItem[];
  scores: AreaScore[];
};

type AnalysisWorkspaceProps = {
  ratingDate: string;
  childNames: string[];
  items: AnalysisItem[];
  ratings: AnalysisRatingData;
  selectedGoals: string[];
  onToggleGoal: (itemId: string, childIndex: number) => void;
  onBack: () => void;
  onExportExcel: () => void;
};

const ratingClass: Record<Rating, string> = {
  0: "border-[#FF9AAA] bg-[#FF637C] text-white",
  1: "border-[#F4C334] bg-[#FFB91F] text-white",
  2: "border-[#34C990] bg-[#34C990] text-white",
};

const quietRatingClass: Record<Rating, string> = {
  0: "border-[#FFD0D6] bg-[#FFF5F6] text-[#B63347]",
  1: "border-[#FFE6A0] bg-[#FFF9E7] text-[#986300]",
  2: "border-[#B8EFD6] bg-[#F0FFF8] text-[#117D5A]",
};

export const goalKey = (itemId: string, childIndex: number) => `${itemId}::${childIndex}`;

export const displayChildName = (name: string, index: number) => name.trim() || `兒童 ${index + 1}`;

export function buildAreaSummaries(items: AnalysisItem[], childCount: number, ratings: AnalysisRatingData): SummaryArea[] {
  const grouped = new Map<string, Omit<SummaryArea, "scores">>();
  items.forEach((item) => {
    const key = `${item.category}::${item.context}::${item.group}`;
    const existing = grouped.get(key);
    if (existing) existing.items.push(item);
    else grouped.set(key, { key, category: item.category, context: item.context, group: item.group, items: [item] });
  });

  return Array.from(grouped.values()).map((area) => ({
    ...area,
    scores: Array.from({ length: childCount }, (_, childIndex) => {
      const values = area.items.map((item) => ratings[goalKey(item.id, childIndex)]?.score).filter((score): score is Rating => score !== undefined);
      if (!values.length) return { ratedCount: 0 };
      return { lowest: Math.min(...values) as Rating, average: values.reduce<number>((total, score) => total + score, 0) / values.length, ratedCount: values.length };
    }),
  }));
}

function ItemText({ text }: { text: string }) {
  return <span className="whitespace-pre-line">{text}</span>;
}

function OverviewTable({ category, areas, childNames, ratings, scoreFilter, selectedGoals, expandedCell, onExpand, onToggleGoal }: {
  category: string;
  areas: SummaryArea[];
  childNames: string[];
  ratings: AnalysisRatingData;
  scoreFilter: Set<Rating>;
  selectedGoals: string[];
  expandedCell: string | null;
  onExpand: (key: string) => void;
  onToggleGoal: (itemId: string, childIndex: number) => void;
}) {
  const lowestFive = useMemo(() => childNames.map((_, childIndex) => new Set(
    areas
      .filter((area) => area.scores[childIndex].lowest !== undefined)
      .sort((left, right) => (left.scores[childIndex].lowest! - right.scores[childIndex].lowest!) || ((left.scores[childIndex].average ?? 0) - (right.scores[childIndex].average ?? 0)))
      .slice(0, 5)
      .map((area) => area.key),
  )), [areas, childNames]);

  return <section className="mt-7">
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div><p className="text-[12px] font-bold tracking-[0.11em] text-[#837CA9]">總覽</p><h2 className="mt-1 text-[22px] font-bold text-[#30395F]">{category}</h2></div>
      <p className="text-[12px] text-[#757FA6]">每位兒童以亮色標示最低的 5 個小範疇；按格子查看項目。</p>
    </div>
    <div className="overflow-x-auto rounded-2xl border border-[#E1E4EF] bg-white shadow-[0_8px_24px_rgba(42,45,88,0.06)]">
      <table className="w-full min-w-[920px] table-fixed border-collapse text-left">
        <thead className="bg-[#F7F8FE]">
          <tr>
            <th className="w-[160px] border-b border-r border-[#E1E4EF] px-3 py-3 text-[13px] font-bold text-[#57618B]">大類別</th>
            <th className="w-[260px] border-b border-r border-[#E1E4EF] px-3 py-3 text-[13px] font-bold text-[#57618B]">小範疇</th>
            {childNames.map((name, index) => <th key={index} className="border-b border-r border-[#E1E4EF] px-3 py-3 text-center last:border-r-0"><p className="text-[11px] font-bold text-[#8A91B0]">兒童 {index + 1}</p><p className="mt-0.5 truncate text-[14px] font-extrabold text-[#444F7A]">{displayChildName(name, index)}</p></th>)}
          </tr>
        </thead>
        <tbody>
          {areas.map((area, areaIndex) => {
            const activeChildIndex = childNames.findIndex((_, childIndex) => expandedCell === `${area.key}::${childIndex}`);
            return <>
              <tr key={area.key} className="border-b border-[#EEF0F6] align-stretch">
                <td className="border-r border-[#E7E9F1] px-3 py-3 text-[13px] font-bold text-[#59638E]">{area.context}</td>
                <th scope="row" className="border-r border-[#E7E9F1] px-3 py-3 text-left text-[14px] font-bold leading-5 text-[#30395F]">{area.group.replaceAll("\n", " ")}</th>
                {childNames.map((_, childIndex) => {
                  const score = area.scores[childIndex];
                  const cellKey = `${area.key}::${childIndex}`;
                  const highlighted = lowestFive[childIndex].has(area.key);
                  const selected = expandedCell === cellKey;
                  return <td key={childIndex} className="border-r border-[#E7E9F1] p-2 text-center last:border-r-0"><button type="button" onClick={() => onExpand(cellKey)} aria-expanded={selected} className={`relative flex min-h-10 w-full items-center justify-center rounded-lg border text-[16px] font-extrabold transition active:scale-[0.98] ${score.lowest === undefined ? "border-[#E5E7EF] bg-white text-[#B0B5C8] hover:border-[#B9BFE0]" : highlighted ? ratingClass[score.lowest] : quietRatingClass[score.lowest]}`}>{score.lowest ?? "—"}{highlighted && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-white/80" />}</button></td>;
                })}
              </tr>
              {activeChildIndex >= 0 && <tr key={`${area.key}-details`} className="border-b border-[#DCE0EC] bg-[#FBFCFF]">
                <td colSpan={2} className="border-r border-[#E7E9F1] px-3 py-3 align-top"><p className="text-[12px] font-bold text-[#505B87]">{area.context} · {area.group.replaceAll("\n", " ")}</p><p className="mt-1 text-[11px] leading-5 text-[#7B84A7]">顯示已勾選分數的詳細項目；可直接選作訓練目標。</p></td>
                {childNames.map((name, childIndex) => <td key={childIndex} className="border-r border-[#E7E9F1] px-2 py-2 align-top last:border-r-0">{childIndex === activeChildIndex ? <div className="space-y-2">{area.items.filter((item) => { const score = ratings[goalKey(item.id, childIndex)]?.score; return score !== undefined && scoreFilter.has(score); }).map((item) => { const entry = ratings[goalKey(item.id, childIndex)]; const checked = selectedGoals.includes(goalKey(item.id, childIndex)); return <div key={item.id} className="rounded-lg border border-[#E2E5EF] bg-white p-2"><div className="flex gap-2"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[12px] font-extrabold ${entry?.score === undefined ? "border-[#E5E7EF] text-[#ADB3C6]" : quietRatingClass[entry.score]}`}>{entry?.score ?? "—"}</span><p className="min-w-0 flex-1 text-[12px] leading-5 font-semibold text-[#394264]"><ItemText text={item.text} /></p><button type="button" onClick={() => onToggleGoal(item.id, childIndex)} aria-pressed={checked} aria-label={`選擇 ${displayChildName(name, childIndex)} 的訓練目標：${item.text.split("\n")[0]}`} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${checked ? "border-[#6557DB] bg-[#6D5DFB] text-white" : "border-[#CBD0E1] bg-white text-transparent hover:border-[#6D5DFB]"}`}><Check className="h-3.5 w-3.5" /></button></div>{entry?.remark ? <p className="mt-2 border-t border-[#EEF0F6] pt-2 text-[11px] leading-4 text-[#737CA1]">備註：{entry.remark}</p> : null}</div>; })}{!area.items.some((item) => { const score = ratings[goalKey(item.id, childIndex)]?.score; return score !== undefined && scoreFilter.has(score); }) && <p className="rounded-lg border border-dashed border-[#D9DDEA] px-2 py-3 text-center text-[11px] text-[#949BB7]">沒有符合篩選的評分。</p>}</div> : null}</td>)}
              </tr>}
            </>;
          })}
        </tbody>
      </table>
    </div>
  </section>;
}

export default function AnalysisWorkspace({ ratingDate, childNames, items, ratings, selectedGoals, onToggleGoal, onBack, onExportExcel }: AnalysisWorkspaceProps) {
  const [scoreFilter, setScoreFilter] = useState<Set<Rating>>(new Set<Rating>([0, 1, 2]));
  const [expandedCell, setExpandedCell] = useState<string | null>(null);
  const areas = useMemo(() => buildAreaSummaries(items, childNames.length, ratings), [items, childNames.length, ratings]);
  const categories = useMemo(() => Array.from(new Set(areas.map((area) => area.category))), [areas]);
  const selectedItems = useMemo(() => selectedGoals.map((key) => { const [itemId, childIndex] = key.split("::"); return { item: items.find((item) => item.id === itemId), childIndex: Number(childIndex) }; }).filter((entry) => entry.item), [items, selectedGoals]);

  const toggleFilter = (score: Rating) => setScoreFilter((current) => { const next = new Set(current); if (next.has(score)) next.delete(score); else next.add(score); return next; });

  return <div className="min-h-screen bg-white text-[#20264A]">
    <header className="border-b border-[#E8E9F5] bg-white px-4 py-4 sm:px-7"><div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-3"><button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border border-[#D8DBEE] bg-white px-3 py-2 text-[13px] font-bold text-[#4B5482] transition hover:border-[#7D89FF] hover:bg-[#F6F7FF] active:scale-[0.98]"><ArrowLeft className="h-4 w-4" />返回評分表</button><div className="flex items-center gap-2 text-[12px] font-medium text-[#68709A]"><span>{ratingDate}</span><span className="h-4 w-px bg-[#D9DCEC]" /><span>{childNames.length} 位兒童</span></div></div></header>
    <main className="mx-auto max-w-[1700px] px-4 pb-10 pt-6 sm:px-7 sm:pt-8">
      <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#6D5DFB_0%,#9978FF_44%,#F96EA5_100%)] px-5 py-6 text-white shadow-[0_18px_44px_rgba(109,93,251,0.23)] sm:px-7 sm:py-7"><div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border-[22px] border-white/20" /><div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-[30px] font-bold tracking-tight sm:text-[38px]">各兒童表現分析</h1><p className="mt-2 max-w-2xl text-[15px] leading-6 text-white/88">按小範疇橫向比較每位兒童的最低分數；按格子展開每項評分並選擇訓練目標。</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[13px] font-bold text-[#5B50D8] transition hover:bg-[#F5F4FF] active:scale-[0.98]"><Printer className="h-4 w-4" />PDF 報告</button><button type="button" onClick={onExportExcel} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 text-[13px] font-bold text-white transition hover:bg-white/20 active:scale-[0.98]"><FileSpreadsheet className="h-4 w-4" />Excel 報告</button></div></div></section>
      <section className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#E7E8F3] bg-white p-4 shadow-[0_8px_24px_rgba(42,45,88,0.06)] sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-[13px] font-bold text-[#404A78]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EFFF] text-[#6D5DFB]"><Filter className="h-4 w-4" /></span>篩選展開項目的分數</div><div className="flex flex-wrap gap-2">{([0, 1, 2] as Rating[]).map((score) => <button key={score} type="button" onClick={() => toggleFilter(score)} aria-pressed={scoreFilter.has(score)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-bold transition ${scoreFilter.has(score) ? quietRatingClass[score] : "border-[#E4E6EF] bg-white text-[#A0A6BB]"}`}><span className={`flex h-4 w-4 items-center justify-center rounded border ${scoreFilter.has(score) ? ratingClass[score] : "border-[#C7CDDD] bg-white text-transparent"}`}><Check className="h-3 w-3" /></span>{score}</button>)}</div></section>
      {categories.map((category) => <OverviewTable key={category} category={category} areas={areas.filter((area) => area.category === category)} childNames={childNames} ratings={ratings} scoreFilter={scoreFilter} selectedGoals={selectedGoals} expandedCell={expandedCell} onExpand={(key) => setExpandedCell((current) => current === key ? null : key)} onToggleGoal={onToggleGoal} />)}
      <section className="mt-7 rounded-2xl border border-[#E0E3EF] bg-[#FCFCFF] p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-[12px] font-bold tracking-[0.11em] text-[#837CA9]">訓練目標</p><h2 className="mt-1 text-[20px] font-bold text-[#30395F]">已選訓練目標</h2></div><span className="rounded-lg bg-[#E9E7FF] px-3 py-2 text-[12px] font-bold text-[#5C50D5]">{selectedItems.length} 項</span></div>{selectedItems.length ? <div className="mt-4 grid gap-2 md:grid-cols-2">{selectedItems.map(({ item, childIndex }) => item ? <div key={`${item.id}-${childIndex}`} className="flex items-start gap-2 rounded-xl border border-[#E2E5EF] bg-white px-3 py-3"><span className="mt-0.5 text-[11px] font-bold text-[#715FE4]">{displayChildName(childNames[childIndex], childIndex)}</span><p className="flex-1 text-[13px] leading-5 font-semibold text-[#3B456A]"><ItemText text={item.text} /></p><button type="button" onClick={() => onToggleGoal(item.id, childIndex)} aria-label={`移除訓練目標：${item.text.split("\n")[0]}`} className="rounded-md border border-[#D7DBE8] p-1 text-[#8C94AD] transition hover:border-[#FF9AAA] hover:text-[#B63347]"><ChevronDown className="h-3.5 w-3.5 rotate-90" /></button></div> : null)}</div> : <p className="mt-3 text-[13px] text-[#838AAA]">按展開格子中的方框，即可加入個別兒童的訓練目標。</p>}</section>
    </main>
  </div>;
}
