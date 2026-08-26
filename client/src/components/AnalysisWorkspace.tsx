/**
 * Design reminder — Bright Clinical Studio:
 * Analysis is a responsive, fixed-row comparison ledger. Child columns stay visible first;
 * only each child's five lowest sub-area means use the energetic violet-to-pink priority mark.
 */
import { ArrowLeft, Check, FileSpreadsheet, Filter, Printer } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";

export type Rating = 0 | 1 | 2;

export type AnalysisItem = { id: string; text: string; category: string; context: string; group: string };
export type AnalysisRatingData = Record<string, { score?: Rating; remark: string }>;
export type AreaScore = { lowest?: Rating; average?: number; ratedCount: number; needCount: number; needPercentage?: number };
export type SummaryArea = { key: string; category: string; context: string; group: string; items: AnalysisItem[]; scores: AreaScore[] };

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
    const existing = grouped.get(key);
    if (existing) existing.items.push(item);
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
function meanTone(isPriority: boolean, mean: number | undefined) {
  if (mean === undefined) return "border-[#E5E7EF] bg-white text-[#B0B5C8]";
  return isPriority
    ? "border-[#7B62F1] bg-[linear-gradient(118deg,#705AF0_0%,#A578FF_49%,#F069A9_100%)] text-white shadow-[0_5px_12px_rgba(110,83,225,0.28)]"
    : "border-[#E0E3EF] bg-white text-[#535E88] hover:border-[#B1A9F2]";
}

