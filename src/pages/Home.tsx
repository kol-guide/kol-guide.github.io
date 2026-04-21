/*
  Design: Generic KOL Version — 대학원생을 위한 영어 논문 번역 완벽 가이드
  - Universal resource pack for academic KOLs
  - UTM source: kol_guide
  - CTA references codes received from KOL/creator
  - Color scheme: teal/blue-green
*/

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check, X, ChevronDown, ChevronUp, ExternalLink, Shield, Zap,
  FileText, Globe, BookOpen, Sparkles, Lock, ArrowRight,
  Search, Network, Languages, FolderOpen, GraduationCap,
  Lightbulb, Star, ChevronRight, Gift
} from "lucide-react";

// ── Analytics helper (Umami) ──
function trackEvent(name: string, data?: Record<string, string | number>) {
  try {
    if (typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.track(name, data);
    }
  } catch { /* silently ignore */ }
}

// ── Scroll depth tracker ──
function useScrollDepthTracker() {
  const tracked = useRef(new Set<number>());
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);
      for (const m of milestones) {
        if (pct >= m && !tracked.current.has(m)) {
          tracked.current.add(m);
          trackEvent("scroll_depth", { depth: m });
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}

// ── Asset URLs ──
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663402005199/VFNaN8wuaSe5mrA7yxWtac/hero-banner-HzRFeiCXnBMYgBtcXk4k8Y.webp";
const CTA_BG_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663402005199/VFNaN8wuaSe5mrA7yxWtac/cta-gradient-a8LZn5J5rxCEDnJVq5xJhL.webp";

// ── Scroll fade-in hook ──
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, className: `transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}` };
}

