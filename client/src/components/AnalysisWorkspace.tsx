/**
 * Design reminder — Bright Clinical Studio:
 * This is a comparison ledger, not a card stack. Expanded rating items and score capsules
 * occupy matching table rows; search clarifies the teacher's view without changing source data.
 */
import { ArrowLeft, Check, FileSpreadsheet, Filter, Printer, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

const scoreTone: Record<Rating, string> = {
  0: "border-[#F2B3BD] bg-[#FFF0F2] text-[#BA3A50]",
  1: "border-[#ECCD79] bg-[#FFF7D9] text-[#9A6800]",
  2: "border-[#9FD9BF] bg-[#EDFCF4] text-[#137D59]",
};

const filterTone: Record<Rating, string> = {
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
      const values = area.items
        .map((item) => ratings[goalKey(item.id, childIndex)]?.score)
        .filter((score): score is Rating => score !== undefined);
      if (!values.length) return { ratedCount: 0, needCount: 0 };
      const needCount = values.filter((score) => score === 0 || score === 1).length;
      return {
        lowest: Math.min(...values) as Rating,
        average: values.reduce<number>((total, score) => total + score, 0) / values.length,
        ratedCount: values.length,
        needCount,
        needPercentage: (needCount / values.length) * 100,
      };
    }),
  }));
}

function ItemText({ text }: { text: string }) {
  return <span className="whitespace-pre-line">{text}</span>;
}

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

function sectionKey(sectionId: string, context: string) {
  return `${sectionId}-${context.replace(/[^\w\u4e00-\u9fff]/g, "-")}`;
}

function normaliseSearch(value: string) {
  return cleanHeading(value).trim().toLocaleLowerCase();
}

function compactSearch(value: string) {
  return normaliseSearch(value).replace(/[\s,.;:!?，。；：！？、（）()「」『』【】\-_/]/g, "");
}

function isOrderedMatch(query: string, target: string) {
  let queryIndex = 0;
  for (const character of target) {
    if (character === query[queryIndex]) queryIndex += 1;
    if (queryIndex === query.length) return true;
  }
  return false;
}

function editDistance(left: string, right: string) {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let previous = row[0];
    row[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const stored = row[rightIndex];
      row[rightIndex] = Math.min(row[rightIndex] + 1, row[rightIndex - 1] + 1, previous + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1));
      previous = stored;
    }
  }
  return row[right.length];
}

function includesQuery(value: string, query: string) {
  if (!query) return true;
  const target = compactSearch(value);
  const compactQuery = compactSearch(query);
  if (!compactQuery || target.includes(compactQuery) || isOrderedMatch(compactQuery, target)) return true;
  if (compactQuery.length < 3) return false;
  const tolerance = compactQuery.length >= 6 ? 2 : 1;
  for (let start = 0; start < target.length; start += 1) {
    const candidate = target.slice(start, start + compactQuery.length);
    if (candidate.length === compactQuery.length && editDistance(compactQuery, candidate) <= tolerance) return true;
  }
  return false;
}

function areaMatchesQuery(area: SummaryArea, query: string) {
  return includesQuery(`${area.category} ${area.context} ${area.group}`, query)
    || area.items.some((item) => includesQuery(item.text, query));
}

function detailItemsFor(area: SummaryArea, query: string) {
  if (!query || includesQuery(`${area.category} ${area.context} ${area.group}`, query)) return area.items;
  return area.items.filter((item) => includesQuery(item.text, query));
}

