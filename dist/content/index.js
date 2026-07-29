(function(){"use strict";const c="snap-capture-overlay",$="snap-overlay-styles",A={screenshot:{status:"Preparing capture",subtext:"Capturing visible area"},fullpage:{status:"Preparing capture",subtext:"Measuring page dimensions"}};let o=null,d=null,g=null;function z(){return`
#${c} {
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

#${c}.snap-visible {
  opacity: 1;
}

#${c}.snap-hiding {
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
  #${c},
  #${c} .snap-corner,
  #${c} .snap-dot,
  #${c} .snap-flash,
  #${c} .snap-corner.animate {
    animation: none !important;
    transition-duration: 10ms !important;
    transition-delay: 0s !important;
  }

  #${c} .snap-corner {
    opacity: 1;
  }

  #${c} .snap-dot {
    opacity: 0.5;
    transform: none !important;
  }
}
`}function H({mode:t="screenshot"}={}){if(o)return;const e=A[t]||A.screenshot;d=document.createElement("style"),d.id=$,d.textContent=z(),document.head.appendChild(d),o=document.createElement("div"),o.id=c;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;o.innerHTML=`
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
  `,document.body.appendChild(o),requestAnimationFrame(()=>{o.classList.add("snap-visible"),n||requestAnimationFrame(()=>{o.querySelectorAll(".snap-corner").forEach(r=>r.classList.add("animate"))})}),t==="screenshot"&&(g=setTimeout(()=>{S()},2e3))}function S(){if(g&&(clearTimeout(g),g=null),!o)return;const t=document.createElement("div");t.className="snap-flash",o.appendChild(t),o.classList.remove("snap-visible"),o.classList.add("snap-hiding"),setTimeout(()=>{o&&o.parentNode&&o.parentNode.removeChild(o),d&&d.parentNode&&d.parentNode.removeChild(d),o=null,d=null},400)}function R(){const t=document.documentElement,e=document.body;return{scrollHeight:Math.max((t==null?void 0:t.scrollHeight)||0,(e==null?void 0:e.scrollHeight)||0,(t==null?void 0:t.offsetHeight)||0,(e==null?void 0:e.offsetHeight)||0),vpHeight:window.innerHeight,vpWidth:window.innerWidth}}function k({hideFixed:t,ignoreSticky:e}){if(!t&&!e)return()=>{};const n=[],a=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_ELEMENT);let r;for(;r=a.nextNode();){const i=getComputedStyle(r).position;(t&&i==="fixed"||e&&i==="sticky")&&(n.push({node:r,value:r.style.getPropertyValue("visibility"),priority:r.style.getPropertyPriority("visibility")}),r.style.setProperty("visibility","hidden","important"))}return()=>{for(const{node:i,value:l,priority:s}of n)l?i.style.setProperty("visibility",l,s):i.style.removeProperty("visibility")}}function _(t){window.scrollTo({top:t,behavior:"instant"})}function w(){return window.scrollY||window.pageYOffset||0}function F(t){window.scrollTo({top:t,behavior:"instant"})}function v(t){return new Promise(e=>setTimeout(e,t))}const p=Object.freeze({START_CAPTURE:"SNAP/START_CAPTURE",CAPTURE_PROGRESS:"SNAP/CAPTURE_PROGRESS",CAPTURE_COMPLETE:"SNAP/CAPTURE_COMPLETE",CAPTURE_ERROR:"SNAP/CAPTURE_ERROR",CAPTURE_TAB:"SNAP/CAPTURE_TAB",PING:"SNAP/PING",CANCEL_CAPTURE:"SNAP/CANCEL_CAPTURE",DOWNLOAD_RESULT:"SNAP/DOWNLOAD_RESULT"});function W(t,e,n={}){return{type:p.CAPTURE_PROGRESS,payload:{stage:t,percent:e,...n}}}function B(t){return{type:p.CAPTURE_COMPLETE,payload:t}}function G(t,e,n=!1){return{type:p.CAPTURE_ERROR,payload:{code:t,message:e,recoverable:n}}}new Set(Object.values(p));const u=(t,e,n)=>chrome.runtime.sendMessage(W(t,e,n)).catch(()=>{}),Y=t=>chrome.runtime.sendMessage(B(t)).catch(()=>{}),j=(t,e,n=!1)=>chrome.runtime.sendMessage(G(t,e,n)).catch(()=>{});async function b(){const t=await chrome.runtime.sendMessage({type:p.CAPTURE_TAB,payload:{}});if(!(t!=null&&t.imageData))throw new Error((t==null?void 0:t.error)||"Browser did not return an image");return t.imageData}async function q(t,e){const n=await chrome.runtime.sendMessage({type:p.DOWNLOAD_RESULT,payload:{imageData:t.imageData,title:t.title,format:t.settings.format,location:e.location,namingPattern:e.namingPattern}});if(!(n!=null&&n.success))throw new Error((n==null?void 0:n.error)||"Download failed")}const V=250,O=32767,X=12e7,M=Object.freeze({png:{mime:"image/png",extension:"png"},jpeg:{mime:"image/jpeg",extension:"jpg"},webp:{mime:"image/webp",extension:"webp"}});function N(t,e){const n=Math.max(0,Math.ceil(t)),a=Math.max(1,Math.floor(e)),r=Math.max(0,n-a),i=[0];for(let l=a;l<r;l+=a)i.push(l);return r>0&&i[i.length-1]!==r&&i.push(r),i}function K(t,e,n,a=n){return{width:Math.round(t*n),height:Math.round(e*a)}}function J({width:t,height:e}){if(!t||!e||t>O||e>O||t*e>X)throw new Error("This page is too large to safely export as one image. Reduce browser zoom or capture it in smaller sections.")}function L(t){return M[String(t||"png").toLowerCase()]||M.png}function Q(t){return{high:.92,medium:.8,low:.65}[t]??.92}function Z(t){return t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(1)} MB`}function tt(t){const e=(t==null?void 0:t.split(",")[1])||"";return Math.floor(e.length*3/4)}let f=!1;function et(){f=!0}function U(){return new Promise(t=>requestAnimationFrame(t))}async function E(t=V){var e;await U(),await U(),(e=document.fonts)!=null&&e.ready&&await Promise.race([document.fonts.ready,v(1e3)]),await v(t)}function P(){if(f)throw new Error("Capture cancelled")}async function nt({mode:t,settings:e={}}){f=!1,H({mode:t});const n=w();let a=()=>{};try{Number(e.delay)>0&&(u("analyze",2,{message:`Waiting ${e.delay} seconds`}),await v(Number(e.delay)*1e3)),P(),a=k(e);const r=t==="fullpage"?await rt(e):await at(e);return Y(r),e.autoDownload&&await q(r,e),{success:!0,data:r}}catch(r){return j(f?"CAPTURE_CANCELLED":"CAPTURE_FAILED",r.message,f),{success:!1,error:r.message}}finally{a(),F(n),S()}}async function at(t){u("capture",30),await E(),P(),T();const e=await b();x(),u("finalize",90);const n=await ot(e,t);return I(n.dataUrl,n.width,n.height,"visible",t)}async function rt(t){u("analyze",5);let e=R();const n=N(e.scrollHeight,e.vpHeight),a=[];u("scroll",10,{currentSection:0,totalSections:n.length});for(let s=0;s<n.length;s+=1){P(),_(n[s]),await E();const h=w();T();const m=await b();x(),a.push({imageData:m,y:h}),u("capture",10+(s+1)/n.length*65,{currentSection:s+1,totalSections:n.length})}e=R();const i=N(e.scrollHeight,e.vpHeight).at(-1);i>a.at(-1).y&&(_(i),await E(),T(),a.push({imageData:await b(),y:w()}),x()),u("merge",78);const l=await it(a,e,t);return u("finalize",94),I(l.dataUrl,l.width,l.height,"fullpage",t)}function T(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.display="none")}function x(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.display="")}function C(t){return new Promise((e,n)=>{const a=new Image;a.onload=()=>e(a),a.onerror=()=>n(new Error("Unable to decode a captured image")),a.src=t})}async function it(t,e,n){if(!t.length)throw new Error("No images were captured");const a=await C(t[0].imageData),r=a.naturalWidth/e.vpWidth,i=a.naturalHeight/e.vpHeight,l=K(e.vpWidth,e.scrollHeight,r,i);J(l);const s=document.createElement("canvas");s.width=l.width,s.height=l.height;const h=s.getContext("2d",{alpha:!1});h.fillStyle="#ffffff",h.fillRect(0,0,s.width,s.height);for(let m=0;m<t.length;m+=1){const y=m===0?a:await C(t[m].imageData),st=Math.round(t[m].y*i);h.drawImage(y,0,0,y.naturalWidth,y.naturalHeight,0,st,s.width,y.naturalHeight)}return D(s,n)}async function ot(t,e){const n=await C(t),a=document.createElement("canvas");return a.width=n.naturalWidth,a.height=n.naturalHeight,a.getContext("2d").drawImage(n,0,0),D(a,e)}function D(t,e){const{mime:n}=L(e.format);return{dataUrl:t.toDataURL(n,Q(e.quality)),width:t.width,height:t.height}}function I(t,e,n,a,r){return{imageData:t,dimensions:`${e} × ${n}`,format:L(r.format).extension.toUpperCase(),size:Z(tt(t)),capturedAt:new Date().toISOString(),source:document.title||location.hostname,title:document.title||"page",domain:location.hostname,mode:a,settings:{format:r.format,location:r.location,namingPattern:r.namingPattern}}}if(!globalThis.__akovoSnapControllerInstalled){globalThis.__akovoSnapControllerInstalled=!0;let t=!1;chrome.runtime.onMessage.addListener((e,n,a)=>{if(e!=null&&e.type){if(e.type===p.PING){a({ready:!0});return}if(e.type===p.CANCEL_CAPTURE){et(),a({success:!0});return}if(e.type===p.START_CAPTURE){if(t){a({success:!1,error:"A capture is already in progress"});return}return t=!0,nt(e.payload).then(a).catch(r=>a({success:!1,error:r.message})).finally(()=>{t=!1}),!0}}})}})();
