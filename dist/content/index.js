(function(){"use strict";const h="snap-capture-overlay",X="snap-overlay-styles",I={screenshot:{status:"Preparing capture",subtext:"Capturing visible area"},fullpage:{status:"Preparing capture",subtext:"Measuring page dimensions"}};let p=null,m=null,S=null;function q(){return`
#${h} {
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

#${h}.snap-visible {
  opacity: 1;
}

#${h}.snap-hiding {
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
  #${h},
  #${h} .snap-corner,
  #${h} .snap-dot,
  #${h} .snap-flash,
  #${h} .snap-corner.animate {
    animation: none !important;
    transition-duration: 10ms !important;
    transition-delay: 0s !important;
  }

  #${h} .snap-corner {
    opacity: 1;
  }

  #${h} .snap-dot {
    opacity: 0.5;
    transform: none !important;
  }
}
`}function Y({mode:t="screenshot"}={}){if(p)return;const e=I[t]||I.screenshot;m=document.createElement("style"),m.id=X,m.textContent=q(),document.head.appendChild(m),p=document.createElement("div"),p.id=h;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;p.innerHTML=`
    <div class="snap-overlay-bg"></div>
    <div class="snap-corners">
      <div class="snap-corner snap-corner-tl${n?" animate":""}"></div>
      <div class="snap-corner snap-corner-tr${n?" animate":""}"></div>
      <div class="snap-corner snap-corner-br${n?" animate":""}"></div>
      <div class="snap-corner snap-corner-bl${n?" animate":""}"></div>
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
  `,document.body.appendChild(p),requestAnimationFrame(()=>{p.classList.add("snap-visible"),n||requestAnimationFrame(()=>{p.querySelectorAll(".snap-corner").forEach(a=>a.classList.add("animate"))})}),t==="screenshot"&&(S=setTimeout(()=>{M()},2e3))}function M(){if(S&&(clearTimeout(S),S=null),!p)return;const t=document.createElement("div");t.className="snap-flash",p.appendChild(t),p.classList.remove("snap-visible"),p.classList.add("snap-hiding"),setTimeout(()=>{p&&p.parentNode&&p.parentNode.removeChild(p),m&&m.parentNode&&m.parentNode.removeChild(m),p=null,m=null},400)}function V(t,e){const{width:n,height:o}=e;if(!t||!n||!o)return!1;const a=t.width/n,i=Math.min(320,o*.28),s=Math.min(32,o*.05),c=t.top<=s&&t.bottom>0,r=t.bottom>=o-s&&t.top<o;return a>=.55&&t.height>=24&&t.height<=i&&(c||r)}function P(){const t=document.documentElement,e=document.body;return{scrollHeight:Math.max((t==null?void 0:t.scrollHeight)||0,(e==null?void 0:e.scrollHeight)||0,(t==null?void 0:t.offsetHeight)||0,(e==null?void 0:e.offsetHeight)||0),vpHeight:window.innerHeight,vpWidth:window.innerWidth}}function j(t){return t.hasAttribute("data-snap-keep")||t.matches("[role='dialog'], [aria-modal='true'], :popover-open")}function K(t){return t.matches("header, nav, footer, [role='banner'], [role='navigation'], [role='contentinfo']")}function O(t,e){return(e.zIndex!=="auto"||e.transform!=="none"||e.willChange.includes("transform"))&&(K(t)||Number(e.zIndex)>=1||e.transform!=="none")}function A(t,e){var a;const n=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT);let o;for(;o=n.nextNode();)e(o),((a=o.shadowRoot)==null?void 0:a.mode)==="open"&&A(o.shadowRoot,e)}function D({floatingMode:t="smart"}){if(t==="none")return()=>{};const e=[],n=[];A(document.documentElement,o=>{if(j(o))return;const a=getComputedStyle(o);if(a.display==="none"||a.visibility==="hidden"||Number(a.opacity)===0)return;const i=a.position,s=i==="fixed"||i==="sticky";if(t==="all"){const c=O(o,a);(s||c)&&n.push(o)}else{const c=V(o.getBoundingClientRect(),{width:window.innerWidth,height:window.innerHeight});(s||O(o,a))&&c&&n.push(o)}});for(const o of n)n.some(a=>a!==o&&a.contains(o))||(e.push({node:o,value:o.style.getPropertyValue("visibility"),priority:o.style.getPropertyPriority("visibility")}),o.style.setProperty("visibility","hidden","important"));return()=>{for(const{node:o,value:a,priority:i}of e)a?o.style.setProperty("visibility",a,i):o.style.removeProperty("visibility")}}function J(){const t=[];return A(document.documentElement,e=>{if(e===document.body||e===document.documentElement)return;const o=getComputedStyle(e).overflowY;o!=="scroll"&&o!=="auto"||e.scrollHeight<=e.clientHeight||(t.push({node:e,overflow:e.style.getPropertyValue("overflow"),overflowPriority:e.style.getPropertyPriority("overflow"),overflowY:e.style.getPropertyValue("overflow-y"),overflowYPriority:e.style.getPropertyPriority("overflow-y"),maxHeight:e.style.getPropertyValue("max-height"),maxHeightPriority:e.style.getPropertyPriority("max-height")}),e.style.setProperty("overflow","visible","important"),e.style.setProperty("overflow-y","visible","important"),e.style.setProperty("max-height","none","important"))}),()=>{for(const e of t){const{node:n,overflow:o,overflowPriority:a,overflowY:i,overflowYPriority:s,maxHeight:c,maxHeightPriority:r}=e;o?n.style.setProperty("overflow",o,a):n.style.removeProperty("overflow"),i?n.style.setProperty("overflow-y",i,s):n.style.removeProperty("overflow-y"),c?n.style.setProperty("max-height",c,r):n.style.removeProperty("max-height")}}}function Q(){const t=document.querySelectorAll("video"),e=[];for(const n of t)n.paused||(n.pause(),e.push(n));return()=>{for(const n of e)n.play().catch(()=>{})}}function x(t){window.scrollTo({top:t,behavior:"instant"})}function v(){return window.scrollY||window.pageYOffset||0}function H(t){window.scrollTo({top:t,behavior:"instant"})}function E(t){return new Promise(e=>setTimeout(e,t))}const g=Object.freeze({START_CAPTURE:"SNAP/START_CAPTURE",CAPTURE_PROGRESS:"SNAP/CAPTURE_PROGRESS",CAPTURE_COMPLETE:"SNAP/CAPTURE_COMPLETE",CAPTURE_ERROR:"SNAP/CAPTURE_ERROR",CAPTURE_TAB:"SNAP/CAPTURE_TAB",PING:"SNAP/PING",CANCEL_CAPTURE:"SNAP/CANCEL_CAPTURE",DOWNLOAD_RESULT:"SNAP/DOWNLOAD_RESULT",EXTRACT_DESIGN:"SNAP/EXTRACT_DESIGN",EXTRACT_DESIGN_PROGRESS:"SNAP/EXTRACT_DESIGN_PROGRESS",EXTRACT_DESIGN_COMPLETE:"SNAP/EXTRACT_DESIGN_COMPLETE",EXTRACT_DESIGN_ERROR:"SNAP/EXTRACT_DESIGN_ERROR",EXTRACT_DESIGN_CANCEL:"SNAP/EXTRACT_DESIGN_CANCEL",AI_CONFIG_SAVE:"SNAP/AI_CONFIG_SAVE",AI_CONFIG_GET:"SNAP/AI_CONFIG_GET",AI_CONFIG_TEST:"SNAP/AI_CONFIG_TEST"});function Z(t,e,n={}){return{type:g.CAPTURE_PROGRESS,payload:{stage:t,percent:e,...n}}}function tt(t){return{type:g.CAPTURE_COMPLETE,payload:t}}function et(t,e,n=!1){return{type:g.CAPTURE_ERROR,payload:{code:t,message:e,recoverable:n}}}new Set(Object.values(g));const w=(t,e,n)=>chrome.runtime.sendMessage(Z(t,e,n)).catch(()=>{}),ot=t=>chrome.runtime.sendMessage(tt(t)).catch(()=>{}),nt=(t,e,n=!1)=>chrome.runtime.sendMessage(et(t,e,n)).catch(()=>{});async function at(){const t=await chrome.runtime.sendMessage({type:g.CAPTURE_TAB,payload:{}});if(!(t!=null&&t.imageData))throw new Error((t==null?void 0:t.error)||"Browser did not return an image");return t.imageData}async function rt(t,e){const n=await chrome.runtime.sendMessage({type:g.DOWNLOAD_RESULT,payload:{imageData:t.imageData,title:t.title,format:t.settings.format,location:e.location,namingPattern:e.namingPattern}});if(!(n!=null&&n.success))throw new Error((n==null?void 0:n.error)||"Download failed")}const it=250,k=32767,st=12e7,G=300,lt=2e5,U=12e4,ct=3,F=Object.freeze({png:{mime:"image/png",extension:"png"},jpeg:{mime:"image/jpeg",extension:"jpg"},webp:{mime:"image/webp",extension:"webp"}});function ut(t,e){const n=Math.max(0,Math.ceil(t)),o=Math.max(1,Math.floor(e)),a=Math.max(0,n-o),i=[0];let s=0;for(let c=o;c<a&&s<G;c+=o)i.push(c),s+=1;return a>0&&i[i.length-1]!==a&&s<G&&i.push(a),i}function dt(t,e){return t>lt}function ft(t,e,n,o=n){return{width:Math.round(t*n),height:Math.round(e*o)}}function pt({width:t,height:e}){if(!t||!e||t>k||e>k||t*e>st)throw new Error("This page is too large to safely export as one image. Reduce browser zoom or capture it in smaller sections.")}function z(t){return F[String(t||"png").toLowerCase()]||F.png}function ht(t){return{high:.92,medium:.8,low:.65}[t]??.92}function mt(t){return t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(1)} MB`}function gt(t){const e=(t==null?void 0:t.split(",")[1])||"";return Math.floor(e.length*3/4)}let b=!1;function yt(){b=!0}function T(){return new Promise(t=>requestAnimationFrame(t))}async function N(t=it){var e;if(await T(),await T(),(e=document.fonts)!=null&&e.ready&&await Promise.race([document.fonts.ready,E(1e3)]),document.getAnimations){const n=document.getAnimations().filter(o=>o.playState==="running");n.length&&await Promise.race([Promise.allSettled(n.map(o=>o.finished.catch(()=>{}))),E(t)])}await E(t)}function C(){if(b)throw new Error("Capture cancelled")}async function wt({mode:t,settings:e={}}){b=!1,Y({mode:t});const n=v();let o=()=>{};try{Number(e.delay)>0&&(w("analyze",2,{message:`Waiting ${e.delay} seconds`}),await E(Number(e.delay)*1e3)),C(),t!=="fullpage"&&(o=D(e));const a=t==="fullpage"?await vt(e):await Et(e);return ot(a),e.autoDownload&&await rt(a,e),{success:!0,data:a}}catch(a){return nt(b?"CAPTURE_CANCELLED":"CAPTURE_FAILED",a.message,b),{success:!1,error:a.message}}finally{o(),H(n),M()}}async function Et(t){w("capture",30),await N(),C();const e=await _();w("finalize",90);const n=await St(e,t);return W(n.dataUrl,n.width,n.height,"visible",t)}async function vt(t){w("analyze",5);const e=J(),n=Q();let o=()=>{};try{let a=P();if(dt(a.scrollHeight,a.vpHeight))throw new Error("Page exceeds the maximum capturable height. Reduce browser zoom or capture in sections.");const i=Date.now(),s=ut(a.scrollHeight,a.vpHeight),c=[];w("scroll",10,{currentSection:0,totalSections:s.length});for(let l=0;l<s.length;l+=1){if(C(),Date.now()-i>U)throw new Error("Capture timed out — the page is too long or taking too long to render.");l===1&&(o=D(t)),x(s[l]),await N();const u=v();if(l>0&&u===c[l-1].y)continue;const f=await _();c.push({imageData:f,y:u}),w("capture",10+(l+1)/s.length*65,{currentSection:l+1,totalSections:s.length})}for(let l=0;l<ct;l++){a=P();const u=c.at(-1).y,f=Math.max(0,a.scrollHeight-a.vpHeight);if(f<=u+a.vpHeight)break;const d=[];for(let y=u+a.vpHeight;y<f&&d.length<50;y+=a.vpHeight)d.push(y);d.length>0&&d.at(-1)<f&&d.push(f);for(const y of d){if(C(),Date.now()-i>U)throw new Error("Capture timed out");x(y),await N(),c.push({imageData:await _(),y:v()})}}w("merge",78);const r=await bt(c,a,t);return w("finalize",94),W(r.dataUrl,r.width,r.height,"fullpage",t)}finally{o(),n(),e()}}async function _(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.setProperty("display","none","important"),t.offsetHeight),await T(),await T();try{return await at()}finally{t&&(t.style.display="")}}function R(t){return new Promise((e,n)=>{const o=new Image;o.onload=()=>e(o),o.onerror=()=>n(new Error("Unable to decode a captured image")),o.src=t})}async function bt(t,e,n){if(!t.length)throw new Error("No images were captured");const o=await R(t[0].imageData),a=o.naturalWidth/e.vpWidth,i=o.naturalHeight/e.vpHeight,s=ft(e.vpWidth,e.scrollHeight,a,i);pt(s);const c=document.createElement("canvas");c.width=s.width,c.height=s.height;const r=c.getContext("2d",{alpha:!1});r.fillStyle="#ffffff",r.fillRect(0,0,c.width,c.height);for(let l=0;l<t.length;l+=1){const u=l===0?o:await R(t[l].imageData),f=Math.round(t[l].y*i);r.drawImage(u,0,0,u.naturalWidth,u.naturalHeight,0,f,c.width,u.naturalHeight)}return $(c,n)}async function St(t,e){const n=await R(t),o=document.createElement("canvas");return o.width=n.naturalWidth,o.height=n.naturalHeight,o.getContext("2d").drawImage(n,0,0),$(o,e)}function $(t,e){const{mime:n}=z(e.format);return{dataUrl:t.toDataURL(n,ht(e.quality)),width:t.width,height:t.height}}function W(t,e,n,o,a){const i=document.querySelector("link[rel*='icon']");return{imageData:t,dimensions:`${e} × ${n}`,format:z(a.format).extension.toUpperCase(),size:mt(gt(t)),capturedAt:new Date().toISOString(),source:document.title||location.hostname,title:document.title||"page",domain:location.hostname,url:location.href,favicon:(i==null?void 0:i.href)||`${location.origin}/favicon.ico`,mode:o,settings:{format:a.format,location:a.location,namingPattern:a.namingPattern}}}function Tt(){var a,i,s,c;const t={tagCount:0,elements:[],semanticElements:[],textNodes:0,links:[],buttons:[],forms:[],inputs:[],lists:[],tables:[],media:[],iframes:[],ids:[],classes:[]},e=document.querySelectorAll("*");t.tagCount=e.length;const n=new Set,o=new Set;for(const r of e){r.id&&n.add(r.id),r.className&&typeof r.className=="string"&&r.className.split(/\s+/).forEach(u=>{u&&o.add(u)});const l=r.tagName.toLowerCase();["header","nav","main","section","article","aside","footer","h1","h2","h3","h4","h5","h6","figure","figcaption","details","summary"].includes(l)&&t.semanticElements.push(l),r.tagName==="A"&&r.href&&t.links.push({text:(r.textContent||"").slice(0,100),href:r.href}),(r.tagName==="BUTTON"||r.tagName==="INPUT"&&r.type==="button")&&t.buttons.push({text:(r.textContent||r.value||"").slice(0,100)}),r.tagName==="FORM"&&t.forms.push({id:r.id,action:r.action,method:r.method}),(r.tagName==="INPUT"||r.tagName==="TEXTAREA"||r.tagName==="SELECT")&&t.inputs.push({type:r.type||r.tagName.toLowerCase(),name:r.name,placeholder:r.placeholder||""}),["UL","OL"].includes(r.tagName)&&t.lists.push({type:r.tagName.toLowerCase(),items:r.children.length}),r.tagName==="TABLE"&&t.tables.push({rows:((a=r.rows)==null?void 0:a.length)||0,cells:((i=r.cells)==null?void 0:i.length)||0}),r.tagName==="IMG"&&r.src&&t.media.push({type:"image",src:r.src,alt:r.alt||"",width:r.naturalWidth,height:r.naturalHeight}),r.tagName==="VIDEO"&&r.src&&t.media.push({type:"video",src:r.src}),r.tagName==="IFRAME"&&t.iframes.push({src:r.src,width:r.width,height:r.height})}return t.ids=Array.from(n).slice(0,200),t.classes=Array.from(o).slice(0,500),t.textNodes=((c=(s=document.body)==null?void 0:s.innerText)==null?void 0:c.length)||0,t.elements=e.length,t}const Ct=["width","height","margin","marginTop","marginRight","marginBottom","marginLeft","padding","paddingTop","paddingRight","paddingBottom","paddingLeft","gap","display","flexDirection","flexWrap","justifyContent","alignItems","alignContent","gridTemplateColumns","gridTemplateRows","gap","position","top","right","bottom","left","overflow","overflowX","overflowY","zIndex","fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","lineHeight","textAlign","textTransform","textDecoration","color","opacity","transform","transition","animation","border","borderTop","borderRight","borderBottom","borderLeft","borderRadius","borderWidth","borderStyle","borderColor","boxShadow","filter","backdropFilter","background","backgroundColor","backgroundImage","backgroundSize","backgroundPosition","backgroundRepeat","objectFit","objectPosition"],Pt=new Set(["none","normal","auto","initial","inherit","unset","0px","0","","rgba(0, 0, 0, 0)","transparent"]);function At(t,e,n){return!!(!n||Pt.has(n))}function xt(){const t={},e=document.querySelectorAll("*");let n=0;const o=120,a=20;for(const i of e){if(n>=o)break;const s=i.tagName.toLowerCase();if(["script","style","link","meta","noscript"].includes(s))continue;const c=i.id?`#${i.id}`:"",r=i.className&&typeof i.className=="string"?`.${i.className.trim().split(/\s+/).slice(0,2).join(".")}`:"",l=`${s}${c}${r}`.slice(0,80);if(!l||t[l])continue;const u=i.getBoundingClientRect();if(u.width*u.height<a)continue;const f=window.getComputedStyle(i),d={tag:s,rect:{w:Math.round(u.width),h:Math.round(u.height)}};for(const L of Ct){const B=f[L];At(s,L,B)||(d.styles||(d.styles={}),d.styles[L]=B)}(d.styles?Object.keys(d.styles).length:0)>2&&(t[l]=d,n++)}return t}function Nt(){const t=document.documentElement,e={},n=window.getComputedStyle(t);for(let o=0;o<n.length;o++){const a=n[o];a.startsWith("--")&&(e[a]=n.getPropertyValue(a).trim())}return e}function _t(){var n;const t=[],e=new Set;for(const o of document.styleSheets)try{for(const a of o.cssRules||[])if(a.type===CSSRule.FONT_FACE_RULE){const i=a.style.getPropertyValue("font-family").replace(/["']/g,"").trim(),s=a.style.getPropertyValue("src"),c=i.toLowerCase();i&&!e.has(c)&&(e.add(c),t.push({family:i,src:s||"",weight:a.style.getPropertyValue("font-weight")||"400"}))}}catch{}for(const o of document.querySelectorAll("[style*='font-family']")){const a=(n=o.style.fontFamily)==null?void 0:n.replace(/["']/g,"").trim();a&&!e.has(a.toLowerCase())&&(e.add(a.toLowerCase()),t.push({family:a,src:"inline",weight:o.style.fontWeight||"400"}))}return t}function Rt(){var n,o;const t={containers:[],grids:[],flexLayouts:[],sections:[],navigation:null,hero:null,cards:[],footer:null,sidebar:null,responsiveGroupings:[]},e=document.querySelectorAll("*");for(const a of e){const i=a.tagName.toLowerCase(),s=a.getBoundingClientRect();if(s.width===0||s.height===0)continue;const c=window.getComputedStyle(a);if(["header","nav","footer","main","section","article","aside"].includes(i)){const r={tag:i,id:a.id||"",classes:((n=a.className)==null?void 0:n.toString().slice(0,80))||"",rect:{w:Math.round(s.width),h:Math.round(s.height)}};i==="nav"?t.navigation=r:i==="footer"?t.footer=r:i==="aside"?t.sidebar=r:i==="section"?t.sections.push(r):t.containers.push(r)}(c.display==="grid"||c.display==="inline-grid")&&t.grids.push({tag:i,columns:c.gridTemplateColumns,rows:c.gridTemplateRows,gap:c.gap,rect:{w:Math.round(s.width),h:Math.round(s.height)}}),(c.display==="flex"||c.display==="inline-flex")&&t.flexLayouts.push({tag:i,direction:c.flexDirection,wrap:c.flexWrap,justify:c.justifyContent,align:c.alignItems,gap:c.gap,rect:{w:Math.round(s.width),h:Math.round(s.height)}}),a.matches&&a.matches('[class*="card"], [class*="Card"], [class*="hero"], [class*="Hero"]')&&(i==="section"||i==="div")&&t.cards.push({tag:i,classes:((o=a.className)==null?void 0:o.toString().slice(0,80))||""})}return t.containers=t.containers.slice(0,50),t.grids=t.grids.slice(0,20),t.flexLayouts=t.flexLayouts.slice(0,50),t.sections=t.sections.slice(0,30),t}function Lt(){var i,s,c,r;const t={images:[],icons:[],svgs:[],fonts:[],favicons:[],backgrounds:[]},e=new Set;function n(l){if(!l||l.startsWith("data:")||l.startsWith("blob:"))return l;try{return new URL(l,location.href).href}catch{return l}}function o(l,u,f={}){if(!u)return;const d=n(u),y=d.toLowerCase();e.has(y)||(e.add(y),t[l].push({url:d,...f}))}for(const l of document.querySelectorAll("img[src]"))o("images",l.src,{alt:l.alt||"",width:l.naturalWidth,height:l.naturalHeight});for(const l of document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"))o("favicons",l.href,{sizes:((i=l.sizes)==null?void 0:i.toString())||""});for(const l of document.querySelectorAll("svg")){const f=l.cloneNode(!0).outerHTML,d=f.slice(0,200);e.has(d)||(e.add(d),t.svgs.push({html:f.slice(0,5e3),width:l.getBoundingClientRect().width,height:l.getBoundingClientRect().height}))}const a='i[class*="icon"], i[class*="Icon"], span[class*="icon"], span[class*="Icon"], [class*="material-icons"], [class*="fa-"], [class*="glyphicon"]';for(const l of document.querySelectorAll(a)){const u=((s=l.className)==null?void 0:s.toString())||"",f=((c=l.textContent)==null?void 0:c.trim())||"";(u||f)&&t.icons.push({classes:u.slice(0,100),text:f.slice(0,50),tag:l.tagName.toLowerCase()})}for(const l of document.querySelectorAll("[style*='background'], [style*='background-image'], [style*='background']")){const u=(r=l.style.backgroundImage)==null?void 0:r.match(/url\(["']?([^"')]+)["']?\)/);u&&o("backgrounds",u[1])}return t.images=t.images.slice(0,100),t.svgs=t.svgs.slice(0,50),t.icons=t.icons.slice(0,50),t}function It(){return{dom:Tt(),computedStyles:xt(),cssVariables:Nt(),fonts:_t(),layout:Rt(),assets:Lt()}}function Mt(){const t=P(),e=Math.max(0,t.scrollHeight-t.vpHeight),n=t.scrollHeight<=t.vpHeight*1.5?[0]:t.scrollHeight<=t.vpHeight*3?[0,1]:[0,.33,.66,1],o=new Set,a=n.map(i=>Math.round(e*i)).filter(i=>{const s=Math.round(i/Math.max(1,t.vpHeight/2));return o.has(s)?!1:(o.add(s),!0)});return{page:t,originalScrollY:v(),positions:a}}async function Ot(){var t;await new Promise(e=>requestAnimationFrame(e)),await new Promise(e=>requestAnimationFrame(e)),(t=document.fonts)!=null&&t.ready&&await Promise.race([document.fonts.ready,E(800)]),await E(200)}if(!globalThis.__akovoSnapControllerInstalled){globalThis.__akovoSnapControllerInstalled=!0;let t=!1;chrome.runtime.onMessage.addListener((e,n,o)=>{var a,i;if(e!=null&&e.type){if(e.type===g.PING){o({ready:!0});return}if(e.type===g.CANCEL_CAPTURE){yt(),o({success:!0});return}if(e.type==="SNAP/EXTRACT_DESIGN_CONTENT"){try{const s=It();o({success:!0,data:s})}catch(s){o({success:!1,error:s.message})}return!0}if(e.type==="SNAP/EXTRACT_DESIGN_SCREENSHOT_PLAN"){try{o({success:!0,data:Mt()})}catch(s){o({success:!1,error:s.message})}return!0}if(e.type==="SNAP/EXTRACT_DESIGN_SCROLL_TO")return x(((a=e.payload)==null?void 0:a.y)||0),Ot().then(()=>o({success:!0,data:{y:v()}})).catch(s=>o({success:!1,error:s.message})),!0;if(e.type==="SNAP/EXTRACT_DESIGN_RESTORE_SCROLL")return H(((i=e.payload)==null?void 0:i.y)||0),o({success:!0}),!0;if(e.type===g.START_CAPTURE){if(t){o({success:!1,error:"A capture is already in progress"});return}return t=!0,wt(e.payload).then(o).catch(s=>o({success:!1,error:s.message})).finally(()=>{t=!1}),!0}}})}})();
