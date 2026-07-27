import { useState, useEffect, useRef, useCallback } from "react";

// PDF path — works both locally (/) and on GitHub Pages (/phoebe-wang-portflio/)
const CV_URL = `${import.meta.env.BASE_URL}Phoebe_CV_Eng__version.pdf`;

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    /* 字体在 index.html 里用 <link> 加载，不在这里 @import——
       @import 要等这段 JS 注入的 <style> 生效后才开始下载，会拖慢首屏文字显示 */
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    /* ── 字体（两个主题共用）── */
    :root{
      --syne:'Syne',sans-serif;
      --dm:'DM Sans',sans-serif;
    }

    /* ── 深色主题（默认）──
       语义化命名：surface=面、line=描边、w/w2/m=文字三级、pk=粉、lv=紫、green=在职状态
       浅色主题只需覆盖同名变量，不用碰任何组件代码 */
    :root,:root[data-theme="dark"]{
      --bg:#07060f;
      --bg2:#0d0b19;

      --card:rgba(255,255,255,.04);
      --surface:rgba(255,255,255,.05);
      --surface-hover:rgba(255,255,255,.09);

      --line:rgba(255,255,255,.09);
      --line-strong:rgba(255,255,255,.15);
      --line-strongest:rgba(255,255,255,.22);

      --w:hsl(0,0%,96%);
      --w2:hsl(0,0%,72%);
      --m:hsl(0,0%,55%);
      --tagline:rgba(255,255,255,.62);

      --nav-bg:rgba(7,6,15,.94);
      --grid:rgba(255,255,255,.018);
      --hero-g1:rgba(80,45,130,.35);
      --hero-g2:rgba(150,55,100,.28);

      --pk:hsl(330,82%,62%);          /* 实心填充 */
      --pkl:hsl(330,82%,78%);         /* 粉色文字 */
      --pk-tag:hsl(330,82%,76%);
      --on-pk:#fff;                   /* 压在粉色填充上的文字 */
      --name:#fff;

      --pk-bg-subtle:rgba(232,99,154,.08);
      --pk-bg:rgba(232,99,154,.14);
      --pk-bg-strong:rgba(232,99,154,.2);
      --pk-line-subtle:rgba(232,99,154,.24);
      --pk-line:rgba(232,99,154,.3);
      --pk-line-strong:rgba(232,99,154,.44);
      --pk-divider:rgba(232,99,154,.36);

      --lv:hsl(272,68%,80%);
      --lv-bg:rgba(155,111,212,.12);
      --lv-line:rgba(155,111,212,.26);

      --green:hsl(142,72%,55%);
      --green-t:hsl(142,72%,72%);
      --green-bg:rgba(74,222,128,.08);
      --green-line:rgba(74,222,128,.28);

      --shadow:none;
      color-scheme:dark;
    }

    /* ── 浅色主题 ──
       粉色在白底上必须压暗，否则正文对比度不达标 */
    :root[data-theme="light"]{
      --bg:hsl(280,36%,99%);
      --bg2:hsl(276,34%,96.5%);

      --card:rgba(255,255,255,.8);
      --surface:rgba(58,30,88,.045);
      --surface-hover:rgba(58,30,88,.085);

      --line:rgba(45,25,70,.12);
      --line-strong:rgba(45,25,70,.18);
      --line-strongest:rgba(45,25,70,.26);

      --w:hsl(270,28%,13%);
      --w2:hsl(270,13%,33%);
      --m:hsl(270,9%,46%);
      --tagline:hsl(270,13%,33%);

      --nav-bg:rgba(252,251,254,.92);
      --grid:rgba(58,30,88,.04);
      --hero-g1:rgba(150,110,220,.2);
      --hero-g2:rgba(232,120,170,.18);

      --pk:hsl(330,74%,47%);
      --pkl:hsl(330,70%,40%);
      --pk-tag:hsl(330,66%,38%);
      --on-pk:#fff;
      --name:hsl(270,28%,13%);

      --pk-bg-subtle:rgba(200,40,120,.07);
      --pk-bg:rgba(200,40,120,.12);
      --pk-bg-strong:rgba(200,40,120,.18);
      --pk-line-subtle:rgba(200,40,120,.24);
      --pk-line:rgba(200,40,120,.32);
      --pk-line-strong:rgba(200,40,120,.5);
      --pk-divider:rgba(200,40,120,.4);

      --lv:hsl(272,48%,40%);
      --lv-bg:rgba(120,70,190,.1);
      --lv-line:rgba(120,70,190,.28);

      --green:hsl(142,62%,36%);
      --green-t:hsl(142,60%,28%);
      --green-bg:rgba(30,150,85,.1);
      --green-line:rgba(30,150,85,.3);

      --shadow:0 1px 2px rgba(45,25,70,.04),0 8px 24px -12px rgba(45,25,70,.12);
      color-scheme:light;
    }

    html{scroll-behavior:smooth}
    body{font-family:var(--dm);background:var(--bg);color:var(--w);overflow-x:hidden;line-height:1.65;font-size:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;transition:background .3s ease,color .3s ease}
    ::selection{background:var(--pk-bg-strong)}
    @keyframes f1{0%,100%{transform:translate(0,0)}50%{transform:translate(28px,-22px)}}
    @keyframes f2{0%,100%{transform:translate(0,0)}50%{transform:translate(-22px,32px)}}
    @keyframes bob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(7px)}}
    @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.55}}
    @keyframes pulseHero{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:var(--bg)}
    ::-webkit-scrollbar-thumb{background:var(--pk-line-strong);border-radius:2px}

    /* Tab scrollbar hide */
    .tab-scroll{scrollbar-width:none;-ms-overflow-style:none}
    .tab-scroll::-webkit-scrollbar{display:none}

    /* Highlight numbers/metrics inside bullets */
    .num{color:var(--pkl);font-weight:700;font-variant-numeric:tabular-nums;}

    /* ── Tablet ── */
    @media(max-width:980px){
      .si{padding:0 2.5rem!important}
      .ct-grid{grid-template-columns:1fr!important;gap:3rem!important}
    }

    /* ── Mobile ── */
    @media(max-width:680px){
      body{font-size:15px}
      .nav-bar{padding:.85rem 1.2rem!important}
      .nav-links{display:none!important}
      .nav-resume{display:none!important}   /* CV 入口移到汉堡菜单里，避免顶栏挤 */
      .nav-burger{display:inline-flex!important}
      .nav-sheet{display:flex!important}
      .si{padding:0 1.3rem!important}

      .hero-section{padding:7rem 1.3rem 5rem!important;min-height:auto!important}
      .hero-avatar{width:96px!important;height:96px!important}
      .hero-pill{font-size:.55rem!important;padding:.32rem .85rem!important;letter-spacing:.14em!important}
      .hero-name{font-size:clamp(3.2rem,16vw,4.6rem)!important;line-height:.92!important}
      .hero-fullname{font-size:.6rem!important;letter-spacing:.13em!important;margin-bottom:1.2rem!important}
      .hero-tags{flex-direction:column!important;gap:.5rem!important;align-items:center!important}
      .hero-tagline{font-size:1rem!important;max-width:none!important;margin-bottom:2rem!important}
      .hero-ctas{gap:.6rem!important;flex-direction:column!important;width:100%!important;max-width:300px!important;margin:0 auto!important}
      .hero-ctas a{width:100%!important;justify-content:center!important}

      .sec{padding:5rem 0!important}
      .stitle{font-size:2rem!important;margin-bottom:2rem!important}
      .slabel{font-size:.55rem!important}

      .tab-btn{padding:.85rem 1.3rem .8rem!important}
      .tab-co{font-size:.78rem!important}
      .tab-period{font-size:.55rem!important}
      .tab-tag{font-size:.5rem!important;padding:.12rem .45rem!important}

      .exp-card{padding:1.6rem 1.3rem!important}
      .exp-co{font-size:1.1rem!important}
      .exp-role{font-size:.78rem!important}
      .exp-line{font-size:.7rem!important}
      .exp-period{font-size:.62rem!important;padding:.22rem .6rem!important}
      .exp-bullet{font-size:.86rem!important;line-height:1.65!important}
      .exp-chip{font-size:.62rem!important;padding:.22rem .65rem!important}

      .proj-grid,.sk-grid,.edu-grid{grid-template-columns:1fr!important;gap:1rem!important}
      .proj-card,.edu-card{padding:1.7rem 1.4rem!important}
      .proj-title{font-size:1.02rem!important}
      .proj-desc{font-size:.86rem!important}
      .proj-link{font-size:.64rem!important;padding:.42rem .8rem!important}
      .sk-card{padding:1.5rem 1.4rem!important}
      .sk-tag{font-size:.78rem!important;padding:.32rem .8rem!important}

      .ct-h2{font-size:1.9rem!important}
      .ct-row{padding:.95rem 1.1rem!important}
      .ct-label{font-size:.55rem!important}
      .ct-val{font-size:.82rem!important}
      .ct-icon{width:36px!important;height:36px!important;font-size:.75rem!important}
      .ct-buttons{flex-direction:column!important}
      .ct-buttons a{width:100%!important;justify-content:center!important}

      .footer-row{flex-direction:column!important;text-align:center!important;gap:.6rem!important}
    }
  `}</style>
);

/* ─── DATA ──────────────────────────────────────────────────────────────── */
// Bullets use **highlight** spans — wrap numbers in {n} so we render bold gradient
const EXP = [
  {
    id:"netease", company:"NetEase", companyFull:"NetEase Network Co., Ltd",
    role:"Product Manager Intern", period:"Jan 2024 – Oct 2024", tag:"AI Product",
    tagline:"0→1 AI analytics platform · ChatBI · EasyCDP · EasyTag",
    bullets:[
      ["Architected a Natural Language → SQL → Visualization pipeline (RAG-based), boosting prompt accuracy by ",{n:"23%"}," and cutting re-queries by ",{n:"17%"}],
      ["Launched an intelligent forecast curve using MLP/CNN models — ",{n:"60%"}," user adoption and ",{n:"30%"}," uplift in advanced model usage"],
      ["Overhauled UI interaction flows, improving efficiency by ",{n:"64%"}," and reducing redundant page transitions by ",{n:"60%"}],
      ["Built a closed-loop CRM integration (EasyCDP) increasing repurchase rates by ",{n:"18%"}," and boosting retention ",{n:"1.5×"}],
      ["Cross-functioned with Tencent & TikTok Ads to raise ad targeting accuracy by ",{n:"19%"},", ROI by ",{n:"13.6%"},", and NPS from 3.8 → ",{n:"4.6"}],
    ],
    chips:["+23% Prompt Accuracy","60% Feature Adoption","+13.6% Ad ROI","1.5× Retention"],
  },
  {
    id:"xiaohongshu", company:"Xiaohongshu", companyFull:"Xiaohongshu Technology Co., Ltd.",
    role:"Product Data Analyst Intern", period:"Jun 2023 – Aug 2023", tag:"Analytics",
    tagline:"GMV funnel decomposition · real-time campaign optimization",
    bullets:[
      ["Built a multi-dimensional performance tracking system in SQL + Power BI across user, product, traffic, and transaction data"],
      ["Identified root-cause of a ",{n:"15% YoY"}," spike in checkout drop-offs through multi-dimensional GMV decomposition using SQL and Python"],
      ["Three core GMV driver recommendations on traffic reallocation and discount strategy adopted into leadership's future campaign roadmaps"],
    ],
    chips:["Checkout Root-cause Found","Strategy Adopted by Leadership"],
  },
  {
    id:"nielseniq", company:"NielsenIQ", companyFull:"NielsenIQ",
    role:"Product Demand Analyst Intern", period:"Jun 2022 – Aug 2022", tag:"Sentiment NLP",
    tagline:"Voice-of-customer NLP modeling for Volvo S90 product strategy",
    bullets:[
      ["Built a multi-source sentiment analysis model (reviews, interviews, market data) in Python for Volvo S90, surfacing key pain points for roadmap prioritization"],
      ["Applied SWOT & Porter's Five Forces to define ",{n:"3"}," critical feature optimization pillars: handling precision, power performance, and driving comfort"],
      ["Region-specific product adjustments delivered ",{n:"+10pt"}," NPS and ",{n:"+30%"}," GMV — significantly outperforming the XC60 benchmark"],
    ],
    chips:["+10pt NPS","+30% GMV"],
  },
];

// links: [{label, href}] — 有 live 的放前面，没链接的留空数组
const PROJECTS = [
  {
    type:"Sports Tech · AI Product · Shipped",
    title:"RallyPoint — AI Partner Matching",
    desc:"A live product that matches tennis and pickleball players on skill (NTRP/DUPR), weekly schedule overlap, court proximity, and a semantic playing-style signal from bio embeddings. Every match explains itself with reason chips — I chose transparency over a black-box score so players trust the suggestion enough to actually message someone. Shipped end to end: React 19 + TypeScript front end, Flask + PostgreSQL API, cookie-based auth, running in production.",
    tags:["React + TypeScript","Flask","PostgreSQL","Embeddings","Explainable Matching"],
    links:[
      {label:"Live Site",href:"https://app.tryrallypoint.com"},
      {label:"GitHub",href:"https://github.com/phoebewong214/rallypoint"},
    ],
  },
  {
    type:"FinTech · ML + Product",
    title:"OmniBank Fraud & Risk Intelligence",
    desc:"An end-to-end fraud risk system for small-business finance teams: a Python pipeline scores transactions, exports them as JSON, and a React dashboard surfaces them for review. The interesting problem was measurement, not modeling — with fraud at well under 1% of volume, accuracy is meaningless, so I evaluated on PR-AUC and precision-at-threshold and made the precision/recall tradeoff an explicit, tunable product decision instead of a hidden default.",
    tags:["Python","Scikit-learn","Imbalanced Data","React Dashboard","Risk Thresholds"],
    links:[
      {label:"GitHub",href:"https://github.com/phoebewong214/omnibank-agentic-platform"},
    ],
  },
  {
    type:"InsurTech · Full-Stack Build",
    title:"Cross-Border Auto Insurance Platform",
    desc:"Built a full-stack platform (PHP + MySQL) digitalizing Guangdong–Hong Kong–Macau cross-border car insurance, targeting a drop from a 7–10 day paper process to 1–2 days. Connected car owners, insurers, and regulators in one workflow with real-time application tracking — replacing the repeated manual data entry and total lack of status visibility that made the original process so painful. Undergraduate capstone, University of Macau.",
    tags:["PHP","MySQL","Workflow Design","Systems Integration","UX Research"],
    links:[
      {label:"GitHub",href:"https://github.com/phoebewong214/cross-border-insurance-platform"},
    ],
  },
  {
    type:"Risk Analytics · Data Mining",
    title:"Wire Transfer Fraud Detection",
    desc:"Applied CRISP-DM methodology to detect fraudulent wire transfers in R. Built and tuned logistic regression, decision trees, random forests, and neural networks — evaluated with AUC-ROC, F1-score, and recall to surface fraud patterns and inform risk control strategy.",
    tags:["R","Neural Networks","CRISP-DM","AUC-ROC"],
    links:[],
  },
];

const SKILLS = [
  {label:"Product & Design",hot:["User Research","A/B Testing","Go-to-Market"],normal:["Competitive Analysis","Figma","Miro","Agile / Scrum","Funnel Analysis","Stakeholder Mgmt"]},
  {label:"Data & Analytics",hot:["Python","SQL"],normal:["R","Pandas","NumPy","Matplotlib","Tableau","Power BI","Excel (Advanced)","Feature Engineering"]},
  {label:"AI & Machine Learning",hot:["LLM Applications","RAG Systems","Prompt Engineering"],normal:["NLP","Scikit-learn","Neural Networks","Supervised Learning","Model Evaluation","PyTorch"]},
  {label:"Languages",hot:["English (Fluent)","Mandarin (Native)","Cantonese (Native)"],normal:[]},
];

/* ─── HOOKS ─────────────────────────────────────────────────────────────── */
function useReveal(t=0.1){
  const ref=useRef(null);
  const [v,sv]=useState(false);
  useEffect(()=>{
    const el=ref.current; if(!el)return;
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){sv(true);o.disconnect();}},{threshold:t});
    o.observe(el);return()=>o.disconnect();
  },[]);
  return[ref,v];
}
function useScrolled(px=30){
  const[s,ss]=useState(false);
  useEffect(()=>{const h=()=>ss(window.scrollY>px);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[px]);
  return s;
}
function useIsMobile(){
  const[m,sm]=useState(false);
  useEffect(()=>{
    const check=()=>sm(window.innerWidth<=680);
    check();window.addEventListener("resize",check);return()=>window.removeEventListener("resize",check);
  },[]);
  return m;
}
// 初始主题由 index.html 里的内联脚本决定（localStorage → 系统偏好），
// 那段脚本在 React 挂载前就跑完了，避免首屏闪一下白/黑。
function useTheme(){
  const[theme,setTheme]=useState(()=>document.documentElement.getAttribute("data-theme")||"dark");
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme",theme);
    try{localStorage.setItem("pw-theme",theme);}catch{/* 无痕模式下忽略 */}
  },[theme]);
  // 用户没手动选过时，跟随系统切换
  useEffect(()=>{
    const mq=window.matchMedia("(prefers-color-scheme: light)");
    const onChange=e=>{
      let stored=null;
      try{stored=localStorage.getItem("pw-theme-manual");}catch{}
      if(!stored)setTheme(e.matches?"light":"dark");
    };
    mq.addEventListener("change",onChange);
    return()=>mq.removeEventListener("change",onChange);
  },[]);
  const toggle=useCallback(()=>{
    try{localStorage.setItem("pw-theme-manual","1");}catch{}
    setTheme(t=>t==="dark"?"light":"dark");
  },[]);
  return[theme,toggle];
}

/* ─── PRIMITIVES ─────────────────────────────────────────────────────────── */
function Reveal({children,delay=0,style={}}){
  const[ref,v]=useReveal();
  return(
    <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:`opacity .65s ease ${delay}s,transform .65s ease ${delay}s`,...style}}>
      {children}
    </div>
  );
}

const SLabel=({c})=>(
  <p className="slabel" style={{fontSize:".62rem",letterSpacing:".28em",textTransform:"uppercase",color:"var(--pk)",fontWeight:700,marginBottom:".7rem"}}>{c}</p>
);
const STitle=({c})=>(
  <h2 className="stitle" style={{fontFamily:"var(--syne)",fontSize:"clamp(2rem,3.6vw,2.8rem)",fontWeight:700,lineHeight:1.15,marginBottom:"3rem",letterSpacing:"-.01em"}}>
    {c}<span style={{color:"var(--pk)"}}>.</span>
  </h2>
);

function Card({children,style={},hover=true,className=""}){
  const[h,sh]=useState(false);
  return(
    <div
      className={className}
      style={{background:"var(--card)",border:`1px solid ${h&&hover?"var(--pk-line-strong)":"var(--line)"}`,borderRadius:20,backdropFilter:"blur(18px)",boxShadow:"var(--shadow)",transition:"border-color .3s,box-shadow .3s",...style}}
      onMouseEnter={()=>hover&&sh(true)} onMouseLeave={()=>sh(false)}
    >{children}</div>
  );
}

function Btn({href,download,children,variant="ghost",style={},className=""}){
  const[h,sh]=useState(false);
  const base={
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:".4rem",
    padding:".8rem 1.7rem",borderRadius:999,fontSize:".74rem",
    fontWeight:600,letterSpacing:".09em",textTransform:"uppercase",
    textDecoration:"none",transition:"all .25s",cursor:"pointer",
    fontFamily:"var(--dm)",border:"none",whiteSpace:"nowrap",
  };
  const variants={
    primary:{...base,background:"var(--pk)",color:"var(--on-pk)",transform:h?"translateY(-2px)":"translateY(0)"},
    ghost:{...base,border:"1px solid var(--line-strongest)",background:h?"var(--surface-hover)":"var(--card)",color:"var(--w)"},
    outline:{...base,border:"1px solid var(--pk-line-strong)",background:h?"var(--pk-bg)":"transparent",color:"var(--w)"},
  };
  return(
    <a href={href} download={download} target={href?.startsWith("http")?"_blank":undefined} rel="noreferrer"
      className={className}
      style={{...variants[variant],...style}} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}
    >{children}</a>
  );
}

// Render a bullet with highlighted numbers
function renderBullet(parts){
  return parts.map((p,i)=>{
    if(typeof p==="string")return <span key={i}>{p}</span>;
    return <span key={i} className="num">{p.n}</span>;
  });
}

/* ─── NAV ────────────────────────────────────────────────────────────────── */
const NAV_LINKS=["Experience","Projects","Skills","Education","Contact"];

// 图标用内联 SVG，不引第三方图标库（避免额外请求，且能跟随 currentColor 变主题）
const IconSun=()=>(
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>
  </svg>
);
const IconMoon=()=>(
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2z"/>
  </svg>
);

function ThemeToggle({theme,toggle,className=""}){
  const[h,sh]=useState(false);
  const next=theme==="dark"?"light":"dark";
  return(
    <button type="button" onClick={toggle} className={className}
      aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}
      style={{
        display:"inline-flex",alignItems:"center",justifyContent:"center",
        width:34,height:34,borderRadius:999,cursor:"pointer",flexShrink:0,
        background:h?"var(--surface-hover)":"var(--surface)",
        border:"1px solid var(--line-strong)",color:"var(--w2)",
        transition:"all .22s",
      }}
      onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}
    >{theme==="dark"?<IconSun/>:<IconMoon/>}</button>
  );
}

function Nav({theme,toggle}){
  const scrolled=useScrolled();
  const[aid,said]=useState("");
  const[open,setOpen]=useState(false);
  useEffect(()=>{
    const ids=NAV_LINKS.map(l=>l.toLowerCase());
    const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)said(e.target.id);}),{rootMargin:"-40% 0px -55% 0px"});
    ids.forEach(id=>{const el=document.getElementById(id);if(el)o.observe(el);});
    return()=>o.disconnect();
  },[]);
  // 菜单展开时锁滚动，并支持 Esc 关闭
  useEffect(()=>{
    document.body.style.overflow=open?"hidden":"";
    const onKey=e=>{if(e.key==="Escape")setOpen(false);};
    window.addEventListener("keydown",onKey);
    return()=>{document.body.style.overflow="";window.removeEventListener("keydown",onKey);};
  },[open]);

  return(
    <>
      <nav className="nav-bar" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"1.05rem 3rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled||open?"var(--nav-bg)":"transparent",backdropFilter:scrolled||open?"blur(28px)":"none",borderBottom:`1px solid ${scrolled&&!open?"var(--line)":"transparent"}`,transition:"all .4s cubic-bezier(.4,0,.2,1)"}}>
        <a href="#" style={{fontFamily:"var(--syne)",fontWeight:800,fontSize:".95rem",color:"var(--pkl)",textDecoration:"none",letterSpacing:".08em"}}>PW</a>
        <ul className="nav-links" style={{display:"flex",gap:"2rem",listStyle:"none"}}>
          {NAV_LINKS.map(l=>{
            const id=l.toLowerCase(),isA=aid===id;
            return(
              <li key={l}>
                <a href={`#${id}`} aria-current={isA?"true":undefined} style={{fontSize:".7rem",letterSpacing:".12em",textTransform:"uppercase",fontWeight:500,textDecoration:"none",color:isA?"var(--w)":"var(--w2)",borderBottom:`1px solid ${isA?"var(--pk)":"transparent"}`,paddingBottom:"3px",transition:"all .2s"}}>{l}</a>
              </li>
            );
          })}
        </ul>
        <div style={{display:"flex",alignItems:"center",gap:".6rem"}}>
          <ThemeToggle theme={theme} toggle={toggle}/>
          <Btn href={CV_URL} download variant="outline" className="nav-resume" style={{fontSize:".66rem",padding:".46rem 1.1rem"}}>↓ Resume</Btn>
          {/* 汉堡按钮：之前手机端导航是直接 display:none 隐藏的，等于没有导航 */}
          <button type="button" className="nav-burger" onClick={()=>setOpen(o=>!o)}
            aria-label={open?"Close menu":"Open menu"} aria-expanded={open}
            style={{display:"none",alignItems:"center",justifyContent:"center",width:34,height:34,borderRadius:10,cursor:"pointer",background:"var(--surface)",border:"1px solid var(--line-strong)",color:"var(--w)",flexShrink:0}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open?<path d="M6 6l12 12M18 6L6 18"/>:<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>}
            </svg>
          </button>
        </div>
      </nav>

      {/* 手机端全屏菜单 */}
      <div className="nav-sheet" onClick={()=>setOpen(false)}
        style={{
          position:"fixed",inset:0,zIndex:99,display:"none",
          flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1.6rem",
          background:"var(--nav-bg)",backdropFilter:"blur(28px)",
          opacity:open?1:0,pointerEvents:open?"auto":"none",transition:"opacity .28s ease",
        }}>
        {NAV_LINKS.map(l=>(
          <a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setOpen(false)}
            style={{fontFamily:"var(--syne)",fontSize:"1.5rem",fontWeight:700,textDecoration:"none",color:aid===l.toLowerCase()?"var(--pkl)":"var(--w)",letterSpacing:"-.01em"}}>{l}</a>
        ))}
        <Btn href={CV_URL} download variant="outline" style={{marginTop:".6rem"}}>↓ Download CV</Btn>
      </div>
    </>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────── */