function DetailScore({ item, childIndex, childName, entry, selected, visible, onToggleGoal }: {
  item: AnalysisItem;
  childIndex: number;
  childName: string;
  entry?: { score?: Rating; remark: string };
  selected: boolean;
  visible: boolean;
  onToggleGoal: (itemId: string, childIndex: number) => void;
}) {
  if (!visible || entry?.score === undefined) return <span className="block h-8 w-full rounded-full border border-transparent sm:h-9" />;
  return <button type="button" onClick={() => onToggleGoal(item.id, childIndex)} aria-pressed={selected} aria-label={`${selected ? "取消" : "選擇"}${displayChildName(childName, childIndex)} 的訓練目標：${item.text.split("\n")[0]}`} className={`grid h-8 w-full grid-cols-[1fr_auto_1fr] items-center rounded-full border px-2 text-[12px] font-extrabold transition active:scale-[0.97] sm:h-9 sm:text-[13px] ${scoreTone[entry.score]} ${selected ? "border-[4px] border-[#00C957] shadow-[0_0_0_4px_rgba(0,201,87,0.42),0_0_26px_rgba(0,201,87,0.82),inset_0_0_0_1px_rgba(0,124,52,0.45)" : ""}`}><span className="col-start-2">{entry.score}</span>{selected && <Check className="col-start-3 h-4 w-4 justify-self-end stroke-[4] text-[#00B94F] drop-shadow-[0_1px_0_rgba(255,255,255,0.98)] sm:h-5 sm:w-5" />}</button>;
}

type PrintScope = "goals" | "overview" | "complete";

const printScopeMeta: Record<PrintScope, { buttonLabel: string; printTitle: string }> = {
  goals: { buttonLabel: "只匯出訓練目標", printTitle: "已選訓練目標" },
  overview: { buttonLabel: "範疇總覽及訓練目標", printTitle: "範疇總覽及訓練目標" },
  complete: { buttonLabel: "完整評估及訓練目標", printTitle: "完整評估及訓練目標" },
};

type OverviewTableProps = {
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
  searchQuery: string;
  highlightedChildIndices: Set<number>;
};

function OverviewTable({ category, sectionId, areas, childNames, ratings, scoreFilter, selectedGoals, onToggleGoal, priorityKeys, expandedKeys, onToggleArea, searchQuery, highlightedChildIndices }: OverviewTableProps) {
  const contextRowSpans = useMemo(() => {
    const result = new Map<number, number>();
    areas.forEach((area, index) => {
      if (index && areas[index - 1].context === area.context) return;
      let rows = 0;
      let cursor = index;
      while (areas[cursor] && areas[cursor].context === area.context) {
        rows += 1 + (expandedKeys.has(areas[cursor].key) ? detailItemsFor(areas[cursor], searchQuery).length : 0);
        cursor += 1;
      }
      result.set(index, rows);
    });
    return result;
  }, [areas, expandedKeys, searchQuery]);

  const contextButtons = useMemo(() => areas
    .filter((area, index) => !index || areas[index - 1].context !== area.context)
    .map((area) => ({
      context: area.context,
      active: areas.filter((candidate) => candidate.context === area.context).some((candidate) => priorityKeys.some((keys) => keys.has(candidate.key))),
    })), [areas, priorityKeys]);

  return <section id={sectionId} className="analysis-category scroll-mt-5 mt-7">
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <p className="text-[12px] font-bold tracking-[0.11em] text-[#837CA9]">總覽</p>
      <h2 className="text-[22px] font-bold text-[#30395F]">{category}</h2>
      {contextButtons.map(({ context, active }) => <button key={context} type="button" onClick={() => document.getElementById(sectionKey(sectionId, context))?.scrollIntoView({ behavior: "smooth", block: "start" })} className={`rounded-lg border px-3 py-1.5 text-[12px] font-bold transition active:scale-[0.98] ${active ? "border-[#8B69ED] bg-[linear-gradient(100deg,#E9E4FF,#FCE4F2)] text-[#5646C5] shadow-[0_3px_8px_rgba(113,91,231,0.14)]" : "border-[#DDE0EC] bg-white text-[#667097] hover:bg-[#F7F7FC]"}`}>{context}</button>)}
    </div>
    <p className="mb-3 text-[12px] text-[#757FA6]">格內數字為小範疇平均分數，按分數格可展開詳細評分。各兒童最低的五個分數會以漸變色標示。</p>
    <div className="comparison-scroll overflow-x-auto rounded-2xl border border-[#E1E4EF] bg-white shadow-[0_8px_24px_rgba(42,45,88,0.06)]">
      <table className="w-full min-w-[356px] table-fixed border-collapse text-left sm:min-w-0">
        <thead className="bg-[#F7F8FE]">
          <tr>
            <th className="w-[48px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#57618B] sm:w-[80px] sm:px-2 sm:text-[12px] md:w-[68px]">類別</th>
            <th className="w-[96px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#57618B] sm:w-[144px] sm:px-2 sm:text-[12px] md:w-[360px]">小範疇</th>
            {childNames.map((name, index) => <th key={index} className={`w-[52px] border-b border-r border-[#E1E4EF] px-0.5 py-3 text-center last:border-r-0 sm:w-[78px] sm:px-1 md:w-[116px] ${highlightedChildIndices.has(index) ? "bg-[#E9FFF1] shadow-[inset_0_-3px_0_#20BF6B]" : ""}`}><p className="text-[8px] font-bold text-[#8A91B0] sm:text-[9px]">兒童 {index + 1}</p><p className="mt-0.5 truncate text-[10px] font-extrabold text-[#444F7A] sm:text-[12px]">{displayChildName(name, index)}</p></th>)}
          </tr>
        </thead>
        <tbody>{areas.map((area, index) => {
          const expanded = expandedKeys.has(area.key);
          const surface = index % 2 ? "bg-[#FAF9FF]" : "bg-white";
          const contextSpan = contextRowSpans.get(index);
          return <FragmentArea key={area.key} area={area} expanded={expanded} surface={surface} contextSpan={contextSpan} contextStart={contextSpan !== undefined} contextId={sectionKey(sectionId, area.context)} childNames={childNames} ratings={ratings} scoreFilter={scoreFilter} selectedGoals={selectedGoals} onToggleGoal={onToggleGoal} priorityKeys={priorityKeys} onToggleArea={onToggleArea} searchQuery={searchQuery} />;
        })}</tbody>
      </table>
    </div>
  </section>;
}

