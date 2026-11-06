(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const tabs = $('archive-tabs'), sidebar = $('section-list'), detail = $('detail-content');
  const search = $('search-records'), detailArea = $('archive-detail');
  const state = { data:null, category:'WORLD', selected:null, search:'', activeFetch:0 };
  if (new URLSearchParams(location.search).get('embedded') === '1') document.body.classList.add('embedded');
  const E = (tag, cls, text) => { const x=document.createElement(tag); if(cls) x.className=cls; if(text!==undefined) x.textContent=text; return x; };
  const safeId = s => String(s||'').replace(/[^a-z0-9-]/gi,'');
  function category(id){ return state.data.categories.find(c=>c.id===id); }
  function record(id){ return state.data.records.find(r=>r.id===id); }
  function sourceId(r){ return r.id.split('-').at(-1); }
  function linkFor(id) { const url = new URL('archive.html',location.href); url.search = new URLSearchParams({record:id}).toString(); return url.href; }
  function setURL(id,replace=false){
    const params=new URLSearchParams(location.search);
    if(id) params.set('record',id); else params.delete('record');
    const next=location.pathname+(params.toString()?'?'+params:'');
    if(replace) history.replaceState(null,'',next); else history.pushState(null,'',next);
  }
  function tabClick(id){
    state.category=id; state.selected=null; state.search=''; search.value='';
    setURL(null); renderTabs(); renderSidebar(); renderIntro();
  }
  function renderTabs(){
    tabs.replaceChildren();
    state.data.categories.forEach((c,i)=>{
      const b=E('button','archive-tab');b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(state.category===c.id));b.setAttribute('tabindex',state.category===c.id?'0':'-1');
      const n=E('span','tab-num',String(i+1).padStart(2,'0'));
      const t=E('span','',c.id);b.append(n,t);b.addEventListener('click',()=>tabClick(c.id));tabs.append(b);
    });
  }
  tabs.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();const list=state.data.categories;let i=list.findIndex(c=>c.id===state.category);
    i=e.key==='Home'?0:e.key==='End'?list.length-1:(i+(e.key==='ArrowRight'?1:-1)+list.length)%list.length;
    tabClick(list[i].id);tabs.querySelector('[aria-selected="true"]').focus();
  });
  function renderSidebar(){
    const c=category(state.category);
    $('sidebar-code').textContent='CATEGORY / '+c.id;
    $('sidebar-title').textContent=c.title;
    $('sidebar-description').textContent=c.description;
    sidebar.replaceChildren();
    const q=state.search.toLocaleLowerCase('ko');
    const matches=q?state.data.records.filter(r=>(r.title+' '+r.summary).toLocaleLowerCase('ko').includes(q)):null;
    if(q){
      sidebar.append(E('div','search-global-note',`전체 검색 결과 · ${matches.length}건`));
      const grouped=state.data.categories.map(cat=>({cat,entries:matches.filter(r=>r.category===cat.id)})).filter(g=>g.entries.length);
      grouped.forEach((group,idx)=>{
        const d=E('details','archive-section');d.open=true;
        const summary=E('summary','',group.cat.id+' / '+group.cat.title),count=E('span','count',String(group.entries.length).padStart(2,'0'));
        summary.append(count);d.append(summary);
        const listing=E('div','archive-item-list'); group.entries.forEach(r=>listing.append(makeEntry(r)));d.append(listing);sidebar.append(d);
      });
      if(!matches.length)sidebar.append(E('p','no-results','검색 결과가 없습니다. 다른 단어를 입력해 보세요.'));
    } else {
      c.sections.forEach((s,i)=>{
        const entries=state.data.records.filter(r=>r.category===c.id&&r.section===s.id);
        const d=E('details','archive-section'); d.dataset.section=s.id;
        if(state.selected?entries.some(r=>r.id===state.selected):(i===0&&entries.length>0))d.open=true;
        const summary=E('summary','',s.title);
        summary.append(E('span','count',String(entries.length).padStart(2,'0')));
        d.append(summary);
        const listing=E('div','archive-item-list');
        entries.forEach(r=>listing.append(makeEntry(r)));
        if(entries.length===0)listing.append(E('div','no-results','현재 공개된 기록 없음'));
        d.append(listing);sidebar.append(d);
      });
    }
  }
  function makeEntry(r){
    const b=E('button','archive-entry'+(r.id===state.selected?' active':''),r.title);b.type='button';
    b.dataset.record=r.id;b.setAttribute('aria-current',r.id===state.selected?'page':'false');
    b.addEventListener('click',()=>selectRecord(r.id));return b;
  }
  function renderIntro(){
    const c=category(state.category);
    detail.replaceChildren();
    const top=E('div','detail-crumb','FIELD ARCHIVE / '+c.id);detail.append(top);
    detail.append(E('h2','detail-title',c.title));
    detail.append(E('p','detail-summary',c.description));
    detail.append(E('div','detail-rule'));
    const selected=state.data.records.filter(r=>r.category===c.id);
    detail.append(E('div','source-tag',`PUBLISHED RECORDS / ${selected.length.toString().padStart(2,'0')}`));
    if(!selected.length){const box=E('div','empty-category');box.append(E('strong','','현재 공개된 개별 기록이 없습니다.'));
      box.append(E('p','','인물 자료는 ARGO NOTE와 EAST CITY의 소속 및 공개 범위를 검토한 뒤 이곳에 추가됩니다. 빈 프로필을 임의로 생성하지 않았습니다.'));detail.append(box);
    }else{
      const grid=E('div','intro-cards');
      c.sections.filter(s=>state.data.records.some(r=>r.category===c.id&&r.section===s.id)).forEach(s=>{
        const a=E('button','intro-card');a.type='button';a.style.textAlign='left';a.style.cursor='pointer';
        a.append(E('strong','',s.title),E('span','',`해당 분류의 기록 ${state.data.records.filter(r=>r.category===c.id&&r.section===s.id).length}건`),E('b','','  ▸'));
        a.addEventListener('click',()=>{const d=sidebar.querySelector(`[data-section="${safeId(s.id)}"]`);if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'nearest'});d.querySelector('.archive-entry')?.focus();}});
        grid.append(a);
      });
      detail.append(grid);
    }
    detailArea.scrollTop=0;
  }
  function paragraph(parent,text){parent.append(E('p','',text));}
  async function selectRecord(id,options={}){
    const item=record(id); if(!item)return;
    state.selected=id;state.category=item.category;
    if(!options.fromHistory)setURL(id,Boolean(options.replace));
    renderTabs();renderSidebar();
    detail.replaceChildren(E('p','archive-loading','기록을 불러오는 중입니다...'));
    const token=++state.activeFetch;
    try{
      if(!item.path.startsWith('content/records/')||!item.path.endsWith('.json'))throw Error('잘못된 기록 경로');
      const res=await fetch(item.path,{cache:'no-cache'});if(!res.ok)throw Error('HTTP '+res.status);
      const full=await res.json();if(token!==state.activeFetch)return;
      if(full.id!==item.id)throw Error('기록 ID가 일치하지 않습니다.');
      renderRecord(full,item);
      detailArea.scrollTop=0;
    }catch(err){if(token!==state.activeFetch)return; detail.replaceChildren();const box=E('div','archive-error',`기록을 열 수 없습니다. (${String(err.message)})`);detail.append(box);}
  }
  function renderRecord(full,item){
    detail.replaceChildren();
    const c=category(item.category); const sec=c.sections.find(s=>s.id===item.section);
    detail.append(E('div','detail-crumb',`${c.id}  /  ${sec?sec.title:''}  /  RECORD ${sourceId(item)}`));
    detail.append(E('h2','detail-title',full.title));
    if(item.summary)detail.append(E('p','detail-summary',item.summary));
    if(full.image){
      const figure=E('figure','detail-image');const img=E('img');img.src=full.image;img.alt=full.title+' 관련 세계관 분위기 도식';img.loading='lazy';
      figure.append(img,E('figcaption','','세계관 기록을 위한 자체 제작 분위기 도식 · 실제 장소 또는 정밀 설계도를 표현한 그림은 아닙니다.'));detail.append(figure);
    }
    detail.append(E('div','detail-rule'));
    if(Array.isArray(full.timeline)&&full.timeline.length){
      const time=E('div','archive-timeline');full.timeline.forEach(event=>{const r=E('div','timeline-row');r.append(E('strong','',event.year),E('p','',event.text));time.append(r);});detail.append(time);
    }
    const content=E('div','detail-body');
    (full.body||[]).forEach(t=>paragraph(content,t));
    if(Array.isArray(full.sections))full.sections.forEach(s=>{content.append(E('h3','',s.heading));s.paragraphs.forEach(p=>paragraph(content,p));});
    detail.append(content);
    const actions=E('div','detail-actions');
    const copy=E('button','','이 기록의 링크 복사');copy.type='button';
    copy.addEventListener('click',async()=>{
      const href=linkFor(full.id);
      try{await navigator.clipboard.writeText(href);copy.textContent='링크가 복사되었습니다';}
      catch(e){copy.textContent='복사할 수 없어 주소를 선택하세요';const input=E('input');input.value=href;input.readOnly=true;input.style.width='100%';actions.append(input);input.select();}
    });actions.append(copy);
    const related=state.data.records.filter(r=>r.category===item.category&&r.section===item.section&&r.id!==full.id).slice(0,3);
    related.forEach(r=>{const b=E('button','',`다른 기록 · ${r.title}`);b.type='button';b.addEventListener('click',()=>selectRecord(r.id));actions.append(b);});
    detail.append(actions);
  }
  function onHistory(){
    const id=new URLSearchParams(location.search).get('record');
    if(id&&record(id))selectRecord(id,{fromHistory:true});
    else{state.selected=null;renderTabs();renderSidebar();renderIntro();}
  }
  window.addEventListener('popstate',onHistory);
  search.addEventListener('input',()=>{state.search=search.value.trim();renderSidebar();});
  document.addEventListener('keydown',e=>{
    if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();search.focus();}
  });
  async function init(){
    try{
      const res=await fetch('content/index.json',{cache:'no-cache'});
      if(!res.ok)throw Error('HTTP '+res.status);
      state.data=await res.json();
      if(!Array.isArray(state.data.categories)||!Array.isArray(state.data.records))throw Error('인덱스 자료가 올바르지 않습니다');
      $('record-total').textContent=state.data.records.length+' RECORDS AVAILABLE';
      const requested=new URLSearchParams(location.search).get('record');
      if(requested&&record(requested)) await selectRecord(requested,{fromHistory:true});
      else{renderTabs();renderSidebar();renderIntro();}
    }catch(e){detail.replaceChildren(E('p','archive-error',`자료를 불러오지 못했습니다. GitHub Pages 또는 로컬 웹 서버에서 열어주세요. (${e.message})`));}
  }
  init();
})();
