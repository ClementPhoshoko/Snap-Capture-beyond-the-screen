(function(){"use strict";const c="snap-capture-overlay",D="snap-overlay-styles",C={screenshot:{status:"Preparing capture",subtext:"Capturing visible area"},fullpage:{status:"Preparing capture",subtext:"Measuring page dimensions"}};let o=null,d=null,g=null;function I(){return`
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
`}function $({mode:t="screenshot"}={}){if(o)return;const e=C[t]||C.screenshot;d=document.createElement("style"),d.id=D,d.textContent=I(),document.head.appendChild(d),o=document.createElement("div"),o.id=c;const a=window.matchMedia("(prefers-reduced-motion: reduce)").matches;o.innerHTML=`
    <div class="snap-overlay-bg"></div>
    <div class="snap-corners">
      <div class="snap-corner snap-corner-tl${a?" animate":""}"></div>
      <div class="snap-corner snap-corner-tr${a?" animate":""}"></div>
      <div class="snap-corner snap-corner-br${a?" animate":""}"></div>
      <div class="snap-corner snap-corner-bl${a?" animate":""}"></div>
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
  `,document.body.appendChild(o),requestAnimationFrame(()=>{o.classList.add("snap-visible"),a||requestAnimationFrame(()=>{o.querySelectorAll(".snap-corner").forEach(r=>r.classList.add("animate"))})}),t==="screenshot"&&(g=setTimeout(()=>{A()},2e3))}function A(){if(g&&(clearTimeout(g),g=null),!o)return;const t=document.createElement("div");t.className="snap-flash",o.appendChild(t),o.classList.remove("snap-visible"),o.classList.add("snap-hiding"),setTimeout(()=>{o&&o.parentNode&&o.parentNode.removeChild(o),d&&d.parentNode&&d.parentNode.removeChild(d),o=null,d=null},400)}function S(){const t=document.documentElement,e=document.body;return{scrollHeight:Math.max((t==null?void 0:t.scrollHeight)||0,(e==null?void 0:e.scrollHeight)||0,(t==null?void 0:t.offsetHeight)||0,(e==null?void 0:e.offsetHeight)||0),vpHeight:window.innerHeight,vpWidth:window.innerWidth}}function z({hideFixed:t,ignoreSticky:e}){if(!t&&!e)return()=>{};const a=[],n=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_ELEMENT);let r;for(;r=n.nextNode();){const i=getComputedStyle(r).position;(t&&i==="fixed"||e&&i==="sticky")&&(a.push({node:r,value:r.style.getPropertyValue("visibility"),priority:r.style.getPropertyPriority("visibility")}),r.style.setProperty("visibility","hidden","important"))}return()=>{for(const{node:i,value:l,priority:s}of a)l?i.style.setProperty("visibility",l,s):i.style.removeProperty("visibility")}}function R(t){window.scrollTo({top:t,behavior:"instant"})}function w(){return window.scrollY||window.pageYOffset||0}function H(t){window.scrollTo({top:t,behavior:"instant"})}function v(t){return new Promise(e=>setTimeout(e,t))}const p=Object.freeze({START_CAPTURE:"SNAP/START_CAPTURE",CAPTURE_PROGRESS:"SNAP/CAPTURE_PROGRESS",CAPTURE_COMPLETE:"SNAP/CAPTURE_COMPLETE",CAPTURE_ERROR:"SNAP/CAPTURE_ERROR",CAPTURE_TAB:"SNAP/CAPTURE_TAB",PING:"SNAP/PING",CANCEL_CAPTURE:"SNAP/CANCEL_CAPTURE",DOWNLOAD_RESULT:"SNAP/DOWNLOAD_RESULT"});function k(t,e,a={}){return{type:p.CAPTURE_PROGRESS,payload:{stage:t,percent:e,...a}}}function W(t){return{type:p.CAPTURE_COMPLETE,payload:t}}function F(t,e,a=!1){return{type:p.CAPTURE_ERROR,payload:{code:t,message:e,recoverable:a}}}new Set(Object.values(p));const u=(t,e,a)=>chrome.runtime.sendMessage(k(t,e,a)).catch(()=>{}),B=t=>chrome.runtime.sendMessage(W(t)).catch(()=>{}),G=(t,e,a=!1)=>chrome.runtime.sendMessage(F(t,e,a)).catch(()=>{});async function Y(){const t=await chrome.runtime.sendMessage({type:p.CAPTURE_TAB,payload:{}});if(!(t!=null&&t.imageData))throw new Error((t==null?void 0:t.error)||"Browser did not return an image");return t.imageData}async function j(t,e){const a=await chrome.runtime.sendMessage({type:p.DOWNLOAD_RESULT,payload:{imageData:t.imageData,title:t.title,format:t.settings.format,location:e.location,namingPattern:e.namingPattern}});if(!(a!=null&&a.success))throw new Error((a==null?void 0:a.error)||"Download failed")}const q=250,_=32767,V=12e7,O=Object.freeze({png:{mime:"image/png",extension:"png"},jpeg:{mime:"image/jpeg",extension:"jpg"},webp:{mime:"image/webp",extension:"webp"}});function M(t,e){const a=Math.max(0,Math.ceil(t)),n=Math.max(1,Math.floor(e)),r=Math.max(0,a-n),i=[0];for(let l=n;l<r;l+=n)i.push(l);return r>0&&i[i.length-1]!==r&&i.push(r),i}function X(t,e,a,n=a){return{width:Math.round(t*a),height:Math.round(e*n)}}function K({width:t,height:e}){if(!t||!e||t>_||e>_||t*e>V)throw new Error("This page is too large to safely export as one image. Reduce browser zoom or capture it in smaller sections.")}function N(t){return O[String(t||"png").toLowerCase()]||O.png}function J(t){return{high:.92,medium:.8,low:.65}[t]??.92}function Q(t){return t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(1)} MB`}function Z(t){const e=(t==null?void 0:t.split(",")[1])||"";return Math.floor(e.length*3/4)}let f=!1;function tt(){f=!0}function b(){return new Promise(t=>requestAnimationFrame(t))}async function E(t=q){var e;await b(),await b(),(e=document.fonts)!=null&&e.ready&&await Promise.race([document.fonts.ready,v(1e3)]),await v(t)}function P(){if(f)throw new Error("Capture cancelled")}async function et({mode:t,settings:e={}}){f=!1,$({mode:t});const a=w();let n=()=>{};try{Number(e.delay)>0&&(u("analyze",2,{message:`Waiting ${e.delay} seconds`}),await v(Number(e.delay)*1e3)),P(),n=z(e);const r=t==="fullpage"?await nt(e):await at(e);return B(r),e.autoDownload&&await j(r,e),{success:!0,data:r}}catch(r){return G(f?"CAPTURE_CANCELLED":"CAPTURE_FAILED",r.message,f),{success:!1,error:r.message}}finally{n(),H(a),A()}}async function at(t){u("capture",30),await E(),P();const e=await T();u("finalize",90);const a=await st(e,t);return U(a.dataUrl,a.width,a.height,"visible",t)}async function nt(t){u("analyze",5);let e=S();const a=M(e.scrollHeight,e.vpHeight),n=[];u("scroll",10,{currentSection:0,totalSections:a.length});for(let s=0;s<a.length;s+=1){P(),R(a[s]),await E();const h=w(),m=await T();n.push({imageData:m,y:h}),u("capture",10+(s+1)/a.length*65,{currentSection:s+1,totalSections:a.length})}e=S();const i=M(e.scrollHeight,e.vpHeight).at(-1);i>n.at(-1).y&&(R(i),await E(),n.push({imageData:await T(),y:w()})),u("merge",78);const l=await ot(n,e,t);return u("finalize",94),U(l.dataUrl,l.width,l.height,"fullpage",t)}function rt(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.display="none")}function it(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.display="")}async function T(){rt(),await b();try{return await Y()}finally{it()}}function x(t){return new Promise((e,a)=>{const n=new Image;n.onload=()=>e(n),n.onerror=()=>a(new Error("Unable to decode a captured image")),n.src=t})}async function ot(t,e,a){if(!t.length)throw new Error("No images were captured");const n=await x(t[0].imageData),r=n.naturalWidth/e.vpWidth,i=n.naturalHeight/e.vpHeight,l=X(e.vpWidth,e.scrollHeight,r,i);K(l);const s=document.createElement("canvas");s.width=l.width,s.height=l.height;const h=s.getContext("2d",{alpha:!1});h.fillStyle="#ffffff",h.fillRect(0,0,s.width,s.height);for(let m=0;m<t.length;m+=1){const y=m===0?n:await x(t[m].imageData),lt=Math.round(t[m].y*i);h.drawImage(y,0,0,y.naturalWidth,y.naturalHeight,0,lt,s.width,y.naturalHeight)}return L(s,a)}async function st(t,e){const a=await x(t),n=document.createElement("canvas");return n.width=a.naturalWidth,n.height=a.naturalHeight,n.getContext("2d").drawImage(a,0,0),L(n,e)}function L(t,e){const{mime:a}=N(e.format);return{dataUrl:t.toDataURL(a,J(e.quality)),width:t.width,height:t.height}}function U(t,e,a,n,r){return{imageData:t,dimensions:`${e} × ${a}`,format:N(r.format).extension.toUpperCase(),size:Q(Z(t)),capturedAt:new Date().toISOString(),source:document.title||location.hostname,title:document.title||"page",domain:location.hostname,mode:n,settings:{format:r.format,location:r.location,namingPattern:r.namingPattern}}}if(!globalThis.__akovoSnapControllerInstalled){globalThis.__akovoSnapControllerInstalled=!0;let t=!1;chrome.runtime.onMessage.addListener((e,a,n)=>{if(e!=null&&e.type){if(e.type===p.PING){n({ready:!0});return}if(e.type===p.CANCEL_CAPTURE){tt(),n({success:!0});return}if(e.type===p.START_CAPTURE){if(t){n({success:!1,error:"A capture is already in progress"});return}return t=!0,et(e.payload).then(n).catch(r=>n({success:!1,error:r.message})).finally(()=>{t=!1}),!0}}})}})();
