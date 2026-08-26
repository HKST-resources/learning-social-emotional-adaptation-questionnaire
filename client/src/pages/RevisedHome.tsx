/**
 * Design reminder — Bright Clinical Studio:
 * A white, energetic, item-first assessment workspace. Rainbow gradients guide navigation
 * and decisions; the assessment text remains visually dominant at every screen size.
 */
import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { ArrowRight, CalendarDays, FileSpreadsheet, RotateCcw, Sparkles, Upload, UsersRound } from "lucide-react";
import { toast } from "sonner";
import AnalysisWorkspace from "@/components/AnalysisWorkspace";
import { allItems, childLabel, entryKey, questionnaire, type Rating, type RatingData, type ItemWithContext, scoreText } from "./Home";

type View = "setup" | "assessment" | "analysis";

const todayDmy = () => {
  const date = new Date();
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const normaliseDate = (value: string) => {
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return value;
  return `${match[1].padStart(2, "0")}/${match[2].padStart(2, "0")}/${match[3]}`;
};

function ItemText({ text }: { text: string }) {
  return <span className="whitespace-pre-line">{text}</span>;
}

function RatingButtons({ score, onChange }: { score?: Rating; onChange: (score: Rating) => void }) {
  const styles: Record<Rating, string> = {
    0: "border-[#FFB4B4] bg-[#FFF5F5] text-[#B63347] data-[active=true]:bg-[#FF637C] data-[active=true]:text-white data-[active=true]:border-[#FF637C]",
    1: "border-[#FFD45B] bg-[#FFF9E7] text-[#986300] data-[active=true]:bg-[#FFB91F] data-[active=true]:text-white data-[active=true]:border-[#FFB91F]",
    2: "border-[#84E3BF] bg-[#F0FFF8] text-[#117D5A] data-[active=true]:bg-[#34C990] data-[active=true]:text-white data-[active=true]:border-[#34C990]",
  };
  return <div className="grid grid-cols-3 gap-0.5" aria-label="學生表現評分">{([0, 1, 2] as Rating[]).map((option) => <button key={option} type="button" onClick={() => onChange(option)} data-active={score === option} className={`h-7 rounded-md border text-[11px] font-extrabold transition active:scale-[0.95] ${styles[option]}`} aria-pressed={score === option} aria-label={`${option}：${scoreText(option)}`}>{option}</button>)}</div>;
}

function MatrixRows({ section, sectionIndex, childNames, ratings, onScore, onRemark }: { section: typeof questionnaire[number]; sectionIndex: number; childNames: string[]; ratings: RatingData; onScore: (itemId: string, childIndex: number, score: Rating) => void; onRemark: (itemId: string, childIndex: number, remark: string) => void }) {
  return <>
    <tr id={`section-${sectionIndex}`} className="scroll-mt-28"><th colSpan={childNames.length + 1} className="border-y border-[#C9C5FF] bg-[linear-gradient(90deg,#F1EFFF_0%,#F8F7FF_100%)] px-4 py-2.5 text-left text-[15px] font-extrabold text-[#5145C7]">{section.title}</th></tr>
    {section.contexts.map((context) => <>
      <tr key={`${section.title}-${context.title}`}><th colSpan={childNames.length + 1} className="border-b border-[#E8E9F3] bg-[#FBFBFF] px-4 py-2 text-left text-[13px] font-bold text-[#69719D]">» {context.title}</th></tr>
      {context.groups.map((group) => group.items.map((item, itemIndex) => <tr key={item.id} className="border-b border-[#F0F0F6] align-top hover:bg-[#FEFEFF]">
        <th scope="row" className="sticky left-0 z-10 border-r border-[#E8E9F3] bg-white px-3 py-2 text-left">
          <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-2.5">
            {itemIndex === 0 ? <p className="whitespace-pre-line text-[11px] leading-4 font-bold text-[#7A82A9]">{group.title}</p> : <span />}
            <div className="flex gap-2"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F0EFFF] text-[10px] font-bold text-[#6557DB]">{itemIndex + 1}</span><p className="text-[15px] leading-6 font-semibold text-[#323A61] sm:text-[16px]"><ItemText text={item.text} /></p></div>
          </div>
        </th>
        {childNames.map((_, childIndex) => { const entry = ratings[entryKey(item.id, childIndex)]; return <td key={childIndex} className="border-r border-[#F0F0F6] p-1.5 last:border-r-0"><RatingButtons score={entry?.score} onChange={(score) => onScore(item.id, childIndex, score)} /><textarea value={entry?.remark ?? ""} onChange={(event) => onRemark(item.id, childIndex, event.target.value)} aria-label={`兒童 ${childIndex + 1} 對「${item.text.split("\n")[0]}」的備註`} placeholder="備註" rows={1} className="mt-1 block h-9 w-full resize-y rounded-md border border-[#E2E4F0] bg-[#FBFBFD] px-1.5 py-1 text-[10px] leading-3.5 text-[#596188] outline-none placeholder:text-[#B3B7CD] focus:border-[#8275FF] focus:bg-white" /></td>; })}
      </tr>))}
    </>)}</>;
}

export default function RevisedHome() {
  const [view, setView] = useState<View>("setup");
  const [ratingDate, setRatingDate] = useState(todayDmy);
  const [groupSize, setGroupSize] = useState(3);
  const [childNames, setChildNames] = useState(["", "", ""]);
  const [ratings, setRatings] = useState<RatingData>({});
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const importInput = useRef<HTMLInputElement>(null);

  const individualAnalysis = useMemo(() => childNames.map((name, childIndex) => ({ name: childLabel(name, childIndex), groups: ([0, 1, 2] as Rating[]).map((score) => ({ score, items: allItems.filter((item) => ratings[entryKey(item.id, childIndex)]?.score === score) })) })), [childNames, ratings]);

  const handleGroupSizeChange = (value: number) => {
    const nextSize = Math.max(1, Math.min(8, value || 1));
    setGroupSize(nextSize);
    setChildNames((previous) => Array.from({ length: nextSize }, (_, index) => previous[index] ?? ""));
  };

  const updateRating = (itemId: string, childIndex: number, score: Rating) => setRatings((previous) => ({ ...previous, [entryKey(itemId, childIndex)]: { score, remark: previous[entryKey(itemId, childIndex)]?.remark ?? "" } }));
  const updateRemark = (itemId: string, childIndex: number, remark: string) => setRatings((previous) => ({ ...previous, [entryKey(itemId, childIndex)]: { score: previous[entryKey(itemId, childIndex)]?.score, remark } }));

  const beginAssessment = () => { setRatings({}); setSelectedGoals([]); setView("assessment"); };
  const backToSetup = () => { setRatings({}); setSelectedGoals([]); setView("setup"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openAnalysis = () => { if (!Object.values(ratings).some((entry) => entry.score !== undefined)) { toast.error("請先為最少一個項目評分，再進行分析。", { position: "top-center" }); return; } setView("analysis"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const toggleGoal = (itemId: string, childIndex: number) => { const key = entryKey(itemId, childIndex); setSelectedGoals((previous) => previous.includes(key) ? previous.filter((id) => id !== key) : [...previous, key]); };

  const exportExcel = () => {
    const assessmentRows = allItems.flatMap((item) => childNames.map((name, childIndex) => { const entry = ratings[entryKey(item.id, childIndex)]; return { item_id: item.id, 評估日期: ratingDate, 兒童索引: childIndex + 1, 兒童姓名: childLabel(name, childIndex), 大範疇: item.category, 範疇: item.context, 小範疇: item.group.replaceAll("\n", " "), 項目: item.text, 分數: entry?.score ?? "", 備註: entry?.remark ?? "" }; }));
    const goalsRows = selectedGoals.map((key) => { const [itemId, childIndexText] = key.split("::"); const childIndex = Number(childIndexText); const item = allItems.find((entry) => entry.id === itemId); return item ? { 評估日期: ratingDate, 兒童姓名: childLabel(childNames[childIndex], childIndex), 項目: item.text, 分數: ratings[key]?.score ?? "", 備註: ratings[key]?.remark ?? "" } : null; }).filter(Boolean);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(assessmentRows), "評分紀錄");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(goalsRows.length ? goalsRows : [{ 已選個別目標: "尚未選擇" }]), "已選個別目標");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([{ 說明: "此 Excel 可於網站首頁按「匯入舊 Excel 報告」重新開啟，並在此基礎上更新評分。" }]), "匯入說明");
    XLSX.writeFile(workbook, `學習社交及情緒適應問卷_${ratingDate.replaceAll("/", "-")}.xlsx`);
  };

  const importExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets["評分紀錄"];
      if (!sheet) throw new Error("missing compatible sheet");
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const compatible = rows.filter((row) => typeof row.item_id === "string" && typeof row["兒童索引"] !== "undefined");
      if (!compatible.length) throw new Error("missing compatible rows");
      const maxChild = Math.max(...compatible.map((row) => Number(row["兒童索引"]) || 1));
      const nextNames = Array.from({ length: maxChild }, (_, index) => { const row = compatible.find((entry) => Number(entry["兒童索引"]) === index + 1); return String(row?.["兒童姓名"] ?? ""); });
      const nextRatings: RatingData = {};
      compatible.forEach((row) => { const rawScore = row["分數"]; const score = Number(rawScore); const childIndex = (Number(row["兒童索引"]) || 1) - 1; if (rawScore !== "" && rawScore !== null && rawScore !== undefined && [0, 1, 2].includes(score)) nextRatings[entryKey(String(row.item_id), childIndex)] = { score: score as Rating, remark: String(row["備註"] ?? "") }; });
      setGroupSize(maxChild); setChildNames(nextNames); setRatings(nextRatings); setRatingDate(String(compatible[0]["評估日期"] || todayDmy())); setSelectedGoals([]); setView("assessment");
      toast.success("已匯入之前的 Excel 評分紀錄。", { position: "top-center" });
    } catch { toast.error("未能讀取此 Excel。請使用本網站匯出的「評分紀錄」工作表。", { position: "top-center" }); }
    event.target.value = "";
  };

  if (view === "analysis") return <><div className="screen-ui"><AnalysisWorkspace ratingDate={ratingDate} childNames={childNames} individualAnalysis={individualAnalysis} selectedGoals={selectedGoals} onToggleGoal={toggleGoal} onBack={() => setView("assessment")} onExportExcel={exportExcel} /></div><PrintableAnalysis ratingDate={ratingDate} childNames={childNames} ratings={ratings} selectedGoals={selectedGoals} /></>;

  if (view === "setup") return <main className="screen-ui min-h-screen bg-white px-4 py-5 sm:px-8 lg:px-12"><section className="mx-auto grid min-h-[calc(100vh-40px)] max-w-[1280px] overflow-hidden rounded-[28px] border border-[#E6E8F2] bg-white shadow-[0_24px_70px_rgba(81,67,195,0.10)] lg:grid-cols-[0.9fr_1.1fr]"><div className="relative overflow-hidden bg-[linear-gradient(140deg,#6556E8_0%,#9F75FF_48%,#FF76AB_100%)] p-7 text-white sm:p-11"><div className="absolute -left-10 -top-14 h-56 w-56 rounded-full border-[32px] border-white/15" /><div className="absolute -bottom-14 right-8 h-52 w-52 rounded-full border-[28px] border-white/15" /><div className="relative flex h-full flex-col justify-between"><div><img src="/manus-storage/clinical-compass-logo_8198f6f6.png" alt="兒童發展觀察標誌" className="h-16 w-16 rounded-2xl bg-white/92 p-2 shadow-[0_9px_24px_rgba(47,30,148,0.22)]" /><h1 className="mt-8 max-w-md text-[34px] leading-[1.25] font-bold tracking-tight sm:text-[46px]">學習、社交及情緒適應問卷</h1><p className="mt-5 max-w-md text-[17px] leading-8 text-white/92">先設定日期與人數，再完成每位兒童的評分與備註。</p></div></div></div><section className="flex flex-col justify-center p-7 sm:p-11"><div className="max-w-xl"><h2 className="text-[29px] font-bold text-[#333D69] sm:text-[35px]">先建立評估表</h2><div className="mt-8 grid gap-5 sm:grid-cols-[1fr_142px]"><label><span className="mb-2 flex items-center gap-2 text-[14px] font-bold text-[#555F8D]"><CalendarDays className="h-4 w-4 text-[#7466ED]" />評估日期</span><input value={ratingDate} onChange={(event) => setRatingDate(event.target.value)} onBlur={(event) => setRatingDate(normaliseDate(event.target.value))} placeholder="DD/MM/YYYY" className="bright-input h-12 w-full px-3 text-[16px]" /></label><label><span className="mb-2 flex items-center gap-2 text-[14px] font-bold text-[#555F8D]"><UsersRound className="h-4 w-4 text-[#7466ED]" />兒童人數</span><input value={groupSize} onChange={(event) => handleGroupSizeChange(Number(event.target.value))} min={1} max={8} type="number" className="bright-input h-12 w-full px-3 text-[16px]" /></label></div><div className="mt-7"><p className="mb-3 text-[14px] font-bold text-[#555F8D]">兒童姓名</p><div className="grid gap-3 sm:grid-cols-2">{childNames.map((name, index) => <label key={index} className="relative"><span className="absolute left-3 top-3 text-[11px] font-bold text-[#877AE4]">{index + 1}</span><input value={name} onChange={(event) => setChildNames((previous) => previous.map((childName, childIndex) => childIndex === index ? event.target.value : childName))} placeholder={`兒童 ${index + 1} 姓名`} className="bright-input h-11 w-full pl-8 pr-3 text-[15px]" /></label>)}</div></div><div className="mt-9 flex flex-wrap gap-3"><button type="button" onClick={beginAssessment} className="inline-flex h-12 items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#6859E8,#9875FF)] px-5 text-[14px] font-bold text-white shadow-[0_8px_0_#4D40C6] transition hover:brightness-105 active:translate-y-[2px] active:scale-[0.98] active:shadow-[0_5px_0_#4D40C6]">建立評估表<ArrowRight className="h-4 w-4" /></button><button type="button" onClick={() => importInput.current?.click()} className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#DCD9FF] bg-[#F7F6FF] px-4 text-[14px] font-bold text-[#6255D3] transition hover:bg-[#EFEDFF] active:scale-[0.98]"><Upload className="h-4 w-4" />匯入舊 Excel 報告</button><input ref={importInput} type="file" accept=".xlsx,.xls" onChange={importExcel} className="hidden" /></div></div></section></section></main>;

  return <main className="screen-ui min-h-screen bg-white pb-8 text-[#273054]"><header className="sticky top-0 z-40 border-b border-[#E9EAF2] bg-white/95 px-3 py-3 backdrop-blur sm:px-6"><div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><img src="/manus-storage/clinical-compass-logo_8198f6f6.png" alt="兒童發展觀察標誌" className="h-10 w-10 rounded-xl bg-[#F2F0FF] p-1.5" /><div><h1 className="text-[18px] font-extrabold text-[#36406A]">學習、社交及情緒適應問卷</h1><p className="text-[12px] text-[#7E86A8]">{ratingDate} · {childNames.length} 位兒童</p></div></div><button type="button" onClick={backToSetup} className="inline-flex items-center gap-2 rounded-xl border border-[#E0E2ED] bg-white px-3 py-2 text-[12px] font-bold text-[#667098] transition hover:bg-[#F7F7FC] active:scale-[0.98]"><RotateCcw className="h-3.5 w-3.5" />重新設定</button></div></header><div className="mx-auto max-w-[1700px] px-3 pt-5 sm:px-6"><section className="rounded-2xl bg-[linear-gradient(100deg,#E8E5FF_0%,#F6ECFF_50%,#FFE6F1_100%)] p-4"><p className="text-[14px] font-bold text-[#4E4882]">按下 0／1／2 為每位兒童評分，再於下方填寫備註。</p><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{questionnaire.map((section, sectionIndex) => <button type="button" key={section.title} onClick={() => document.getElementById(`section-${sectionIndex}`)?.scrollIntoView({ behavior: "smooth", block: "start" })} className="shrink-0 rounded-lg border border-white/90 bg-white/85 px-3 py-2 text-[12px] font-bold text-[#6359B0] shadow-[0_2px_8px_rgba(91,76,187,0.08)] transition hover:bg-white active:scale-[0.98]">{section.title}</button>)}</div></section><section className="mt-4 overflow-hidden rounded-2xl border border-[#E4E6F1] bg-white shadow-[0_8px_24px_rgba(53,56,106,0.07)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9EAF2] px-4 py-4"><h2 className="text-[22px] font-bold text-[#353E6B]">各兒童表現</h2><p className="text-[12px] font-bold text-[#606998]"><span className="mr-2 rounded-full bg-[#FFE6E6] px-2 py-1 text-[#B63A4D]">0</span><span className="mr-2 rounded-full bg-[#FFF3C9] px-2 py-1 text-[#956000]">1</span><span className="rounded-full bg-[#E2FFF3] px-2 py-1 text-[#167C5D]">2</span></p></div><div className="comparison-scroll overflow-x-auto"><table className="w-full min-w-[690px] border-collapse text-left"><thead className="sticky top-[71px] z-20"><tr className="bg-[#F7F7FD]"><th className="sticky left-0 z-30 w-[49%] min-w-[380px] border-r border-[#E8E9F3] bg-[#F7F7FD] px-4 py-3 text-[13px] font-bold text-[#59638E]">項目</th>{childNames.map((name, index) => <th key={index} className="min-w-[128px] border-r border-[#E8E9F3] px-2 py-3 last:border-r-0"><p className="text-[11px] font-bold text-[#8990B2]">兒童 {index + 1}</p><p className="mt-0.5 text-[14px] font-extrabold text-[#4A5383]">{childLabel(name, index)}</p></th>)}</tr></thead><tbody>{questionnaire.map((section, sectionIndex) => <MatrixRows key={section.title} section={section} sectionIndex={sectionIndex} childNames={childNames} ratings={ratings} onScore={updateRating} onRemark={updateRemark} />)}</tbody></table></div><div className="flex flex-col gap-3 border-t border-[#E9EAF2] bg-[#FAFAFE] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[13px] text-[#747CA3]">完成評分後可用不同分數篩選每位兒童的表現。</p><button type="button" onClick={openAnalysis} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#6859E8,#F06FA5)] px-5 text-[14px] font-bold text-white shadow-[0_5px_0_#BF4C84] transition hover:brightness-105 active:translate-y-[1px] active:scale-[0.98] active:shadow-[0_3px_0_#BF4C84]"><Sparkles className="h-4 w-4" />進行分析</button></div></section></div></main>;
}

