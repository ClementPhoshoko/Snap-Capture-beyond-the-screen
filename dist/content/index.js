(function(){"use strict";const m="snap-capture-overlay",B="snap-overlay-styles",_={screenshot:{status:"Preparing capture",subtext:"Capturing visible area"},fullpage:{status:"Preparing capture",subtext:"Measuring page dimensions"}};let f=null,h=null,b=null;function V(){return`
#${m} {
  --brand-primary: #7c5cfc;
  --brand-primary-light: #a78bfa;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.68);
  --text-tertiary: rgba(255, 255, 255, 0.42);
  --glass-blur-xl: 40px;
  --glass-bg: rgba(15, 12, 41, 0.82);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-border-strong: rgba(255, 255, 255, 0.22);
  --font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size-sm: 13px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --duration-slow: 350ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);

  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out);
  pointer-events: auto;
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  color-scheme: dark;
}

#${m}.snap-visible {
  opacity: 1;
}

#${m}.snap-hiding {
  opacity: 0;
  transition: opacity 150ms var(--ease-out);
}

.snap-overlay-bg {
  position: absolute;
  inset: 0;
  background: var(--glass-bg);
}

.snap-corners {
  position: absolute;
  inset: var(--space-4);
  pointer-events: none;
}

.snap-corner {
  position: absolute;
  width: 36px;
  height: 36px;
  border-color: var(--glass-border-strong);
  border-style: solid;
  border-width: 0;
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out), border-color 1.2s ease;
}

.snap-visible .snap-corner {
  opacity: 1;
}

.snap-visible.snap-hiding .snap-corner {
  border-color: var(--brand-primary-light) !important;
  opacity: 0;
  transition: opacity 200ms var(--ease-out), border-color 150ms ease;
}

.snap-corner-tl {
  top: 0;
  left: 0;
  border-top-width: 3px;
  border-left-width: 3px;
  transition-delay: 0s;
}

.snap-corner-tl.animate {
  animation: cornerGlow 2.4s ease-in-out infinite;
  animation-delay: 0s;
}

.snap-corner-tr {
  top: 0;
  right: 0;
  border-top-width: 3px;
  border-right-width: 3px;
  transition-delay: 0.1s;
}

.snap-corner-tr.animate {
  animation: cornerGlow 2.4s ease-in-out infinite;
  animation-delay: 0.6s;
}

.snap-corner-br {
  bottom: 0;
  right: 0;
  border-bottom-width: 3px;
  border-right-width: 3px;
  transition-delay: 0.2s;
}

.snap-corner-br.animate {
  animation: cornerGlow 2.4s ease-in-out infinite;
  animation-delay: 1.2s;
}

.snap-corner-bl {
  bottom: 0;
  left: 0;
  border-bottom-width: 3px;
  border-left-width: 3px;
  transition-delay: 0.3s;
}

.snap-corner-bl.animate {
  animation: cornerGlow 2.4s ease-in-out infinite;
  animation-delay: 1.8s;
}

@keyframes cornerGlow {
  0%, 100% { border-color: var(--glass-border); }
  40% { border-color: var(--brand-primary); }
  70% { border-color: var(--brand-primary-light); }
}

.snap-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  text-align: center;
  pointer-events: none;
}

.snap-status {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
}

.snap-subtext {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  line-height: var(--line-height-normal);
}

.snap-dots {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.snap-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-primary-light);
  opacity: 0.15;
  animation: dotPulse 1.4s ease-in-out infinite;
}

.snap-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.snap-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 80%, 100% { opacity: 0.15; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-4px); }
}

.snap-flash {
  position: absolute;
  inset: 0;
  background: #ffffff;
  opacity: 0;
  pointer-events: none;
  animation: flashFade 300ms ease-out;
}

@keyframes flashFade {
  0% { opacity: 0.5; }
  100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  #${m},
  #${m} .snap-corner,
  #${m} .snap-dot,
  #${m} .snap-flash,
  #${m} .snap-corner.animate {
    animation: none !important;
    transition-duration: 10ms !important;
    transition-delay: 0s !important;
  }

  #${m} .snap-corner {
    opacity: 1;
  }

  #${m} .snap-dot {
    opacity: 0.5;
    transform: none !important;
  }
}
`}function X({mode:t="screenshot"}={}){if(f)return;const e=_[t]||_.screenshot;h=document.createElement("style"),h.id=B,h.textContent=V(),document.head.appendChild(h),f=document.createElement("div"),f.id=m;const o=window.matchMedia("(prefers-reduced-motion: reduce)").matches;f.innerHTML=`
    <div class="snap-overlay-bg"></div>
    <div class="snap-corners">
      <div class="snap-corner snap-corner-tl${o?" animate":""}"></div>
      <div class="snap-corner snap-corner-tr${o?" animate":""}"></div>
      <div class="snap-corner snap-corner-br${o?" animate":""}"></div>
      <div class="snap-corner snap-corner-bl${o?" animate":""}"></div>
    </div>
    <div class="snap-content">
      <p class="snap-status">${e.status}</p>
      <p class="snap-subtext">${e.subtext}</p>
      <div class="snap-dots">
        <span class="snap-dot"></span>
        <span class="snap-dot"></span>
        <span class="snap-dot"></span>
      </div>
    </div>
  `,document.body.appendChild(f),requestAnimationFrame(()=>{f.classList.add("snap-visible"),o||requestAnimationFrame(()=>{f.querySelectorAll(".snap-corner").forEach(i=>i.classList.add("animate"))})}),t==="screenshot"&&(b=setTimeout(()=>{L()},2e3))}function L(){if(b&&(clearTimeout(b),b=null),!f)return;const t=document.createElement("div");t.className="snap-flash",f.appendChild(t),f.classList.remove("snap-visible"),f.classList.add("snap-hiding"),setTimeout(()=>{f&&f.parentNode&&f.parentNode.removeChild(f),h&&h.parentNode&&h.parentNode.removeChild(h),f=null,h=null},400)}function q(t,e){const{width:o,height:n}=e;if(!t||!o||!n)return!1;const i=t.width/o,r=Math.min(320,n*.28),c=Math.min(32,n*.05),l=t.top<=c&&t.bottom>0,a=t.bottom>=n-c&&t.top<n;return i>=.55&&t.height>=24&&t.height<=r&&(l||a)}function I(){const t=document.documentElement,e=document.body;return{scrollHeight:Math.max((t==null?void 0:t.scrollHeight)||0,(e==null?void 0:e.scrollHeight)||0,(t==null?void 0:t.offsetHeight)||0,(e==null?void 0:e.offsetHeight)||0),vpHeight:window.innerHeight,vpWidth:window.innerWidth}}function Y(t){return t.hasAttribute("data-snap-keep")||t.matches("[role='dialog'], [aria-modal='true'], :popover-open")}function j(t){return t.matches("header, nav, footer, [role='banner'], [role='navigation'], [role='contentinfo']")}function M(t,e){return(e.zIndex!=="auto"||e.transform!=="none"||e.willChange.includes("transform"))&&(j(t)||Number(e.zIndex)>=1||e.transform!=="none")}function C(t,e){var i;const o=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT);let n;for(;n=o.nextNode();)e(n),((i=n.shadowRoot)==null?void 0:i.mode)==="open"&&C(n.shadowRoot,e)}function O({floatingMode:t="smart"}){if(t==="none")return()=>{};const e=[],o=[];C(document.documentElement,n=>{if(Y(n))return;const i=getComputedStyle(n);if(i.display==="none"||i.visibility==="hidden"||Number(i.opacity)===0)return;const r=i.position,c=r==="fixed"||r==="sticky";if(t==="all"){const l=M(n,i);(c||l)&&o.push(n)}else{const l=q(n.getBoundingClientRect(),{width:window.innerWidth,height:window.innerHeight});(c||M(n,i))&&l&&o.push(n)}});for(const n of o)o.some(i=>i!==n&&i.contains(n))||(e.push({node:n,value:n.style.getPropertyValue("visibility"),priority:n.style.getPropertyPriority("visibility")}),n.style.setProperty("visibility","hidden","important"));return()=>{for(const{node:n,value:i,priority:r}of e)i?n.style.setProperty("visibility",i,r):n.style.removeProperty("visibility")}}function K(){const t=[];return C(document.documentElement,e=>{if(e===document.body||e===document.documentElement)return;const n=getComputedStyle(e).overflowY;n!=="scroll"&&n!=="auto"||e.scrollHeight<=e.clientHeight||(t.push({node:e,overflow:e.style.getPropertyValue("overflow"),overflowPriority:e.style.getPropertyPriority("overflow"),overflowY:e.style.getPropertyValue("overflow-y"),overflowYPriority:e.style.getPropertyPriority("overflow-y"),maxHeight:e.style.getPropertyValue("max-height"),maxHeightPriority:e.style.getPropertyPriority("max-height")}),e.style.setProperty("overflow","visible","important"),e.style.setProperty("overflow-y","visible","important"),e.style.setProperty("max-height","none","important"))}),()=>{for(const e of t){const{node:o,overflow:n,overflowPriority:i,overflowY:r,overflowYPriority:c,maxHeight:l,maxHeightPriority:a}=e;n?o.style.setProperty("overflow",n,i):o.style.removeProperty("overflow"),r?o.style.setProperty("overflow-y",r,c):o.style.removeProperty("overflow-y"),l?o.style.setProperty("max-height",l,a):o.style.removeProperty("max-height")}}}function J(){const t=document.querySelectorAll("video"),e=[];for(const o of t)o.paused||(o.pause(),e.push(o));return()=>{for(const o of e)o.play().catch(()=>{})}}function D(t){window.scrollTo({top:t,behavior:"instant"})}function T(){return window.scrollY||window.pageYOffset||0}function Q(t){window.scrollTo({top:t,behavior:"instant"})}function E(t){return new Promise(e=>setTimeout(e,t))}const g=Object.freeze({START_CAPTURE:"SNAP/START_CAPTURE",CAPTURE_PROGRESS:"SNAP/CAPTURE_PROGRESS",CAPTURE_COMPLETE:"SNAP/CAPTURE_COMPLETE",CAPTURE_ERROR:"SNAP/CAPTURE_ERROR",CAPTURE_TAB:"SNAP/CAPTURE_TAB",PING:"SNAP/PING",CANCEL_CAPTURE:"SNAP/CANCEL_CAPTURE",DOWNLOAD_RESULT:"SNAP/DOWNLOAD_RESULT",EXTRACT_DESIGN:"SNAP/EXTRACT_DESIGN",EXTRACT_DESIGN_PROGRESS:"SNAP/EXTRACT_DESIGN_PROGRESS",EXTRACT_DESIGN_COMPLETE:"SNAP/EXTRACT_DESIGN_COMPLETE",EXTRACT_DESIGN_ERROR:"SNAP/EXTRACT_DESIGN_ERROR",AI_CONFIG_SAVE:"SNAP/AI_CONFIG_SAVE",AI_CONFIG_GET:"SNAP/AI_CONFIG_GET",AI_CONFIG_TEST:"SNAP/AI_CONFIG_TEST"});function Z(t,e,o={}){return{type:g.CAPTURE_PROGRESS,payload:{stage:t,percent:e,...o}}}function tt(t){return{type:g.CAPTURE_COMPLETE,payload:t}}function et(t,e,o=!1){return{type:g.CAPTURE_ERROR,payload:{code:t,message:e,recoverable:o}}}new Set(Object.values(g));const w=(t,e,o)=>chrome.runtime.sendMessage(Z(t,e,o)).catch(()=>{}),ot=t=>chrome.runtime.sendMessage(tt(t)).catch(()=>{}),nt=(t,e,o=!1)=>chrome.runtime.sendMessage(et(t,e,o)).catch(()=>{});async function it(){const t=await chrome.runtime.sendMessage({type:g.CAPTURE_TAB,payload:{}});if(!(t!=null&&t.imageData))throw new Error((t==null?void 0:t.error)||"Browser did not return an image");return t.imageData}async function at(t,e){const o=await chrome.runtime.sendMessage({type:g.DOWNLOAD_RESULT,payload:{imageData:t.imageData,title:t.title,format:t.settings.format,location:e.location,namingPattern:e.namingPattern}});if(!(o!=null&&o.success))throw new Error((o==null?void 0:o.error)||"Download failed")}const rt=250,k=32767,st=12e7,H=300,lt=2e5,U=12e4,ct=3,G=Object.freeze({png:{mime:"image/png",extension:"png"},jpeg:{mime:"image/jpeg",extension:"jpg"},webp:{mime:"image/webp",extension:"webp"}});function ut(t,e){const o=Math.max(0,Math.ceil(t)),n=Math.max(1,Math.floor(e)),i=Math.max(0,o-n),r=[0];let c=0;for(let l=n;l<i&&c<H;l+=n)r.push(l),c+=1;return i>0&&r[r.length-1]!==i&&c<H&&r.push(i),r}function dt(t,e){return t>lt}function pt(t,e,o,n=o){return{width:Math.round(t*o),height:Math.round(e*n)}}function ft({width:t,height:e}){if(!t||!e||t>k||e>k||t*e>st)throw new Error("This page is too large to safely export as one image. Reduce browser zoom or capture it in smaller sections.")}function F(t){return G[String(t||"png").toLowerCase()]||G.png}function mt(t){return{high:.92,medium:.8,low:.65}[t]??.92}function ht(t){return t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(1)} MB`}function gt(t){const e=(t==null?void 0:t.split(",")[1])||"";return Math.floor(e.length*3/4)}let v=!1;function yt(){v=!0}function S(){return new Promise(t=>requestAnimationFrame(t))}async function A(t=rt){var e;if(await S(),await S(),(e=document.fonts)!=null&&e.ready&&await Promise.race([document.fonts.ready,E(1e3)]),document.getAnimations){const o=document.getAnimations().filter(n=>n.playState==="running");o.length&&await Promise.race([Promise.allSettled(o.map(n=>n.finished.catch(()=>{}))),E(t)])}await E(t)}function P(){if(v)throw new Error("Capture cancelled")}async function wt({mode:t,settings:e={}}){v=!1,X({mode:t});const o=T();let n=()=>{};try{Number(e.delay)>0&&(w("analyze",2,{message:`Waiting ${e.delay} seconds`}),await E(Number(e.delay)*1e3)),P(),t!=="fullpage"&&(n=O(e));const i=t==="fullpage"?await bt(e):await vt(e);return ot(i),e.autoDownload&&await at(i,e),{success:!0,data:i}}catch(i){return nt(v?"CAPTURE_CANCELLED":"CAPTURE_FAILED",i.message,v),{success:!1,error:i.message}}finally{n(),Q(o),L()}}async function vt(t){w("capture",30),await A(),P();const e=await x();w("finalize",90);const o=await St(e,t);return $(o.dataUrl,o.width,o.height,"visible",t)}async function bt(t){w("analyze",5);const e=K(),o=J();let n=()=>{};try{let i=I();if(dt(i.scrollHeight,i.vpHeight))throw new Error("Page exceeds the maximum capturable height. Reduce browser zoom or capture in sections.");const r=Date.now(),c=ut(i.scrollHeight,i.vpHeight),l=[];w("scroll",10,{currentSection:0,totalSections:c.length});for(let s=0;s<c.length;s+=1){if(P(),Date.now()-r>U)throw new Error("Capture timed out — the page is too long or taking too long to render.");s===1&&(n=O(t)),D(c[s]),await A();const u=T();if(s>0&&u===l[s-1].y)continue;const p=await x();l.push({imageData:p,y:u}),w("capture",10+(s+1)/c.length*65,{currentSection:s+1,totalSections:c.length})}for(let s=0;s<ct;s++){i=I();const u=l.at(-1).y,p=Math.max(0,i.scrollHeight-i.vpHeight);if(p<=u+i.vpHeight)break;const d=[];for(let y=u+i.vpHeight;y<p&&d.length<50;y+=i.vpHeight)d.push(y);d.length>0&&d.at(-1)<p&&d.push(p);for(const y of d){if(P(),Date.now()-r>U)throw new Error("Capture timed out");D(y),await A(),l.push({imageData:await x(),y:T()})}}w("merge",78);const a=await Et(l,i,t);return w("finalize",94),$(a.dataUrl,a.width,a.height,"fullpage",t)}finally{n(),o(),e()}}async function x(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.setProperty("display","none","important"),t.offsetHeight),await S(),await S();try{return await it()}finally{t&&(t.style.display="")}}function N(t){return new Promise((e,o)=>{const n=new Image;n.onload=()=>e(n),n.onerror=()=>o(new Error("Unable to decode a captured image")),n.src=t})}async function Et(t,e,o){if(!t.length)throw new Error("No images were captured");const n=await N(t[0].imageData),i=n.naturalWidth/e.vpWidth,r=n.naturalHeight/e.vpHeight,c=pt(e.vpWidth,e.scrollHeight,i,r);ft(c);const l=document.createElement("canvas");l.width=c.width,l.height=c.height;const a=l.getContext("2d",{alpha:!1});a.fillStyle="#ffffff",a.fillRect(0,0,l.width,l.height);for(let s=0;s<t.length;s+=1){const u=s===0?n:await N(t[s].imageData),p=Math.round(t[s].y*r);a.drawImage(u,0,0,u.naturalWidth,u.naturalHeight,0,p,l.width,u.naturalHeight)}return z(l,o)}async function St(t,e){const o=await N(t),n=document.createElement("canvas");return n.width=o.naturalWidth,n.height=o.naturalHeight,n.getContext("2d").drawImage(o,0,0),z(n,e)}function z(t,e){const{mime:o}=F(e.format);return{dataUrl:t.toDataURL(o,mt(e.quality)),width:t.width,height:t.height}}function $(t,e,o,n,i){const r=document.querySelector("link[rel*='icon']");return{imageData:t,dimensions:`${e} × ${o}`,format:F(i.format).extension.toUpperCase(),size:ht(gt(t)),capturedAt:new Date().toISOString(),source:document.title||location.hostname,title:document.title||"page",domain:location.hostname,url:location.href,favicon:(r==null?void 0:r.href)||`${location.origin}/favicon.ico`,mode:n,settings:{format:i.format,location:i.location,namingPattern:i.namingPattern}}}function Pt(){var i,r,c,l;const t={tagCount:0,elements:[],semanticElements:[],textNodes:0,links:[],buttons:[],forms:[],inputs:[],lists:[],tables:[],media:[],iframes:[],ids:[],classes:[]},e=document.querySelectorAll("*");t.tagCount=e.length;const o=new Set,n=new Set;for(const a of e){a.id&&o.add(a.id),a.className&&typeof a.className=="string"&&a.className.split(/\s+/).forEach(u=>{u&&n.add(u)});const s=a.tagName.toLowerCase();["header","nav","main","section","article","aside","footer","h1","h2","h3","h4","h5","h6","figure","figcaption","details","summary"].includes(s)&&t.semanticElements.push(s),a.tagName==="A"&&a.href&&t.links.push({text:(a.textContent||"").slice(0,100),href:a.href}),(a.tagName==="BUTTON"||a.tagName==="INPUT"&&a.type==="button")&&t.buttons.push({text:(a.textContent||a.value||"").slice(0,100)}),a.tagName==="FORM"&&t.forms.push({id:a.id,action:a.action,method:a.method}),(a.tagName==="INPUT"||a.tagName==="TEXTAREA"||a.tagName==="SELECT")&&t.inputs.push({type:a.type||a.tagName.toLowerCase(),name:a.name,placeholder:a.placeholder||""}),["UL","OL"].includes(a.tagName)&&t.lists.push({type:a.tagName.toLowerCase(),items:a.children.length}),a.tagName==="TABLE"&&t.tables.push({rows:((i=a.rows)==null?void 0:i.length)||0,cells:((r=a.cells)==null?void 0:r.length)||0}),a.tagName==="IMG"&&a.src&&t.media.push({type:"image",src:a.src,alt:a.alt||"",width:a.naturalWidth,height:a.naturalHeight}),a.tagName==="VIDEO"&&a.src&&t.media.push({type:"video",src:a.src}),a.tagName==="IFRAME"&&t.iframes.push({src:a.src,width:a.width,height:a.height})}return t.ids=Array.from(o).slice(0,200),t.classes=Array.from(n).slice(0,500),t.textNodes=((l=(c=document.body)==null?void 0:c.innerText)==null?void 0:l.length)||0,t.elements=e.length,t}const Ct=["width","height","margin","marginTop","marginRight","marginBottom","marginLeft","padding","paddingTop","paddingRight","paddingBottom","paddingLeft","gap","display","flexDirection","flexWrap","justifyContent","alignItems","alignContent","gridTemplateColumns","gridTemplateRows","gap","position","top","right","bottom","left","overflow","overflowX","overflowY","zIndex","fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","lineHeight","textAlign","textTransform","textDecoration","color","opacity","transform","transition","animation","border","borderTop","borderRight","borderBottom","borderLeft","borderRadius","borderWidth","borderStyle","borderColor","boxShadow","filter","backdropFilter","background","backgroundColor","backgroundImage","backgroundSize","backgroundPosition","backgroundRepeat","objectFit","objectPosition"],Tt=new Set(["none","normal","auto","initial","inherit","unset","0px","0","","rgba(0, 0, 0, 0)","transparent"]);function At(t,e,o){return!!(!o||Tt.has(o))}function xt(){const t={},e=document.querySelectorAll("*");let o=0;const n=120,i=20;for(const r of e){if(o>=n)break;const c=r.tagName.toLowerCase();if(["script","style","link","meta","noscript"].includes(c))continue;const l=r.id?`#${r.id}`:"",a=r.className&&typeof r.className=="string"?`.${r.className.trim().split(/\s+/).slice(0,2).join(".")}`:"",s=`${c}${l}${a}`.slice(0,80);if(!s||t[s])continue;const u=r.getBoundingClientRect();if(u.width*u.height<i)continue;const p=window.getComputedStyle(r),d={tag:c,rect:{w:Math.round(u.width),h:Math.round(u.height)}};for(const R of Ct){const W=p[R];At(c,R,W)||(d.styles||(d.styles={}),d.styles[R]=W)}(d.styles?Object.keys(d.styles).length:0)>2&&(t[s]=d,o++)}return t}function Nt(){const t=document.documentElement,e={},o=window.getComputedStyle(t);for(let n=0;n<o.length;n++){const i=o[n];i.startsWith("--")&&(e[i]=o.getPropertyValue(i).trim())}return e}function Rt(){var o;const t=[],e=new Set;for(const n of document.styleSheets)try{for(const i of n.cssRules||[])if(i.type===CSSRule.FONT_FACE_RULE){const r=i.style.getPropertyValue("font-family").replace(/["']/g,"").trim(),c=i.style.getPropertyValue("src"),l=r.toLowerCase();r&&!e.has(l)&&(e.add(l),t.push({family:r,src:c||"",weight:i.style.getPropertyValue("font-weight")||"400"}))}}catch{}for(const n of document.querySelectorAll("[style*='font-family']")){const i=(o=n.style.fontFamily)==null?void 0:o.replace(/["']/g,"").trim();i&&!e.has(i.toLowerCase())&&(e.add(i.toLowerCase()),t.push({family:i,src:"inline",weight:n.style.fontWeight||"400"}))}return t}function _t(){var o,n;const t={containers:[],grids:[],flexLayouts:[],sections:[],navigation:null,hero:null,cards:[],footer:null,sidebar:null,responsiveGroupings:[]},e=document.querySelectorAll("*");for(const i of e){const r=i.tagName.toLowerCase(),c=i.getBoundingClientRect();if(c.width===0||c.height===0)continue;const l=window.getComputedStyle(i);if(["header","nav","footer","main","section","article","aside"].includes(r)){const a={tag:r,id:i.id||"",classes:((o=i.className)==null?void 0:o.toString().slice(0,80))||"",rect:{w:Math.round(c.width),h:Math.round(c.height)}};r==="nav"?t.navigation=a:r==="footer"?t.footer=a:r==="aside"?t.sidebar=a:r==="section"?t.sections.push(a):t.containers.push(a)}(l.display==="grid"||l.display==="inline-grid")&&t.grids.push({tag:r,columns:l.gridTemplateColumns,rows:l.gridTemplateRows,gap:l.gap,rect:{w:Math.round(c.width),h:Math.round(c.height)}}),(l.display==="flex"||l.display==="inline-flex")&&t.flexLayouts.push({tag:r,direction:l.flexDirection,wrap:l.flexWrap,justify:l.justifyContent,align:l.alignItems,gap:l.gap,rect:{w:Math.round(c.width),h:Math.round(c.height)}}),i.matches&&i.matches('[class*="card"], [class*="Card"], [class*="hero"], [class*="Hero"]')&&(r==="section"||r==="div")&&t.cards.push({tag:r,classes:((n=i.className)==null?void 0:n.toString().slice(0,80))||""})}return t.containers=t.containers.slice(0,50),t.grids=t.grids.slice(0,20),t.flexLayouts=t.flexLayouts.slice(0,50),t.sections=t.sections.slice(0,30),t}function Lt(){var r,c,l,a;const t={images:[],icons:[],svgs:[],fonts:[],favicons:[],backgrounds:[]},e=new Set;function o(s){if(!s||s.startsWith("data:")||s.startsWith("blob:"))return s;try{return new URL(s,location.href).href}catch{return s}}function n(s,u,p={}){if(!u)return;const d=o(u),y=d.toLowerCase();e.has(y)||(e.add(y),t[s].push({url:d,...p}))}for(const s of document.querySelectorAll("img[src]"))n("images",s.src,{alt:s.alt||"",width:s.naturalWidth,height:s.naturalHeight});for(const s of document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"))n("favicons",s.href,{sizes:((r=s.sizes)==null?void 0:r.toString())||""});for(const s of document.querySelectorAll("svg")){const p=s.cloneNode(!0).outerHTML,d=p.slice(0,200);e.has(d)||(e.add(d),t.svgs.push({html:p.slice(0,5e3),width:s.getBoundingClientRect().width,height:s.getBoundingClientRect().height}))}const i='i[class*="icon"], i[class*="Icon"], span[class*="icon"], span[class*="Icon"], [class*="material-icons"], [class*="fa-"], [class*="glyphicon"]';for(const s of document.querySelectorAll(i)){const u=((c=s.className)==null?void 0:c.toString())||"",p=((l=s.textContent)==null?void 0:l.trim())||"";(u||p)&&t.icons.push({classes:u.slice(0,100),text:p.slice(0,50),tag:s.tagName.toLowerCase()})}for(const s of document.querySelectorAll("[style*='background'], [style*='background-image'], [style*='background']")){const u=(a=s.style.backgroundImage)==null?void 0:a.match(/url\(["']?([^"')]+)["']?\)/);u&&n("backgrounds",u[1])}return t.images=t.images.slice(0,100),t.svgs=t.svgs.slice(0,50),t.icons=t.icons.slice(0,50),t}function It(){return{dom:Pt(),computedStyles:xt(),cssVariables:Nt(),fonts:Rt(),layout:_t(),assets:Lt()}}if(!globalThis.__akovoSnapControllerInstalled){globalThis.__akovoSnapControllerInstalled=!0;let t=!1;chrome.runtime.onMessage.addListener((e,o,n)=>{if(e!=null&&e.type){if(e.type===g.PING){n({ready:!0});return}if(e.type===g.CANCEL_CAPTURE){yt(),n({success:!0});return}if(e.type==="SNAP/EXTRACT_DESIGN_CONTENT"){try{const i=It();n({success:!0,data:i})}catch(i){n({success:!1,error:i.message})}return!0}if(e.type===g.START_CAPTURE){if(t){n({success:!1,error:"A capture is already in progress"});return}return t=!0,wt(e.payload).then(n).catch(i=>n({success:!1,error:i.message})).finally(()=>{t=!1}),!0}}})}})();
