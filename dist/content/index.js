(function(){"use strict";const d="snap-capture-overlay",$="snap-overlay-styles",C={screenshot:{status:"Preparing capture",subtext:"Capturing visible area"},fullpage:{status:"Preparing capture",subtext:"Measuring page dimensions"}};let l=null,u=null,y=null;function H(){return`
#${d} {
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

#${d}.snap-visible {
  opacity: 1;
}

#${d}.snap-hiding {
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
  #${d},
  #${d} .snap-corner,
  #${d} .snap-dot,
  #${d} .snap-flash,
  #${d} .snap-corner.animate {
    animation: none !important;
    transition-duration: 10ms !important;
    transition-delay: 0s !important;
  }

  #${d} .snap-corner {
    opacity: 1;
  }

  #${d} .snap-dot {
    opacity: 0.5;
    transform: none !important;
  }
}
`}function k({mode:t="screenshot"}={}){if(l)return;const e=C[t]||C.screenshot;u=document.createElement("style"),u.id=$,u.textContent=H(),document.head.appendChild(u),l=document.createElement("div"),l.id=d;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;l.innerHTML=`
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
  `,document.body.appendChild(l),requestAnimationFrame(()=>{l.classList.add("snap-visible"),n||requestAnimationFrame(()=>{l.querySelectorAll(".snap-corner").forEach(i=>i.classList.add("animate"))})}),t==="screenshot"&&(y=setTimeout(()=>{A()},2e3))}function A(){if(y&&(clearTimeout(y),y=null),!l)return;const t=document.createElement("div");t.className="snap-flash",l.appendChild(t),l.classList.remove("snap-visible"),l.classList.add("snap-hiding"),setTimeout(()=>{l&&l.parentNode&&l.parentNode.removeChild(l),u&&u.parentNode&&u.parentNode.removeChild(u),l=null,u=null},400)}function B(t,e){const{width:n,height:a}=e;if(!t||!n||!a)return!1;const i=t.width/n,o=Math.min(320,a*.28),r=Math.min(32,a*.05),s=t.top<=r&&t.bottom>0,c=t.bottom>=a-r&&t.top<a;return i>=.55&&t.height>=24&&t.height<=o&&(s||c)}function S(){const t=document.documentElement,e=document.body;return{scrollHeight:Math.max((t==null?void 0:t.scrollHeight)||0,(e==null?void 0:e.scrollHeight)||0,(t==null?void 0:t.offsetHeight)||0,(e==null?void 0:e.offsetHeight)||0),vpHeight:window.innerHeight,vpWidth:window.innerWidth}}function F(t){return t.hasAttribute("data-snap-keep")||t.matches("[role='dialog'], [aria-modal='true'], :popover-open")}function W(t){return t.matches("header, nav, footer, [role='banner'], [role='navigation'], [role='contentinfo']")}function G(t,e){return(e.zIndex!=="auto"||e.transform!=="none"||e.willChange.includes("transform"))&&(W(t)||Number(e.zIndex)>=1||e.transform!=="none")}function R(t,e){var i;const n=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT);let a;for(;a=n.nextNode();)e(a),((i=a.shadowRoot)==null?void 0:i.mode)==="open"&&R(a.shadowRoot,e)}function _({floatingMode:t="smart",hideFixed:e,ignoreSticky:n}){if(t==="none"&&!e&&!n)return()=>{};const a=[],i=[];R(document.documentElement,o=>{if(F(o))return;const r=getComputedStyle(o);if(r.display==="none"||r.visibility==="hidden"||Number(r.opacity)===0)return;const s=r.position,c=s==="fixed"||s==="sticky",p=B(o.getBoundingClientRect(),{width:window.innerWidth,height:window.innerHeight}),h=G(o,r)&&p;(e&&s==="fixed"||n&&s==="sticky"||t==="all"&&(c||h)||t==="smart"&&(c||h)&&p)&&i.push(o)});for(const o of i)i.some(r=>r!==o&&r.contains(o))||(a.push({node:o,value:o.style.getPropertyValue("visibility"),priority:o.style.getPropertyPriority("visibility")}),o.style.setProperty("visibility","hidden","important"));return()=>{for(const{node:o,value:r,priority:s}of a)r?o.style.setProperty("visibility",r,s):o.style.removeProperty("visibility")}}function L(t){window.scrollTo({top:t,behavior:"instant"})}function w(){return window.scrollY||window.pageYOffset||0}function Y(t){window.scrollTo({top:t,behavior:"instant"})}function b(t){return new Promise(e=>setTimeout(e,t))}const m=Object.freeze({START_CAPTURE:"SNAP/START_CAPTURE",CAPTURE_PROGRESS:"SNAP/CAPTURE_PROGRESS",CAPTURE_COMPLETE:"SNAP/CAPTURE_COMPLETE",CAPTURE_ERROR:"SNAP/CAPTURE_ERROR",CAPTURE_TAB:"SNAP/CAPTURE_TAB",PING:"SNAP/PING",CANCEL_CAPTURE:"SNAP/CANCEL_CAPTURE",DOWNLOAD_RESULT:"SNAP/DOWNLOAD_RESULT"});function j(t,e,n={}){return{type:m.CAPTURE_PROGRESS,payload:{stage:t,percent:e,...n}}}function q(t){return{type:m.CAPTURE_COMPLETE,payload:t}}function V(t,e,n=!1){return{type:m.CAPTURE_ERROR,payload:{code:t,message:e,recoverable:n}}}new Set(Object.values(m));const f=(t,e,n)=>chrome.runtime.sendMessage(j(t,e,n)).catch(()=>{}),X=t=>chrome.runtime.sendMessage(q(t)).catch(()=>{}),K=(t,e,n=!1)=>chrome.runtime.sendMessage(V(t,e,n)).catch(()=>{});async function J(){const t=await chrome.runtime.sendMessage({type:m.CAPTURE_TAB,payload:{}});if(!(t!=null&&t.imageData))throw new Error((t==null?void 0:t.error)||"Browser did not return an image");return t.imageData}async function Q(t,e){const n=await chrome.runtime.sendMessage({type:m.DOWNLOAD_RESULT,payload:{imageData:t.imageData,title:t.title,format:t.settings.format,location:e.location,namingPattern:e.namingPattern}});if(!(n!=null&&n.success))throw new Error((n==null?void 0:n.error)||"Download failed")}const Z=250,O=32767,tt=12e7,N=Object.freeze({png:{mime:"image/png",extension:"png"},jpeg:{mime:"image/jpeg",extension:"jpg"},webp:{mime:"image/webp",extension:"webp"}});function M(t,e){const n=Math.max(0,Math.ceil(t)),a=Math.max(1,Math.floor(e)),i=Math.max(0,n-a),o=[0];for(let r=a;r<i;r+=a)o.push(r);return i>0&&o[o.length-1]!==i&&o.push(i),o}function et(t,e,n,a=n){return{width:Math.round(t*n),height:Math.round(e*a)}}function nt({width:t,height:e}){if(!t||!e||t>O||e>O||t*e>tt)throw new Error("This page is too large to safely export as one image. Reduce browser zoom or capture it in smaller sections.")}function U(t){return N[String(t||"png").toLowerCase()]||N.png}function at(t){return{high:.92,medium:.8,low:.65}[t]??.92}function it(t){return t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(1)} MB`}function ot(t){const e=(t==null?void 0:t.split(",")[1])||"";return Math.floor(e.length*3/4)}let g=!1;function rt(){g=!0}function v(){return new Promise(t=>requestAnimationFrame(t))}async function E(t=Z){var e;await v(),await v(),(e=document.fonts)!=null&&e.ready&&await Promise.race([document.fonts.ready,b(1e3)]),await b(t)}function P(){if(g)throw new Error("Capture cancelled")}async function st({mode:t,settings:e={}}){g=!1,k({mode:t});const n=w();let a=()=>{};try{Number(e.delay)>0&&(f("analyze",2,{message:`Waiting ${e.delay} seconds`}),await b(Number(e.delay)*1e3)),P(),t!=="fullpage"&&(a=_(e));const i=t==="fullpage"?await ct(e):await lt(e);return X(i),e.autoDownload&&await Q(i,e),{success:!0,data:i}}catch(i){return K(g?"CAPTURE_CANCELLED":"CAPTURE_FAILED",i.message,g),{success:!1,error:i.message}}finally{a(),Y(n),A()}}async function lt(t){f("capture",30),await E(),P();const e=await x();f("finalize",90);const n=await mt(e,t);return I(n.dataUrl,n.width,n.height,"visible",t)}async function ct(t){f("analyze",5);let e=S();const n=M(e.scrollHeight,e.vpHeight),a=[];let i=()=>{};f("scroll",10,{currentSection:0,totalSections:n.length});try{for(let c=0;c<n.length;c+=1){P(),c===1&&(i=_(t)),L(n[c]),await E();const p=w(),h=await x();a.push({imageData:h,y:p}),f("capture",10+(c+1)/n.length*65,{currentSection:c+1,totalSections:n.length})}e=S();const r=M(e.scrollHeight,e.vpHeight).at(-1);r>a.at(-1).y&&(L(r),await E(),a.push({imageData:await x(),y:w()})),f("merge",78);const s=await ut(a,e,t);return f("finalize",94),I(s.dataUrl,s.width,s.height,"fullpage",t)}finally{i()}}function dt(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.display="none")}function pt(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.display="")}async function x(){dt(),await v();try{return await J()}finally{pt()}}function T(t){return new Promise((e,n)=>{const a=new Image;a.onload=()=>e(a),a.onerror=()=>n(new Error("Unable to decode a captured image")),a.src=t})}async function ut(t,e,n){if(!t.length)throw new Error("No images were captured");const a=await T(t[0].imageData),i=a.naturalWidth/e.vpWidth,o=a.naturalHeight/e.vpHeight,r=et(e.vpWidth,e.scrollHeight,i,o);nt(r);const s=document.createElement("canvas");s.width=r.width,s.height=r.height;const c=s.getContext("2d",{alpha:!1});c.fillStyle="#ffffff",c.fillRect(0,0,s.width,s.height);for(let p=0;p<t.length;p+=1){const h=p===0?a:await T(t[p].imageData),z=Math.round(t[p].y*o);c.drawImage(h,0,0,h.naturalWidth,h.naturalHeight,0,z,s.width,h.naturalHeight)}return D(s,n)}async function mt(t,e){const n=await T(t),a=document.createElement("canvas");return a.width=n.naturalWidth,a.height=n.naturalHeight,a.getContext("2d").drawImage(n,0,0),D(a,e)}function D(t,e){const{mime:n}=U(e.format);return{dataUrl:t.toDataURL(n,at(e.quality)),width:t.width,height:t.height}}function I(t,e,n,a,i){return{imageData:t,dimensions:`${e} × ${n}`,format:U(i.format).extension.toUpperCase(),size:it(ot(t)),capturedAt:new Date().toISOString(),source:document.title||location.hostname,title:document.title||"page",domain:location.hostname,mode:a,settings:{format:i.format,location:i.location,namingPattern:i.namingPattern}}}if(!globalThis.__akovoSnapControllerInstalled){globalThis.__akovoSnapControllerInstalled=!0;let t=!1;chrome.runtime.onMessage.addListener((e,n,a)=>{if(e!=null&&e.type){if(e.type===m.PING){a({ready:!0});return}if(e.type===m.CANCEL_CAPTURE){rt(),a({success:!0});return}if(e.type===m.START_CAPTURE){if(t){a({success:!1,error:"A capture is already in progress"});return}return t=!0,st(e.payload).then(a).catch(i=>a({success:!1,error:i.message})).finally(()=>{t=!1}),!0}}})}})();
