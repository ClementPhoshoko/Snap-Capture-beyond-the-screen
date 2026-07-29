(function(){"use strict";const p="snap-capture-overlay",B="snap-overlay-styles",_={screenshot:{status:"Preparing capture",subtext:"Capturing visible area"},fullpage:{status:"Preparing capture",subtext:"Measuring page dimensions"}};let c=null,m=null,b=null;function F(){return`
#${p} {
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

#${p}.snap-visible {
  opacity: 1;
}

#${p}.snap-hiding {
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
  #${p},
  #${p} .snap-corner,
  #${p} .snap-dot,
  #${p} .snap-flash,
  #${p} .snap-corner.animate {
    animation: none !important;
    transition-duration: 10ms !important;
    transition-delay: 0s !important;
  }

  #${p} .snap-corner {
    opacity: 1;
  }

  #${p} .snap-dot {
    opacity: 0.5;
    transform: none !important;
  }
}
`}function G({mode:t="screenshot"}={}){if(c)return;const e=_[t]||_.screenshot;m=document.createElement("style"),m.id=B,m.textContent=F(),document.head.appendChild(m),c=document.createElement("div"),c.id=p;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;c.innerHTML=`
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
  `,document.body.appendChild(c),requestAnimationFrame(()=>{c.classList.add("snap-visible"),n||requestAnimationFrame(()=>{c.querySelectorAll(".snap-corner").forEach(r=>r.classList.add("animate"))})}),t==="screenshot"&&(b=setTimeout(()=>{M()},2e3))}function M(){if(b&&(clearTimeout(b),b=null),!c)return;const t=document.createElement("div");t.className="snap-flash",c.appendChild(t),c.classList.remove("snap-visible"),c.classList.add("snap-hiding"),setTimeout(()=>{c&&c.parentNode&&c.parentNode.removeChild(c),m&&m.parentNode&&m.parentNode.removeChild(m),c=null,m=null},400)}function Y(t,e){const{width:n,height:o}=e;if(!t||!n||!o)return!1;const r=t.width/n,i=Math.min(320,o*.28),s=Math.min(32,o*.05),a=t.top<=s&&t.bottom>0,u=t.bottom>=o-s&&t.top<o;return r>=.55&&t.height>=24&&t.height<=i&&(a||u)}function L(){const t=document.documentElement,e=document.body;return{scrollHeight:Math.max((t==null?void 0:t.scrollHeight)||0,(e==null?void 0:e.scrollHeight)||0,(t==null?void 0:t.offsetHeight)||0,(e==null?void 0:e.offsetHeight)||0),vpHeight:window.innerHeight,vpWidth:window.innerWidth}}function q(t){return t.hasAttribute("data-snap-keep")||t.matches("[role='dialog'], [aria-modal='true'], :popover-open")}function V(t){return t.matches("header, nav, footer, [role='banner'], [role='navigation'], [role='contentinfo']")}function H(t,e){return(e.zIndex!=="auto"||e.transform!=="none"||e.willChange.includes("transform"))&&(V(t)||Number(e.zIndex)>=1||e.transform!=="none")}function T(t,e){var r;const n=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT);let o;for(;o=n.nextNode();)e(o),((r=o.shadowRoot)==null?void 0:r.mode)==="open"&&T(o.shadowRoot,e)}function O({floatingMode:t="smart"}){if(t==="none")return()=>{};const e=[],n=[];T(document.documentElement,o=>{if(q(o))return;const r=getComputedStyle(o);if(r.display==="none"||r.visibility==="hidden"||Number(r.opacity)===0)return;const i=r.position,s=i==="fixed"||i==="sticky";if(t==="all"){const a=H(o,r);(s||a)&&n.push(o)}else{const a=Y(o.getBoundingClientRect(),{width:window.innerWidth,height:window.innerHeight});(s||H(o,r))&&a&&n.push(o)}});for(const o of n)n.some(r=>r!==o&&r.contains(o))||(e.push({node:o,value:o.style.getPropertyValue("visibility"),priority:o.style.getPropertyPriority("visibility")}),o.style.setProperty("visibility","hidden","important"));return()=>{for(const{node:o,value:r,priority:i}of e)r?o.style.setProperty("visibility",r,i):o.style.removeProperty("visibility")}}function j(){const t=[];return T(document.documentElement,e=>{if(e===document.body||e===document.documentElement)return;const o=getComputedStyle(e).overflowY;o!=="scroll"&&o!=="auto"||e.scrollHeight<=e.clientHeight||(t.push({node:e,overflow:e.style.getPropertyValue("overflow"),overflowPriority:e.style.getPropertyPriority("overflow"),overflowY:e.style.getPropertyValue("overflow-y"),overflowYPriority:e.style.getPropertyPriority("overflow-y"),maxHeight:e.style.getPropertyValue("max-height"),maxHeightPriority:e.style.getPropertyPriority("max-height")}),e.style.setProperty("overflow","visible","important"),e.style.setProperty("overflow-y","visible","important"),e.style.setProperty("max-height","none","important"))}),()=>{for(const e of t){const{node:n,overflow:o,overflowPriority:r,overflowY:i,overflowYPriority:s,maxHeight:a,maxHeightPriority:u}=e;o?n.style.setProperty("overflow",o,r):n.style.removeProperty("overflow"),i?n.style.setProperty("overflow-y",i,s):n.style.removeProperty("overflow-y"),a?n.style.setProperty("max-height",a,u):n.style.removeProperty("max-height")}}}function X(){const t=document.querySelectorAll("video"),e=[];for(const n of t)n.paused||(n.pause(),e.push(n));return()=>{for(const n of e)n.play().catch(()=>{})}}function N(t){window.scrollTo({top:t,behavior:"instant"})}function C(){return window.scrollY||window.pageYOffset||0}function K(t){window.scrollTo({top:t,behavior:"instant"})}function P(t){return new Promise(e=>setTimeout(e,t))}const f=Object.freeze({START_CAPTURE:"SNAP/START_CAPTURE",CAPTURE_PROGRESS:"SNAP/CAPTURE_PROGRESS",CAPTURE_COMPLETE:"SNAP/CAPTURE_COMPLETE",CAPTURE_ERROR:"SNAP/CAPTURE_ERROR",CAPTURE_TAB:"SNAP/CAPTURE_TAB",PING:"SNAP/PING",CANCEL_CAPTURE:"SNAP/CANCEL_CAPTURE",DOWNLOAD_RESULT:"SNAP/DOWNLOAD_RESULT"});function J(t,e,n={}){return{type:f.CAPTURE_PROGRESS,payload:{stage:t,percent:e,...n}}}function Q(t){return{type:f.CAPTURE_COMPLETE,payload:t}}function Z(t,e,n=!1){return{type:f.CAPTURE_ERROR,payload:{code:t,message:e,recoverable:n}}}new Set(Object.values(f));const h=(t,e,n)=>chrome.runtime.sendMessage(J(t,e,n)).catch(()=>{}),tt=t=>chrome.runtime.sendMessage(Q(t)).catch(()=>{}),et=(t,e,n=!1)=>chrome.runtime.sendMessage(Z(t,e,n)).catch(()=>{});async function nt(){const t=await chrome.runtime.sendMessage({type:f.CAPTURE_TAB,payload:{}});if(!(t!=null&&t.imageData))throw new Error((t==null?void 0:t.error)||"Browser did not return an image");return t.imageData}async function ot(t,e){const n=await chrome.runtime.sendMessage({type:f.DOWNLOAD_RESULT,payload:{imageData:t.imageData,title:t.title,format:t.settings.format,location:e.location,namingPattern:e.namingPattern}});if(!(n!=null&&n.success))throw new Error((n==null?void 0:n.error)||"Download failed")}const rt=250,U=32767,at=12e7,D=300,it=2e5,I=12e4,st=3,z=Object.freeze({png:{mime:"image/png",extension:"png"},jpeg:{mime:"image/jpeg",extension:"jpg"},webp:{mime:"image/webp",extension:"webp"}});function lt(t,e){const n=Math.max(0,Math.ceil(t)),o=Math.max(1,Math.floor(e)),r=Math.max(0,n-o),i=[0];let s=0;for(let a=o;a<r&&s<D;a+=o)i.push(a),s+=1;return r>0&&i[i.length-1]!==r&&s<D&&i.push(r),i}function ct(t,e){return t>it}function pt(t,e,n,o=n){return{width:Math.round(t*n),height:Math.round(e*o)}}function ut({width:t,height:e}){if(!t||!e||t>U||e>U||t*e>at)throw new Error("This page is too large to safely export as one image. Reduce browser zoom or capture it in smaller sections.")}function $(t){return z[String(t||"png").toLowerCase()]||z.png}function dt(t){return{high:.92,medium:.8,low:.65}[t]??.92}function mt(t){return t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(1)} MB`}function ft(t){const e=(t==null?void 0:t.split(",")[1])||"";return Math.floor(e.length*3/4)}let w=!1;function ht(){w=!0}function E(){return new Promise(t=>requestAnimationFrame(t))}async function S(t=rt){var e;if(await E(),await E(),(e=document.fonts)!=null&&e.ready&&await Promise.race([document.fonts.ready,P(1e3)]),document.getAnimations){const n=document.getAnimations().filter(o=>o.playState==="running");n.length&&await Promise.race([Promise.allSettled(n.map(o=>o.finished.catch(()=>{}))),P(t)])}await P(t)}function x(){if(w)throw new Error("Capture cancelled")}async function gt({mode:t,settings:e={}}){w=!1,G({mode:t});const n=C();let o=()=>{};try{Number(e.delay)>0&&(h("analyze",2,{message:`Waiting ${e.delay} seconds`}),await P(Number(e.delay)*1e3)),x(),t!=="fullpage"&&(o=O(e));const r=t==="fullpage"?await wt(e):await yt(e);return tt(r),e.autoDownload&&await ot(r,e),{success:!0,data:r}}catch(r){return et(w?"CAPTURE_CANCELLED":"CAPTURE_FAILED",r.message,w),{success:!1,error:r.message}}finally{o(),K(n),M()}}async function yt(t){h("capture",30),await S(),x();const e=await A();h("finalize",90);const n=await bt(e,t);return W(n.dataUrl,n.width,n.height,"visible",t)}async function wt(t){h("analyze",5);const e=j(),n=X();let o=()=>{};try{let r=L();if(ct(r.scrollHeight,r.vpHeight))throw new Error("Page exceeds the maximum capturable height. Reduce browser zoom or capture in sections.");const i=Date.now(),s=lt(r.scrollHeight,r.vpHeight),a=[];h("scroll",10,{currentSection:0,totalSections:s.length});for(let l=0;l<s.length;l+=1){if(x(),Date.now()-i>I)throw new Error("Capture timed out — the page is too long or taking too long to render.");l===1&&(o=O(t)),N(s[l]),await S();const d=C();if(l>0&&d===a[l-1].y)continue;const g=await A();a.push({imageData:g,y:d}),h("capture",10+(l+1)/s.length*65,{currentSection:l+1,totalSections:s.length})}for(let l=0;l<st;l++){r=L();const d=a.at(-1).y,g=Math.max(0,r.scrollHeight-r.vpHeight);if(g<=d+r.vpHeight)break;const y=[];for(let v=d+r.vpHeight;v<g&&y.length<50;v+=r.vpHeight)y.push(v);y.length>0&&y.at(-1)<g&&y.push(g);for(const v of y){if(x(),Date.now()-i>I)throw new Error("Capture timed out");N(v),await S(),a.push({imageData:await A(),y:C()})}}h("merge",78);const u=await vt(a,r,t);return h("finalize",94),W(u.dataUrl,u.width,u.height,"fullpage",t)}finally{o(),n(),e()}}async function A(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.setProperty("display","none","important"),t.offsetHeight),await E(),await E();try{return await nt()}finally{t&&(t.style.display="")}}function R(t){return new Promise((e,n)=>{const o=new Image;o.onload=()=>e(o),o.onerror=()=>n(new Error("Unable to decode a captured image")),o.src=t})}async function vt(t,e,n){if(!t.length)throw new Error("No images were captured");const o=await R(t[0].imageData),r=o.naturalWidth/e.vpWidth,i=o.naturalHeight/e.vpHeight,s=pt(e.vpWidth,e.scrollHeight,r,i);ut(s);const a=document.createElement("canvas");a.width=s.width,a.height=s.height;const u=a.getContext("2d",{alpha:!1});u.fillStyle="#ffffff",u.fillRect(0,0,a.width,a.height);for(let l=0;l<t.length;l+=1){const d=l===0?o:await R(t[l].imageData),g=Math.round(t[l].y*i);u.drawImage(d,0,0,d.naturalWidth,d.naturalHeight,0,g,a.width,d.naturalHeight)}return k(a,n)}async function bt(t,e){const n=await R(t),o=document.createElement("canvas");return o.width=n.naturalWidth,o.height=n.naturalHeight,o.getContext("2d").drawImage(n,0,0),k(o,e)}function k(t,e){const{mime:n}=$(e.format);return{dataUrl:t.toDataURL(n,dt(e.quality)),width:t.width,height:t.height}}function W(t,e,n,o,r){const i=document.querySelector("link[rel*='icon']");return{imageData:t,dimensions:`${e} × ${n}`,format:$(r.format).extension.toUpperCase(),size:mt(ft(t)),capturedAt:new Date().toISOString(),source:document.title||location.hostname,title:document.title||"page",domain:location.hostname,url:location.href,favicon:(i==null?void 0:i.href)||`${location.origin}/favicon.ico`,mode:o,settings:{format:r.format,location:r.location,namingPattern:r.namingPattern}}}if(!globalThis.__akovoSnapControllerInstalled){globalThis.__akovoSnapControllerInstalled=!0;let t=!1;chrome.runtime.onMessage.addListener((e,n,o)=>{if(e!=null&&e.type){if(e.type===f.PING){o({ready:!0});return}if(e.type===f.CANCEL_CAPTURE){ht(),o({success:!0});return}if(e.type===f.START_CAPTURE){if(t){o({success:!1,error:"A capture is already in progress"});return}return t=!0,gt(e.payload).then(o).catch(r=>o({success:!1,error:r.message})).finally(()=>{t=!1}),!0}}})}})();