function OverviewTable({ category, areas, childNames, ratings, scoreFilter, selectedGoals, onToggleGoal, lowestMeanAreaKeys }: {
  category: string;
  areas: SummaryArea[];
  childNames: string[];
  ratings: AnalysisRatingData;
  scoreFilter: Set<Rating>;
  selectedGoals: string[];
  onToggleGoal: (itemId: string, childIndex: number) => void;
  lowestMeanAreaKeys: Set<string>[];
}) {
  const [expandedAreaKeys, setExpandedAreaKeys] = useState<Set<string>>(new Set());
  const toggleArea = (areaKey: string) => setExpandedAreaKeys((current) => {
    const next = new Set(current);
    if (next.has(areaKey)) next.delete(areaKey); else next.add(areaKey);
    return next;
  });

  return <section className="mt-7">
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div><p className="text-[12px] font-bold tracking-[0.11em] text-[#837CA9]">總覽</p><h2 className="mt-1 text-[22px] font-bold text-[#30395F]">{category}</h2></div>
      <p className="text-[12px] text-[#757FA6]">格內數字為小範疇平均分數；按分數格可展開詳細評分，最低五個平均分數以漸變色標示。</p>
    </div>
    <div className="comparison-scroll overflow-x-auto rounded-2xl border border-[#E1E4EF] bg-white shadow-[0_8px_24px_rgba(42,45,88,0.06)]">
      <table className="w-full min-w-[356px] table-fixed border-collapse text-left sm:min-w-0">
        <thead className="bg-[#F7F8FE]"><tr>
          <th className="w-[48px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#57618B] sm:w-[80px] sm:px-2 sm:text-[12px]">大類別</th>
          <th className="w-[96px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#57618B] sm:w-[144px] sm:px-2 sm:text-[12px]">小範疇</th>
          {childNames.map((name, index) => <th key={index} className="w-[52px] border-b border-r border-[#E1E4EF] px-0.5 py-3 text-center last:border-r-0 sm:w-[78px] sm:px-1"><p className="text-[8px] font-bold text-[#8A91B0] sm:text-[9px]">兒童 {index + 1}</p><p className="mt-0.5 truncate text-[10px] font-extrabold text-[#444F7A] sm:text-[12px]">{displayChildName(name, index)}</p></th>)}
        </tr></thead>
        <tbody>{areas.map((area, areaIndex) => { const expanded = expandedAreaKeys.has(area.key); const rowTone = areaIndex % 2 === 0 ? "bg-white" : "bg-[#FAF9FF]"; return <Fragment key={area.key}>
          <tr id={`analysis-area-${area.key}`} className={`border-b border-[#E7E9F1] align-stretch ${rowTone}`}>
            <td className="border-r border-[#E7E9F1] px-1 py-3 text-[9px] font-bold leading-4 text-[#59638E] sm:px-2 sm:text-[12px]"><span className="line-clamp-3">{cleanHeading(area.context)}</span></td>
            <th scope="row" className="border-r border-[#E7E9F1] px-1 py-3 text-left text-[10px] font-bold leading-4 text-[#30395F] sm:px-2 sm:text-[13px]"><span className="line-clamp-3">{cleanHeading(area.group)}</span></th>
            {childNames.map((name, childIndex) => { const score = area.scores[childIndex]; return <td key={childIndex} className="border-r border-[#E7E9F1] p-0.5 text-center last:border-r-0 sm:p-1"><button type="button" onClick={() => toggleArea(area.key)} aria-expanded={expanded} aria-label={`${expanded ? "收合" : "展開"}${displayChildName(name, childIndex)} 的 ${cleanHeading(area.group)} 詳細評分`} className={`flex min-h-9 w-full items-center justify-center rounded-md border px-0.5 text-center text-[11px] font-extrabold transition active:scale-[0.97] sm:min-h-10 sm:rounded-lg sm:text-[13px] ${meanTone(lowestMeanAreaKeys[childIndex].has(area.key), score.average)}`}>{score.average === undefined ? "—" : score.average.toFixed(2)}</button></td>; })}
          </tr>
          {expanded && area.items.map((item, itemIndex) => <tr id={`analysis-item-${item.id}`} key={item.id} className={`border-b border-[#E7E9F1] last:border-b-0 ${rowTone}`}>
            <td colSpan={2} className="border-r border-[#E7E9F1] px-1 py-2 align-top sm:px-2"><div className="flex gap-1.5"><span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F0EFFF] text-[9px] font-bold text-[#6557DB] sm:h-5 sm:w-5 sm:text-[10px]">{itemIndex + 1}</span><p className="text-[10px] leading-4 font-semibold text-[#394264] sm:text-[13px] sm:leading-5"><ItemText text={item.text} /></p></div></td>
            {childNames.map((name, childIndex) => { const entry = ratings[goalKey(item.id, childIndex)]; const visible = entry?.score !== undefined && scoreFilter.has(entry.score); const selected = selectedGoals.includes(goalKey(item.id, childIndex)); return <td key={childIndex} className="border-r border-[#E7E9F1] p-0.5 align-middle text-center last:border-r-0 sm:p-1"><button type="button" disabled={!visible} onClick={() => onToggleGoal(item.id, childIndex)} aria-pressed={selected} aria-label={`${selected ? "取消" : "選擇"}${displayChildName(name, childIndex)} 的訓練目標：${item.text.split("\n")[0]}`} className={visible ? `flex min-h-8 w-full items-center justify-center gap-1 rounded-md border text-[10px] font-extrabold transition active:scale-[0.94] sm:min-h-9 sm:text-[12px] ${selected ? "border-[3px] border-[#14945C] bg-[#D8F7E7] text-[#087044] shadow-[inset_0_0_0_999px_rgba(38,191,111,0.16),0_0_0_2px_rgba(20,148,92,0.16)]" : quietRatingClass[entry.score as Rating]}` : "invisible min-h-8 w-full rounded-md border sm:min-h-9"}>{selected ? <><span>{entry?.score}</span><Check className="h-3.5 w-3.5 stroke-[3] sm:h-4 sm:w-4" /></> : entry?.score ?? "—"}</button></td>; })}
          </tr>)}
        </Fragment>; })}</tbody>
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
  const groupSpans = useMemo(() => {
    const spans = new Map<number, number>();
    selectedGoalItems.forEach((item, index) => { const previous = selectedGoalItems[index - 1]; if (!previous || previous.context !== item.context || previous.group !== item.group) { let span = 1; while (selectedGoalItems[index + span] && selectedGoalItems[index + span].context === item.context && selectedGoalItems[index + span].group === item.group) span += 1; spans.set(index, span); } });
    return spans;
  }, [selectedGoalItems]);
  const groupToneByItem = useMemo(() => {
    const tones = new Map<string, boolean>(); let groupIndex = -1;
    selectedGoalItems.forEach((item, index) => { const previous = selectedGoalItems[index - 1]; if (!previous || previous.context !== item.context || previous.group !== item.group) groupIndex += 1; tones.set(item.id, groupIndex % 2 === 1); });
    return tones;
  }, [selectedGoalItems]);
  return <div className="comparison-scroll mt-4 overflow-x-auto rounded-xl border border-[#E1E4EF] bg-white"><table className="w-full min-w-[356px] table-fixed border-collapse text-left sm:min-w-0"><thead className="bg-[#F6F6FD]"><tr><th className="w-[60px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#59638E] sm:w-[108px] sm:px-2 sm:text-[12px]">範疇</th><th className="border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#59638E] sm:px-2 sm:text-[12px]">訓練目標</th>{childNames.map((name, childIndex) => <th key={childIndex} className="w-[40px] border-b border-r border-[#E1E4EF] px-0.5 py-3 text-center text-[8px] font-bold text-[#59638E] last:border-r-0 sm:w-[62px] sm:text-[11px]"><span className="block truncate">{displayChildName(name, childIndex)}</span></th>)}</tr></thead><tbody>{selectedGoalItems.map((item, index) => { const span = groupSpans.get(index); const rowTone = groupToneByItem.get(item.id) ? "bg-[#FAF9FF]" : "bg-white"; return <tr key={item.id} className={`border-b border-[#EDF0F6] last:border-b-0 ${rowTone}`}>{span ? <td rowSpan={span} className={`border-r border-[#E7E9F1] px-1 py-3 align-top text-[9px] font-bold leading-4 text-[#59638E] sm:px-2 sm:text-[12px] sm:leading-5 ${rowTone}`}>{cleanHeading(item.context)}<br /><span className="text-[#9A91D4]">—</span><br />{cleanHeading(item.group)}</td> : null}<th scope="row" className="border-r border-[#E7E9F1] p-0 text-left"><button type="button" onClick={() => onJumpToItem(item.id)} className="w-full px-1 py-3 text-left text-[10px] leading-4 font-semibold text-[#384263] transition hover:bg-[#F5F4FF] hover:text-[#584DCC] sm:px-2 sm:text-[13px] sm:leading-5"><ItemText text={item.text} /></button></th>{childNames.map((name, childIndex) => { const selected = selectedGoals.includes(goalKey(item.id, childIndex)); return <td key={childIndex} className="border-r border-[#E7E9F1] p-0.5 text-center last:border-r-0"><button type="button" onClick={() => onToggleGoal(item.id, childIndex)} aria-pressed={selected} aria-label={`${selected ? "移除" : "選擇"}${displayChildName(name, childIndex)} 的訓練目標：${item.text.split("\n")[0]}`} className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition active:scale-[0.94] sm:h-7 sm:w-7 ${selected ? "bg-[#2AA876] text-white shadow-[0_3px_8px_rgba(42,168,118,0.26)]" : "bg-transparent text-transparent hover:bg-[#ECFAF4] hover:text-[#2AA876]"}`}><Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></button></td>; })}</tr>; })}</tbody></table></div>;
}

export default function AnalysisWorkspace({ ratingDate, childNames, items, ratings, selectedGoals, onToggleGoal, onBack, onExportExcel }: AnalysisWorkspaceProps) {
  const [scoreFilter, setScoreFilter] = useState<Set<Rating>>(new Set<Rating>([0, 1, 2]));
  const [goalItemsSeen, setGoalItemsSeen] = useState<string[]>([]);
  const areas = useMemo(() => buildAreaSummaries(items, childNames.length, ratings), [items, childNames.length, ratings]);
  const categories = useMemo(() => Array.from(new Set(areas.map((area) => area.category))), [areas]);
  const lowestMeanAreaKeys = useMemo(() => childNames.map((_, childIndex) => new Set(
    areas.filter((area) => area.scores[childIndex].average !== undefined)
      .sort((left, right) => (left.scores[childIndex].average ?? Infinity) - (right.scores[childIndex].average ?? Infinity))
      .slice(0, 5).map((area) => area.key),
  )), [areas, childNames]);
  useEffect(() => { setGoalItemsSeen((current) => Array.from(new Set([...current, ...selectedGoals.map((key) => key.split("::")[0])]))); }, [selectedGoals]);
  const selectedGoalItems = useMemo(() => items.filter((item) => goalItemsSeen.includes(item.id) || childNames.some((_, childIndex) => selectedGoals.includes(goalKey(item.id, childIndex)))), [items, childNames, goalItemsSeen, selectedGoals]);
  const toggleFilter = (score: Rating) => setScoreFilter((current) => { const next = new Set(current); if (next.has(score)) next.delete(score); else next.add(score); return next; });
  const jumpToItem = (itemId: string) => document.getElementById(`analysis-item-${itemId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });

  return <div className="min-h-screen bg-white text-[#20264A]">
    <header className="border-b border-[#E8E9F5] bg-white px-4 py-4 sm:px-7"><div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-3"><button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border border-[#D8DBEE] bg-white px-3 py-2 text-[13px] font-bold text-[#4B5482] transition hover:border-[#7D89FF] hover:bg-[#F6F7FF] active:scale-[0.98]"><ArrowLeft className="h-4 w-4" />返回評分表</button><div className="flex items-center gap-2 text-[12px] font-medium text-[#68709A]"><span>{ratingDate}</span><span className="h-4 w-px bg-[#D9DCEC]" /><span>{childNames.length} 位兒童</span></div></div></header>
    <main className="mx-auto max-w-[1700px] px-3 pb-10 pt-5 sm:px-6 sm:pt-8"><section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#6D5DFB_0%,#9978FF_44%,#F96EA5_100%)] px-5 py-6 text-white shadow-[0_18px_44px_rgba(109,93,251,0.23)] sm:px-7 sm:py-7"><div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border-[22px] border-white/20" /><div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-[30px] font-bold tracking-tight sm:text-[38px]">各兒童表現分析</h1><p className="mt-2 max-w-2xl text-[15px] leading-6 text-white/88">所有評分項目固定排列，方便橫向比較；每位兒童最低五個小範疇平均分數以漸變色標示。</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[13px] font-bold text-[#5B50D8] transition hover:bg-[#F5F4FF] active:scale-[0.98]"><Printer className="h-4 w-4" />PDF 報告</button><button type="button" onClick={onExportExcel} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 text-[13px] font-bold text-white transition hover:bg-white/20 active:scale-[0.98]"><FileSpreadsheet className="h-4 w-4" />Excel 報告</button></div></div></section>
      <section className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#E7E8F3] bg-white p-4 shadow-[0_8px_24px_rgba(42,45,88,0.06)] sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-[13px] font-bold text-[#404A78]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EFFF] text-[#6D5DFB]"><Filter className="h-4 w-4" /></span>篩選固定項目的分數</div><div className="flex flex-wrap gap-2">{([0, 1, 2] as Rating[]).map((score) => <button key={score} type="button" onClick={() => toggleFilter(score)} aria-pressed={scoreFilter.has(score)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-bold transition ${scoreFilter.has(score) ? quietRatingClass[score] : "border-[#E4E6EF] bg-white text-[#A0A6BB]"}`}><span className={`flex h-4 w-4 items-center justify-center rounded border ${scoreFilter.has(score) ? filterClass[score] : "border-[#C7CDDD] bg-white text-transparent"}`}><Check className="h-3 w-3" /></span>{score}</button>)}</div></section>
      {categories.map((category) => <OverviewTable key={category} category={category} areas={areas.filter((area) => area.category === category)} childNames={childNames} ratings={ratings} scoreFilter={scoreFilter} selectedGoals={selectedGoals} onToggleGoal={onToggleGoal} lowestMeanAreaKeys={lowestMeanAreaKeys} />)}
      <section className="mt-7 rounded-2xl border border-[#E0E3EF] bg-[#FCFCFF] p-3 sm:p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-[12px] font-bold tracking-[0.11em] text-[#837CA9]">訓練目標</p><h2 className="mt-1 text-[20px] font-bold text-[#30395F]">已選訓練目標</h2></div><span className="rounded-lg bg-[#E9E7FF] px-3 py-2 text-[12px] font-bold text-[#5C50D5]">{selectedGoals.length} 項</span></div>{selectedGoalItems.length ? <SelectedGoalsTable selectedGoalItems={selectedGoalItems} childNames={childNames} selectedGoals={selectedGoals} onToggleGoal={onToggleGoal} onJumpToItem={jumpToItem} /> : <p className="mt-3 text-[13px] text-[#838AAA]">直接在上方固定評分列的綠色方格，加入個別兒童的訓練目標。</p>}</section>
    </main>
  </div>;
}
