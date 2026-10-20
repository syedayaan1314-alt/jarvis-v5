const $=id=>document.getElementById(id);
const views={home:$("welcome"),chat:$("chatPanel"),camera:$("cameraPanel"),settings:$("settingsPanel")};
let stream=null, facing="environment";
function showView(name){Object.entries(views).forEach(([k,v])=>v.classList.toggle("hidden",k!==name));document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===name));$("drawer").classList.remove("open");if(name==="camera"&&!stream)$("cameraToggle").textContent="◎  Enable camera";if(name==="settings")refreshProviderStates();}
function selectedProvider(){return $("provider").value}
function setProvider(name){$("provider").value=name;$("providerLabel").textContent=name.toUpperCase();document.querySelectorAll(".providers button").forEach(b=>b.classList.toggle("selected",b.dataset.provider===name));}
$("provider").addEventListener("change",()=>setProvider(selectedProvider()));
document.querySelectorAll("[data-provider]").forEach(b=>b.addEventListener("click",()=>{setProvider(b.dataset.provider);showView("chat")}));
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
$("menuBtn").addEventListener("click",()=>$("drawer").classList.toggle("open"));
$("settingsJump").addEventListener("click",()=>showView("settings"));
$("startBtn").addEventListener("click",()=>showView("chat"));
$("cameraExit").addEventListener("click",()=>showView("home"));
$("holoToggle").addEventListener("change",e=>document.querySelector(".camera-overlay").style.display=e.target.checked?"flex":"none");
function addBubble(text,who,error=false){const el=document.createElement("div");el.className="bubble "+who+(error?" error":"");el.textContent=text;$("messages").appendChild(el);el.scrollIntoView({behavior:"smooth",block:"nearest"});return el}
async function ask(message){if(!message.trim())return;addBubble(message,"user");$("prompt").value="";const wait=addBubble("Connecting to "+selectedProvider()+"…","assistant");const provider=selectedProvider();try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider,message})});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||"Request failed ("+r.status+").");wait.textContent=data.reply||"No text returned.";if($("voiceOutput").checked&&"speechSynthesis"in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(data.reply));}refreshProviderStates()}catch(e){wait.classList.add("error");wait.textContent=e.message+"\n\nSet the selected provider's API key in Vercel Environment Variables, then redeploy."} }
$("chatForm").addEventListener("submit",e=>{e.preventDefault();ask($("prompt").value)});
$("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();ask($("prompt").value)}});
$("voiceBtn").addEventListener("click",()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){addBubble("Voice input is not supported by this browser. Type your message instead.","assistant",true);return}const rec=new R();rec.lang="en-IN";rec.onstart=()=>$("voiceBtn").textContent="…";rec.onresult=e=>{ $("prompt").value=e.results[0][0].transcript;ask($("prompt").value)};rec.onerror=e=>addBubble("Voice input error: "+e.error,"assistant",true);rec.onend=()=>$("voiceBtn").textContent="♩";rec.start()});
async function cameraOn(){try{if(!navigator.mediaDevices?.getUserMedia)throw new Error("Camera API unavailable. Open this website using HTTPS in Chrome.");stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:facing}},audio:false});$("camera").srcObject=stream;$("cameraToggle").textContent="×  Turn camera off"}catch(e){addBubble("Camera could not start: "+e.message+" Check Chrome site permissions.","assistant",true)}}
$("cameraToggle").addEventListener("click",async()=>{if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;$("camera").srcObject=null;$("cameraToggle").textContent="◎  Enable camera"}else await cameraOn()});
$("flipCamera").addEventListener("click",async()=>{facing=facing==="environment"?"user":"environment";if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;await cameraOn()}});
window.addEventListener("pagehide",()=>stream?.getTracks().forEach(t=>t.stop()));
async function refreshProviderStates(){for(const p of ["openai","gemini","claude"]){const el=$(`${p}State`);el.textContent="●";el.style.color="#6d849b"}}
$("testBtn").addEventListener("click",async()=>{showView("chat");addBubble("Connection test: reply with exactly “JARVIS online”.","user");await ask("Reply with exactly: JARVIS online")});
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
setProvider("openai");showView("home");