// 照片放在 public/ 下即可，改这一行的文件名。
// 文件不存在时 onError 会回退到 "PW" 字母版，页面不会出现裂图。
const PHOTO_URL=`${import.meta.env.BASE_URL}photo.jpg`;

function Avatar(){
  const[failed,setFailed]=useState(false);
  const ring={
    width:132,height:132,borderRadius:"50%",
    padding:3,background:"linear-gradient(140deg,var(--pk),var(--lv))",
    boxShadow:"0 10px 34px -14px var(--pk-line-strong)",
  };
  const inner={
    width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover",display:"block",
    background:"var(--bg2)",
  };
  return(
    <div className="hero-avatar" style={ring}>
      {failed
        ? <div style={{...inner,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--syne)",fontWeight:800,fontSize:"2.4rem",letterSpacing:".04em",color:"var(--pkl)"}}>PW</div>
        : <img src={PHOTO_URL} alt="Tszching (Phoebe) Wang" width={126} height={126} style={inner} onError={()=>setFailed(true)}/>}
    </div>
  );
}

function Hero(){
  const[m,sm]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>sm(true),80);return()=>clearTimeout(t);},[]);
  const f=(d=0)=>({opacity:m?1:0,transform:m?"translateY(0)":"translateY(20px)",transition:`opacity .75s ease ${d}s,transform .75s ease ${d}s`});

  return(
    <section className="hero-section" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8rem 2rem 6rem",position:"relative",overflow:"hidden",textAlign:"center"}}>
      {/* Layered background — flat gradient, no glow orbs */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 25% 40%,var(--hero-g1) 0%,transparent 55%),radial-gradient(ellipse at 75% 60%,var(--hero-g2) 0%,transparent 50%),var(--bg)"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px)",backgroundSize:"80px 80px",maskImage:"radial-gradient(ellipse at center,black 30%,transparent 80%)",WebkitMaskImage:"radial-gradient(ellipse at center,black 30%,transparent 80%)"}}/>

      <div style={{position:"relative",zIndex:1,maxWidth:880,width:"100%"}}>

        {/* ── 头像 ── */}
        <div style={{...f(0),display:"flex",justifyContent:"center",marginBottom:"1.6rem"}}>
          <Avatar/>
        </div>

        {/* ── BADGES ROW ── */}
        <div className="hero-tags" style={{...f(.06),display:"flex",alignItems:"center",justifyContent:"center",gap:".7rem",flexWrap:"wrap",marginBottom:"1.8rem"}}>
          {/* Open to Work */}
          <div className="hero-pill" style={{display:"inline-flex",alignItems:"center",gap:".5rem",padding:".4rem 1rem",borderRadius:999,border:"1px solid var(--green-line)",background:"var(--green-bg)",backdropFilter:"blur(10px)",fontSize:".64rem",letterSpacing:".15em",textTransform:"uppercase",color:"var(--green-t)",fontWeight:600}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"var(--green)",display:"inline-block",animation:"pulseDot 2s ease-in-out infinite"}}/>
            Open to Work
          </div>
          {/* New Grad */}
          <div className="hero-pill" style={{display:"inline-flex",alignItems:"center",gap:".5rem",padding:".4rem 1rem",borderRadius:999,border:"1px solid var(--pk-line)",background:"var(--pk-bg-subtle)",backdropFilter:"blur(10px)",fontSize:".64rem",letterSpacing:".15em",textTransform:"uppercase",color:"var(--pkl)",fontWeight:600}}>
            ✦ New Grad · 2026
          </div>
          {/* Role */}
          <div className="hero-pill" style={{display:"inline-flex",alignItems:"center",gap:".5rem",padding:".4rem 1rem",borderRadius:999,border:"1px solid var(--line-strong)",background:"var(--surface)",backdropFilter:"blur(10px)",fontSize:".62rem",letterSpacing:".15em",textTransform:"uppercase",color:"var(--w2)"}}>
            PM · Data · AI
          </div>
        </div>

        {/* Name */}
        <h1 className="hero-name" style={{...f(.1),fontFamily:"var(--syne)",fontSize:"clamp(3.6rem,11vw,9.5rem)",fontWeight:800,lineHeight:.92,letterSpacing:"-.03em",marginBottom:".6rem"}}>
          <span style={{color:"var(--name)"}}>Tszching</span><br/>
          <span style={{color:"var(--pkl)"}}>(Phoebe) Wang.</span>
        </h1>

        <p className="hero-fullname" style={{...f(.2),fontSize:".74rem",letterSpacing:".18em",color:"var(--w2)",marginBottom:"1.6rem",textTransform:"uppercase",fontWeight:500}}>
          Northwestern MSIT '26 · Chicago, IL
        </p>

        {/* Tagline */}
        <p className="hero-tagline" style={{...f(.28),fontSize:"1.1rem",color:"var(--tagline)",fontWeight:300,maxWidth:520,margin:"0 auto 2.6rem",lineHeight:1.85}}>
          Building AI-powered products that turn data into decisions people actually adopt.
        </p>

        {/* CTAs */}
        <div className="hero-ctas" style={{...f(.36),display:"flex",gap:".85rem",justifyContent:"center",flexWrap:"wrap"}}>
          <Btn href="#experience" variant="primary">View My Work</Btn>
          <Btn href="#contact" variant="ghost">Get in Touch</Btn>
          <Btn href={CV_URL} download variant="outline">↓ Download CV</Btn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{position:"absolute",bottom:"2rem",left:"50%",animation:"bob 2.2s ease-in-out infinite"}}>
        <div style={{width:22,height:34,borderRadius:11,border:"2px solid var(--line-strongest)",display:"flex",justifyContent:"center",paddingTop:7}}>
          <div style={{width:4,height:8,borderRadius:2,background:"var(--pk)"}}/>
        </div>
      </div>
    </section>
  );
}