function PrintableAnalysis({ ratingDate, childNames, ratings, selectedGoals }: { ratingDate: string; childNames: string[]; ratings: RatingData; selectedGoals: string[] }) {
  const selectedItems = selectedGoals.map((key) => { const [itemId, childIndexText] = key.split("::"); const childIndex = Number(childIndexText); return { item: allItems.find((entry) => entry.id === itemId), childIndex, entry: ratings[key] }; }).filter((item) => item.item);
  return <article className="print-report hidden"><header><p>學習、社交及情緒適應問卷</p><h1>各兒童表現分析及已選訓練目標</h1><div className="print-meta"><span>評估日期：{ratingDate}</span><span>兒童：{childNames.map(childLabel).join("、")}</span></div></header><section className="print-section"><h2>已選個別訓練目標</h2>{selectedItems.length ? <table><thead><tr><th>兒童</th><th>項目</th><th>分數</th><th>備註</th></tr></thead><tbody>{selectedItems.map(({ item, childIndex, entry }) => item ? <tr key={`${item.id}-${childIndex}`}><td>{childLabel(childNames[childIndex], childIndex)}</td><td><ItemText text={item.text} /></td><td>{entry?.score ?? "—"}</td><td>{entry?.remark ?? ""}</td></tr> : null)}</tbody></table> : <p>尚未選擇個別訓練目標。</p>}</section><section className="print-section"><h2>各兒童表現</h2><table><thead><tr><th>項目</th>{childNames.map((name, index) => <th key={index}>{childLabel(name, index)}</th>)}</tr></thead><tbody>{allItems.map((item) => <tr key={item.id}><td><strong>{item.context} · {item.group.replaceAll("\n", " ")}</strong><br /><ItemText text={item.text} /></td>{childNames.map((_, childIndex) => { const entry = ratings[entryKey(item.id, childIndex)]; return <td key={childIndex}><strong>{entry?.score ?? "—"}</strong>：{scoreText(entry?.score)}{entry?.remark ? <><br /><span>備註：{entry.remark}</span></> : null}</td>; })}</tr>)}</tbody></table></section></article>;
}
