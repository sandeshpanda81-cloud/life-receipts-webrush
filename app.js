const D = window.LIFE_DATA;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const icon = {music:"♪", purchase:"₹", card:"↗"};

function fmt(n){return new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(n)}
function fmtMoney(n){return "₹"+fmt(n)}
function prettyDate(v){const d=new Date(v);return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function normalize(r){
  let title=r.title||"Untitled receipt", subtitle=r.subtitle||"", detail=r.detail||"";
  return {...r,title:String(title),subtitle:String(subtitle),detail:String(detail)};
}
let activeFilter="all", query="", activeYear="all", visible=18;

const allRecords = D.records.map(normalize).sort((a,b)=>new Date(b.date)-new Date(a.date));

$("#rawCount").textContent = fmt(D.stats.music + D.stats.household + D.stats.card);
$("#nightShare").textContent = D.stats.nightShare+"%";
$("#nightMetric").textContent = D.stats.nightShare+"%";
$("#foodSpend").textContent = fmtMoney(D.hhCategories["Food"]||0).replace("₹","");
$("#resultCount").textContent = `${allRecords.length} visible sample receipts`;

function renderSpark(){
  const vals=Object.values(D.spYear), max=Math.max(...vals);
  $("#musicSpark").innerHTML=vals.map(v=>`<i style="height:${Math.max(8,v/max*100)}%"></i>`).join("");
}
function renderArtists(){
  const rows=Object.entries(D.topArtists).slice(0,7), max=rows[0][1];
  $("#artistBars").innerHTML=rows.map(([name,n])=>`
    <div class="bar-row"><span>${name}</span><div class="bar-track"><div class="bar-fill" style="width:${n/max*100}%"></div></div><span>${fmt(n)}</span></div>`).join("");
}
function renderHours(){
  const wheel=$("#hourWheel"), vals=D.hourCounts, max=Math.max(...Object.values(vals));
  wheel.innerHTML="";
  for(let h=0;h<24;h++){
    const angle=(h/24)*Math.PI*2-Math.PI/2, radius=68;
    const x=75+Math.cos(angle)*radius-3.5,y=75+Math.sin(angle)*radius-3.5;
    const dot=document.createElement("i");dot.className="hour-dot";dot.style.left=x+"px";dot.style.top=y+"px";
    dot.style.transform=`scale(${.55+(vals[h]||0)/max*1.8})`;wheel.appendChild(dot);
  }
}
function populateYears(){
  const years=[...new Set(allRecords.map(r=>new Date(r.date).getFullYear()))].sort((a,b)=>b-a);
  $("#yearFilter").innerHTML='<option value="all">All years</option>'+years.map(y=>`<option>${y}</option>`).join("");
}
function filtered(){
  return allRecords.filter(r=>{
    const hay=[r.title,r.subtitle,r.detail,r.meta,r.type].join(" ").toLowerCase();
    const okQ=!query||hay.includes(query);
    const okF=activeFilter==="all"||r.type===activeFilter;
    const okY=activeYear==="all"||String(new Date(r.date).getFullYear())===activeYear;
    return okQ&&okF&&okY;
  });
}
function renderReceipts(){
  const rows=filtered(), shown=rows.slice(0,visible);
  $("#resultCount").textContent=`${rows.length} matching receipts`;
  $("#receiptGrid").innerHTML=shown.map((r,i)=>`
    <article class="receipt" data-index="${allRecords.indexOf(r)}">
      <span class="receipt-icon">${icon[r.type]||"•"}</span>
      <h4>${escapeHtml(r.title)}</h4>
      <p>${escapeHtml(r.subtitle||r.detail||"A digital-life fragment")}</p>
      <div class="receipt-meta"><span>${prettyDate(r.date)}</span><span>${r.amount?fmtMoney(Number(r.amount)):r.meta||r.type}</span></div>
    </article>`).join("") || `<div style="grid-column:1/-1;padding:40px;color:#777">No receipts match this trail.</div>`;
  $("#loadMore").style.display=shown.length<rows.length?"block":"none";
  $$(".receipt").forEach(el=>el.addEventListener("click",()=>selectReceipt(allRecords[+el.dataset.index])));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function selectReceipt(seed){
  const seedDate=new Date(seed.date).getTime();
  const candidates=allRecords.filter(r=>r!==seed).map(r=>({...r,delta:Math.abs(new Date(r.date).getTime()-seedDate)}))
    .sort((a,b)=>a.delta-b.delta);
  const near=candidates.filter(r=>r.delta<=86400000);
  const byType={music:near.find(r=>r.type==="music"),purchase:near.find(r=>r.type==="purchase"),card:near.find(r=>r.type==="card")};
  $("#sceneDate").textContent=prettyDate(seed.date);
  $("#sceneTitle").textContent=seed.title;
  $("#sceneDesc").textContent=`A ${seed.type} receipt becomes the anchor. Nearby fragments are surfaced within a ±24 hour window to create a possible scene.`;
  $("#graphCenter").textContent=seed.title.length>22?seed.title.slice(0,22)+"…":seed.title;
  $("#nodeMusic").style.opacity=byType.music?"1":".35";
  $("#nodeBuy").style.opacity=byType.purchase?"1":".35";
  $("#nodeCard").style.opacity=byType.card?"1":".35";
  $("#sceneList").innerHTML=[seed,...Object.values(byType).filter(Boolean)].map(r=>`
    <div class="scene-item"><span>${icon[r.type]||"•"}</span><div><b>${escapeHtml(r.title)}</b><small>${escapeHtml(r.subtitle||r.detail||r.type)}</small></div><small>${r.amount?fmtMoney(Number(r.amount)):prettyDate(r.date)}</small></div>`).join("");
  $("#connections").scrollIntoView({behavior:"smooth",block:"start"});
}

$$(".filter").forEach(b=>b.addEventListener("click",()=>{
  $$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  activeFilter=b.dataset.filter;visible=18;renderReceipts();
}));
$$("[data-filter]").forEach(b=>{
  if(b.classList.contains("filter")) return;
  b.addEventListener("click",()=>{
    const target=b.dataset.filter;
    activeFilter=target;$$(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===target));
    visible=18;renderReceipts();$("#explore").scrollIntoView({behavior:"smooth"});
  });
});
$("#search").addEventListener("input",e=>{query=e.target.value.toLowerCase().trim();visible=18;renderReceipts()});
$("#yearFilter").addEventListener("change",e=>{activeYear=e.target.value;visible=18;renderReceipts()});
$("#loadMore").addEventListener("click",()=>{visible+=18;renderReceipts()});
$("#discoverBtn").addEventListener("click",()=>$("#story").scrollIntoView({behavior:"smooth"}));
$("#storyBtn").addEventListener("click",()=>$("#connections").scrollIntoView({behavior:"smooth"}));
$("#openConnection").addEventListener("click",()=>{
  const seed=allRecords.find(r=>r.type==="music")||allRecords[0];selectReceipt(seed);
});
$("#surpriseBtn").addEventListener("click",()=>{
  const seed=allRecords[Math.floor(Math.random()*allRecords.length)];selectReceipt(seed);
});
$("#backTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

renderSpark();renderArtists();renderHours();populateYears();renderReceipts();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add("visible")),{threshold:.08});
$$(".section,.chapter,.pattern-card").forEach(x=>{x.classList.add("reveal");observer.observe(x)});

// Start with a meaningful example scene.
selectReceipt(allRecords.find(r=>r.type==="music")||allRecords[0]);
