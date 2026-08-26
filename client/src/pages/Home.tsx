/**
 * Design reminder — Clinical Stationery Atelier:
 * This page is an evidence-led comparison folio. Warm paper, Observation Jade,
 * stable side-by-side child columns, and sparse functional colour guide every choice.
 */
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  Printer,
  RotateCcw,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

type Rating = 0 | 1 | 2;

type QuestionnaireItem = {
  id: string;
  text: string;
};

type QuestionnaireGroup = {
  title: string;
  items: QuestionnaireItem[];
};

type QuestionnaireContext = {
  title: string;
  groups: QuestionnaireGroup[];
};

type QuestionnaireSection = {
  title: string;
  contexts: QuestionnaireContext[];
};

type ItemWithContext = QuestionnaireItem & {
  category: string;
  context: string;
  group: string;
};

type RatingEntry = {
  score?: Rating;
  remark: string;
};

type RatingData = Record<string, RatingEntry>;

const ratingDefinitions: { score: Rating; short: string; description: string }[] = [
  { score: 2, short: "2", description: "時常做到" },
  { score: 1, short: "1", description: "有時或支援下做到" },
  { score: 0, short: "0", description: "未能做到" },
];

/** The following item bank reproduces the uploaded Word document verbatim. */
const questionnaire: QuestionnaireSection[] = [
  {
    title: "（一）學習適應",
    contexts: [
      {
        title: "主題時間",
        groups: [
          {
            title: "遵守規則及指令",
            items: [
              { id: "learning-topic-rules-1", text: "能安坐" },
              { id: "learning-topic-rules-2", text: "能先舉手、後發言" },
              { id: "learning-topic-rules-3", text: "在合適時間才舉手發言或參與" },
              { id: "learning-topic-rules-4", text: "能持續地留心聆聽" },
              { id: "learning-topic-rules-5", text: "能合作並跟從老師指令" },
            ],
          },
          {
            title: "上課時\n給予反應",
            items: [
              { id: "learning-topic-response-1", text: "聽課時，會眼望老師及點頭表示明白" },
              { id: "learning-topic-response-2", text: "被叫名或提問時，會嘗試作出回應" },
              { id: "learning-topic-response-3", text: "能主動舉手回答老師問題" },
            ],
          },
          {
            title: "與朋輩\n討論",
            items: [
              { id: "learning-topic-peer-1", text: "主動積極參與於與朋輩的討論中" },
              { id: "learning-topic-peer-2", text: "知道老師現在指示同學們討論甚麼題目" },
              { id: "learning-topic-peer-3", text: "能專心聆聽伙伴的分享或意見" },
              { id: "learning-topic-peer-4", text: "以點頭或說話回應對方，示意知道或同意" },
              {
                id: "learning-topic-peer-5",
                text: "分享自己的答案、想法或意見\n內容：有條理、與主題相關\n身體語言：轉向對方或有眼神接觸、保持適當距離\n語調：合宜聲量、語氣有禮",
              },
              { id: "learning-topic-peer-6", text: "向伙伴提出相關問題" },
            ],
          },
        ],
      },
      {
        title: "分組時間／功課時間",
        groups: [
          {
            title: "獨立\n完成工作",
            items: [
              { id: "learning-group-independent-1", text: "自發地開展工作" },
              { id: "learning-group-independent-2", text: "獨立地按指示完成工作" },
              { id: "learning-group-independent-3", text: "持續專注地工作" },
            ],
          },
          {
            title: "轉換及\n靈活性",
            items: [
              { id: "learning-group-transition-1", text: "能分辨事情重要性，計劃完成的先後次序" },
              { id: "learning-group-transition-2", text: "能分辨事情重要性或按老師指令，加快完成手上工作或暫時先放下未完成的工作" },
              { id: "learning-group-transition-3", text: "接受流程或規則的改變" },
              { id: "learning-group-transition-4", text: "按計劃自行由一項活動轉換到另一活動" },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "（二）社交適應",
    contexts: [
      {
        title: "語言及非語言溝通",
        groups: [
          {
            title: "恰當\n運用語言",
            items: [
              { id: "social-language-1", text: "能清晰具體地表達" },
              { id: "social-language-2", text: "能運用恰當語速" },
              { id: "social-language-3", text: "能運用恰當聲量" },
              { id: "social-language-4", text: "能運用自然恰當的說話風格，例如：\n避免過分直接、只顧表達自己喜好的話題（如：鐵路、天文、數學）" },
            ],
          },
          {
            title: "理解及運用非語言訊息",
            items: [
              { id: "social-nonverbal-1", text: "保持恰當的眼神接觸" },
              { id: "social-nonverbal-2", text: "聆聽別人說話時，能給予對方恰當的非語言訊息（如：點頭）" },
              { id: "social-nonverbal-3", text: "按情景和關係，保持適當的社交距離" },
              { id: "social-nonverbal-4", text: "溝通能運用恰當的動作、姿勢及面部表情" },
              { id: "social-nonverbal-5", text: "能理解別人的目光、表情、姿勢及動作等非語言訊息的含意（例如別人皺眉、注視物品的意思）" },
            ],
          },
          {
            title: "運用語言作不同用途",
            items: [
              { id: "social-language-purpose-1", text: "恰當地提出要求" },
              { id: "social-language-purpose-2", text: "恰當地敘述事情" },
              { id: "social-language-purpose-3", text: "恰當地解釋事物" },
              { id: "social-language-purpose-4", text: "恰當地分享經驗、興趣或想法" },
              { id: "social-language-purpose-5", text: "恰當地提出提議或意見" },
              { id: "social-language-purpose-6", text: "恰當地提出問題" },
            ],
          },
        ],
      },
      {
        title: "對話技巧",
        groups: [
          {
            title: "恰當地開展、加入及完結對話",
            items: [
              { id: "social-conversation-opening-1", text: "主動與別人開展交談或互動" },
              { id: "social-conversation-opening-2", text: "主動開展不同種類的話題" },
              { id: "social-conversation-opening-3", text: "在適當的時機加入其他人的對話，而不會打斷別人的說話" },
              { id: "social-conversation-opening-4", text: "恰當地完結對話或互動" },
            ],
          },
          {
            title: "因應情況調節對話內容",
            items: [
              { id: "social-conversation-adjust-1", text: "當別人不明白或有誤解時，能重複一次、調整用詞、加入更多解釋、加入手勢、展示物品等方法以作澄清" },
              { id: "social-conversation-adjust-2", text: "根據別人的反應來調整對話內容及行為（例如：留意到對方對自己的話題不感興趣時，便終止話題；留意到對方忙碌中，便暫停對話）" },
            ],
          },
          {
            title: "維持對話及互動",
            items: [
              { id: "social-conversation-maintain-1", text: "別人對他說話時，會留心聆聽（例如：身體轉向對方、有眼神接觸、間中點頭等）" },
              { id: "social-conversation-maintain-2", text: "別人對他說話時，會回應或回答" },
              { id: "social-conversation-maintain-3", text: "能與人輪流說話，不會中途插入" },
              { id: "social-conversation-maintain-4", text: "能保持恰當的說話頻次，不會過分霸佔或主導對話" },
              { id: "social-conversation-maintain-5", text: "對話時不離題" },
              { id: "social-conversation-maintain-6", text: "能提出想法、意見或更多資料，以維持對話" },
              { id: "social-conversation-maintain-7", text: "能向對方提出問題，以維持對話" },
              { id: "social-conversation-maintain-8", text: "對話時，遇上不明白之處會主動要求澄清" },
              { id: "social-conversation-maintain-9", text: "在對話中，能自然地轉換話題" },
            ],
          },
        ],
      },
      {
        title: "社交思考及解難",
        groups: [
          {
            title: "解讀別人的想法",
            items: [
              { id: "social-thinking-read-1", text: "理解別人的觀點和感受" },
              { id: "social-thinking-read-2", text: "能理解別人的意圖（包括善意及惡意）" },
              { id: "social-thinking-read-3", text: "能明白自己的行為會如何影響別人對自己的印象（例如用手指著別人的臉說話，會令人覺得自己沒有禮貌）" },
            ],
          },
          {
            title: "運用社交思考，調整自己的行為",
            items: [
              { id: "social-thinking-adjust-1", text: "能夠就對方的反應調整自己的行為\n情緒：看到別人在哭，自己便不會在旁玩耍，會觀察或主動安慰他\n語言：聽到別人說自己阻礙了他，會移開自己的物品\n非語言：看到別人皺眉，明白對方是不明白，會主動澄清" },
              { id: "social-thinking-adjust-2", text: "能理解在不同場合的預期行為\n例如在圖書館要安靜，在巴士中要安坐，老師上課時自己不會隨意開口說話，在合作遊戲中要一起參與" },
            ],
          },
          {
            title: "平和地面對問題及合宜地解決困難",
            items: [
              { id: "social-thinking-solve-1", text: "平和地面對和處理自己的過失" },
              { id: "social-thinking-solve-2", text: "平和地面對和處理不如意的事情" },
              { id: "social-thinking-solve-3", text: "能分辨是小問題或大問題，作出小反應或大反應" },
              { id: "social-thinking-solve-4", text: "做事或說話前會考慮後果（例如太大力玩玩具，玩具會爛；現在不去做功課，便不能參與體能遊戲）" },
              { id: "social-thinking-solve-5", text: "能指出現在遇到的困難或問題" },
              { id: "social-thinking-solve-6", text: "能主動尋求成人或朋輩的幫助，及接受幫助" },
              { id: "social-thinking-solve-7", text: "能運用不同方法去解決問題" },
            ],
          },
        ],
      },
      {
        title: "友善行為",
        groups: [
          {
            title: "社交禮儀",
            items: [
              { id: "social-friendly-etiquette-1", text: "能以表情或動作表示友好（例如微笑、擁抱）" },
              { id: "social-friendly-etiquette-2", text: "恰當地跟別人打招呼及回應別人的打招呼" },
              { id: "social-friendly-etiquette-3", text: "能主動道歉（例如對唔住、唔好意思）" },
              { id: "social-friendly-etiquette-4", text: "能運用表達禮貌的用詞（例如唔該、請、多謝）" },
              { id: "social-friendly-etiquette-5", text: "恰當地回應讚美和欣賞" },
              { id: "social-friendly-etiquette-6", text: "恰當地表示反對或拒絕" },
            ],
          },
          {
            title: "友善對待別人",
            items: [
              { id: "social-friendly-kindness-1", text: "懂得鼓勵、讚美和欣賞別人" },
              { id: "social-friendly-kindness-2", text: "在合情合理的情況下，才投訴或指出別人的錯處" },
              { id: "social-friendly-kindness-3", text: "別人打擾或阻礙到自己時，能合宜地處理" },
              { id: "social-friendly-kindness-4", text: "能向別人表達關心" },
              { id: "social-friendly-kindness-5", text: "主動幫助別人" },
              { id: "social-friendly-kindness-6", text: "主動安慰別人" },
              { id: "social-friendly-kindness-7", text: "分享別人的歡樂（例如別人勝出時，會一起歡呼）" },
            ],
          },
        ],
      },
      {
        title: "遊戲活動",
        groups: [
          {
            title: "與朋輩一起參與遊戲",
            items: [
              { id: "social-play-peer-1", text: "接受朋輩加入自己的遊戲" },
              { id: "social-play-peer-2", text: "主動而合宜地加入朋輩的遊戲" },
              { id: "social-play-peer-3", text: "會主動邀請朋輩一起進行遊戲" },
              { id: "social-play-peer-4", text: "合宜地完結或離開與別人進行中的遊戲" },
              { id: "social-play-peer-5", text: "參與多樣化的興趣活動" },
            ],
          },
          {
            title: "在遊戲中表現合宜的行為",
            items: [
              { id: "social-play-behaviour-1", text: "恰當地運用遊戲物品和設施" },
              { id: "social-play-behaviour-2", text: "懂得分享遊戲物品" },
              { id: "social-play-behaviour-3", text: "懂得與朋輩輪流玩耍" },
              { id: "social-play-behaviour-4", text: "遵守遊戲規則" },
              { id: "social-play-behaviour-5", text: "與朋輩一起玩假想遊戲" },
              { id: "social-play-behaviour-6", text: "當別人與自己有不同興趣時，能作出協商或妥協" },
              { id: "social-play-behaviour-7", text: "遊戲時，能平和地面對失敗" },
            ],
          },
        ],
      },
      {
        title: "處理意見分歧或衝突",
        groups: [
          {
            title: "處理意見分歧及拒絕",
            items: [
              { id: "social-conflict-1", text: "能察覺有意見分歧或衝突" },
              { id: "social-conflict-2", text: "面對意見分歧，在合適的情況下願意妥協" },
              { id: "social-conflict-3", text: "面對意見分歧，嘗試與人協商議以達成共識\n解釋自己所提議的好處，或別人所提議的壞處\n以包剪揼、鬥快舉手等方法決定誰作主\n提出輪流作主\n嘗試融合兩人的意見，以達成共識" },
              { id: "social-conflict-4", text: "能合宜地拒絕對方的提議" },
              { id: "social-conflict-5", text: "被對方拒絕時，能作出恰當回應" },
            ],
          },
        ],
      },
      {
        title: "情緒表達、理解及調控",
        groups: [
          {
            title: "理解、表達及解釋自己的情緒",
            items: [
              { id: "social-emotion-self-1", text: "能以表情、動作及語氣來表達情緒" },
              { id: "social-emotion-self-2", text: "能運用基礎情緒詞彙（例如開心、傷心、害怕、生氣）描述自己的狀態" },
              { id: "social-emotion-self-3", text: "能運用進階情緒詞彙（例如興奮、悶、期待、擔心）描述自己的狀態" },
              { id: "social-emotion-self-4", text: "明白情緒有不同的程度，並恰當地表達不同程度的情緒" },
              { id: "social-emotion-self-5", text: "能解釋自己出現情緒背後的原因" },
            ],
          },
          {
            title: "理解及解釋別人的情緒",
            items: [
              { id: "social-emotion-other-1", text: "能從表情、動作及語氣來理解別人的情緒" },
              { id: "social-emotion-other-2", text: "能運用基礎情緒詞彙（例如開心、傷心、害怕、生氣）描述別人的狀態" },
              { id: "social-emotion-other-3", text: "能運用進階情緒詞彙（例如興奮、悶、期待、擔心）描述別人的狀態" },
              { id: "social-emotion-other-4", text: "能解釋別人出現情緒背後的原因" },
            ],
          },
          {
            title: "情緒調控",
            items: [
              { id: "social-emotion-regulation-1", text: "當出現負面情緒時，會恰當地以表情、動作或說話表達出感受，以尋求別人的關注或安慰" },
              { id: "social-emotion-regulation-2", text: "當出現正面情緒時，會恰當地以表情、動作或說話表達出感受，以尋求別人的關注或回應" },
              { id: "social-emotion-regulation-3", text: "能運用恰當的策略，調控憤怒的情緒" },
              { id: "social-emotion-regulation-4", text: "能運用恰當的策略，調控緊張或焦慮的情緒" },
              { id: "social-emotion-regulation-5", text: "能運用恰當的策略，調控不開心或失望的情緒" },
              { id: "social-emotion-regulation-6", text: "能運用恰當的策略，調控過度興奮的情緒" },
              { id: "social-emotion-regulation-7", text: "平復心情後，能重新參與活動" },
            ],
          },
        ],
      },
    ],
  },
];

const flattenQuestionnaire = (): ItemWithContext[] =>
  questionnaire.flatMap((section) =>
    section.contexts.flatMap((context) =>
      context.groups.flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          category: section.title,
          context: context.title,
          group: group.title,
        })),
      ),
    ),
  );

const allItems = flattenQuestionnaire();

function childLabel(name: string, index: number) {
  return name.trim() || `兒童 ${index + 1}`;
}

function entryKey(itemId: string, childIndex: number) {
  return `${itemId}::${childIndex}`;
}

function scoreTone(score?: Rating) {
  if (score === 0) return "border-[#C76A55] bg-[#FFF0EB] text-[#963E2C]";
  if (score === 1) return "border-[#D99A2E] bg-[#FFF6DE] text-[#8A5B00]";
  if (score === 2) return "border-[#63A477] bg-[#EEF8F0] text-[#2F7044]";
  return "border-[#D8DDDA] bg-white text-[#94A19B]";
}

function scoreText(score?: Rating) {
  if (score === 0) return "未能做到";
  if (score === 1) return "有時或支援下做到";
  if (score === 2) return "時常做到";
  return "未評分";
}

function ItemText({ text }: { text: string }) {
  return <span className="whitespace-pre-line">{text}</span>;
}

function RatingButtons({ score, onChange }: { score?: Rating; onChange: (score: Rating) => void }) {
  return (
    <div className="grid grid-cols-3 gap-1" aria-label="學生表現評分">
      {[0, 1, 2].map((option) => {
        const optionScore = option as Rating;
        const selected = score === optionScore;
        const selectedClass =
          optionScore === 0
            ? "border-[#B9503B] bg-[#C7614A] text-white shadow-[0_2px_0_#9A3F2D]"
            : optionScore === 1
              ? "border-[#C28118] bg-[#D99A2E] text-white shadow-[0_2px_0_#9A680A]"
              : "border-[#4A8D5E] bg-[#63A477] text-white shadow-[0_2px_0_#39794C]";
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(optionScore)}
            className={`h-8 rounded-md border text-[12px] font-bold transition duration-150 active:scale-[0.97] ${
              selected ? selectedClass : "border-[#D9DEDB] bg-white text-[#67746E] hover:border-[#8BA7A0] hover:bg-[#F7FAF8]"
            }`}
            aria-pressed={selected}
            aria-label={`${optionScore}：${scoreText(optionScore)}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function AnalysisItem({ item, className }: { item: ItemWithContext; className: string }) {
  return (
    <li className={`rounded-lg border px-3 py-2.5 text-[13px] leading-5 ${className}`}>
      <p className="mb-1 text-[10px] font-bold tracking-[0.14em] opacity-65">{item.context} · {item.group.replaceAll("\n", " ")}</p>
      <ItemText text={item.text} />
    </li>
  );
}

export default function Home() {
  const [ratingDate, setRatingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [groupSize, setGroupSize] = useState(3);
  const [childNames, setChildNames] = useState(["", "", ""]);
  const [ratings, setRatings] = useState<RatingData>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const totalExpectedRatings = allItems.length * childNames.length;
  const completedRatings = Object.values(ratings).filter((entry) => entry.score !== undefined).length;
  const ratingProgress = totalExpectedRatings ? Math.round((completedRatings / totalExpectedRatings) * 100) : 0;

  const individualAnalysis = useMemo(
    () =>
      childNames.map((name, childIndex) => ({
        name: childLabel(name, childIndex),
        groups: ([1, 0, 2] as Rating[]).map((score) => ({
          score,
          items: allItems.filter((item) => ratings[entryKey(item.id, childIndex)]?.score === score),
        })),
      })),
    [childNames, ratings],
  );

  const sharedScoreOne = useMemo(
    () => allItems.filter((item) => childNames.length > 0 && childNames.every((_, childIndex) => ratings[entryKey(item.id, childIndex)]?.score === 1)),
    [childNames, ratings],
  );

  const sharedScoreZero = useMemo(
    () => allItems.filter((item) => childNames.length > 0 && childNames.every((_, childIndex) => ratings[entryKey(item.id, childIndex)]?.score === 0)),
    [childNames, ratings],
  );

  const handleGroupSizeChange = (value: number) => {
    const nextSize = Math.max(1, Math.min(8, value || 1));
    setGroupSize(nextSize);
    setChildNames((previous) => Array.from({ length: nextSize }, (_, index) => previous[index] ?? ""));
  };

  const updateRating = (itemId: string, childIndex: number, score: Rating) => {
    const key = entryKey(itemId, childIndex);
    setRatings((previous) => ({
      ...previous,
      [key]: { score, remark: previous[key]?.remark ?? "" },
    }));
  };

  const updateRemark = (itemId: string, childIndex: number, remark: string) => {
    const key = entryKey(itemId, childIndex);
    setRatings((previous) => ({
      ...previous,
      [key]: { score: previous[key]?.score, remark },
    }));
  };

  const startForm = () => {
    setHasStarted(true);
    setShowAnalysis(false);
    setRatings({});
    setSelectedGoals([]);
  };

  const resetForm = () => {
    setHasStarted(false);
    setShowAnalysis(false);
    setRatings({});
    setSelectedGoals([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const runAnalysis = () => {
    if (completedRatings === 0) {
      toast.error("請先為最少一個項目評分，再進行分析。", { position: "top-center" });
      return;
    }
    setShowAnalysis(true);
    window.setTimeout(() => document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  const toggleGoal = (itemId: string) => {
    setSelectedGoals((previous) => (previous.includes(itemId) ? previous.filter((id) => id !== itemId) : [...previous, itemId]));
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#233834]">
      <main className="screen-ui min-h-screen">
        {!hasStarted ? (
          <section className="min-h-screen px-4 py-5 sm:px-8 lg:px-12">
            <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-[1380px] overflow-hidden rounded-[24px] border border-[#DCE0DA] bg-[#FBFAF6] shadow-[0_20px_70px_rgba(35,56,52,0.10)] lg:grid-cols-[0.74fr_1.26fr]">
              <aside className="relative overflow-hidden border-b border-[#D8DED9] bg-[#E6EFEB] p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
                <img src="/manus-storage/assessment-paper-texture_494a4d15.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55" />
                <div className="relative flex h-full flex-col justify-between gap-10">
                  <div>
                    <div className="mb-12 flex items-center gap-4">
                      <span className="brand-signature"><img src="/manus-storage/clinical-compass-logo_8198f6f6.png" alt="" className="h-14 w-14 shrink-0" /></span>
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.17em] text-[#55726A]">GROUP OBSERVATION FOLIO</p>
                        <p className="mt-1 font-serif text-[18px] font-semibold text-[#145B58]">兒童發展觀察</p>
                      </div>
                    </div>
                    <p className="mb-4 text-[11px] font-bold tracking-[0.18em] text-[#55726A]">學習、社交及情緒適應問卷</p>
                    <h1 className="max-w-md font-serif text-[34px] leading-[1.22] font-semibold text-[#174A47] sm:text-[43px]">把同一節小組的觀察，整理成清晰的共同方向。</h1>
                    <p className="mt-6 max-w-md text-[15px] leading-7 text-[#4C655E]">先設定日期與人數，再以並列欄位完成每位兒童的評分與備註。所有問卷項目均按原有字詞呈現。</p>
                  </div>
                  <div className="border-l-2 border-[#79A79A] pl-4 text-[13px] leading-6 text-[#45645B]">
                    <p className="font-bold text-[#235A55]">評分方式</p>
                    <p>2 = 時常做到／1＝有時或支援下做到／0＝未能做到</p>
                  </div>
                </div>
              </aside>

              <section className="relative flex flex-col justify-center p-7 sm:p-10 lg:p-16">
                <img src="/manus-storage/progress-rings_39bbed60.png" alt="" className="pointer-events-none absolute right-0 top-0 w-[66%] opacity-40" />
                <div className="relative max-w-2xl">
                  <div className="mb-10 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#145B58] text-[12px] font-bold text-white">1</span>
                    <span className="h-px w-10 bg-[#B7C9C0]" />
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#BCCDC5] bg-white text-[12px] font-bold text-[#789189]">2</span>
                    <p className="ml-1 text-[12px] font-bold tracking-[0.12em] text-[#6D8079]">設定評估</p>
                  </div>
                  <div className="mb-8">
                    <p className="text-[12px] font-bold tracking-[0.16em] text-[#55736B]">本次小組</p>
                    <h2 className="mt-2 font-serif text-[32px] font-semibold text-[#23433D]">先建立比較表</h2>
                    <p className="mt-3 text-[14px] leading-6 text-[#667870]">填寫評估日期，然後選擇小組中的兒童人數。每位兒童會有一個並列的評分與備註欄。</p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-[#4F685F]"><CalendarDays className="h-4 w-4" />評估日期</span>
                      <input value={ratingDate} onChange={(event) => setRatingDate(event.target.value)} type="date" className="ledger-input h-12 w-full px-3 text-[14px] text-[#23433D] outline-none transition" />
                    </label>
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-[#4F685F]"><UsersRound className="h-4 w-4" />兒童人數</span>
                      <input value={groupSize} onChange={(event) => handleGroupSizeChange(Number(event.target.value))} min={1} max={8} type="number" className="ledger-input h-12 w-full px-3 text-[14px] text-[#23433D] outline-none transition" />
                    </label>
                  </div>

                  <div className="mt-8 border-t border-[#DCE3DE] pt-7">
                    <div className="mb-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[12px] font-bold tracking-[0.1em] text-[#4F685F]">兒童姓名</p>
                        <p className="mt-1 text-[12px] text-[#7B8B84]">可先輸入姓名；如留空，表內會以「兒童 1」等顯示。</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#E8F0EC] px-3 py-1 text-[11px] font-bold text-[#387263]">{groupSize} 位兒童</span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {childNames.map((name, index) => (
                        <label key={index} className="group relative">
                          <span className="absolute left-3 top-3 text-[11px] font-bold text-[#7F948C]">{index + 1}</span>
                          <input value={name} onChange={(event) => setChildNames((previous) => previous.map((childName, childIndex) => childIndex === index ? event.target.value : childName))} placeholder={`兒童 ${index + 1} 姓名`} className="ledger-input h-11 w-full pl-8 pr-3 text-[14px] text-[#314D45] outline-none transition" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="button" onClick={startForm} className="mt-10 inline-flex h-12 items-center gap-3 rounded-lg bg-[#145B58] px-5 text-[14px] font-bold text-white shadow-[0_6px_0_#0D4643] transition duration-150 hover:bg-[#0F514E] active:translate-y-[2px] active:scale-[0.98] active:shadow-[0_3px_0_#0D4643]">
                    建立比較表 <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </section>
            </div>
          </section>
        ) : (
          <div className="mx-auto max-w-[1720px] px-3 py-3 sm:px-5 lg:px-7">
            <header className="mb-3 grid overflow-hidden rounded-xl border border-[#D9E0DB] bg-[#FBFAF6] shadow-[0_8px_26px_rgba(35,56,52,0.07)] lg:grid-cols-[0.72fr_1.28fr]">
              <div className="flex items-center gap-3 border-b border-[#DCE3DE] px-4 py-3 lg:border-b-0 lg:border-r lg:px-5">
                <span className="brand-signature brand-signature-small"><img src="/manus-storage/clinical-compass-logo_8198f6f6.png" alt="兒童發展觀察標誌" className="h-12 w-12 shrink-0" /></span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.17em] text-[#688078]">GROUP OBSERVATION FOLIO</p>
                  <h1 className="mt-0.5 font-serif text-[19px] font-semibold text-[#194944]">學習、社交及情緒適應問卷</h1>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-5">
                <div className="flex items-center gap-4 text-[12px] text-[#5C736B]">
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{ratingDate}</span>
                  <span className="inline-flex items-center gap-1.5"><UsersRound className="h-3.5 w-3.5" />{childNames.length} 位兒童</span>
                  <span className="hidden rounded-full bg-[#EAF2EE] px-2.5 py-1 font-bold text-[#397563] sm:inline">已評 {completedRatings}/{totalExpectedRatings}</span>
                </div>
                <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-md border border-[#C8D3CD] bg-white px-3 py-2 text-[12px] font-bold text-[#506961] transition hover:border-[#8AA99F] hover:bg-[#F3F7F4] active:scale-[0.97]"><RotateCcw className="h-3.5 w-3.5" />重新設定</button>
              </div>
            </header>

            <section className="mb-3 grid gap-3 lg:grid-cols-[250px_minmax(0,1fr)]">
              <aside className="rounded-xl border border-[#D9E0DB] bg-[#EFF4F0] p-4 shadow-[0_6px_20px_rgba(35,56,52,0.05)] lg:sticky lg:top-3 lg:h-fit">
                <div className="mb-4 flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-[#145B58]" />
                  <p className="text-[12px] font-bold tracking-[0.12em] text-[#37695F]">評分狀態</p>
                </div>
                <p className="font-serif text-[28px] font-semibold text-[#145B58]">{ratingProgress}%</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#D8E4DD]"><div className="h-full rounded-full bg-[#6AA18B] transition-all duration-200" style={{ width: `${ratingProgress}%` }} /></div>
                <p className="mt-2 text-[11px] leading-5 text-[#60766E]">{completedRatings} / {totalExpectedRatings} 個評分已完成</p>
                <div className="mt-5 space-y-2 border-t border-[#D4E0D9] pt-4 text-[11px]">
                  {ratingDefinitions.map((definition) => (
                    <div key={definition.score} className="flex items-center gap-2 text-[#5D726A]"><span className={`flex h-5 w-5 items-center justify-center rounded border text-[10px] font-bold ${scoreTone(definition.score)}`}>{definition.score}</span><span>{definition.description}</span></div>
                  ))}
                </div>
                <p className="mt-5 border-t border-[#D4E0D9] pt-4 text-[10px] leading-5 text-[#778982]">每格可直接選擇 0／1／2；下方可補充備註。</p>
              </aside>

              <section className="min-w-0 rounded-xl border border-[#D9E0DB] bg-[#FBFAF6] shadow-[0_6px_20px_rgba(35,56,52,0.05)]">
                <div className="ring-stage relative overflow-hidden border-b border-[#DDE4DF] px-5 py-4">
                  <img src="/manus-storage/progress-rings_39bbed60.png" alt="" className="pointer-events-none absolute right-0 top-0 h-full w-[45%] object-cover opacity-40" />
                  <div className="relative flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.16em] text-[#618077]">STEP 2 · 並列評分</p>
                      <h2 className="mt-1 font-serif text-[22px] font-semibold text-[#25473F]">小組表現比較</h2>
                    </div>
                    <p className="max-w-xl text-[11px] leading-5 text-[#657A71]">2 = 時常做到／1＝有時或支援下做到／0＝未能做到</p>
                  </div>
                </div>
                <div className="comparison-scroll overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead className="sticky top-0 z-20 shadow-[0_1px_0_#D9E2DC]">
                      <tr className="bg-[#EDF2EE]">
                        <th className="sticky left-0 z-30 w-[42%] min-w-[330px] border-r border-[#D5DED8] bg-[#EDF2EE] px-5 py-3 text-[11px] font-bold tracking-[0.13em] text-[#45645A]">項目</th>
                        {childNames.map((name, index) => (
                          <th key={index} className="min-w-[182px] border-r border-[#D5DED8] px-3 py-3 last:border-r-0">
                            <p className="text-[10px] font-bold tracking-[0.12em] text-[#758B82]">兒童 {index + 1}</p>
                            <p className="mt-0.5 text-[14px] font-bold text-[#24534C]">{childLabel(name, index)}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {questionnaire.map((section) => (
                        <SectionRows key={section.title} section={section} childNames={childNames} ratings={ratings} onScore={updateRating} onRemark={updateRemark} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col gap-3 border-t border-[#DDE4DF] bg-[#F7F8F5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[12px] leading-5 text-[#5A7168]">完成評分後，系統會按每位兒童的 1、0、2 順序整理結果，並找出所有兒童同樣評為 1 或 0 的項目。</p>
                  <button type="button" onClick={runAnalysis} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[#145B58] px-4 text-[13px] font-bold text-white shadow-[0_4px_0_#0D4643] transition duration-150 hover:bg-[#0F514E] active:translate-y-[1px] active:scale-[0.98] active:shadow-[0_2px_0_#0D4643]"><Sparkles className="h-3.5 w-3.5" />進行分析<ChevronRight className="h-3.5 w-3.5" /></button>
                </div>
              </section>
            </section>

            {showAnalysis && (
              <section id="analysis" className="scroll-mt-4 rounded-xl border border-[#CFDBD5] bg-[#FBFAF6] shadow-[0_10px_30px_rgba(35,56,52,0.08)]">
                <div className="ring-stage relative overflow-hidden border-b border-[#DDE4DF] bg-[#F0F5F1] px-5 py-5 sm:px-6">
                  <img src="/manus-storage/progress-rings_39bbed60.png" alt="" className="pointer-events-none absolute right-0 top-0 h-full w-[38%] object-cover opacity-25" />
                  <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.16em] text-[#628076]">STEP 3 · 分析與計劃</p>
                      <h2 className="mt-1 font-serif text-[25px] font-semibold text-[#24483F]">評分分析</h2>
                      <p className="mt-1 text-[12px] leading-5 text-[#657A71]">先顯示個別兒童的 1、0、2 項目，再呈現本組所有兒童一致的 1 與 0 項目。</p>
                    </div>
                    <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#90AAA0] bg-white px-4 text-[12px] font-bold text-[#245A50] transition hover:bg-[#F5F9F6] active:scale-[0.97]"><Printer className="h-3.5 w-3.5" />產生並列印 PDF 報告</button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <section>
                    <div className="mb-4 flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#145B58] text-[12px] font-bold text-white">1</span><h3 className="font-serif text-[20px] font-semibold text-[#2B4E46]">個別兒童表現</h3></div>
                    <div className="grid gap-4 xl:grid-cols-2">
                      {individualAnalysis.map((child) => (
                        <article key={child.name} className="overflow-hidden rounded-lg border border-[#D9E2DC] bg-white">
                          <div className="border-b border-[#E0E7E2] bg-[#FAFBF8] px-4 py-3"><p className="text-[10px] font-bold tracking-[0.14em] text-[#729087]">個別整理</p><h4 className="mt-0.5 text-[16px] font-bold text-[#24554C]">{child.name}</h4></div>
                          <div className="grid divide-y divide-[#E8ECE8]">
                            {child.groups.map(({ score, items }) => {
                              const tone = score === 1 ? "bg-[#FFF8E8] text-[#825B0E]" : score === 0 ? "bg-[#FFF0EC] text-[#923E2C]" : "bg-[#F0F8F2] text-[#367145]";
                              const heading = score === 1 ? "有時或支援下做到" : score === 0 ? "未能做到" : "時常做到";
                              return (
                                <div key={score} className="p-4">
                                  <div className="mb-3 flex items-center justify-between gap-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tone}`}>{score} · {heading}</span><span className="text-[11px] font-bold text-[#82918A]">{items.length} 項</span></div>
                                  {items.length ? <ul className="space-y-2">{items.map((item) => <AnalysisItem key={item.id} item={item} className={score === 1 ? "border-[#ECD49A] bg-[#FFFDF6] text-[#705313]" : score === 0 ? "border-[#E7BCB2] bg-[#FFF9F7] text-[#7B4032]" : "border-[#B9D8C1] bg-[#FBFEFB] text-[#396345]"} />)}</ul> : <p className="text-[12px] text-[#83928C]">暫無此評分項目。</p>}
                                </div>
                              );
                            })}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="mt-8 border-t border-[#DFE6E1] pt-7">
                    <div className="mb-4 flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#145B58] text-[12px] font-bold text-white">2</span><div><h3 className="font-serif text-[20px] font-semibold text-[#2B4E46]">本組共同方向</h3><p className="mt-0.5 text-[12px] text-[#71837A]">以下只列出所有兒童均評為 1 或均評為 0 的項目。</p></div></div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      <SharedGoalPanel title="共同訓練目標" subtitle="所有兒童均為 1：有時或支援下做到" score={1} items={sharedScoreOne} selectedGoals={selectedGoals} onToggle={toggleGoal} />
                      <SharedGoalPanel title="共同困難" subtitle="所有兒童均為 0：未能做到" score={0} items={sharedScoreZero} selectedGoals={selectedGoals} onToggle={toggleGoal} />
                    </div>
                  </section>

                  <section className="mt-6 rounded-lg border border-[#B8D1C6] bg-[#EAF4EE] p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
                    <div><p className="text-[10px] font-bold tracking-[0.15em] text-[#4C796B]">已選目標</p><p className="mt-1 text-[14px] font-bold text-[#235D50]">{selectedGoals.length} 項將納入小組治療計劃</p></div>
                    <button type="button" onClick={() => window.print()} className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-[#145B58] px-4 text-[13px] font-bold text-white shadow-[0_4px_0_#0D4643] transition duration-150 hover:bg-[#0F514E] active:translate-y-[1px] active:scale-[0.98] active:shadow-[0_2px_0_#0D4643] sm:mt-0"><Printer className="h-3.5 w-3.5" />產生並列印 PDF 報告</button>
                  </section>
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {showAnalysis && <PrintableReport ratingDate={ratingDate} childNames={childNames} ratings={ratings} individualAnalysis={individualAnalysis} sharedScoreOne={sharedScoreOne} sharedScoreZero={sharedScoreZero} selectedGoals={selectedGoals} />}
    </div>
  );
}

