const D=window.LIFE,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const money=n=>"₹"+new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(n||0);
const date=v=>{let d=new Date(v);return isNaN(d)?"—":d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})};
const ico={music:"♪",household:"₹",card:"↗"};
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
let data=D.records.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)), filter="all", q="", year="all", shown=20;

$("#heroSignal").textContent=data[0]?date(data[0].date):"—";
$("#heroSpan").textContent=`${date(D.stats.dateStart)} — ${date(D.stats.dateEnd)}`;
$("#musicCount").textContent=new Intl.NumberFormat("en-IN").format(D.stats.music);
$("#foodCount").textContent=new Intl.NumberFormat("en-IN").format(D.stats.household);
const topArtist=Object.entries(D.topArtists)[0]||["The soundtrack",""];
$("#artistLead").textContent=`${topArtist[0]} kept returning.`;
const topFood=Object.entries(D.householdCategories)[0]||["Food",0];
$("#foodLead").textContent=`${topFood[0]} became a ritual.`;
$("#night").textContent=D.stats.nightShare+"%";
$("#moneyTitle").textContent=topFood[0];
$("#money").textContent=money(topFood[1]);

function renderBars(){
 let rows=Object.entries(D.topArtists).slice(0,7), max=rows[0]?.[1]||1;
 $("#bars").innerHTML=rows.map(([n,v])=>`<div class="bar"><span>${esc(n)}</span><div class="track"><div class="fill" style="width:${v/max*100}%"></div></div><span>${v.toLocaleString()}</span></div>`).join("");
}
function renderClock(){
 let box=$("#clock"), vals=D.hours, max=Math.max(...Object.values(vals));
 box.innerHTML="";
 for(let h=0;h<24;h++){let a=h/24*Math.PI*2-Math.PI/2,r=63,x=70+Math.cos(a)*r-3,y=70+Math.sin(a)*r-3,d=document.createElement("i");d.className="hourdot";d.style.left=x+"px";d.style.top=y+"px";d.style.transform=`scale(${.6+(vals[h]||0)/max*1.8})`;box.appendChild(d)}
}
function renderWeek(){
 let box=$("#week"), vals=D.weekdays, max=Math.max(...Object.values(vals));
 box.innerHTML=Object.entries(vals).map(([n,v])=>`<div class="wday"><div class="wbar" style="height:${25+v/max*70}px"></div>${n.slice(0,3)}</div>`).join("");
}
function years(){let ys=[...new Set(data.map(r=>new Date(r.date).getFullYear()).filter(Boolean))].sort((a,b)=>b-a);$("#year").innerHTML='<option value="all">All years</option>'+ys.map(y=>`<option>${y}</option>`).join("")}
function filtered(){return data.filter(r=>{let hay=[r.title,r.subtitle,r.detail,r.meta,r.type].join(" ").toLowerCase();return(!q||hay.includes(q))&&(filter==="all"||r.type===filter)&&(year==="all"||String(new Date(r.date).getFullYear())===year)})}
function renderList(){let rows=filtered(),show=rows.slice(0,shown);$("#matches").textContent=`${rows.length} matching receipts`;$("#list").innerHTML=show.map((r,i)=>`<article class="receipt" data-i="${data.indexOf(r)}"><span class="r-icon">${ico[r.type]||"•"}</span><h4>${esc(r.title)}</h4><p>${esc(r.subtitle||r.detail||"Digital-life fragment")}</p><div class="receipt-meta"><span>${date(r.date)}</span><b>${r.amount!=null?money(r.amount):r.type}</b></div></article>`).join("")||"<p>No evidence found.</p>";$("#more").style.display=show.length<rows.length?"block":"none";$$(".receipt").forEach(x=>x.onclick=()=>openReceipt(data[+x.dataset.i]))}
function openReceipt(r){$("#mSymbol").textContent=ico[r.type]||"•";$("#mTitle").textContent=r.title;$("#mSub").textContent=r.subtitle||r.detail||"Digital-life fragment";$("#mMeta").textContent=[date(r.date),r.meta,r.amount!=null?money(r.amount):"",r.detail].filter(Boolean).join("  ·  ");$("#modal").classList.add("open")}
$("#close").onclick=()=>$("#modal").classList.remove("open");$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.remove("open")};
$$(".chips button").forEach(b=>b.onclick=()=>{$$(".chips button").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.type;shown=20;renderList()});
$("#q").oninput=e=>{q=e.target.value.toLowerCase();shown=20;renderList()};$("#year").onchange=e=>{year=e.target.value;shown=20;renderList()};$("#more").onclick=()=>{shown+=20;renderList()};
$$("[data-scroll]").forEach(b=>b.onclick=()=>$(b.dataset.scroll).scrollIntoView({behavior:"smooth"}));
$("#begin").onclick=()=>$("#story").scrollIntoView({behavior:"smooth"});$("#jump").onclick=()=>$("#story").scrollIntoView({behavior:"smooth"});
$("#top").onclick=()=>scrollTo({top:0,behavior:"smooth"});
$("#random").onclick=()=>openReceipt(data[Math.floor(Math.random()*data.length)]);
$("#openConst").onclick=()=>$("#constellation").scrollIntoView({behavior:"smooth"});
function scene(seed){
 let t=new Date(seed.date).getTime(), near=data.filter(r=>r!==seed).map(r=>({...r,delta:Math.abs(new Date(r.date).getTime()-t)})).filter(r=>r.delta<=86400000).sort((a,b)=>a.delta-b.delta);
 let pick={music:near.find(r=>r.type==="music"),household:near.find(r=>r.type==="household"),card:near.find(r=>r.type==="card")};
 $("#sceneDate").textContent=date(seed.date);$("#sceneIcon").textContent=ico[seed.type]||"✦";$("#center").innerHTML=esc(seed.title).slice(0,26);
 $("#sceneTitle").textContent=seed.title;$("#sceneText").textContent=`A ${seed.type} receipt becomes the anchor. Nearby fragments within ±24 hours are surfaced as possible evidence for the same scene.`;
 $("#sceneItems").innerHTML=[seed,...Object.values(pick).filter(Boolean)].map(r=>`<div class="scene-item"><span>${ico[r.type]||"•"}</span><b>${esc(r.title)}</b><small>${r.amount!=null?money(r.amount):date(r.date)}</small></div>`).join("");
 $("#nm").style.opacity=pick.music?"1":".35";$("#nh").style.opacity=pick.household?"1":".35";$("#nc").style.opacity=pick.card?"1":".35";
}
$$(".node").forEach((b,i)=>b.onclick=()=>scene(data[i%data.length]));
scene(data.find(r=>r.type==="music")||data[0]);
renderBars();renderClock();renderWeek();years();renderList();

window.addEventListener("scroll",()=>{let h=document.documentElement.scrollHeight-innerHeight;$("#progress").style.width=(scrollY/h*100)+"%";});
document.addEventListener("mousemove",e=>{$("#cursor").style.left=e.clientX+"px";$("#cursor").style.top=e.clientY+"px"});
const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("show")),{threshold:.08});
$$(".reveal").forEach(x=>obs.observe(x));