// ── Expandable section component ──
function Expandable({ title, children, defaultOpen = false, icon, trackName }: { title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ReactNode; trackName?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <button
        onClick={() => { setOpen(!open); if (!open && trackName) trackEvent("expand_section", { section: trackName }); }}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-lavender-light/30 transition-colors"
      >
        <span className="flex items-center gap-2.5 font-semibold text-[15px]">
          {icon}
          {title}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 text-[14px] leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
}

// ── Screenshot component with click-to-zoom ──
function Screenshot({ src, alt, caption, size = "md" }: { src: string; alt: string; caption: string; size?: "sm" | "md" | "lg" | "full" }) {
  const [zoomed, setZoomed] = useState(false);
  const maxW = { sm: "max-w-[280px]", md: "max-w-[420px]", lg: "max-w-[560px]", full: "max-w-full" }[size];
  return (
    <>
      <figure className={`my-4 cursor-pointer group mx-auto ${maxW}`} onClick={() => setZoomed(true)}>
        <div className="rounded-xl overflow-hidden border border-border shadow-sm group-hover:shadow-md transition-shadow">
          <img src={src} alt={alt} className="w-full" loading="lazy" />
        </div>
        <figcaption className="text-[11px] text-muted-foreground text-center mt-2">{caption}</figcaption>
      </figure>
      {zoomed && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cursor-pointer" onClick={() => setZoomed(false)}>
          <img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
}

// ── Step header component ──
function StepHeader({ step, title, subtitle, accent = false }: { step: string; title: string; subtitle: string; accent?: boolean }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-white text-sm font-bold shrink-0 ${accent ? "bg-gradient-to-br from-lavender to-peach shadow-lg shadow-lavender/20" : "bg-lavender"}`}>
          {step}
        </span>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// ── Tool badge ──
function ToolBadge({ name, role }: { name: string; role: "main" | "assist" }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
      role === "main"
        ? "bg-lavender text-white"
        : "bg-muted text-muted-foreground"
    }`}>
      {role === "main" && <Star className="w-3 h-3" />}
      {name}
    </span>
  );
}

// ── Main Page ──
export default function Home() {
  const s0 = useFadeIn();
  const s1 = useFadeIn();
  const s2 = useFadeIn();
  const s3 = useFadeIn();
  const s4 = useFadeIn();
  const s5 = useFadeIn();
  const sMidCta = useFadeIn();
  const sPricing = useFadeIn();
  const sPrivacy = useFadeIn();
  const sInstall = useFadeIn();
  const sCta = useFadeIn();

  // Track scroll depth
  useScrollDepthTracker();

  // Track page view on mount
  useEffect(() => { trackEvent("page_view", { page: "kol_guide" }); }, []);

  // Tracked link click helper
  const onLinkClick = useCallback((eventName: string, data?: Record<string, string>) => {
    trackEvent(eventName, data);
  }, []);

  return (
    <div className="min-h-screen bg-warm-white">
      {/* ── HERO SECTION ── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-warm-white/60 via-warm-white/80 to-warm-white" />
        </div>
        <div className="relative container pt-12 pb-16 sm:pt-16 sm:pb-20">
          {/* Branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-white font-bold text-sm">📚</div>
            <div>
              <p className="text-sm font-semibold text-foreground">대학원생을 위한 논문 연구 가이드</p>
              <p className="text-xs text-muted-foreground">영어 논문 번역 완벽 가이드</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-foreground mb-4">
            영어 논문,<br />
            검색부터 번역, 정리까지<br />
            <span className="text-lavender">한 번에 끝내는 가이드</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mb-6">
            영어 논문 앞에만 서면 막막한 대학원생분들을 위해 준비했어요.
            직접 써보고 진짜 도움 된 것들만 모았습니다.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["논문 연구 5단계 워크플로우", "실전 도구 가이드", "기본 기능 무료"].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-lavender-light text-lavender text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://immersivetranslate.com/ko/?utm_source=kol_guide&utm_medium=resource_pack"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onLinkClick("cta_click", { location: "hero", type: "install" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lavender text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-lavender/20"
          >
            무료로 시작하기 <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="container pb-20">

        {/* ── TRIAL CODE BANNER ── */}
        <section className="mt-10">
          <div className="bg-gradient-to-r from-peach-light/80 to-lavender-light/60 border border-peach/30 rounded-2xl p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-peach flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground mb-1">🎁 크리에이터에게 받은 코드가 있으신가요?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  이 가이드를 공유한 크리에이터가 <strong className="text-foreground">Pro 1주일 무료 체험 코드</strong>(추첨 5명)와 <strong className="text-foreground">10% 할인 코드</strong>를 제공하고 있어요. 코드를 받으셨다면 아래에서 바로 입력하세요!
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://immersivetranslate.com/ko/exchange/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onLinkClick("cta_click", { location: "trial_banner", type: "pro_trial" })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-peach text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    받은 코드 입력하기 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-2">💡 코드가 없어도 괜찮아요! 기본 기능(PDF 번역, 웹페이지 이중 언어, YouTube 자막)은 <strong className="text-peach">완전 무료</strong>예요.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── OVERVIEW: 가이드 구성 ── */}
        <section ref={s0.ref} className={`${s0.className} mt-14`}>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">📋 이 가이드의 구성</h2>
          <p className="text-sm text-muted-foreground mb-6">
            영어 논문 연구의 전 과정을 5단계로 나누고, 각 단계에서 실제로 쓰는 도구들을 정리했어요.
          </p>

          <div className="space-y-2.5">
            {[
              { step: "1", title: "자료 조사", desc: "연구 주제 탐색", tools: "Perplexity + Immersive Translate", icon: <Search className="w-4 h-4" /> },
              { step: "2", title: "논문 검색", desc: "핵심 논문 찾기", tools: "Connected Papers · Liner + Immersive Translate", icon: <Network className="w-4 h-4" /> },
              { step: "3", title: "논문 번역 ⭐", desc: "PDF 완벽 번역", tools: "Immersive Translate (BabelDOC)", icon: <Languages className="w-4 h-4" />, accent: true },
              { step: "4", title: "논문 정리", desc: "문헌 관리", tools: "Zotero + Immersive Translate", icon: <FolderOpen className="w-4 h-4" /> },
              { step: "5", title: "심화 학습", desc: "논문 이해 심화", tools: "Scispace · YouTube 이중 자막", icon: <GraduationCap className="w-4 h-4" /> },
            ].map((item) => (
              <div key={item.step} className={`flex items-center gap-4 rounded-xl p-4 border transition-colors ${item.accent ? "bg-lavender-light/40 border-lavender/30" : "bg-white/80 border-border hover:bg-lavender-light/20"}`}>
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold shrink-0 ${item.accent ? "bg-gradient-to-br from-lavender to-peach" : "bg-lavender/80"}`}>
                  {item.step}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <span className="text-xs text-muted-foreground">— {item.desc}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.tools}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>

          {/* Immersive Translate intro banner */}
          <div className="mt-6 bg-gradient-to-r from-lavender-light/60 to-peach-light/40 border border-lavender/20 rounded-xl p-5">
            <p className="text-sm text-foreground leading-relaxed">
              📌 이 가이드에서 가장 많이 등장하는 도구는 <strong className="text-lavender">Immersive Translate</strong>예요.
              논문 번역뿐 아니라 검색, 정리, 학습 등 연구의 거의 모든 단계에서 쓸 수 있어서,
              주변 대학원생들 사이에서 입소문 나고 있는 확장 프로그램이에요.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2.5 py-1 rounded-full bg-white/80 text-xs font-medium text-lavender">전 세계 2,000만+ 사용자</span>
              <span className="px-2.5 py-1 rounded-full bg-white/80 text-xs font-medium text-lavender">Chrome 2024 올해의 확장 프로그램</span>
              <span className="px-2.5 py-1 rounded-full bg-white/80 text-xs font-medium text-lavender">GitHub Trending 3위</span>
            </div>
          </div>
        </section>

        {/* ── PAIN POINT ── */}
        <section ref={s1.ref} className={`${s1.className} mt-16`}>
          <div className="bg-peach-light/60 border border-peach/20 rounded-xl p-5 mb-4">
            <p className="text-sm font-semibold text-foreground mb-3">😩 혹시 이런 경험 있지 않나요?</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ["교수님이 \"이 논문 읽어와\" 하셨는데 30페이지 영어 PDF 보고 ", "멘붕"],
                ["구글 번역에 논문 넣으면 ", "수식이고 표고 다 깨짐"],
                ["Papago에 한 문단씩 복붙하다가 ", "하루가 감"],
                ["ChatGPT에 넣으면 페이지 제한 걸리고 ", "레이아웃도 날아감"],
                ["RISS에서 국내 논문은 찾겠는데 해외 논문은 ", "어디서 찾아야 할지 모르겠음"],
                ["읽은 논문 폴더에 넣어놓고 학위논문 문헌리뷰 쓸 때 ", "어디 갔는지 모름"],
              ].map(([prefix, bold], i) => (
                <li key={i} className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>{prefix}<strong className="text-foreground">{bold}</strong></span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-lavender-light/40 border border-lavender/20 rounded-xl p-5">
            <p className="text-sm text-foreground">
              💡 이 가이드는 이런 고민을 해결하기 위해 만들었어요.
              연구 워크플로우를 체계적으로 정리하면, 논문 읽는 속도가 <strong className="text-lavender">체감 2~3배</strong> 빨라져요.
              지금부터 실제로 쓰는 방법을 전부 공유할게요.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STEP 1: 자료 조사
        ══════════════════════════════════════════════ */}
        <section ref={s2.ref} className={`${s2.className} mt-20`}>
          <StepHeader step="1" title="자료 조사 — 연구 주제 탐색" subtitle="논문을 읽기 전에, 먼저 '뭘 읽어야 하는지'를 파악하는 게 첫 번째예요" />

          <div className="flex flex-wrap gap-2 mb-6">
            <ToolBadge name="Perplexity" role="assist" />
            <ToolBadge name="Immersive Translate" role="main" />
          </div>

          <Expandable title="Perplexity — AI 기반 리서치" defaultOpen={true} icon={<Search className="w-4 h-4 text-lavender" />} trackName="perplexity">
            <p className="mb-3">
              새로운 연구 주제 시작할 때, 예전에는 Google이랑 네이버 학술정보에서 키워드 바꿔가며 탭을 수십 개 열었잖아요.
              이제는 <a href="https://www.perplexity.ai/" target="_blank" rel="noopener noreferrer" className="text-lavender font-semibold hover:underline">Perplexity</a>에 질문 하나만 던지면 돼요.
            </p>
            <p className="mb-3">
              Perplexity는 AI 검색 엔진인데, 질문하면 <strong className="text-foreground">출처가 달린 종합 답변</strong>을 줘요.
              <strong> Deep Research</strong> 기능을 쓰면 AI가 수십 개 소스를 자동으로 탐색해서 보고서처럼 정리해 줘요.
            </p>
            <div className="bg-sage-light/60 rounded-lg p-4 mb-3">
              <p className="text-xs font-semibold text-foreground mb-2">이렇게 활용해 보세요:</p>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                  <span><strong className="text-foreground">연구 주제 탐색</strong> — "최근 3년간 LLM hallucination 관련 주요 연구 동향은?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                  <span><strong className="text-foreground">배경 지식 파악</strong> — "Transformer attention mechanism의 핵심 원리를 설명해줘"</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                  <span><strong className="text-foreground">연구 갭 발견</strong> — "federated learning에서 아직 해결되지 않은 주요 과제는?"</span>
                </li>
              </ul>
            </div>
            <div className="bg-lavender-light/40 rounded-lg p-4">
              <p className="text-xs text-foreground">
                💡 <strong>Perplexity + Immersive Translate 조합 팁</strong>: Perplexity 답변에 포함된 영어 출처 링크를 클릭하면,
                Immersive Translate가 <strong className="text-lavender">해당 페이지를 이중 언어로 자동 번역</strong>해 줘요.
                영어 원문 아래에 한국어가 바로 나오니까, 출처 확인하면서 내용도 동시에 이해할 수 있어요.
              </p>
            </div>
          </Expandable>
        </section>

        {/* ══════════════════════════════════════════════
            STEP 2: 논문 검색
        ══════════════════════════════════════════════ */}
        <section ref={s3.ref} className={`${s3.className} mt-20`}>
          <StepHeader step="2" title="논문 검색 — 핵심 논문 찾기" subtitle="좋은 연구의 시작은 좋은 논문을 찾는 거예요" />

          <div className="flex flex-wrap gap-2 mb-6">
            <ToolBadge name="Connected Papers" role="assist" />
            <ToolBadge name="Liner" role="assist" />
            <ToolBadge name="Immersive Translate" role="main" />
          </div>

          <div className="space-y-3">
            <Expandable title="Connected Papers — 시각적 논문 네트워크" defaultOpen={true} icon={<Network className="w-4 h-4 text-sage" />} trackName="connected_papers">
              <p className="mb-3">
                <a href="https://www.connectedpapers.com/" target="_blank" rel="noopener noreferrer" className="text-lavender font-semibold hover:underline">Connected Papers</a>는 <strong className="text-foreground">핵심 논문 1편</strong>을 입력하면,
                관련 논문들을 <strong className="text-foreground">네트워크 그래프</strong>로 보여주는 도구예요.
                약 2억 편의 논문 데이터베이스 기반이에요.
              </p>
              <div className="bg-sage-light/60 rounded-lg p-4 mb-3">
                <p className="text-xs font-semibold text-foreground mb-2">이렇게 활용하세요:</p>
                <ol className="space-y-1.5 text-xs list-decimal list-inside">
                  <li>내 연구와 가장 관련 있는 핵심 논문 1편을 입력</li>
                  <li>관련 논문들이 노드(원) 형태로 연결된 그래프가 나타남</li>
                  <li>원이 클수록 인용 수가 많고, 색이 진할수록 최신 논문</li>
                  <li>클릭하면 상세 정보 확인 가능</li>
                </ol>
              </div>
              <Screenshot src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402005199/VFNaN8wuaSe5mrA7yxWtac/screenshot-20260416-191032_81669094.webp" alt="Connected Papers 네트워크 그래프 화면" caption="Connected Papers — 핵심 논문을 중심으로 관련 논문들이 네트워크로 연결된 모습 (클릭하면 확대)" size="lg" />
              <div className="bg-lavender-light/40 rounded-lg p-4">
                <p className="text-xs text-foreground">
                  💡 <strong>Connected Papers + Immersive Translate 조합 팁</strong>: 발견한 논문의 Abstract 페이지(arXiv, PubMed 등)를 열면,
                  Immersive Translate가 <strong className="text-lavender">초록을 이중 언어로 번역</strong>해 줘요.
                  수십 편 중에서 실제로 읽어야 할 논문을 빠르게 걸러낼 수 있어요.
                </p>
              </div>
            </Expandable>

            <Expandable title="Liner — 논문 근거 찾기" icon={<Search className="w-4 h-4 text-peach" />} trackName="liner">
              <p className="mb-3">
                <a href="https://getliner.com/" target="_blank" rel="noopener noreferrer" className="text-lavender font-semibold hover:underline">Liner</a>는 특정 주장에 대한 <strong className="text-foreground">논문 근거를 찾아주는 AI 검색 도구</strong>예요.
                문헌 리뷰 쓸 때 "이 주장을 뒷받침하는 논문이 뭐가 있지?" 할 때 진짜 유용해요.
              </p>
              <div className="bg-peach-light/40 rounded-lg p-4">
                <p className="text-xs font-semibold text-foreground mb-2">활용 예시:</p>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-peach mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">논문 근거 검색</strong> — "이 주장을 뒷받침하는 논문을 찾아줘"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-peach mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">문헌 리뷰 보조</strong> — AI Agent가 관련 논문을 자동으로 수집·정리</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-peach mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">연구 갭 발견</strong> — 기존 연구에서 빠져있는 부분을 AI가 분석</span>
                  </li>
                </ul>
              </div>
            </Expandable>

            <Expandable title="웹에서 논문 훑어보기 — Immersive Translate 이중 언어 번역" icon={<Globe className="w-4 h-4 text-lavender" />} trackName="web_bilingual">
              <p className="mb-3">
                논문을 다운로드하기 전에, 웹에서 초록(Abstract)이랑 서론을 먼저 훑어보잖아요.
                이때 Chrome 자체 번역을 쓰면 원문이 사라지고 번역만 남아서, 전문 용어가 어떻게 번역됐는지 확인할 수가 없어요.
              </p>
              <p className="mb-3">
                Immersive Translate는 <strong className="text-foreground">원문 아래에 번역을 삽입</strong>하는 방식이라, 원문과 번역을 동시에 볼 수 있어요.
              </p>
              <Screenshot src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402005199/VFNaN8wuaSe5mrA7yxWtac/pasted_file_FmP6JN_image_5f65f008.webp" alt="arXiv 논문 페이지에서 이중 언어 번역된 모습" caption="arXiv 논문 페이지에서 이중 언어 번역 — 원문 아래에 한국어 번역이 바로 표시돼요 (클릭하면 확대)" size="lg" />
              <div className="bg-lavender-light/40 rounded-lg p-4">
                <p className="text-xs font-semibold text-foreground mb-2">특히 유용한 사이트:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ["arXiv", "Abstract 이중 언어 읽기"],
                    ["PubMed", "검색 결과 대량 스크리닝"],
                    ["RISS / DBpia", "해외 논문 영어 초록 확인"],
                    ["IEEE / ACM", "논문 상세 페이지 확인"],
                    ["Google Scholar", "핵심 내용 빠르게 파악"],
                    ["학회 프로시딩", "수백 편 제목 한꺼번에 번역"],
                  ].map(([site, desc]) => (
                    <div key={site} className="bg-white rounded-lg p-2.5">
                      <p className="font-semibold text-foreground">{site}</p>
                      <p className="text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Expandable>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STEP 3: 논문 번역 ⭐ (핵심)
        ══════════════════════════════════════════════ */}
        <section ref={s4.ref} className={`${s4.className} mt-20`}>
          <StepHeader step="3" title="논문 번역 — PDF 완벽 번역 ⭐" subtitle="이 가이드의 핵심이에요. 다른 번역 도구와 가장 큰 차이가 나는 부분이에요." accent={true} />

          <div className="flex flex-wrap gap-2 mb-6">
            <ToolBadge name="Immersive Translate (BabelDOC)" role="main" />
          </div>

          {/* Comparison Table */}
          <div className="rounded-2xl border border-border overflow-hidden bg-white mb-6">
            <div className="px-5 py-3 bg-lavender-light/30 border-b border-border">
              <p className="text-sm font-semibold text-foreground">🔬 다른 도구와 비교</p>
            </div>
            <div className="overflow-x-auto">
              <p className="text-[10px] text-muted-foreground px-5 pt-2 sm:hidden">← 좌우로 스크롤하세요 →</p>
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-3 font-semibold text-foreground">기능</th>
                    <th className="text-center p-3 font-semibold text-muted-foreground w-16">Google</th>
                    <th className="text-center p-3 font-semibold text-muted-foreground w-16">ChatGPT</th>
                    <th className="text-center p-3 font-semibold text-muted-foreground w-16">Papago</th>
                    <th className="text-center p-3 font-semibold text-lavender w-20">BabelDOC</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["수학 공식 보존", false, "partial", false, true],
                    ["표 레이아웃 유지", false, "partial", false, true],
                    ["2단 레이아웃 인식", false, false, false, true],
                    ["그래프 내 텍스트 번역", false, false, false, true],
                    ["스캔 PDF (OCR)", false, false, false, true],
                    ["이중 언어 대조", false, false, false, true],
                    ["최대 페이지 수", "제한", "~25p", "5천자", "5,000p"],
                  ] as const).map(([feature, g, c, p, b], i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="p-3 text-foreground">{feature}</td>
                      <td className="p-3 text-center">
                        {typeof g === "string" ? <span className="text-muted-foreground">{g}</span> : g ? <Check className="w-3.5 h-3.5 text-sage mx-auto" /> : <X className="w-3.5 h-3.5 text-red-300 mx-auto" />}
                      </td>
                      <td className="p-3 text-center">
                        {c === "partial" ? <span className="text-amber-400 text-xs">⚠️</span> : typeof c === "string" ? <span className="text-muted-foreground">{c}</span> : c ? <Check className="w-3.5 h-3.5 text-sage mx-auto" /> : <X className="w-3.5 h-3.5 text-red-300 mx-auto" />}
                      </td>
                      <td className="p-3 text-center">
                        {typeof p === "string" ? <span className="text-muted-foreground">{p}</span> : p ? <Check className="w-3.5 h-3.5 text-sage mx-auto" /> : <X className="w-3.5 h-3.5 text-red-300 mx-auto" />}
                      </td>
                      <td className="p-3 text-center bg-lavender-light/10">
                        {typeof b === "string" ? <span className="text-lavender font-semibold">{b}</span> : b ? <Check className="w-3.5 h-3.5 text-lavender mx-auto" /> : <X className="w-3.5 h-3.5 text-red-300 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Screenshot src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402005199/VFNaN8wuaSe5mrA7yxWtac/babeldoc_before_after_658d90b2.png" alt="BabelDOC 번역 전후 비교 — 수식이 포함된 논문 PDF" caption="📸 BabelDOC 번역 전후 비교 — 수식·표가 포함된 논문 PDF도 레이아웃이 그대로 유지돼요 (클릭하면 확대)" size="lg" />

          {/* Usage Steps */}
          <div className="bg-sage-light/40 border border-sage/20 rounded-xl p-5 mb-6">
            <p className="text-sm font-semibold text-foreground mb-3">📋 사용 방법 (딱 3단계)</p>
            <div className="space-y-3">
              {[
                ["1", "PDF 업로드", "BabelDOC 사이트에 논문 PDF를 업로드하거나, Chrome에서 PDF를 열고 Immersive Translate 아이콘 클릭"],
                ["2", "번역 설정", "목표 언어(한국어), 번역 모델(DeepL/DeepSeek 등), 이중 언어 모드 선택"],
                ["3", "번역 완료!", "수식·표·그래프가 그대로 보존된 이중 언어 PDF를 다운로드"],
              ].map(([num, title, desc]) => (
                <div key={num} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-sage flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{num}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instant Trial */}
          <div className="bg-gradient-to-r from-lavender-light/60 to-sage-light/40 border border-lavender/20 rounded-xl p-5 mb-6">
            <p className="text-sm font-semibold text-foreground mb-2">🚀 설치했으면 바로 체험해 보세요!</p>
            <p className="text-xs text-muted-foreground mb-3">
              아래 논문 링크를 열어서 Immersive Translate로 직접 번역해 보세요. "아, 이런 거구나" 하고 바로 느낄 수 있어요.
            </p>
            <div className="bg-white/80 rounded-lg p-4 border border-lavender/10">
              <p className="text-xs font-semibold text-foreground mb-2">📄 체험용 논문: Attention Is All You Need (Transformer 원조 논문)</p>
              <ol className="space-y-1 text-xs text-muted-foreground list-decimal list-inside mb-3">
                <li>아래 링크 클릭</li>
                <li>"View PDF" 클릭</li>
                <li>Immersive Translate 아이콘 클릭</li>
                <li>번역 시작!</li>
              </ol>
              <a
                href="https://arxiv.org/abs/1706.03762"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-lavender font-semibold hover:underline"
              >
                arxiv.org/abs/1706.03762 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Advanced Settings */}
          <p className="text-sm font-semibold text-foreground mb-3">🎯 고급 설정 — 번역 퀄리티를 한 단계 끌어올리는 법</p>
          <p className="text-xs text-muted-foreground mb-3">이거 아는 사람이 별로 없는데, 알고 나면 번역 품질이 확 달라져요.</p>
          <div className="space-y-3">
            <Expandable title="AI 용어 자동 추출" icon={<BookOpen className="w-4 h-4 text-lavender" />} trackName="ai_terminology">
              <p className="mb-3">
                논문에서 같은 용어가 문단마다 다르게 번역되는 거, 겪어보셨죠?
                BabelDOC은 번역을 시작하기 전에 <strong className="text-foreground">AI가 먼저 전체 문서를 훑고 핵심 용어를 추출</strong>해요.
                용어표를 기반으로 번역하기 때문에, 논문 전체에서 <strong className="text-foreground">용어가 일관되게</strong> 번역돼요.
              </p>
              <Screenshot src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402005199/VFNaN8wuaSe5mrA7yxWtac/pasted_file_nPL9uU_image_87236b4d.png" alt="BabelDOC 술어 설정 화면" caption="BabelDOC 용어집 및 자동 용어 추출 설정 화면 (클릭하면 확대)" size="md" />
              <div className="bg-lavender-light/40 rounded-lg p-4 mb-3">
                <p className="text-xs font-semibold text-foreground mb-2">설정 방법:</p>
                <ul className="space-y-1 text-xs">
                  <li>• 번역 옵션에서 "자동 용어 추출" 켜기</li>
                  <li>• 추천 조합: KIMI 모델(용어 추출) + DeepSeek/Qwen(본문 번역)</li>
                  <li>• 직접 용어 등록도 가능 — 내 분야 전문 용어를 등록하면 AI가 반드시 그 번역을 따라요</li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground">
                예시: "Attention Mechanism" → 항상 "어텐션 메커니즘", "Transformer" → 항상 "트랜스포머"
              </p>
            </Expandable>

            <Expandable title="맞춤형 역할 프롬프트 · AI 전문가 선택" icon={<Sparkles className="w-4 h-4 text-peach" />} trackName="ai_expert_prompt">
              <p className="mb-3">
                AI한테 <strong className="text-foreground">"학술 번역 전문가"라는 역할</strong>을 부여하면, 번역 퀄리티가 눈에 띄게 올라가요. Immersive Translate에는 다양한 AI 전문가 프리셋이 내장되어 있어요.
              </p>
              <Screenshot src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402005199/VFNaN8wuaSe5mrA7yxWtac/pasted_file_ivA5IU_image_9ede7f10.png" alt="Immersive Translate AI 전문가 선택 화면" caption="AI 전문가 프리셋 — Academic Paper Translation Expert 등 다양한 전문가를 선택할 수 있어요 (클릭하면 확대)" size="sm" />
              <div className="bg-muted/50 rounded-lg p-4 mb-3 font-mono text-xs">
                <p>당신은 [자신의 전공] 분야의 학술 논문 번역 전문가입니다.</p>
                <p>학술적 어조를 유지하고, 전문 용어는 해당 분야의 표준 한국어 번역을 사용하세요.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ["컴퓨터 과학", "딥러닝·NLP 분야 교수"],
                  ["생물학", "분자생물학 전공 연구원"],
                  ["경제학", "행동경제학 학술 번역가"],
                  ["심리학", "인지심리학 박사과정 연구자"],
                ].map(([field, role]) => (
                  <div key={field} className="bg-peach-light/40 rounded-lg p-2.5">
                    <p className="font-semibold text-foreground">{field}</p>
                    <p className="text-muted-foreground">{role}</p>
                  </div>
                ))}
              </div>
            </Expandable>

            <Expandable title="AI 번역 엔진 선택 가이드" icon={<Zap className="w-4 h-4 text-sage" />} trackName="engine_guide">
              <p className="mb-3">
                번역 엔진을 <strong className="text-foreground">직접 골라서</strong> 쓸 수 있어요. 논문 유형에 따라 최적의 엔진이 달라요.
              </p>
              <div className="space-y-2">
                {[
                  { name: "DeepL", desc: "가장 자연스러운 번역, '사람이 쓴 것 같다'는 평가", use: "인문·사회과학 논문" },
                  { name: "DeepSeek", desc: "빠르고 안정적, 기술 용어에 강함", use: "이공계 논문, 대량 번역" },
                  { name: "Claude", desc: "문맥 파악 능력 최상, 긴 논문에 강함", use: "Review 논문, 50페이지+" },
                  { name: "GPT-4", desc: "전반적으로 우수한 범용 모델", use: "학제간 연구" },
                  { name: "Gemini", desc: "Google 학술 데이터 기반", use: "최신 트렌드 논문" },
                ].map((engine) => (
                  <div key={engine.name} className="flex items-start gap-3 bg-white rounded-lg border border-border/50 p-3">
                    <div className="w-8 h-8 rounded-lg bg-lavender-light flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-lavender" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{engine.name}</p>
                      <p className="text-xs text-muted-foreground">{engine.desc}</p>
                      <p className="text-xs text-lavender mt-0.5">추천: {engine.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Expandable>

            <Expandable title="다중 모델 병렬 번역 · 리치 텍스트 번역" icon={<FileText className="w-4 h-4 text-lavender" />} trackName="parallel_richtext">
              <p className="mb-3">
                AI 모델 하나로 부족하다면? <strong className="text-foreground">두 개를 동시에 돌리면 돼요.</strong>
                KIMI가 용어를 추출하고, DeepSeek가 본문을 번역하고, 두 결과를 비교해서 더 나은 쪽을 선택하는 방식이에요.
              </p>
              <p className="mb-3">
                <strong className="text-foreground">리치 텍스트 번역</strong>을 켜면 굵은 글씨, 기울임, 제목 크기 같은 서식까지 그대로 유지돼요.
              </p>
              <div className="bg-sage-light/40 rounded-lg p-4">
                <p className="text-xs font-semibold text-foreground mb-2">설정 팁:</p>
                <ul className="space-y-1 text-xs">
                  <li>• 설정에서 "리치 텍스트 번역" → "고급 모델에서만 활성화" 선택</li>
                  <li>• "단락 내 비공식 선 제거" 옵션으로 수학 공식 보존</li>
                </ul>
              </div>
            </Expandable>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            MID-FUNNEL CTA — after Step 3
        ══════════════════════════════════════════════ */}
        <section ref={sMidCta.ref} className={`${sMidCta.className} mt-14`}>
          <div className="bg-gradient-to-br from-lavender/10 via-peach-light/30 to-lavender-light/20 border border-lavender/20 rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-lg sm:text-xl font-bold text-foreground mb-2">
              ✨ 여기까지 읽으셨다면, 한번 직접 써보세요!
            </p>
            <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
              지금 바로 설치 → 아무 영어 논문 PDF 열기 → 번역 버튼 클릭.
              <strong className="text-foreground"> 무료 버전만으로도 PDF 번역, 웹페이지 이중 언어, YouTube 자막까지 전부 돼요.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://immersivetranslate.com/ko/?utm_source=kol_guide&utm_medium=resource_pack"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick("cta_click", { location: "mid_page", type: "install" })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-lavender text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-lavender/20"
              >
                <Zap className="w-4 h-4" /> 무료로 시작하기
              </a>
              <a
                href="https://immersivetranslate.com/ko/exchange/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick("cta_click", { location: "mid_page", type: "pro_trial" })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-peach/40 text-peach font-semibold text-sm hover:bg-peach-light/30 transition-colors"
              >
                <Gift className="w-4 h-4" /> 받은 코드 입력하기
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              크리에이터에게 받은 Pro 체험 코드 또는 10% 할인 코드가 있다면 👆 바로 입력해서 체험해 보세요!
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STEP 4: 논문 정리
        ══════════════════════════════════════════════ */}
        <section ref={s5.ref} className={`${s5.className} mt-20`}>
          <StepHeader step="4" title="논문 정리 — 문헌 관리" subtitle="논문 읽는 것만큼 중요한 게 읽은 논문을 체계적으로 정리하는 거예요" />

          <div className="flex flex-wrap gap-2 mb-6">
            <ToolBadge name="Zotero" role="assist" />
            <ToolBadge name="Immersive Translate" role="main" />
          </div>

          <div className="space-y-3">
            <Expandable title="Zotero — 무료 문헌 관리 도구" defaultOpen={true} icon={<FolderOpen className="w-4 h-4 text-sage" />} trackName="zotero">
              <p className="mb-3">
                <a href="https://www.zotero.org/" target="_blank" rel="noopener noreferrer" className="text-lavender font-semibold hover:underline">Zotero</a>는 전 세계 연구자들이 쓰는 <strong className="text-foreground">무료 오픈소스 참고문헌 관리 소프트웨어</strong>예요.
                학위논문 문헌리뷰 쓸 때 정리 안 해놨으면 진짜 멘붕 오는데, Zotero가 있으면 그런 걱정이 없어요.
              </p>
              <div className="bg-sage-light/60 rounded-lg p-4 mb-3">
                <p className="text-xs font-semibold text-foreground mb-2">핵심 기능:</p>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">원클릭 저장</strong> — 논문 웹사이트에서 메타데이터와 PDF를 자동으로 저장</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">자동 인용 생성</strong> — Word/Google Docs에서 APA, MLA, Chicago 등 인용 자동 생성</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">무료 PDF 검색</strong> — 유료 논문이라도 무료 공개 버전을 자동으로 찾아줌</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">철회 논문 경고</strong> — 인용하려는 논문이 철회된 경우 경고 표시</span>
                  </li>
                </ul>
              </div>
              <Screenshot src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402005199/VFNaN8wuaSe5mrA7yxWtac/pasted_file_TMT5Gx_image_771e83a3.webp" alt="Zotero 메인 화면" caption="Zotero 메인 화면 — 논문 목록과 태그 분류 (클릭하면 확대)" size="lg" />
            </Expandable>

            <Expandable title="Zotero × Immersive Translate 연동 — 게임 체인저" icon={<Languages className="w-4 h-4 text-lavender" />} trackName="zotero_integration">
              <p className="mb-3">
                Immersive Translate의 Zotero 플러그인을 설치하면, <strong className="text-foreground">Zotero 안에서 바로 BabelDOC 번역</strong>을 할 수 있어요. 이거 진짜 게임 체인저예요.
              </p>
              <div className="bg-lavender-light/40 rounded-lg p-4 mb-3">
                <p className="text-xs font-semibold text-foreground mb-2">설정 방법 (5단계):</p>
                <ol className="space-y-1 text-xs list-decimal list-inside">
                  <li>Zotero에서 Immersive Translate 플러그인 설치</li>
                  <li>설정에서 BabelDOC 인증 코드 입력 (개인 페이지에서 발급)</li>
                  <li>번역할 PDF 선택</li>
                  <li>우클릭 → "Immersive Translate" → 목표 언어, 번역 모델 설정</li>
                  <li>번역 완료! 번역된 PDF가 원본 첨부파일로 자동 연결</li>
                </ol>
              </div>

              <Screenshot src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402005199/VFNaN8wuaSe5mrA7yxWtac/pasted_file_mwdxoN_image_9ce27243.png" alt="Zotero에서 Immersive Translate 연동 화면" caption="Zotero × Immersive Translate 연동 — 우클릭 한 번으로 논문 번역 (클릭하면 확대)" size="lg" />

              {/* Before/After comparison */}
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold text-red-400 bg-red-50/50">기존 방식</th>
                      <th className="text-left p-3 font-semibold text-lavender bg-lavender-light/30">Zotero + Immersive Translate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["PDF 다운 → 브라우저에서 열기 → 번역 → 따로 저장", "Zotero에서 우클릭 한 번으로 끝"],
                      ["번역본과 원본이 따로 관리됨", "번역본이 원본의 첨부파일로 자동 연결"],
                      ["메타데이터(저자, 출처) 수동 입력", "메타데이터가 자동으로 함께 관리"],
                    ].map(([before, after], i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="p-3 text-muted-foreground">{before}</td>
                        <td className="p-3 text-foreground bg-lavender-light/10 font-medium">{after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ⚠️ Zotero 플러그인은 현재 Pro 회원 전용 기능이에요.
              </p>
            </Expandable>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STEP 5: 심화 학습
        ══════════════════════════════════════════════ */}
        <section className="mt-20">
          <StepHeader step="5" title="심화 학습 — 더 깊이 이해하기" subtitle="논문을 읽은 후에 더 깊이 이해하고 싶을 때 쓸 수 있는 도구들이에요" />

          <div className="flex flex-wrap gap-2 mb-6">
            <ToolBadge name="Scispace" role="assist" />
            <ToolBadge name="Immersive Translate" role="main" />
          </div>

          <div className="space-y-3">
            <Expandable title="Scispace — AI와 함께 논문 읽기" icon={<BookOpen className="w-4 h-4 text-sage" />} trackName="scispace">
              <p className="mb-3">
                <a href="https://typeset.io/" target="_blank" rel="noopener noreferrer" className="text-lavender font-semibold hover:underline">Scispace</a>는 논문을 업로드하면 <strong className="text-foreground">AI와 대화하면서 내용을 파악</strong>할 수 있는 도구예요.
                2.8억 편의 논문 데이터베이스를 기반으로 동작해요.
              </p>
              <div className="bg-sage-light/60 rounded-lg p-4">
                <p className="text-xs font-semibold text-foreground mb-2">이렇게 활용하세요:</p>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">어려운 단락 이해</strong> — 특정 부분을 선택하면 AI가 쉽게 풀어서 설명</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">방법론 파악</strong> — "이 논문의 실험 방법을 요약해 줘"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                    <span><strong className="text-foreground">관련 논문 추천</strong> — 읽고 있는 논문과 관련된 다른 논문을 추천</span>
                  </li>
                </ul>
              </div>
            </Expandable>

            <Expandable title="YouTube 학술 영상 — 이중 언어 자막" icon={<GraduationCap className="w-4 h-4 text-peach" />} trackName="youtube_subtitles">
              <p className="mb-3">
                논문 저자가 직접 발표한 학회 영상이나 강의를 찾았을 때,
                Immersive Translate의 <strong className="text-foreground">이중 언어 자막</strong> 기능이 정말 유용해요.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                {[
                  ["MIT OpenCourseWare", "MIT 공개 강의"],
                  ["Stanford Online", "스탠포드 대학 강의"],
                  ["Two Minute Papers", "최신 AI 논문 해설"],
                  ["학회 공식 채널", "NeurIPS, ICML, ACL"],
                ].map(([name, desc]) => (
                  <div key={name} className="bg-peach-light/40 rounded-lg p-2.5">
                    <p className="font-semibold text-foreground">{name}</p>
                    <p className="text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                💡 자막 내보내기 기능으로 강의 내용을 텍스트로 저장할 수도 있어요. 시험 준비할 때 유용해요!
              </p>
            </Expandable>

            <Expandable title="추가 기능: 마우스 오버 번역 · AI 간소화 · AI Reply" icon={<Sparkles className="w-4 h-4 text-lavender" />} trackName="extra_features">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">🔍 마우스 오버 번역</p>
                  <p className="text-xs">논문 읽다가 모르는 단어나 문장이 나오면, 마우스로 드래그하기만 하면 바로 번역 팝업이 떠요.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">🧠 AI 간소화 (AI Simplify)</p>
                  <p className="text-xs">복잡한 영어 원문을 쉬운 영어로 다시 써주는 기능이에요. 영어 실력도 키우면서 논문을 읽고 싶은 분께 추천해요.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">📧 AI Reply — 교수님 이메일 답장</p>
                  <p className="text-xs">Gmail에서 영어 이메일을 받으면 AI가 내용을 자동 요약하고, 영어 답장 초안까지 만들어 줘요.</p>
                  <Screenshot src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402005199/VFNaN8wuaSe5mrA7yxWtac/pasted_file_pFTuCv_image_5fdf479d.png" alt="Gmail AI Reply 화면" caption="AI Reply — Gmail에서 영어 이메일 요약 및 답장 초안 자동 생성 (클릭하면 확대)" size="lg" />
                </div>
              </div>
            </Expandable>
          </div>
        </section>

        {/* ── TOOL OVERVIEW ── */}
        <section className="mt-20">
          <div className="rounded-2xl border border-border overflow-hidden bg-white">
            <div className="px-5 py-3 bg-lavender-light/30 border-b border-border">
              <p className="text-sm font-semibold text-foreground">📌 이 가이드에서 소개한 도구 한눈에 보기</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-semibold text-foreground">단계</th>
                  <th className="text-left p-3 font-semibold text-foreground">도구</th>
                  <th className="text-left p-3 font-semibold text-foreground hidden sm:table-cell">용도</th>
                  <th className="text-center p-3 font-semibold text-foreground w-16">가격</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["자료 조사", "Perplexity", "AI 기반 리서치", "무료+", "https://www.perplexity.ai/"],
                  ["논문 검색", "Connected Papers", "시각적 논문 네트워크", "무료", "https://www.connectedpapers.com/"],
                  ["논문 검색", "Liner", "논문 근거 검색", "무료+", "https://getliner.com/"],
                  ["논문 번역 ⭐", "Immersive Translate", "PDF·웹·자막 번역", "무료+", "https://immersivetranslate.com/ko/"],
                  ["논문 정리", "Zotero", "문헌 관리·인용 생성", "무료", "https://www.zotero.org/"],
                  ["심화 학습", "Scispace", "AI와 함께 논문 이해", "무료+", "https://typeset.io/"],
                ].map(([stage, tool, use, price, url], i) => (
                  <tr key={i} className={`border-b border-border/50 last:border-0 ${tool === "Immersive Translate" ? "bg-lavender-light/10" : ""}`}>
                    <td className="p-3 text-muted-foreground">{stage}</td>
                    <td className={`p-3 font-medium ${tool === "Immersive Translate" ? "text-lavender" : "text-foreground"}`}>
                      <a href={url as string} target="_blank" rel="noopener noreferrer" className="hover:underline">{tool}</a>
                    </td>
                    <td className="p-3 text-muted-foreground hidden sm:table-cell">{use}</td>
                    <td className="p-3 text-center text-muted-foreground">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Immersive Translate는 번역뿐 아니라, 검색(웹페이지 이중 언어), 정리(Zotero 연동), 학습(영상 자막) 등 연구 전 과정에서 활용할 수 있어요.
          </p>
        </section>

        {/* ── PRICING ── */}
        <section ref={sPricing.ref} className={`${sPricing.className} mt-20`}>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">📊 요금제 비교: Free vs Pro vs Max</h2>
          <p className="text-sm text-muted-foreground mb-6">
            솔직히 <strong className="text-foreground">무료 버전만으로도 꽤 쓸 만해요</strong>. 하지만 논문을 매일 읽는 대학원생이라면 Pro를 쓰면 확실히 달라요.
          </p>

          <div className="rounded-2xl border border-border overflow-hidden bg-white">
            <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[360px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 sm:p-3 font-semibold text-foreground bg-muted/50 min-w-[100px]">기능</th>
                  <th className="text-center p-2 sm:p-3 font-semibold text-foreground bg-muted/50 w-14 sm:w-16">무료</th>
                  <th className="text-center p-2 sm:p-3 font-semibold text-lavender bg-lavender-light/30 w-20 sm:w-24">Pro ✨<br /><span className="text-[10px] font-normal">약 13,000원/월</span></th>
                  <th className="text-center p-2 sm:p-3 font-semibold text-peach bg-peach-light/30 w-20 sm:w-24">Max<br /><span className="text-[10px] font-normal">약 33,000원/월</span></th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["웹페이지 이중 언어 번역", true, true, true],
                  ["BabelDOC PDF 번역", true, true, true],
                  ["수식·표 레이아웃 보존", true, true, true],
                  ["YouTube 이중 자막", true, true, true],
                  ["고급 AI 엔진 (DeepL, DeepSeek, Gemini)", false, true, true],
                  ["최고급 AI 엔진 (GPT-4, Claude)", false, false, true],
                  ["AI 용어 자동 추출", false, true, true],
                  ["Zotero 플러그인", false, true, true],
                  ["AI Reply (이메일)", false, true, true],
                ].map(([feature, free, pro, max], i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="p-2 sm:p-3 text-foreground text-[11px] sm:text-xs">{feature as string}</td>
                    <td className="p-2 sm:p-3 text-center">
                      {free ? <Check className="w-3.5 h-3.5 text-sage mx-auto" /> : <X className="w-3.5 h-3.5 text-red-300 mx-auto" />}
                    </td>
                    <td className="p-2 sm:p-3 text-center bg-lavender-light/10">
                      {pro ? <Check className="w-3.5 h-3.5 text-lavender mx-auto" /> : <X className="w-3.5 h-3.5 text-red-300 mx-auto" />}
                    </td>
                    <td className="p-2 sm:p-3 text-center bg-peach-light/10">
                      {max ? <Check className="w-3.5 h-3.5 text-peach mx-auto" /> : <X className="w-3.5 h-3.5 text-red-300 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div className="mt-4 bg-lavender-light/30 border border-lavender/20 rounded-xl p-5">
            <p className="text-sm text-foreground">
              🎓 <strong>솔직한 추천</strong>: 무료 버전만으로도 웹페이지 번역이랑 기본 PDF 번역은 충분해요.
              그런데 <strong className="text-lavender">DeepL이나 DeepSeek 같은 고급 AI 엔진</strong>으로 돌려보면 품질 차이가 확 느껴져요.
              한 달에 커피 두 잔 값(약 13,000원)으로 논문 읽는 시간을 절반으로 줄일 수 있다면, 충분히 가치 있는 투자라고 생각해요.
            </p>
          </div>
        </section>

        {/* ── PRIVACY ── */}
        <section ref={sPrivacy.ref} className={`${sPrivacy.className} mt-20`}>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">🔒 아직 발표 전인 논문도 안심하고 번역하세요</h2>
          <p className="text-sm text-muted-foreground mb-6">
            "아직 발표 안 한 내 논문을 번역기에 넣어도 괜찮을까?" — 연구자라면 당연히 신경 쓰이는 부분이죠.
          </p>

          <div className="space-y-3">
            {[
              { icon: <Lock className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50", title: "번역 데이터 제로 보관", desc: "번역이 끝나면 서버에서 즉시 삭제돼요. 어디에도 저장되지 않아요." },
              { icon: <Shield className="w-5 h-5 text-sage" />, bg: "bg-sage-light", title: "AI 학습에 절대 사용 안 함", desc: "논문 내용이 AI 모델 훈련 데이터로 쓰이는 일은 절대 없어요." },
              { icon: <Sparkles className="w-5 h-5 text-lavender" />, bg: "bg-lavender-light", title: "전 구간 암호화 통신", desc: "번역 요청부터 결과 수신까지 전 과정이 암호화돼요." },
              { icon: <BookOpen className="w-5 h-5 text-peach" />, bg: "bg-peach-light", title: "오픈소스 (MIT 라이선스)", desc: "코드가 전부 공개되어 있어서 누구나 직접 검증할 수 있어요." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl border border-border p-5">
                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mt-20">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">❓ 자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              {
                q: "무료로 어디까지 쓸 수 있나요?",
                a: "웹페이지 이중 언어 번역, 기본 PDF 번역(BabelDOC 포함), YouTube 이중 자막까지 전부 무료예요. 고급 AI 엔진(DeepL, DeepSeek 등)을 쓰려면 Pro 이상이 필요해요."
              },
              {
                q: "ChatGPT로 논문 번역하는 거랑 뭐가 달라요?",
                a: "ChatGPT는 PDF를 직접 번역할 수 없어서 텍스트를 복사해서 넣어야 하고, 한 번에 약 25페이지 정도가 한계예요. 수식이나 표 레이아웃도 전부 날아가고요. BabelDOC은 PDF 구조를 그대로 유지하면서 최대 5,000페이지까지 번역할 수 있어요."
              },
              {
                q: "RISS나 DBpia에서도 쓸 수 있나요?",
                a: "네! RISS, DBpia, KISS 등 국내 학술 데이터베이스에서 영어 논문을 열 때도 이중 언어 번역이 잘 작동해요."
              },
              {
                q: "한국어 번역 품질은 어떤가요?",
                a: "BabelDOC은 한국어를 공식 지원하고, 특히 DeepL 엔진은 학술 번역에서 '가장 사람 같은 번역'이라는 평가를 받고 있어요."
              },
              {
                q: "한 번에 몇 페이지까지 번역되나요?",
                a: "단일 문서 기준 최대 5,000페이지까지 지원돼요."
              },
              {
                q: "번역 품질이 마음에 안 들면요?",
                a: "번역 모델을 바꿔보거나, 맞춤형 역할 프롬프트를 설정해 보세요. 그래도 문제가 있으면 번역 ID를 보관해 두고 고객 지원에 문의하면 해당 크레딧을 환불받을 수 있어요."
              },
            ].map((item, i) => (
              <Expandable key={i} title={item.q} icon={<span className="text-lavender font-bold text-xs">Q</span>}>
                <p className="text-sm">{item.a}</p>
              </Expandable>
            ))}
          </div>
        </section>

        {/* ── INSTALL GUIDE ── */}
        <section ref={sInstall.ref} className={`${sInstall.className} mt-20`}>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">⚡ Immersive Translate 시작하기</h2>

          <div className="space-y-4">
            {[
              ["1", "확장 프로그램 설치", "아래 버튼을 클릭하면 Immersive Translate 공식 페이지로 이동해요. Chrome, Edge, Firefox, Safari 모두 지원돼요."],
              ["2", "영어 웹페이지나 PDF 열기", "번역하고 싶은 영어 논문 페이지를 열거나, PDF 파일을 브라우저에서 열어주세요."],
              ["3", "번역 버튼 클릭 → 끝!", "브라우저 우측 상단의 Immersive Translate 아이콘을 클릭하면 원문 아래에 번역이 나란히 표시돼요."],
            ].map(([num, title, desc]) => (
              <div key={num} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-lavender-light flex items-center justify-center text-lavender font-bold text-sm shrink-0">{num}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://immersivetranslate.com/ko/?utm_source=kol_guide&utm_medium=resource_pack"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onLinkClick("cta_click", { location: "install_guide", type: "install" })}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-lavender text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-lavender/20"
          >
            <Zap className="w-4 h-4" />
            Immersive Translate 무료 설치하기
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>

        {/* ── FINAL CTA ── */}
        <section ref={sCta.ref} className={`${sCta.className} mt-20`}>
          <div className="relative rounded-2xl overflow-hidden">
            <img src={CTA_BG_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
            <div className="relative p-8 sm:p-12 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                논문 읽는 시간,<br />
                <span className="text-lavender">절반으로</span> 줄여보세요
              </p>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                기본 기능은 완전 무료예요. 크리에이터에게 받은 <strong className="text-foreground">Pro 체험 코드</strong> 또는 <strong className="text-foreground">10% 할인 코드</strong>가 있다면 아래에서 바로 입력하세요.
              </p>

              {/* Trial code reminder */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-peach-light/80 border border-peach/30 text-xs font-medium text-peach mb-5">
                <Gift className="w-3.5 h-3.5" />
                코드가 없어도 OK! 기본 기능은 완전 무료예요 😊
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://immersivetranslate.com/ko/?utm_source=kol_guide&utm_medium=resource_pack"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onLinkClick("cta_click", { location: "bottom_cta", type: "install" })}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-lavender text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-lavender/20"
                >
                  무료로 시작하기 <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://immersivetranslate.com/ko/exchange/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onLinkClick("cta_click", { location: "bottom_cta", type: "pro_trial" })}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-lavender/30 text-lavender font-semibold text-sm hover:bg-lavender-light/30 transition-colors"
                >
                  받은 코드 입력하기
                </a>
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                🏆 Chrome 웹스토어 2024 올해의 확장 프로그램 선정 · 전 세계 2,000만+ 사용자
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-white/50">
        <div className="container py-8 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            이 가이드가 도움이 됐다면, 주변 대학원생 친구들한테도 공유해 주세요! 📩
          </p>
          <p className="text-xs text-muted-foreground">
            더 자세한 사용법은 <a href="https://immersivetranslate.com/ko/learn/" target="_blank" rel="noopener noreferrer" className="text-lavender hover:underline">Immersive Translate 공식 튜토리얼</a>에서 확인할 수 있어요.
          </p>
        </div>
      </footer>
    </div>
  );
}