function SectionRows({ section, childNames, ratings, onScore, onRemark }: { section: QuestionnaireSection; childNames: string[]; ratings: RatingData; onScore: (itemId: string, childIndex: number, score: Rating) => void; onRemark: (itemId: string, childIndex: number, remark: string) => void }) {
  return (
    <>
      <tr className="section-row"><th colSpan={childNames.length + 1} className="border-y border-[#B8D1C6] bg-[#DCEBE3] px-5 py-2.5 text-[13px] font-bold tracking-[0.1em] text-[#245A50]">{section.title}</th></tr>
      {section.contexts.map((context) => (
        <>
          <tr key={`${section.title}-${context.title}`} className="context-row"><th colSpan={childNames.length + 1} className="border-b border-[#D9E3DD] bg-[#F2F6F2] px-5 py-2 text-[12px] font-bold text-[#426A5E]">» {context.title}</th></tr>
          {context.groups.map((group) =>
            group.items.map((item, itemIndex) => (
              <tr key={item.id} className="group border-b border-[#E0E6E2] align-top transition hover:bg-[#FBFCFA]">
                <th scope="row" className="sticky left-0 z-10 border-r border-[#DCE4DF] bg-[#FBFAF6] px-4 py-3 text-left group-hover:bg-[#FBFCFA]">
                  <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
                    {itemIndex === 0 ? <p className="whitespace-pre-line text-[11px] leading-5 font-bold text-[#547267]">{group.title}</p> : <span />}
                    <div className="flex gap-2"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8EFEB] text-[10px] font-bold text-[#4D7065]">{itemIndex + 1}</span><p className="whitespace-pre-line text-[12px] leading-5 font-medium text-[#365248]"><ItemText text={item.text} /></p></div>
                  </div>
                </th>
                {childNames.map((_, childIndex) => {
                  const entry = ratings[entryKey(item.id, childIndex)];
                  return (
                    <td key={childIndex} className="border-r border-[#E0E6E2] p-2.5 last:border-r-0">
                      <RatingButtons score={entry?.score} onChange={(score) => onScore(item.id, childIndex, score)} />
                      <textarea value={entry?.remark ?? ""} onChange={(event) => onRemark(item.id, childIndex, event.target.value)} aria-label={`兒童 ${childIndex + 1} 對「${item.text.split("\n")[0]}」的備註`} placeholder="備註" rows={2} className="mt-2 block w-full resize-y rounded-md border border-[#D9E1DC] bg-white px-2 py-1.5 text-[11px] leading-4 text-[#496259] outline-none transition placeholder:text-[#A3B0AA] focus:border-[#6E9789] focus:ring-2 focus:ring-[#145B58]/10" />
                    </td>
                  );
                })}
              </tr>
            )),
          )}
        </>
      ))}
    </>
  );
}