/* ─── EXPERIENCE — HORIZONTAL TABS ──────────────────────────────────────── */
function ExperienceSection(){
  const[active,setActive]=useState("netease");
  const[key,setKey]=useState(0);
  const cardRef=useRef(null);

  const switchTo=useCallback((id)=>{
    if(id===active)return;
    if(cardRef.current){cardRef.current.style.opacity="0";cardRef.current.style.transform="translateY(10px)";}
    setTimeout(()=>{
      setActive(id);setKey(k=>k+1);
      if(cardRef.current){cardRef.current.style.opacity="1";cardRef.current.style.transform="translateY(0)";}
    },180);
  },[active]);

  const exp=EXP.find(e=>e.id===active);

  return(
    <section id="experience" className="sec" style={{padding:"7rem 0",background:"var(--bg)"}}>
      <div className="si" style={{maxWidth:1080,margin:"0 auto",padding:"0 4rem"}}>
        <Reveal><SLabel c="Experience"/></Reveal>
        <Reveal delay={.05}><STitle c="Where I've Built Things"/></Reveal>

        {/* ── Horizontal tab bar ── */}
        <Reveal delay={.1}>
          <div className="tab-scroll" style={{display:"flex",gap:0,marginBottom:"2rem",borderBottom:"1px solid var(--line)",overflowX:"auto",position:"relative"}}>
            {EXP.map((e)=>{
              const isA=active===e.id;
              return(
                <button key={e.id} onClick={()=>switchTo(e.id)} className="tab-btn"
                  style={{
                    flex:"0 0 auto",background:"none",border:"none",cursor:"pointer",
                    padding:"1.15rem 1.9rem 1.05rem",position:"relative",
                    display:"flex",flexDirection:"column",alignItems:"flex-start",gap:".25rem",
                    transition:"all .25s",
                    borderBottom:`2px solid ${isA?"var(--pk)":"transparent"}`,
                    marginBottom:"-1px",
                  }}
                >
                  <span className="tab-co" style={{fontFamily:"var(--syne)",fontSize:".95rem",fontWeight:700,color:isA?"var(--pkl)":"var(--w2)",transition:"color .25s",whiteSpace:"nowrap"}}>{e.company}</span>
                  <span className="tab-period" style={{fontSize:".64rem",color:isA?"var(--w2)":"var(--m)",letterSpacing:".04em",transition:"color .25s",whiteSpace:"nowrap",fontWeight:500}}>{e.period}</span>
                  <span className="tab-tag" style={{fontSize:".56rem",letterSpacing:".1em",textTransform:"uppercase",padding:".15rem .55rem",borderRadius:999,background:isA?"var(--pk-bg)":"var(--surface)",border:`1px solid ${isA?"var(--pk-line)":"var(--line)"}`,color:isA?"var(--pkl)":"var(--m)",transition:"all .25s",display:"inline-block",fontWeight:600}}>{e.tag}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ── Active card ── */}
        <div ref={cardRef} key={key} style={{transition:"opacity .2s ease,transform .2s ease"}}>
          <Card className="exp-card" style={{padding:"2.5rem"}}>
            {/* Header */}
            <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",marginBottom:"1.7rem"}}>
              <div>
                <div className="exp-co" style={{fontFamily:"var(--syne)",fontSize:"1.35rem",fontWeight:700,color:"var(--pkl)",marginBottom:".3rem"}}>{exp.companyFull}</div>
                <div className="exp-role" style={{fontSize:".9rem",color:"var(--w2)",marginBottom:".25rem",fontWeight:500}}>{exp.role}</div>
                <div className="exp-line" style={{fontSize:".76rem",color:"var(--m)",fontStyle:"italic"}}>{exp.tagline}</div>
              </div>
              <span className="exp-period" style={{fontSize:".72rem",color:"var(--w2)",letterSpacing:".06em",padding:".3rem .8rem",border:"1px solid var(--line)",borderRadius:6,whiteSpace:"nowrap",fontWeight:500}}>{exp.period}</span>
            </div>

            <div style={{height:1,background:"linear-gradient(to right,var(--pk-divider),transparent)",marginBottom:"1.7rem"}}/>

            {/* Bullets with bold numbers */}
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:".75rem",marginBottom:"1.8rem"}}>
              {exp.bullets.map((b,i)=>(
                <li key={i} className="exp-bullet" style={{fontSize:".92rem",color:"var(--w2)",lineHeight:1.75,display:"flex",gap:".8rem",animation:`fadeUp .38s ease ${i*.05}s both`}}>
                  <span style={{color:"var(--pk)",flexShrink:0,marginTop:".15em",fontSize:".78rem"}}>▹</span>
                  <span>{renderBullet(b)}</span>
                </li>
              ))}
            </ul>

            {/* Chips */}
            <div style={{display:"flex",flexWrap:"wrap",gap:".5rem"}}>
              {exp.chips.map(c=>(
                <span key={c} className="exp-chip" style={{fontSize:".66rem",letterSpacing:".06em",padding:".26rem .8rem",borderRadius:6,background:"var(--lv-bg)",border:"1px solid var(--lv-line)",color:"var(--lv)",fontWeight:600}}>{c}</span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ───────────────────────────────────────────────────────────── */
function ProjectsSection(){
  return(
    <section id="projects" className="sec" style={{padding:"7rem 0",background:"var(--bg2)"}}>
      <div className="si" style={{maxWidth:1080,margin:"0 auto",padding:"0 4rem"}}>
        <Reveal><SLabel c="Projects"/></Reveal>
        <Reveal delay={.05}><STitle c="What I've Designed & Built"/></Reveal>
        <div className="proj-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1.2rem"}}>
          {PROJECTS.map((p,i)=>(
            <Reveal key={p.title} delay={i*.07}>
              <Card className="proj-card" style={{padding:"2rem",height:"100%",display:"flex",flexDirection:"column"}}>
                <p style={{fontSize:".62rem",letterSpacing:".14em",textTransform:"uppercase",color:"var(--lv)",marginBottom:".75rem",fontWeight:600}}>{p.type}</p>
                <h3 className="proj-title" style={{fontFamily:"var(--syne)",fontSize:"1.05rem",fontWeight:700,lineHeight:1.32,marginBottom:".9rem"}}>{p.title}</h3>
                <p className="proj-desc" style={{fontSize:".87rem",color:"var(--w2)",lineHeight:1.78,flex:1,fontWeight:300,marginBottom:"1.2rem"}}>{p.desc}</p>
                {p.links?.length>0&&(
                  <div className="proj-links" style={{display:"flex",flexWrap:"wrap",gap:".5rem",marginBottom:"1.1rem"}}>
                    {p.links.map((l,li)=><ProjLink key={l.href} {...l} primary={li===0}/>)}
                  </div>
                )}
                <div style={{display:"flex",flexWrap:"wrap",gap:".4rem"}}>
                  {p.tags.map(t=>(
                    <span key={t} style={{fontSize:".6rem",letterSpacing:".07em",textTransform:"uppercase",padding:".2rem .62rem",borderRadius:5,background:"var(--pk-bg-subtle)",border:"1px solid var(--pk-line-subtle)",color:"var(--pk-tag)",fontWeight:600}}>{t}</span>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// 项目卡片上的链接。第一个（通常是 live 站点）用实心样式，突出"可以点开看"
function ProjLink({label,href,primary=false}){
  const[h,sh]=useState(false);
  return(
    <a href={href} target="_blank" rel="noreferrer" className="proj-link"
      style={{
        display:"inline-flex",alignItems:"center",gap:".35rem",
        fontSize:".68rem",letterSpacing:".08em",textTransform:"uppercase",fontWeight:600,
        padding:".38rem .85rem",borderRadius:999,textDecoration:"none",transition:"all .22s",
        background:primary?(h?"var(--pk)":"var(--pk-bg)"):(h?"var(--surface-hover)":"var(--surface)"),
        border:`1px solid ${primary?"var(--pk-line-strong)":"var(--line-strong)"}`,
        color:primary?(h?"var(--on-pk)":"var(--pkl)"):"var(--w2)",
        transform:h?"translateY(-1px)":"translateY(0)",
      }}
      onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}
    >
      {label}<span aria-hidden="true" style={{fontSize:".8em",opacity:.8}}>↗</span>
    </a>
  );
}

/* ─── SKILLS ─────────────────────────────────────────────────────────────── */
function SkillsSection(){
  return(
    <section id="skills" className="sec" style={{padding:"7rem 0",background:"var(--bg)"}}>
      <div className="si" style={{maxWidth:1080,margin:"0 auto",padding:"0 4rem"}}>
        <Reveal><SLabel c="Skills"/></Reveal>
        <Reveal delay={.05}><STitle c="Technical Toolkit"/></Reveal>
        <div className="sk-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1.2rem"}}>
          {SKILLS.map((s,i)=>(
            <Reveal key={s.label} delay={i*.07}>
              <Card className="sk-card" style={{padding:"1.8rem 2rem"}}>
                <p style={{fontSize:".62rem",letterSpacing:".22em",textTransform:"uppercase",color:"var(--pk)",fontWeight:700,marginBottom:"1.1rem"}}>{s.label}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:".5rem"}}>
                  {s.hot.map(sk=><SkTag key={sk} hot>{sk}</SkTag>)}
                  {s.normal.map(sk=><SkTag key={sk}>{sk}</SkTag>)}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkTag({children,hot=false}){
  const[h,sh]=useState(false);
  return(
    <span className="sk-tag"
      style={{fontSize:".82rem",padding:".34rem .9rem",borderRadius:8,cursor:"default",transition:"all .2s",fontWeight:500,
        background:hot?(h?"var(--pk-bg-strong)":"var(--pk-bg)"):(h?"var(--pk-bg-subtle)":"var(--surface)"),
        border:hot?`1px solid ${h?"var(--pk-line-strong)":"var(--pk-line)"}`:`1px solid ${h?"var(--pk-line)":"var(--line)"}`,
        color:hot?"var(--pkl)":(h?"var(--pkl)":"var(--w2)"),
      }}
      onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}
    >{children}</span>
  );
}

/* ─── EDUCATION ──────────────────────────────────────────────────────────── */
function EducationSection(){
  return(
    <section id="education" className="sec" style={{padding:"7rem 0",background:"var(--bg2)"}}>
      <div className="si" style={{maxWidth:1080,margin:"0 auto",padding:"0 4rem"}}>
        <Reveal><SLabel c="Education"/></Reveal>
        <Reveal delay={.05}><STitle c="Academic Background"/></Reveal>
        <div className="edu-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1.2rem"}}>
          {[
            {period:"Sep 2025 – Aug 2026 · Chicago, IL",school:"Northwestern University",degree:"M.S. in Information Systems",note:"Focusing on AI product development, data systems, and business analytics — building on cross-industry experience to break into the US tech market."},
            {period:"Aug 2021 – Jun 2025 · Macau, China",school:"University of Macau",degree:"B.Sc. Business Intelligence & Data Analytics",note:'Led Business Analytics Association — IG followers +60% in 3 months, 45% more registrations for Deloitte\'s Recruitment Fair. Captained Mandarin Debating Team, earning "Fastest-Improving Team" recognition.'},
          ].map((e,i)=>(
            <Reveal key={e.school} delay={i*.1}>
              <Card className="edu-card" style={{padding:"2.2rem",height:"100%"}}>
                <p style={{fontSize:".62rem",letterSpacing:".15em",textTransform:"uppercase",color:"var(--lv)",fontWeight:700,marginBottom:".9rem"}}>{e.period}</p>
                <h3 style={{fontFamily:"var(--syne)",fontSize:"1.25rem",fontWeight:700,marginBottom:".35rem",letterSpacing:"-.005em"}}>{e.school}</h3>
                <p style={{fontSize:".84rem",color:"var(--w2)",fontStyle:"italic",fontWeight:400,marginBottom:"1.15rem"}}>{e.degree}</p>
                <div style={{width:"2rem",height:2,borderRadius:1,background:"var(--pk)",marginBottom:"1.15rem"}}/>
                <p style={{fontSize:".86rem",color:"var(--w2)",lineHeight:1.78,fontWeight:300}}>{e.note}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────────────────────── */
function ContactSection(){
  return(
    <section id="contact" className="sec" style={{padding:"7rem 0",background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <div className="si" style={{maxWidth:1080,margin:"0 auto",padding:"0 4rem",position:"relative"}}>
        <div className="ct-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"center"}}>
          <Reveal>
            <SLabel c="Contact"/>
            <h2 className="ct-h2" style={{fontFamily:"var(--syne)",fontSize:"clamp(2rem,3.8vw,2.9rem)",fontWeight:700,lineHeight:1.1,marginBottom:"1.3rem",letterSpacing:"-.01em"}}>
              Let's Build Something <span style={{color:"var(--pk)"}}>Meaningful.</span>
            </h2>
            <p style={{fontSize:".92rem",color:"var(--w2)",lineHeight:1.85,fontWeight:300,maxWidth:380}}>
              Open to PM, data analyst, and AI product roles — especially in tech, SaaS, or fintech. Fluent in English, Mandarin, and Cantonese.
            </p>
          </Reveal>

          <Reveal delay={.1}>
            <div style={{display:"flex",flexDirection:"column",gap:".85rem"}}>
              {[
                {icon:"✉",label:"Email",val:"phoebewong214@gmail.com",href:"mailto:phoebewong214@gmail.com"},
                {icon:"in",label:"LinkedIn",val:"linkedin.com/in/phoebewang003214",href:"https://www.linkedin.com/in/phoebewang003214"},
                {icon:"GH",label:"GitHub",val:"github.com/phoebewang214",href:"https://github.com/phoebewang214"},
                {icon:"☏",label:"Phone",val:"+1 (312) 358-8059",href:"tel:+13123588059"},
              ].map(c=><ContactRow key={c.label} {...c}/>)}

              <div className="ct-buttons" style={{display:"flex",gap:".75rem",marginTop:".4rem"}}>
                <Btn href="mailto:phoebewong214@gmail.com" variant="primary" style={{flex:1}}>Email Me</Btn>
                <Btn href={CV_URL} download variant="outline" style={{flex:1}}>↓ Download CV</Btn>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Footer */}
        <div className="footer-row" style={{marginTop:"5rem",paddingTop:"2rem",borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:".5rem"}}>
          <span style={{fontFamily:"var(--syne)",fontSize:".82rem",fontWeight:700,color:"var(--pkl)"}}>Tszching (Phoebe) Wang · 2026</span>
          <span style={{fontSize:".62rem",letterSpacing:".1em",textTransform:"uppercase",color:"var(--w2)",fontWeight:500}}>Chicago, IL · Open to Opportunities</span>
        </div>
      </div>
    </section>
  );
}

function ContactRow({icon,label,val,href}){
  const[h,sh]=useState(false);
  return(
    <a href={href} target={href.startsWith("http")?"_blank":undefined} rel="noreferrer" className="ct-row"
      style={{display:"flex",alignItems:"center",gap:"1rem",padding:"1.1rem 1.35rem",borderRadius:14,textDecoration:"none",color:"var(--w)",background:h?"var(--pk-bg-subtle)":"var(--card)",border:`1px solid ${h?"var(--pk-line-strong)":"var(--line)"}`,transform:h?"translateX(4px)":"translateX(0)",transition:"all .25s"}}
      onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}
    >
      <div className="ct-icon" style={{width:40,height:40,borderRadius:10,background:"var(--pk-bg)",border:"1px solid var(--pk-line-subtle)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".82rem",color:"var(--pkl)",flexShrink:0,fontWeight:700,letterSpacing:".02em"}}>{icon}</div>
      <div style={{minWidth:0,flex:1}}>
        <span className="ct-label" style={{fontSize:".58rem",letterSpacing:".14em",textTransform:"uppercase",color:"var(--m)",display:"block",marginBottom:".1rem",fontWeight:600}}>{label}</span>
        <span className="ct-val" style={{fontSize:".88rem",fontWeight:500,color:h?"var(--pkl)":"var(--w)",transition:"color .25s",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{val}</span>
      </div>
    </a>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App(){
  const[theme,toggle]=useTheme();
  return(
    <>
      <G/>
      <Nav theme={theme} toggle={toggle}/>
      <Hero/>
      <ExperienceSection/>
      <ProjectsSection/>
      <SkillsSection/>
      <EducationSection/>
      <ContactSection/>
    </>
  );
}