type FragmentAreaProps = {
  area: SummaryArea;
  expanded: boolean;
  surface: string;
  contextSpan?: number;
  contextStart: boolean;
  contextId: string;
  childNames: string[];
  ratings: AnalysisRatingData;
  scoreFilter: Set<Rating>;
  selectedGoals: string[];
  onToggleGoal: (itemId: string, childIndex: number) => void;
  priorityKeys: Set<string>[];
  onToggleArea: (key: string) => void;
  searchQuery: string;
};

function FragmentArea({ area, expanded, surface, contextSpan, contextStart, contextId, childNames, ratings, scoreFilter, selectedGoals, onToggleGoal, priorityKeys, onToggleArea, searchQuery }: FragmentAreaProps) {
  const detailItems = detailItemsFor(area, searchQuery);
  return <>
    <tr id={contextStart ? contextId : undefined} className={`border-b border-[#E7E9F1] align-top ${surface}`}>
      {contextStart && contextSpan ? <td rowSpan={contextSpan} className={`border-r border-[#E7E9F1] px-1 py-3 align-top text-[9px] font-bold leading-4 text-[#59638E] sm:px-2 sm:text-[12px] ${surface}`}><span className="line-clamp-5">{cleanHeading(area.context)}</span></td> : null}
      <th scope="row" className="border-r border-[#E7E9F1] px-1 py-3 text-left align-top"><p className="text-[10px] font-bold leading-4 text-[#30395F] sm:text-[13px]"><span className="line-clamp-3">{cleanHeading(area.group)}</span></p></th>
      {childNames.map((name, childIndex) => {
        const summary = area.scores[childIndex];
        return <td key={childIndex} className="border-r border-[#E7E9F1] p-1 text-center align-top last:border-r-0"><button type="button" onClick={() => onToggleArea(area.key)} aria-expanded={expanded} aria-label={`${expanded ? "收合" : "展開"}${displayChildName(name, childIndex)} 的 ${cleanHeading(area.group)} 詳細評分`} className={`flex h-9 w-full items-center justify-center rounded-lg border px-0.5 text-[11px] font-extrabold transition active:scale-[0.97] sm:h-10 sm:text-[13px] ${meanClass(priorityKeys[childIndex].has(area.key), summary.average)}`}>{summary.average === undefined ? "—" : summary.average.toFixed(2)}</button></td>;
      })}
    </tr>
    {expanded && detailItems.map((item, itemIndex) => <tr id={`analysis-item-${item.id}`} key={item.id} className={`analysis-detail-row border-b border-[#E7E9F1] ${surface}`}>
      <td className="border-r border-[#E7E9F1] px-1 py-1.5 sm:px-2"><div className="flex min-h-8 items-center gap-1.5 rounded-lg border border-[#DED9FF] bg-[#F1F0FF] px-1.5 py-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)] sm:min-h-9 sm:px-2"><span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7465E9] text-[9px] font-bold text-white">{itemIndex + 1}</span><p className="text-[10px] font-semibold leading-4 text-[#433D83] sm:text-[12px]"><ItemText text={item.text} /></p></div></td>
      {childNames.map((name, childIndex) => {
        const entry = ratings[goalKey(item.id, childIndex)];
        const selected = selectedGoals.includes(goalKey(item.id, childIndex));
        const visible = entry?.score !== undefined && scoreFilter.has(entry.score);
        return <td key={childIndex} className="border-r border-[#E7E9F1] p-1 align-middle text-center last:border-r-0"><DetailScore item={item} childIndex={childIndex} childName={name} entry={entry} selected={selected} visible={visible} onToggleGoal={onToggleGoal} /></td>;
      })}
    </tr>)}
  </>;
}