function SharedGoalPanel({ title, subtitle, score, items, selectedGoals, onToggle }: { title: string; subtitle: string; score: Rating; items: ItemWithContext[]; selectedGoals: string[]; onToggle: (itemId: string) => void }) {
  const isScoreOne = score === 1;
  const surface = isScoreOne ? "border-[#E5C77E] bg-[#FFFDF5]" : "border-[#E4B1A6] bg-[#FFF9F7]";
  const badge = isScoreOne ? "bg-[#FFF2C9] text-[#855A08]" : "bg-[#FCE2DA] text-[#963E2B]";
  return (
    <article className={`overflow-hidden rounded-lg border ${surface}`}>
      <div className="flex items-start justify-between gap-4 border-b border-inherit px-4 py-3"><div><p className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${badge}`}>{score}</p><h4 className="mt-2 text-[15px] font-bold text-[#345047]">{title}</h4><p className="mt-1 text-[11px] text-[#718178]">{subtitle}</p></div><span className="pt-1 text-[12px] font-bold text-[#73867D]">{items.length} 項</span></div>
      <div className="p-3">
        {items.length ? <ul className="space-y-2">{items.map((item) => {
          const selected = selectedGoals.includes(item.id);
          return <li key={item.id}><button type="button" onClick={() => onToggle(item.id)} className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition active:scale-[0.99] ${selected ? "border-[#3F8270] bg-[#E5F2EB] shadow-[0_2px_0_#B5D6C4]" : "border-[#E4E6E0] bg-white hover:border-[#A6C1B5] hover:bg-[#FBFCFA]"}`}><span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selected ? "border-[#2E725F] bg-[#3D856F] text-white" : "border-[#B9C9C1] bg-white text-transparent"}`}><Check className="h-3 w-3" /></span><span className="min-w-0"><span className="mb-1 block text-[10px] font-bold tracking-[0.1em] text-[#71857B]">{item.context} · {item.group.replaceAll("\n", " ")}</span><span className="whitespace-pre-line text-[12px] leading-5 text-[#405B52]">{item.text}</span></span></button></li>;
        })}</ul> : <p className="px-1 py-5 text-center text-[12px] text-[#83928C]">沒有所有兒童一致的此類項目。</p>}
      </div>
    </article>
  );
}

function PrintableReport({ ratingDate, childNames, ratings, individualAnalysis, sharedScoreOne, sharedScoreZero, selectedGoals }: { ratingDate: string; childNames: string[]; ratings: RatingData; individualAnalysis: { name: string; groups: { score: Rating; items: ItemWithContext[] }[] }[]; sharedScoreOne: ItemWithContext[]; sharedScoreZero: ItemWithContext[]; selectedGoals: string[] }) {
  const selectedItems = [...sharedScoreOne, ...sharedScoreZero].filter((item) => selectedGoals.includes(item.id));
  return (
    <article className="print-report hidden">
      <header>
        <p>學習、社交及情緒適應問卷</p>
        <h1>小組評分及治療計劃報告</h1>
        <div className="print-meta"><span>評估日期：{ratingDate}</span><span>兒童：{childNames.map(childLabel).join("、")}</span></div>
      </header>
      <section className="print-section">
        <h2>小組共同方向</h2>
        <div className="print-columns">
          <div><h3>共同訓練目標（1：有時或支援下做到）</h3>{sharedScoreOne.length ? <ol>{sharedScoreOne.map((item) => <li key={item.id}><ItemText text={item.text} /></li>)}</ol> : <p>沒有所有兒童一致的此類項目。</p>}</div>
          <div><h3>共同困難（0：未能做到）</h3>{sharedScoreZero.length ? <ol>{sharedScoreZero.map((item) => <li key={item.id}><ItemText text={item.text} /></li>)}</ol> : <p>沒有所有兒童一致的此類項目。</p>}</div>
        </div>
      </section>
      <section className="print-section"><h2>已選小組治療目標</h2>{selectedItems.length ? <ol>{selectedItems.map((item) => <li key={item.id}><ItemText text={item.text} /></li>)}</ol> : <p>尚未選擇目標。</p>}</section>
      <section className="print-section"><h2>個別兒童表現</h2>{individualAnalysis.map((child) => <div key={child.name} className="print-child"><h3>{child.name}</h3>{child.groups.map(({ score, items }) => <div key={score}><h4>{score}：{scoreText(score)}</h4>{items.length ? <ol>{items.map((item) => <li key={item.id}><ItemText text={item.text} /></li>)}</ol> : <p>暫無此評分項目。</p>}</div>)}</div>)}</section>
      <section className="print-section"><h2>完整評分紀錄</h2><table><thead><tr><th>項目</th>{childNames.map((name, index) => <th key={index}>{childLabel(name, index)}</th>)}</tr></thead><tbody>{allItems.map((item) => <tr key={item.id}><td><strong>{item.context} · {item.group.replaceAll("\n", " ")}</strong><br /><ItemText text={item.text} /></td>{childNames.map((_, childIndex) => { const entry = ratings[entryKey(item.id, childIndex)]; return <td key={childIndex}><strong>{entry?.score ?? "—"}</strong>：{scoreText(entry?.score)}{entry?.remark ? <><br /><span>備註：{entry.remark}</span></> : null}</td>; })}</tr>)}</tbody></table></section>
    </article>
  );
}
