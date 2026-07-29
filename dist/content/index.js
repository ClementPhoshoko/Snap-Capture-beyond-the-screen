(function(){"use strict";const s="snap-capture-overlay",P="snap-overlay-styles",v={screenshot:{status:"Preparing capture",subtext:"Capturing visible area"},fullpage:{status:"Preparing capture",subtext:"Measuring page dimensions"}};let o=null,c=null,f=null;function T(){return`
#${s} {
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
  pointer-events: none;
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  color-scheme: dark;
}

#${s}.snap-visible {
  opacity: 1;
}

#${s}.snap-hiding {
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
  #${s},
  #${s} .snap-corner,
  #${s} .snap-dot,
  #${s} .snap-flash,
  #${s} .snap-corner.animate {
    animation: none !important;
    transition-duration: 10ms !important;
    transition-delay: 0s !important;
  }

  #${s} .snap-corner {
    opacity: 1;
  }

  #${s} .snap-dot {
    opacity: 0.5;
    transform: none !important;
  }
}
`}function A({mode:e="screenshot"}={}){if(o)return;const t=v[e]||v.screenshot;c=document.createElement("style"),c.id=P,c.textContent=T(),document.head.appendChild(c),o=document.createElement("div"),o.id=s;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;o.innerHTML=`
    <div class="snap-overlay-bg"></div>
    <div class="snap-corners">
      <div class="snap-corner snap-corner-tl${n?" animate":""}"></div>
      <div class="snap-corner snap-corner-tr${n?" animate":""}"></div>
      <div class="snap-corner snap-corner-br${n?" animate":""}"></div>
      <div class="snap-corner snap-corner-bl${n?" animate":""}"></div>
    </div>
    <div class="snap-content">
      <p class="snap-status">${t.status}</p>
      <p class="snap-subtext">${t.subtext}</p>
      <div class="snap-dots">
        <span class="snap-dot"></span>
        <span class="snap-dot"></span>
        <span class="snap-dot"></span>
      </div>
    </div>
  `,document.body.appendChild(o),requestAnimationFrame(()=>{o.classList.add("snap-visible"),n||requestAnimationFrame(()=>{o.querySelectorAll(".snap-corner").forEach(r=>r.classList.add("animate"))})}),e==="screenshot"&&(f=setTimeout(()=>{m()},2e3))}function m(){if(f&&(clearTimeout(f),f=null),!o)return;const e=document.createElement("div");e.className="snap-flash",o.appendChild(e),o.classList.remove("snap-visible"),o.classList.add("snap-hiding"),setTimeout(()=>{o&&o.parentNode&&o.parentNode.removeChild(o),c&&c.parentNode&&c.parentNode.removeChild(c),o=null,c=null},400)}function R(){const e=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight),t=window.innerHeight,n=window.innerWidth,a=Math.ceil(e/t),r=[],p=[];return document.body&&document.body.querySelectorAll("*").forEach(l=>{const i=getComputedStyle(l).position;i==="sticky"?r.push(l):i==="fixed"&&p.push(l)}),{scrollHeight:e,vpHeight:t,vpWidth:n,totalSections:a,stickyElements:r,fixedElements:p}}function U(e,t){const n=[];for(let a=0;a<e;a++)n.push({index:a,y:a*t,height:t});return n}function M(e){window.scrollTo({top:e,behavior:"instant"})}function _(){return window.scrollY||window.pageYOffset||0}function O(e){window.scrollTo({top:e,behavior:"instant"})}function $(e){return new Promise(t=>setTimeout(t,e))}const u=Object.freeze({START_CAPTURE:"SNAP/START_CAPTURE",CAPTURE_PROGRESS:"SNAP/CAPTURE_PROGRESS",CAPTURE_COMPLETE:"SNAP/CAPTURE_COMPLETE",CAPTURE_ERROR:"SNAP/CAPTURE_ERROR",CAPTURE_TAB:"SNAP/CAPTURE_TAB"});function z(e,t,n={}){return{type:u.CAPTURE_PROGRESS,payload:{stage:e,percent:t,...n}}}function F(e){return{type:u.CAPTURE_COMPLETE,payload:e}}function L(e,t,n=!1){return{type:u.CAPTURE_ERROR,payload:{code:e,message:t,recoverable:n}}}new Set(Object.values(u));function d(e,t,n){chrome.runtime.sendMessage(z(e,t,n)).catch(()=>{})}function w(e){chrome.runtime.sendMessage(F(e)).catch(()=>{})}function H(e,t,n=!1){chrome.runtime.sendMessage(L(e,t,n)).catch(()=>{})}async function C(){const e=await chrome.runtime.sendMessage({type:"SNAP/CAPTURE_TAB"});if(console.log("[Snap Content] CAPTURE_TAB response:",e),!(e!=null&&e.imageData)){const t=(e==null?void 0:e.error)||"response missing imageData";throw console.error("[Snap Content] CAPTURE_TAB failed:",t),new Error(t)}return e.imageData}function x(){const e=document.getElementById("snap-capture-overlay");e&&(e.style.display="none")}function E(){const e=document.getElementById("snap-capture-overlay");e&&(e.style.display="")}function S(){return new Promise(e=>requestAnimationFrame(e))}async function I({mode:e,settings:t}){console.log("[Snap Content] startCapture called",{mode:e,settings:t}),A({mode:e});const n=e==="fullpage"?"fullpage":"visible";try{return d("analyze",5),n==="fullpage"?await N(t):await k(t)}catch(a){return m(),H("CAPTURE_FAILED",a.message,!0),{success:!1,error:a.message}}}async function N(e){const t=R(),n=U(t.totalSections,t.vpHeight),a=n.length,r=_();d("scroll",10,{currentSection:0,totalSections:a});const p=[];for(const i of n){M(i.y),await $(300),d("capture",10+(i.index+1)/a*60,{currentSection:i.index+1,totalSections:a}),x(),await S();const b=await C();E(),p.push(b)}d("merge",75);const l=await B(p);if(!l)throw new Error("Failed to stitch captures");return O(r),d("finalize",90),m(),w(h(l,"fullpage",e)),{success:!0,data:h(l,"fullpage",e)}}async function k(e){d("capture",30),x(),await S();const t=await C();return E(),d("finalize",80),m(),w(h(t,"visible",e)),{success:!0,data:h(t,"visible",e)}}function h(e,t,n){const a=new Date;return{imageData:e,dimensions:t==="fullpage"?"Full page":`${window.innerWidth} × ${window.innerHeight}`,format:(n==null?void 0:n.format)||"PNG",size:G(D(e)),capturedAt:a.toISOString(),source:document.title||new URL(location.href).hostname}}async function B(e,t){const n=document.createElement("canvas"),a=n.getContext("2d"),r=[];for(const i of e){const b=await new Promise((Y,q)=>{const y=new Image;y.onload=()=>Y(y),y.onerror=q,y.src=i});r.push(b)}const p=r[0].naturalHeight,l=r[0].naturalWidth;n.width=l,n.height=p*r.length;for(let i=0;i<r.length;i++)a.drawImage(r[i],0,i*p);return n.toDataURL("image/png")}function D(e){const t=e.split(",")[1]||"";return Math.round(t.length*3/4)}function G(e){return e<1024?e+" B":e<1024*1024?(e/1024).toFixed(1)+" KB":(e/(1024*1024)).toFixed(1)+" MB"}console.log("[Snap Content] Script loaded");let g=!1;chrome.runtime.onMessage.addListener((e,t,n)=>{if(e!=null&&e.type&&(console.log("[Snap Content] Received:",e.type),e.type===u.START_CAPTURE)){if(g){console.log("[Snap Content] Capture already in progress"),n({success:!1,error:"Capture already in progress"});return}return g=!0,console.log("[Snap Content] Starting capture with payload:",e.payload),I(e.payload).then(a=>{g=!1,console.log("[Snap Content] Capture completed:",a.success),n(a)}).catch(a=>{g=!1,console.error("[Snap Content] Capture error:",a),n({success:!1,error:a.message})}),!0}})})();
