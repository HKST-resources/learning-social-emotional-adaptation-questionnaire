/**
 * Design reminder — Bright Clinical Studio:
 * Mean grids form a compact comparison ledger. Only means at or below each child's tied
 * fifth-lowest entered score use the violet-to-pink priority gradient; detail rows are nested
 * below the level-three area so horizontal comparison remains stable.
 */
import { ArrowLeft, Check, FileSpreadsheet, Filter, Printer, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

export type Rating = 0 | 1 | 2;
export type AnalysisItem = { id: string; text: string; category: string; context: string; group: string };
export type AnalysisRatingData = Record<string, { score?: Rating; remark: string }>;
export type AreaScore = { lowest?: Rating; average?: number; ratedCount: number; needCount: number; needPercentage?: number };
export type SummaryArea = { key: string; category: string; context: string; group: string; items: AnalysisItem[]; scores: AreaScore[] };

type Props = {
  ratingDate: string;
  childNames: string[];
  items: AnalysisItem[];
  ratings: AnalysisRatingData;
  selectedGoals: string[];
  onToggleGoal: (itemId: string, childIndex: number) => void;
  onClearGoals: () => void;
  onBack: () => void;
  onExportExcel: () => void;
};

const quietRatingClass: Record<Rating, string> = {
  0: "border-[#FFD0D6] bg-[#FFF5F6] text-[#B63347]",
  1: "border-[#FFE6A0] bg-[#FFF9E7] text-[#986300]",
  2: "border-[#B8EFD6] bg-[#F0FFF8] text-[#117D5A]",
};
const filterClass: Record<Rating, string> = {
  0: "border-[#FF9AAA] bg-[#FF637C] text-white",
  1: "border-[#F4C334] bg-[#FFB91F] text-white",
  2: "border-[#34C990] bg-[#34C990] text-white",
};

export const goalKey = (itemId: string, childIndex: number) => `${itemId}::${childIndex}`;
export const displayChildName = (name: string, index: number) => name.trim() || `兒童 ${index + 1}`;
export const cleanHeading = (text: string) => text.replace(/[\r\n]/g, "");

export function buildAreaSummaries(items: AnalysisItem[], childCount: number, ratings: AnalysisRatingData): SummaryArea[] {
  const grouped = new Map<string, Omit<SummaryArea, "scores">>();
  items.forEach((item) => {
    const key = `${item.category}::${item.context}::${item.group}`;
    const current = grouped.get(key);
    if (current) current.items.push(item);
    else grouped.set(key, { key, category: item.category, context: item.context, group: item.group, items: [item] });
  });
  return Array.from(grouped.values()).map((area) => ({
    ...area,
    scores: Array.from({ length: childCount }, (_, childIndex) => {
      const values = area.items.map((item) => ratings[goalKey(item.id, childIndex)]?.score).filter((score): score is Rating => score !== undefined);
      if (!values.length) return { ratedCount: 0, needCount: 0 };
      const needCount = values.filter((score) => score === 0 || score === 1).length;
      return { lowest: Math.min(...values) as Rating, average: values.reduce<number>((total, score) => total + score, 0) / values.length, ratedCount: values.length, needCount, needPercentage: (needCount / values.length) * 100 };
    }),
  }));
}

function ItemText({ text }: { text: string }) { return <span className="whitespace-pre-line">{text}</span>; }
function meanClass(priority: boolean, mean: number | undefined) {
  if (mean === undefined) return "border-[#E5E7EF] bg-white text-[#B0B5C8]";
  return priority
    ? "border-[#7B62F1] bg-[linear-gradient(118deg,#705AF0_0%,#A578FF_49%,#F069A9_100%)] text-white shadow-[0_5px_12px_rgba(110,83,225,0.28)]"
    : "border-[#E0E3EF] bg-white text-[#535E88] hover:border-[#B1A9F2]";
}
function spansFor<T>(rows: T[], equal: (left: T, right: T) => boolean) {
  const result = new Map<number, number>();
  rows.forEach((row, index) => {
    if (index && equal(rows[index - 1], row)) return;
    let count = 1;
    while (rows[index + count] && equal(row, rows[index + count])) count += 1;
    result.set(index, count);
  });
  return result;
}

function OverviewTable({ category, sectionId, areas, childNames, ratings, scoreFilter, selectedGoals, onToggleGoal, priorityKeys, expandedKeys, onToggleArea }: {
  category: string;
  sectionId: string;
  areas: SummaryArea[];
  childNames: string[];
  ratings: AnalysisRatingData;
  scoreFilter: Set<Rating>;
  selectedGoals: string[];
  onToggleGoal: (itemId: string, childIndex: number) => void;
  priorityKeys: Set<string>[];
  expandedKeys: Set<string>;
  onToggleArea: (key: string) => void;
}) {
  const contextSpans = useMemo(() => spansFor(areas, (left, right) => left.context === right.context), [areas]);
  return <section id={sectionId} className="scroll-mt-5 mt-7">
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div><p className="text-[12px] font-bold tracking-[0.11em] text-[#837CA9]">總覽</p><h2 className="mt-1 text-[22px] font-bold text-[#30395F]">{category}</h2></div>
      <p className="text-[12px] text-[#757FA6]">格內數字為小範疇平均分數；按分數格可展開詳細評分。第五個最低分數如有同分，一併以漸變色標示。</p>
    </div>
    <div className="comparison-scroll overflow-x-auto rounded-2xl border border-[#E1E4EF] bg-white shadow-[0_8px_24px_rgba(42,45,88,0.06)]">
      <table className="w-full min-w-[356px] table-fixed border-collapse text-left sm:min-w-0">
        <thead className="bg-[#F7F8FE]"><tr>
          <th className="w-[48px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#57618B] sm:w-[80px] sm:px-2 sm:text-[12px]">類別</th>
          <th className="w-[96px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#57618B] sm:w-[144px] sm:px-2 sm:text-[12px]">小範疇</th>
          {childNames.map((name, index) => <th key={index} className="w-[52px] border-b border-r border-[#E1E4EF] px-0.5 py-3 text-center last:border-r-0 sm:w-[78px] sm:px-1"><p className="text-[8px] font-bold text-[#8A91B0] sm:text-[9px]">兒童 {index + 1}</p><p className="mt-0.5 truncate text-[10px] font-extrabold text-[#444F7A] sm:text-[12px]">{displayChildName(name, index)}</p></th>)}
        </tr></thead>
        <tbody>{areas.map((area, index) => {
          const expanded = expandedKeys.has(area.key);
          const rowTone = index % 2 ? "bg-[#FAF9FF]" : "bg-white";
          const contextSpan = contextSpans.get(index);
          return <tr id={`analysis-area-${area.key}`} key={area.key} className={`border-b border-[#E7E9F1] align-top ${rowTone}`}>
            {contextSpan ? <td rowSpan={contextSpan} className={`border-r border-[#E7E9F1] px-1 py-3 align-top text-[9px] font-bold leading-4 text-[#59638E] sm:px-2 sm:text-[12px] ${rowTone}`}><span className="line-clamp-5">{cleanHeading(area.context)}</span></td> : null}
            <th scope="row" className="border-r border-[#E7E9F1] px-1 py-3 text-left align-top"><p className="text-[10px] font-bold leading-4 text-[#30395F] sm:text-[13px]"><span className="line-clamp-3">{cleanHeading(area.group)}</span></p>{expanded && <div className="mt-2 space-y-1.5 border-l-2 border-[#CFC8FF] pl-1.5 sm:pl-2">{area.items.map((item, itemIndex) => <div id={`analysis-item-${item.id}`} key={item.id} className="rounded-md border border-[#E0DCFF] bg-[#F1F0FF] px-1.5 py-1.5 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)] sm:px-2"><div className="flex gap-1.5"><span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7465E9] text-[9px] font-bold text-white">{itemIndex + 1}</span><p className="text-[10px] font-semibold leading-4 text-[#433D83] sm:text-[12px]"><ItemText text={item.text} /></p></div></div>)}</div>}</th>
            {childNames.map((name, childIndex) => { const summary = area.scores[childIndex]; return <td key={childIndex} className="border-r border-[#E7E9F1] p-0.5 text-center align-top last:border-r-0 sm:p-1"><button type="button" onClick={() => onToggleArea(area.key)} aria-expanded={expanded} aria-label={`${expanded ? "收合" : "展開"}${displayChildName(name, childIndex)} 的 ${cleanHeading(area.group)} 詳細評分`} className={`flex min-h-9 w-full items-center justify-center rounded-md border px-0.5 text-[11px] font-extrabold transition active:scale-[0.97] sm:min-h-10 sm:rounded-lg sm:text-[13px] ${meanClass(priorityKeys[childIndex].has(area.key), summary.average)}`}>{summary.average === undefined ? "—" : summary.average.toFixed(2)}</button>{expanded && <div className="mt-2 space-y-1.5">{area.items.map((item) => { const entry = ratings[goalKey(item.id, childIndex)]; const visible = entry?.score !== undefined && scoreFilter.has(entry.score); const selected = selectedGoals.includes(goalKey(item.id, childIndex)); return <div key={item.id} className="flex h-[34px] items-center justify-center rounded-md border border-[#E0DCFF] bg-[#F1F0FF] sm:h-[38px]"><button type="button" disabled={!visible} onClick={() => onToggleGoal(item.id, childIndex)} aria-pressed={selected} aria-label={`${selected ? "取消" : "選擇"}${displayChildName(name, childIndex)} 的訓練目標：${item.text.split("\n")[0]}`} className={visible ? `flex h-7 w-7 items-center justify-center gap-0.5 rounded-full border text-[10px] font-extrabold transition active:scale-[0.92] sm:h-8 sm:w-8 sm:text-[11px] ${selected ? "border-[3px] border-[#14945C] bg-[#D8F7E7] text-[#087044] shadow-[0_0_0_2px_rgba(20,148,92,0.16)]" : quietRatingClass[entry.score as Rating]}` : "invisible h-7 w-7 rounded-full border sm:h-8 sm:w-8"}>{selected ? <><span>{entry?.score}</span><Check className="h-3 w-3 stroke-[3]" /></> : entry?.score ?? "—"}</button></div>; })}</div>}</td>; })}
          </tr>;
        })}</tbody>
      </table>
    </div>
  </section>;
}

function SelectedGoalsTable({ selectedGoalItems, childNames, selectedGoals, onToggleGoal, onJumpToItem }: {
  selectedGoalItems: AnalysisItem[];
  childNames: string[];
  selectedGoals: string[];
  onToggleGoal: (itemId: string, childIndex: number) => void;
  onJumpToItem: (itemId: string) => void;
}) {
  const contextSpans = useMemo(() => spansFor(selectedGoalItems, (left, right) => left.context === right.context), [selectedGoalItems]);
  const groupSpans = useMemo(() => spansFor(selectedGoalItems, (left, right) => left.context === right.context && left.group === right.group), [selectedGoalItems]);
  const rowTone = useMemo(() => { const result = new Map<string, boolean>(); let groupNumber = -1; selectedGoalItems.forEach((item, index) => { const previous = selectedGoalItems[index - 1]; if (!previous || previous.context !== item.context || previous.group !== item.group) groupNumber += 1; result.set(item.id, groupNumber % 2 === 1); }); return result; }, [selectedGoalItems]);
  return <div className="comparison-scroll mt-4 overflow-x-auto rounded-xl border border-[#E1E4EF] bg-white"><table className="w-full min-w-[356px] table-fixed border-collapse text-left sm:min-w-0"><thead className="bg-[#F6F6FD]"><tr><th className="w-[50px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#59638E] sm:w-[88px] sm:px-2 sm:text-[12px]">類別</th><th className="w-[68px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#59638E] sm:w-[118px] sm:px-2 sm:text-[12px]">小範疇</th><th className="border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#59638E] sm:px-2 sm:text-[12px]">訓練目標</th>{childNames.map((name, childIndex) => <th key={childIndex} className="w-[40px] border-b border-r border-[#E1E4EF] px-0.5 py-3 text-center text-[8px] font-bold text-[#59638E] last:border-r-0 sm:w-[62px] sm:text-[11px]"><span className="block truncate">{displayChildName(name, childIndex)}</span></th>)}</tr></thead><tbody>{selectedGoalItems.map((item, index) => { const surface = rowTone.get(item.id) ? "bg-[#FAF9FF]" : "bg-white"; const contextSpan = contextSpans.get(index); const groupSpan = groupSpans.get(index); return <tr key={item.id} className={`border-b border-[#EDF0F6] last:border-b-0 ${surface}`}>{contextSpan ? <td rowSpan={contextSpan} className={`border-r border-[#E7E9F1] px-1 py-3 align-top text-[9px] font-bold leading-4 text-[#59638E] sm:px-2 sm:text-[12px] sm:leading-5 ${surface}`}>{cleanHeading(item.context)}</td> : null}{groupSpan ? <td rowSpan={groupSpan} className={`border-r border-[#E7E9F1] px-1 py-3 align-top text-[9px] font-bold leading-4 text-[#59638E] sm:px-2 sm:text-[12px] sm:leading-5 ${surface}`}>{cleanHeading(item.group)}</td> : null}<th scope="row" className="border-r border-[#E7E9F1] p-0 text-left"><button type="button" onClick={() => onJumpToItem(item.id)} className="w-full px-1 py-3 text-left text-[10px] leading-4 font-semibold text-[#384263] transition hover:bg-[#F1F0FF] hover:text-[#584DCC] sm:px-2 sm:text-[13px] sm:leading-5"><ItemText text={item.text} /></button></th>{childNames.map((name, childIndex) => { const selected = selectedGoals.includes(goalKey(item.id, childIndex)); return <td key={childIndex} className="border-r border-[#E7E9F1] p-0.5 text-center last:border-r-0"><button type="button" onClick={() => onToggleGoal(item.id, childIndex)} aria-pressed={selected} aria-label={`${selected ? "移除" : "選擇"}${displayChildName(name, childIndex)} 的訓練目標：${item.text.split("\n")[0]}`} className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition active:scale-[0.94] sm:h-7 sm:w-7 ${selected ? "bg-[#2AA876] text-white shadow-[0_3px_8px_rgba(42,168,118,0.26)]" : "bg-transparent text-transparent hover:bg-[#ECFAF4] hover:text-[#2AA876]"}`}><Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></button></td>; })}</tr>; })}</tbody></table></div>;
}

export default function AnalysisWorkspace({ ratingDate, childNames, items, ratings, selectedGoals, onToggleGoal, onClearGoals, onBack, onExportExcel }: Props) {
  const [scoreFilter, setScoreFilter] = useState<Set<Rating>>(new Set<Rating>([0, 1, 2]));
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const areas = useMemo(() => buildAreaSummaries(items, childNames.length, ratings), [items, childNames.length, ratings]);
  const categories = useMemo(() => Array.from(new Set(areas.map((area) => area.category))), [areas]);
  const priorityKeys = useMemo(() => childNames.map((_, childIndex) => {
    const ranked = areas.filter((area) => area.scores[childIndex].average !== undefined).sort((left, right) => (left.scores[childIndex].average ?? Infinity) - (right.scores[childIndex].average ?? Infinity));
    const threshold = ranked[Math.min(4, ranked.length - 1)]?.scores[childIndex].average;
    return new Set(ranked.filter((area) => threshold !== undefined && (area.scores[childIndex].average ?? Infinity) <= threshold).map((area) => area.key));
  }), [areas, childNames]);
  const highlightedCategories = useMemo(() => new Set(categories.filter((category) => areas.filter((area) => area.category === category).some((area) => childNames.some((_, childIndex) => priorityKeys[childIndex].has(area.key))))), [areas, categories, childNames, priorityKeys]);
  const itemAreaKey = useMemo(() => new Map(areas.flatMap((area) => area.items.map((item) => [item.id, area.key] as const))), [areas]);
  const selectedGoalItems = useMemo(() => items.filter((item) => childNames.some((_, childIndex) => selectedGoals.includes(goalKey(item.id, childIndex)))), [items, childNames, selectedGoals]);
  const toggleFilter = (score: Rating) => setScoreFilter((current) => { const next = new Set(current); if (next.has(score)) next.delete(score); else next.add(score); return next; });
  const toggleArea = (key: string) => setExpandedKeys((current) => { const next = new Set(current); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  const jumpToItem = (itemId: string) => { const areaKey = itemAreaKey.get(itemId); if (!areaKey) return; setExpandedKeys((current) => new Set(Array.from(current).concat(areaKey))); window.setTimeout(() => document.getElementById(`analysis-item-${itemId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 90); };
  return <div className="min-h-screen bg-white text-[#20264A]">
    <header className="border-b border-[#E8E9F5] bg-white px-4 py-4 sm:px-7"><div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-3"><button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border border-[#D8DBEE] bg-white px-3 py-2 text-[13px] font-bold text-[#4B5482] transition hover:border-[#7D89FF] hover:bg-[#F6F7FF] active:scale-[0.98]"><ArrowLeft className="h-4 w-4" />返回評分表</button><div className="flex items-center gap-2 text-[12px] font-medium text-[#68709A]"><span>{ratingDate}</span><span className="h-4 w-px bg-[#D9DCEC]" /><span>{childNames.length} 位兒童</span></div></div></header>
    <main className="mx-auto max-w-[1700px] px-3 pb-10 pt-5 sm:px-6 sm:pt-8"><section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#6D5DFB_0%,#9978FF_44%,#F96EA5_100%)] px-5 py-6 text-white shadow-[0_18px_44px_rgba(109,93,251,0.23)] sm:px-7 sm:py-7"><div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border-[22px] border-white/20" /><div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-[30px] font-bold tracking-tight sm:text-[38px]">各兒童表現分析</h1><p className="mt-2 max-w-2xl text-[15px] leading-6 text-white/88">每位兒童第五個最低平均分數如有同分，所有同分格均以漸變色標示。</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[13px] font-bold text-[#5B50D8] transition hover:bg-[#F5F4FF] active:scale-[0.98]"><Printer className="h-4 w-4" />PDF 報告</button><button type="button" onClick={onExportExcel} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 text-[13px] font-bold text-white transition hover:bg-white/20 active:scale-[0.98]"><FileSpreadsheet className="h-4 w-4" />Excel 報告</button></div></div></section>
      <section className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#E7E8F3] bg-white p-4 shadow-[0_8px_24px_rgba(42,45,88,0.06)] sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-[13px] font-bold text-[#404A78]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EFFF] text-[#6D5DFB]"><Filter className="h-4 w-4" /></span>篩選展開項目的分數</div><div className="flex flex-wrap gap-2">{([0, 1, 2] as Rating[]).map((score) => <button key={score} type="button" onClick={() => toggleFilter(score)} aria-pressed={scoreFilter.has(score)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-bold transition ${scoreFilter.has(score) ? quietRatingClass[score] : "border-[#E4E6EF] bg-white text-[#A0A6BB]"}`}><span className={`flex h-4 w-4 items-center justify-center rounded border ${scoreFilter.has(score) ? filterClass[score] : "border-[#C7CDDD] bg-white text-transparent"}`}><Check className="h-3 w-3" /></span>{score}</button>)}</div></section>
      <nav className="mt-4 flex flex-wrap items-center gap-2"><span className="text-[12px] font-bold text-[#7079A2]">快速前往</span>{categories.map((category, index) => { const active = highlightedCategories.has(category); return <button key={category} type="button" onClick={() => document.getElementById(`analysis-category-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" })} className={`rounded-lg border px-3 py-2 text-[12px] font-bold transition active:scale-[0.98] ${active ? "border-[#8B69ED] bg-[linear-gradient(100deg,#E9E4FF,#FCE4F2)] text-[#5646C5] shadow-[0_3px_8px_rgba(113,91,231,0.14)]" : "border-[#E1E3EF] bg-white text-[#667097] hover:bg-[#F7F7FC]"}`}>{category}</button>; })}</nav>
      {categories.map((category, index) => <OverviewTable key={category} category={category} sectionId={`analysis-category-${index}`} areas={areas.filter((area) => area.category === category)} childNames={childNames} ratings={ratings} scoreFilter={scoreFilter} selectedGoals={selectedGoals} onToggleGoal={onToggleGoal} priorityKeys={priorityKeys} expandedKeys={expandedKeys} onToggleArea={toggleArea} />)}
      <section className="mt-7 rounded-2xl border border-[#E0E3EF] bg-[#FCFCFF] p-3 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[12px] font-bold tracking-[0.11em] text-[#837CA9]">訓練目標</p><h2 className="mt-1 text-[20px] font-bold text-[#30395F]">已選訓練目標</h2></div><div className="flex items-center gap-2"><span className="rounded-lg bg-[#E9E7FF] px-3 py-2 text-[12px] font-bold text-[#5C50D5]">{selectedGoals.length} 項</span><button type="button" disabled={!selectedGoals.length} onClick={onClearGoals} className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2A4B8] bg-white px-3 py-2 text-[12px] font-bold text-[#B44768] transition enabled:hover:bg-[#FFF5F8] disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw className="h-3.5 w-3.5" />清除全部</button></div></div>{selectedGoalItems.length ? <SelectedGoalsTable selectedGoalItems={selectedGoalItems} childNames={childNames} selectedGoals={selectedGoals} onToggleGoal={onToggleGoal} onJumpToItem={jumpToItem} /> : <p className="mt-3 text-[13px] text-[#838AAA]">在上方展開的小範疇內按圓形分數格，即可加入個別兒童的訓練目標。</p>}</section>
    </main>
  </div>;
}