function SelectedGoalsTable({ selectedGoalItems, childNames, selectedGoals, onToggleGoal, onJumpToItem }: { selectedGoalItems: AnalysisItem[]; childNames: string[]; selectedGoals: string[]; onToggleGoal: (itemId: string, childIndex: number) => void; onJumpToItem: (itemId: string) => void; }) {
  const contextSpans = useMemo(() => spansFor(selectedGoalItems, (left, right) => left.context === right.context), [selectedGoalItems]);
  const groupSpans = useMemo(() => spansFor(selectedGoalItems, (left, right) => left.context === right.context && left.group === right.group), [selectedGoalItems]);
  const rowTone = useMemo(() => {
    const result = new Map<string, boolean>();
    let groupNumber = -1;
    selectedGoalItems.forEach((item, index) => {
      const previous = selectedGoalItems[index - 1];
      if (!previous || previous.context !== item.context || previous.group !== item.group) groupNumber += 1;
      result.set(item.id, groupNumber % 2 === 1);
    });
    return result;
  }, [selectedGoalItems]);

  return <div className="comparison-scroll mt-4 overflow-x-auto rounded-xl border border-[#E1E4EF] bg-white"><table className="w-full min-w-[356px] table-fixed border-collapse text-left sm:min-w-0"><thead className="bg-[#F6F6FD]"><tr><th className="w-[50px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#59638E] sm:w-[88px] sm:px-2 sm:text-[12px]">類別</th><th className="w-[68px] border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#59638E] sm:w-[118px] sm:px-2 sm:text-[12px]">小範疇</th><th className="border-b border-r border-[#E1E4EF] px-1 py-3 text-[9px] font-bold text-[#59638E] sm:px-2 sm:text-[12px]">訓練目標</th>{childNames.map((name, childIndex) => <th key={childIndex} className="w-[40px] border-b border-r border-[#E1E4EF] px-0.5 py-3 text-center text-[8px] font-bold text-[#59638E] last:border-r-0 sm:w-[62px] sm:text-[11px]"><span className="block truncate">{displayChildName(name, childIndex)}</span></th>)}</tr></thead><tbody>{selectedGoalItems.map((item, index) => { const surface = rowTone.get(item.id) ? "bg-[#FAF9FF]" : "bg-white"; const contextSpan = contextSpans.get(index); const groupSpan = groupSpans.get(index); return <tr key={item.id} className={`border-b border-[#EDF0F6] last:border-b-0 ${surface}`}>{contextSpan ? <td rowSpan={contextSpan} className={`border-r border-[#E7E9F1] px-1 py-3 align-top text-[9px] font-bold leading-4 text-[#59638E] sm:px-2 sm:text-[12px] sm:leading-5 ${surface}`}>{cleanHeading(item.context)}</td> : null}{groupSpan ? <td rowSpan={groupSpan} className={`border-r border-[#E7E9F1] px-1 py-3 align-top text-[9px] font-bold leading-4 text-[#59638E] sm:px-2 sm:text-[12px] sm:leading-5 ${surface}`}>{cleanHeading(item.group)}</td> : null}<th scope="row" className="border-r border-[#E7E9F1] p-0 text-left"><button type="button" onClick={() => onJumpToItem(item.id)} className="w-full px-1 py-3 text-left text-[10px] font-semibold leading-4 text-[#384263] transition hover:bg-[#F1F0FF] hover:text-[#584DCC] sm:px-2 sm:text-[13px] sm:leading-5"><ItemText text={item.text} /></button></th>{childNames.map((name, childIndex) => { const selected = selectedGoals.includes(goalKey(item.id, childIndex)); return <td key={childIndex} className="border-r border-[#E7E9F1] p-0.5 text-center last:border-r-0"><button type="button" onClick={() => onToggleGoal(item.id, childIndex)} aria-pressed={selected} aria-label={`${selected ? "移除" : "選擇"}${displayChildName(name, childIndex)} 的訓練目標：${item.text.split("\n")[0]}`} className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition active:scale-[0.94] sm:h-7 sm:w-7 ${selected ? "bg-[#2AA876] text-white shadow-[0_3px_8px_rgba(42,168,118,0.26)]" : "bg-transparent text-transparent hover:bg-[#ECFAF4] hover:text-[#2AA876]"}`}><Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></button></td>; })}</tr>; })}</tbody></table></div>;
}

export default function AnalysisWorkspace({ ratingDate, childNames, items, ratings, selectedGoals, onToggleGoal, onClearGoals, onBack, onExportExcel }: Props) {
  const [scoreFilter, setScoreFilter] = useState<Set<Rating>>(new Set<Rating>([0, 1, 2]));
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [printScope, setPrintScope] = useState<PrintScope>("complete");
  const [pendingPrintScope, setPendingPrintScope] = useState<PrintScope | null>(null);
  const areas = useMemo(() => buildAreaSummaries(items, childNames.length, ratings), [items, childNames.length, ratings]);
  const searchQuery = normaliseSearch(searchTerm);
  const highlightedChildIndices = useMemo(() => new Set(childNames.map((name, index) => ({ name: displayChildName(name, index), index })).filter(({ name }) => includesQuery(name, searchQuery) && Boolean(searchQuery)).map(({ index }) => index)), [childNames, searchQuery]);
  const searchTargetsChildren = highlightedChildIndices.size > 0;
  const visibleAreas = useMemo(() => !searchQuery || searchTargetsChildren ? areas : areas.filter((area) => areaMatchesQuery(area, searchQuery)), [areas, searchQuery, searchTargetsChildren]);
  const categories = useMemo(() => Array.from(new Set(visibleAreas.map((area) => area.category))), [visibleAreas]);
  const priorityKeys = useMemo(() => childNames.map((_, childIndex) => {
    const ranked = areas
      .filter((area) => area.scores[childIndex].average !== undefined)
      .sort((left, right) => (left.scores[childIndex].average ?? Infinity) - (right.scores[childIndex].average ?? Infinity));
    const threshold = ranked[Math.min(4, ranked.length - 1)]?.scores[childIndex].average;
    return new Set(ranked.filter((area) => threshold !== undefined && (area.scores[childIndex].average ?? Infinity) <= threshold).map((area) => area.key));
  }), [areas, childNames]);
  const itemAreaKey = useMemo(() => new Map(areas.flatMap((area) => area.items.map((item) => [item.id, area.key] as const))), [areas]);
  const selectedGoalItems = useMemo(() => items.filter((item) => childNames.some((_, childIndex) => selectedGoals.includes(goalKey(item.id, childIndex)))), [items, childNames, selectedGoals]);

  useEffect(() => {
    if (!searchQuery || searchTargetsChildren) return;
    setExpandedKeys((current) => new Set(Array.from(current).concat(visibleAreas.map((area) => area.key))));
  }, [searchQuery, searchTargetsChildren, visibleAreas]);

  const toggleFilter = (score: Rating) => setScoreFilter((current) => {
    const next = new Set(current);
    if (next.has(score)) next.delete(score);
    else next.add(score);
    return next;
  });
  const toggleArea = (key: string) => setExpandedKeys((current) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });
  const jumpToItem = (itemId: string) => {
    const areaKey = itemAreaKey.get(itemId);
    if (!areaKey) return;
    setExpandedKeys((current) => new Set(Array.from(current).concat(areaKey)));
    window.setTimeout(() => document.getElementById(`analysis-item-${itemId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 90);
  };
  const startPdfExport = (scope: PrintScope) => {
    setPrintScope(scope);
    setPendingPrintScope(scope);
  };

  useEffect(() => {
    if (!pendingPrintScope) return;
    const printTimer = window.setTimeout(() => {
      window.print();
      setPendingPrintScope(null);
    }, 120);
    return () => window.clearTimeout(printTimer);
  }, [pendingPrintScope, printScope]);

  return <div className={`analysis-print-root print-scope-${printScope} min-h-screen bg-white text-[#20264A]`}>
    <header className="border-b border-[#E8E9F5] bg-white px-4 py-4 sm:px-7"><div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-3"><button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border border-[#D8DBEE] bg-white px-3 py-2 text-[13px] font-bold text-[#4B5482] transition hover:border-[#7D89FF] hover:bg-[#F6F7FF] active:scale-[0.98]"><ArrowLeft className="h-4 w-4" />返回評分表</button><div className="flex items-center gap-2 text-[12px] font-medium text-[#68709A]"><span>{ratingDate}</span><span className="h-4 w-px bg-[#D9DCEC]" /><span>{childNames.length} 位兒童</span></div></div></header>
    <main className="mx-auto max-w-[1700px] px-3 pb-10 pt-5 sm:px-6 sm:pt-8">
      <section className="analysis-hero relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#6D5DFB_0%,#9978FF_44%,#F96EA5_100%)] px-5 py-6 text-white shadow-[0_18px_44px_rgba(109,93,251,0.23)] sm:px-7 sm:py-7"><div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border-[22px] border-white/20" /><div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><h1 className="text-[30px] font-bold tracking-tight sm:text-[38px]"><span className="screen-analysis-title">各兒童表現分析</span><span className="print-analysis-title">{printScopeMeta[printScope].printTitle}</span></h1><div className="analysis-export-actions flex flex-wrap gap-2"><div className="analysis-pdf-actions flex flex-wrap gap-2"><p className="w-full text-[11px] font-bold tracking-[0.08em] text-white/85">PDF 匯出範圍</p>{(Object.keys(printScopeMeta) as PrintScope[]).map((scope) => <button key={scope} type="button" onClick={() => startPdfExport(scope)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-3 text-[12px] font-bold text-[#5B50D8] transition hover:bg-[#F5F4FF] active:scale-[0.98]"><Printer className="h-4 w-4" />{printScopeMeta[scope].buttonLabel}</button>)}</div><button type="button" onClick={onExportExcel} className="inline-flex h-10 items-center gap-2 self-end rounded-xl border border-white bg-white px-4 text-[13px] font-bold text-[#5B50D8] transition hover:bg-[#F5F4FF] active:scale-[0.98]"><FileSpreadsheet className="h-4 w-4" />Excel 報告</button></div></div></section>
      <section className="analysis-controls mt-5 grid gap-4 rounded-2xl border border-[#E7E8F3] bg-white p-4 shadow-[0_8px_24px_rgba(42,45,88,0.06)] lg:grid-cols-[minmax(280px,1fr)_auto] lg:items-center">
        <div className="min-w-0"><label className="flex h-11 items-center gap-2 rounded-xl border border-[#DDE0EE] bg-[#FBFBFF] px-3 text-[#6973A0] focus-within:border-[#7A69E8] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#EAE7FF]"><Search className="h-4 w-4 shrink-0 text-[#6D5DFB]" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="搜尋評分項目或兒童名稱" aria-label="搜尋評分項目或兒童名稱" className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[#30395F] outline-none placeholder:text-[#9DA4BE]" />{searchTerm && <button type="button" onClick={() => setSearchTerm("")} aria-label="清除搜尋" className="rounded-md p-1 text-[#7A83A7] transition hover:bg-[#EFEEFF] hover:text-[#5B50D8]"><X className="h-4 w-4" /></button>}</label>{searchQuery && <p className="mt-1.5 text-[11px] font-medium text-[#6973A0]">{searchTargetsChildren ? `已標示符合「${searchTerm}」的兒童欄位。` : `顯示包含「${searchTerm}」的評分項目及小範疇。`}</p>}</div>
        <div><div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-[#404A78]"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F0EFFF] text-[#6D5DFB]"><Filter className="h-3.5 w-3.5" /></span>篩選展開項目的分數</div><div className="flex flex-wrap gap-2">{([0, 1, 2] as Rating[]).map((score) => <button key={score} type="button" onClick={() => toggleFilter(score)} aria-pressed={scoreFilter.has(score)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-bold transition ${scoreFilter.has(score) ? scoreTone[score] : "border-[#E4E6EF] bg-white text-[#A0A6BB]"}`}><span className={`flex h-4 w-4 items-center justify-center rounded border ${scoreFilter.has(score) ? filterTone[score] : "border-[#C7CDDD] bg-white text-transparent"}`}><Check className="h-3 w-3" /></span>{score}</button>)}</div></div>
      </section>
      {categories.length ? categories.map((category, index) => <OverviewTable key={category} category={category} sectionId={`analysis-category-${index}`} areas={visibleAreas.filter((area) => area.category === category)} childNames={childNames} ratings={ratings} scoreFilter={scoreFilter} selectedGoals={selectedGoals} onToggleGoal={onToggleGoal} priorityKeys={priorityKeys} expandedKeys={expandedKeys} onToggleArea={toggleArea} searchQuery={searchTargetsChildren ? "" : searchQuery} highlightedChildIndices={highlightedChildIndices} />) : <section className="mt-7 rounded-2xl border border-dashed border-[#D9DDF0] bg-[#FBFBFF] px-5 py-12 text-center"><Search className="mx-auto h-7 w-7 text-[#8A81DD]" /><p className="mt-3 text-[15px] font-bold text-[#44507B]">找不到符合的評分項目</p><p className="mt-1 text-[13px] text-[#7C85A5]">請嘗試另一個關鍵字，或清除搜尋後再次查看完整表格。</p></section>}
      <section className="analysis-goals mt-7 rounded-2xl border border-[#E0E3EF] bg-[#FCFCFF] p-3 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[12px] font-bold tracking-[0.11em] text-[#837CA9]">訓練目標</p><h2 className="mt-1 text-[20px] font-bold text-[#30395F]">已選訓練目標</h2></div><div className="flex items-center gap-2"><span className="rounded-lg bg-[#E9E7FF] px-3 py-2 text-[12px] font-bold text-[#5C50D5]">{selectedGoals.length} 項</span><button type="button" disabled={!selectedGoals.length} onClick={onClearGoals} className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2A4B8] bg-white px-3 py-2 text-[12px] font-bold text-[#B44768] transition enabled:hover:bg-[#FFF5F8] disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw className="h-3.5 w-3.5" />清除全部</button></div></div>{selectedGoalItems.length ? <SelectedGoalsTable selectedGoalItems={selectedGoalItems} childNames={childNames} selectedGoals={selectedGoals} onToggleGoal={onToggleGoal} onJumpToItem={jumpToItem} /> : <p className="mt-3 text-[13px] text-[#838AAA]">在上方展開的小範疇內按圓形分數格，即可加入個別兒童的訓練目標。</p>}</section>
    </main>
  </div>;
}
