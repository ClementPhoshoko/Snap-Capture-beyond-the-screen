(function(){"use strict";const p="snap-capture-overlay",$="snap-overlay-styles",A={screenshot:{status:"Preparing capture",subtext:"Capturing visible area"},fullpage:{status:"Preparing capture",subtext:"Measuring page dimensions"}};let c=null,m=null,y=null;function k(){return`
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
`}function B({mode:t="screenshot"}={}){if(c)return;const e=A[t]||A.screenshot;m=document.createElement("style"),m.id=$,m.textContent=k(),document.head.appendChild(m),c=document.createElement("div"),c.id=p;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;c.innerHTML=`
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
  `,document.body.appendChild(c),requestAnimationFrame(()=>{c.classList.add("snap-visible"),n||requestAnimationFrame(()=>{c.querySelectorAll(".snap-corner").forEach(o=>o.classList.add("animate"))})}),t==="screenshot"&&(y=setTimeout(()=>{S()},2e3))}function S(){if(y&&(clearTimeout(y),y=null),!c)return;const t=document.createElement("div");t.className="snap-flash",c.appendChild(t),c.classList.remove("snap-visible"),c.classList.add("snap-hiding"),setTimeout(()=>{c&&c.parentNode&&c.parentNode.removeChild(c),m&&m.parentNode&&m.parentNode.removeChild(m),c=null,m=null},400)}function F(t,e){const{width:n,height:a}=e;if(!t||!n||!a)return!1;const o=t.width/n,i=Math.min(320,a*.28),r=Math.min(32,a*.05),s=t.top<=r&&t.bottom>0,d=t.bottom>=a-r&&t.top<a;return o>=.55&&t.height>=24&&t.height<=i&&(s||d)}function R(){const t=document.documentElement,e=document.body;return{scrollHeight:Math.max((t==null?void 0:t.scrollHeight)||0,(e==null?void 0:e.scrollHeight)||0,(t==null?void 0:t.offsetHeight)||0,(e==null?void 0:e.offsetHeight)||0),vpHeight:window.innerHeight,vpWidth:window.innerWidth}}function W(t){return t.hasAttribute("data-snap-keep")||t.matches("[role='dialog'], [aria-modal='true'], :popover-open")}function G(t){return t.matches("header, nav, footer, [role='banner'], [role='navigation'], [role='contentinfo']")}function Y(t,e){return(e.zIndex!=="auto"||e.transform!=="none"||e.willChange.includes("transform"))&&(G(t)||Number(e.zIndex)>=1||e.transform!=="none")}function _(t,e){var o;const n=document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT);let a;for(;a=n.nextNode();)e(a),((o=a.shadowRoot)==null?void 0:o.mode)==="open"&&_(a.shadowRoot,e)}function L({floatingMode:t="smart",hideFixed:e,ignoreSticky:n}){if(t==="none"&&!e&&!n)return()=>{};const a=[],o=[];_(document.documentElement,i=>{if(W(i))return;const r=getComputedStyle(i);if(r.display==="none"||r.visibility==="hidden"||Number(r.opacity)===0)return;const s=r.position,d=s==="fixed"||s==="sticky",l=F(i.getBoundingClientRect(),{width:window.innerWidth,height:window.innerHeight}),u=Y(i,r)&&l;(e&&s==="fixed"||n&&s==="sticky"||t==="all"&&(d||u)||t==="smart"&&(d||u)&&l)&&o.push(i)});for(const i of o)o.some(r=>r!==i&&r.contains(i))||(a.push({node:i,value:i.style.getPropertyValue("visibility"),priority:i.style.getPropertyPriority("visibility")}),i.style.setProperty("visibility","hidden","important"));return()=>{for(const{node:i,value:r,priority:s}of a)r?i.style.setProperty("visibility",r,s):i.style.removeProperty("visibility")}}function M(t){window.scrollTo({top:t,behavior:"instant"})}function b(){return window.scrollY||window.pageYOffset||0}function j(t){window.scrollTo({top:t,behavior:"instant"})}function v(t){return new Promise(e=>setTimeout(e,t))}const h=Object.freeze({START_CAPTURE:"SNAP/START_CAPTURE",CAPTURE_PROGRESS:"SNAP/CAPTURE_PROGRESS",CAPTURE_COMPLETE:"SNAP/CAPTURE_COMPLETE",CAPTURE_ERROR:"SNAP/CAPTURE_ERROR",CAPTURE_TAB:"SNAP/CAPTURE_TAB",PING:"SNAP/PING",CANCEL_CAPTURE:"SNAP/CANCEL_CAPTURE",DOWNLOAD_RESULT:"SNAP/DOWNLOAD_RESULT"});function q(t,e,n={}){return{type:h.CAPTURE_PROGRESS,payload:{stage:t,percent:e,...n}}}function X(t){return{type:h.CAPTURE_COMPLETE,payload:t}}function V(t,e,n=!1){return{type:h.CAPTURE_ERROR,payload:{code:t,message:e,recoverable:n}}}new Set(Object.values(h));const f=(t,e,n)=>chrome.runtime.sendMessage(q(t,e,n)).catch(()=>{}),K=t=>chrome.runtime.sendMessage(X(t)).catch(()=>{}),J=(t,e,n=!1)=>chrome.runtime.sendMessage(V(t,e,n)).catch(()=>{});async function Q(){const t=await chrome.runtime.sendMessage({type:h.CAPTURE_TAB,payload:{}});if(!(t!=null&&t.imageData))throw new Error((t==null?void 0:t.error)||"Browser did not return an image");return t.imageData}async function Z(t,e){const n=await chrome.runtime.sendMessage({type:h.DOWNLOAD_RESULT,payload:{imageData:t.imageData,title:t.title,format:t.settings.format,location:e.location,namingPattern:e.namingPattern}});if(!(n!=null&&n.success))throw new Error((n==null?void 0:n.error)||"Download failed")}const tt=250,O=32767,et=12e7,N=300,nt=2e5,at=12e4,U=Object.freeze({png:{mime:"image/png",extension:"png"},jpeg:{mime:"image/jpeg",extension:"jpg"},webp:{mime:"image/webp",extension:"webp"}});function D(t,e){const n=Math.max(0,Math.ceil(t)),a=Math.max(1,Math.floor(e)),o=Math.max(0,n-a),i=[0];let r=0;for(let s=a;s<o&&r<N;s+=a)i.push(s),r+=1;return o>0&&i[i.length-1]!==o&&r<N&&i.push(o),i}function ot(t,e){return t>nt}function it(t,e,n,a=n){return{width:Math.round(t*n),height:Math.round(e*a)}}function rt({width:t,height:e}){if(!t||!e||t>O||e>O||t*e>et)throw new Error("This page is too large to safely export as one image. Reduce browser zoom or capture it in smaller sections.")}function I(t){return U[String(t||"png").toLowerCase()]||U.png}function st(t){return{high:.92,medium:.8,low:.65}[t]??.92}function lt(t){return t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(1)} MB`}function ct(t){const e=(t==null?void 0:t.split(",")[1])||"";return Math.floor(e.length*3/4)}let g=!1;function dt(){g=!0}function E(){return new Promise(t=>requestAnimationFrame(t))}async function P(t=tt){var e;await E(),await E(),(e=document.fonts)!=null&&e.ready&&await Promise.race([document.fonts.ready,v(1e3)]),await v(t)}function x(){if(g)throw new Error("Capture cancelled")}async function pt({mode:t,settings:e={}}){g=!1,B({mode:t});const n=b();let a=()=>{};try{Number(e.delay)>0&&(f("analyze",2,{message:`Waiting ${e.delay} seconds`}),await v(Number(e.delay)*1e3)),x(),t!=="fullpage"&&(a=L(e));const o=t==="fullpage"?await mt(e):await ut(e);return K(o),e.autoDownload&&await Z(o,e),{success:!0,data:o}}catch(o){return J(g?"CAPTURE_CANCELLED":"CAPTURE_FAILED",o.message,g),{success:!1,error:o.message}}finally{a(),j(n),S()}}async function ut(t){f("capture",30),await P(),x();const e=await T();f("finalize",90);const n=await yt(e,t);return z(n.dataUrl,n.width,n.height,"visible",t)}async function mt(t){f("analyze",5);let e=R();if(ot(e.scrollHeight,e.vpHeight))throw new Error("Page exceeds the maximum capturable height. Reduce browser zoom or capture in sections.");const n=Date.now(),a=D(e.scrollHeight,e.vpHeight),o=[];let i=()=>{};f("scroll",10,{currentSection:0,totalSections:a.length});try{for(let l=0;l<a.length;l+=1){if(x(),Date.now()-n>at)throw new Error("Capture timed out — the page is too long or taking too long to render.");l===1&&(i=L(t)),M(a[l]),await P();const u=b();if(l>0&&u===o[l-1].y)continue;const w=await T();o.push({imageData:w,y:u}),f("capture",10+(l+1)/a.length*65,{currentSection:l+1,totalSections:a.length})}e=R();const s=D(e.scrollHeight,e.vpHeight).at(-1);s>o.at(-1).y&&(M(s),await P(),o.push({imageData:await T(),y:b()})),f("merge",78);const d=await gt(o,e,t);return f("finalize",94),z(d.dataUrl,d.width,d.height,"fullpage",t)}finally{i()}}function ht(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.display="none")}function ft(){const t=document.getElementById("snap-capture-overlay");t&&(t.style.display="")}async function T(){ht(),await E();try{return await Q()}finally{ft()}}function C(t){return new Promise((e,n)=>{const a=new Image;a.onload=()=>e(a),a.onerror=()=>n(new Error("Unable to decode a captured image")),a.src=t})}async function gt(t,e,n){if(!t.length)throw new Error("No images were captured");const a=await C(t[0].imageData),o=a.naturalWidth/e.vpWidth,i=a.naturalHeight/e.vpHeight,r=it(e.vpWidth,e.scrollHeight,o,i);rt(r);const s=document.createElement("canvas");s.width=r.width,s.height=r.height;const d=s.getContext("2d",{alpha:!1});d.fillStyle="#ffffff",d.fillRect(0,0,s.width,s.height);for(let l=0;l<t.length;l+=1){const u=l===0?a:await C(t[l].imageData),w=Math.round(t[l].y*i);d.drawImage(u,0,0,u.naturalWidth,u.naturalHeight,0,w,s.width,u.naturalHeight)}return H(s,n)}async function yt(t,e){const n=await C(t),a=document.createElement("canvas");return a.width=n.naturalWidth,a.height=n.naturalHeight,a.getContext("2d").drawImage(n,0,0),H(a,e)}function H(t,e){const{mime:n}=I(e.format);return{dataUrl:t.toDataURL(n,st(e.quality)),width:t.width,height:t.height}}function z(t,e,n,a,o){return{imageData:t,dimensions:`${e} × ${n}`,format:I(o.format).extension.toUpperCase(),size:lt(ct(t)),capturedAt:new Date().toISOString(),source:document.title||location.hostname,title:document.title||"page",domain:location.hostname,mode:a,settings:{format:o.format,location:o.location,namingPattern:o.namingPattern}}}if(!globalThis.__akovoSnapControllerInstalled){globalThis.__akovoSnapControllerInstalled=!0;let t=!1;chrome.runtime.onMessage.addListener((e,n,a)=>{if(e!=null&&e.type){if(e.type===h.PING){a({ready:!0});return}if(e.type===h.CANCEL_CAPTURE){dt(),a({success:!0});return}if(e.type===h.START_CAPTURE){if(t){a({success:!1,error:"A capture is already in progress"});return}return t=!0,pt(e.payload).then(a).catch(o=>a({success:!1,error:o.message})).finally(()=>{t=!1}),!0}}})}})();
