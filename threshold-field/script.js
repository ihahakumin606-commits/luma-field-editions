(() => {
  'use strict';
  const products = [
    {id:'T01',name:'Edge Beacon',cn:'An object for arrival',category:'arrival',role:'ARRIVAL',crop:['-6.4%','-19.5%'],description:'An open, softly rounded silhouette gives an entrance a quiet point of recognition. An ice-blue guard wraps a metal spine; the low triangular node gathers connection and tactile control into one place.',place:'Building entrances, exhibition foyers and transitions between indoors and outdoors.',material:'Brushed metal / translucent ice-blue guard / charcoal mineral base.',relation:'Place on dry, stable ground beside the threshold, leaving the route fully open.'},
    {id:'T02',name:'Wall Edge',cn:'A frame for entry',category:'arrival',role:'ENTRY',crop:['-115.4%','-19.5%'],description:'A folded metal surface brings an entrance number, protective edge and small colour accent together. Information stays close to the doorway it identifies.',place:'Shop doorframes, factory entrances and public lobbies.',material:'Brushed metal / ice-blue protective lip / replaceable information insert.',relation:'Follow the door jamb or wall edge and face the arriving visitor. Every number belongs to a real entrance.'},
    {id:'T03',name:'Garden Beacon',cn:'A gesture along the path',category:'path',role:'PATH',crop:['-225.4%','-19.5%'],description:'The straight spine becomes a gently leaning curve. A low stance and restrained head let the marker settle into the landscape edge.',place:'Garden paths, campus turns and planted borders.',material:'Curved metal / ice-blue underside / compact mineral foot.',relation:'Mark actual turns and path edges. Use a spacing rhythm that follows the landscape.'},
    {id:'T04',name:'Threshold Bench',cn:'A moment to stay',category:'pause',role:'PAUSE',crop:['-6.4%','-132%'],description:'A generous, softly rounded seat rests on supports of different weights. A mineral foot and folded metal leg leave an open space beneath, creating a short pause at the entrance.',place:'Entrance pockets, planter edges and pickup waiting areas.',material:'Charcoal mineral seat / folded metal support / ice-blue connection sleeve.',relation:'Set beside the route, facing the place people are waiting for. Keep entrances and circulation clear.'},
    {id:'T05',name:'Canopy Frame',cn:'A light shelter',category:'pause',role:'SHELTER',crop:['-115.4%','-132%'],description:'Two continuous metal supports carry a shallow curved roof. Ice-blue ribs soften daylight; small lime connections bring a measured rhythm to the frame.',place:'Open entrances, industrial campus pickup points and exposed waiting areas.',material:'Translucent ribbed roof / curved metal frame / mineral foundations.',relation:'Cover the actual waiting area and pair with a side-set bench where additional shelter is needed.'},
    {id:'T06',name:'Wayfinding Totem',cn:'A point of direction',category:'path',role:'DIRECTION',crop:['-225.4%','-132%'],description:'A smooth metal return forms an upright spine for information. A white sign insert sits within an ice-blue protective edge, giving a complex place a clear reading order.',place:'Campus junctions, commercial street entrances and public courtyards.',material:'Brushed metal / white sign insert / ice-blue edge / mineral base.',relation:'Stand before the decision point and face the arriving visitor. Each direction leads to an actual destination.'}
  ];
  const $ = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const storageKey = 'threshold-field-project-v1';
  let selection = [], notes = '';
  try {const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');selection=Array.isArray(saved.ids)?saved.ids.filter(id=>products.some(p=>p.id===id)):[];notes=typeof saved.notes==='string'?saved.notes:'';} catch {}
  const visual = p => {if(p.id==='T01')return `<div class="product-visual"><img class="object-packshot" src="assets/t01-angle-b-threequarter.png" alt="T01 Edge Beacon: the locked ice-blue guard, lemon node, brushed metal spine and mineral base" loading="lazy"></div>`;const lower=Number(p.id.slice(1))>=4;return `<div class="product-visual"><div class="sprite-crop" style="--crop-x:${p.crop[0]};--crop-y:${lower?'-144.7%':p.crop[1]};--crop-height:${lower?'88.75%':'100%'}"><img src="assets/collection-master.png" alt="${p.id} ${p.name} ${p.cn}" loading="lazy"></div></div>`;};
  $('#product-grid').innerHTML=products.map(p=>`<article class="product-card" data-category="${p.category}"><button class="product-image-button" data-product="${p.id}" aria-label="Explore ${p.name}">${visual(p)}</button><div class="product-info"><div class="eyebrow"><span>${p.id} / OBJECT</span><span>${p.role}</span></div><h3><button data-product="${p.id}" style="padding:0;text-align:left;font:inherit;letter-spacing:inherit">${p.name}</button></h3><p>${p.cn}</p><div class="product-actions"><button data-product="${p.id}">Explore object</button><button data-add="${p.id}">${selection.includes(p.id)?'In your list':'Add to project'}</button></div></div></article>`).join('');
  let toastTimer;
  function toast(message){const el=$('.toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2400);}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify({ids:selection,notes}));}catch{}}
  function refreshSelection(){
    $('#selection-count').textContent=String(selection.length).padStart(2,'0');
    all('[data-add]').forEach(btn=>{const exists=selection.includes(btn.dataset.add);btn.textContent=btn.classList.contains('pill-button')?(exists?'Added to your project':'Add to your project'):(exists?'In your list':'Add to project');btn.setAttribute('aria-pressed',String(exists));});
    $('#selection-items').innerHTML=selection.length?selection.map(id=>{const p=products.find(x=>x.id===id);return `<div class="selection-item"><span>${p.id} / ${p.name}<small>${p.cn}</small></span><button data-remove="${p.id}" aria-label="Remove ${p.name} from your project">Remove</button></div>`;}).join(''):'<p class="empty-selection">Your list is empty. Explore the collection and add the objects you would like to discuss.</p>';
  }
  function add(id){if(!products.some(p=>p.id===id))return;if(selection.includes(id)){toast('This object is already in your project');return;}selection.push(id);save();refreshSelection();toast(`${id} added to your project`);}
  function openDialog(dialog){if(!dialog.open){dialog.showModal();document.body.classList.add('modal-open');}}
  all('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{if(!all('dialog').some(x=>x.open))document.body.classList.remove('modal-open');});dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});});
  function openProduct(id){const p=products.find(x=>x.id===id);if(!p)return;$('#product-dialog-content').innerHTML=`<div class="dialog-layout">${visual(p)}<div class="dialog-copy"><span class="eyebrow">${p.id} / ${p.role}</span><h2 id="product-title" tabindex="-1">${p.name}</h2><p class="chinese-name">${p.cn}</p><p class="description">${p.description}</p><dl class="dialog-facts"><div><dt>Place</dt><dd>${p.place}</dd></div><div><dt>Material</dt><dd>${p.material}</dd></div><div><dt>Position</dt><dd>${p.relation}</dd></div></dl><button class="pill-button" data-add="${p.id}">Add to your project</button><p class="concept-note">CONCEPT OBJECT / Individual objects and spatial commissions</p></div></div>`;refreshSelection();openDialog($('#product-dialog'));$('#product-title').focus({preventScroll:true});}
  const scenes={campus:{title:'Campus / A quiet arrival',intro:'Keep the central route open. Give each object a clear role at the entrance, the turn or the waiting pocket.',items:[['T02','A number on the actual factory doorframe.'],['T03','A low marker at real turns beside the planted path.'],['T04','A side-set seat facing the pickup and waiting area.'],['T05','Shelter over the place people actually wait.'],['T06','Directions before the junction, facing arriving visitors.']]},street:{title:'Street / Follow the architecture',intro:'Work with the shelter of the arcade and the rhythm of shopfronts. Use only the objects that the place needs.',items:[['T02','Each shop number belongs to its doorway.'],['T04','A short pause beside the planter edge.'],['T06','A readable direction before the street branches.']]}};
  function openScene(id){const s=scenes[id];if(!s)return;$('#product-dialog-content').innerHTML=`<div class="scene-dialog-content"><span class="eyebrow">SPATIAL COMPOSITION</span><h2 id="product-title" tabindex="-1">${s.title}</h2><p>${s.intro}</p><div class="scene-objects">${s.items.map(([id,reason])=>{const p=products.find(x=>x.id===id);return `<div class="scene-object"><button data-product="${id}">${id} / ${p.name}</button><p>${reason}</p></div>`;}).join('')}</div><button class="text-link" data-add-scene="${id}">Add this composition to your project</button></div>`;openDialog($('#product-dialog'));$('#product-title').focus({preventScroll:true});}
  document.addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn)return;if(btn.dataset.product)openProduct(btn.dataset.product);else if(btn.dataset.add)add(btn.dataset.add);else if(btn.dataset.remove){selection=selection.filter(id=>id!==btn.dataset.remove);save();refreshSelection();const next=$('#selection-items button')||$('#project-notes');next.focus({preventScroll:true});}else if(btn.hasAttribute('data-close'))btn.closest('dialog').close();else if(btn.dataset.scene)openScene(btn.dataset.scene);else if(btn.dataset.addScene){scenes[btn.dataset.addScene].items.forEach(([id])=>{if(!selection.includes(id))selection.push(id);});save();refreshSelection();toast('Spatial composition added to your project');}});
  all('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{all('[data-filter]').forEach(x=>{x.classList.toggle('active',x===btn);x.setAttribute('aria-pressed',String(x===btn));});all('.product-card').forEach(card=>card.hidden=btn.dataset.filter!=='all'&&card.dataset.category!==btn.dataset.filter);}));
  $('#project-notes').value=notes;$('#project-notes').addEventListener('input',e=>{notes=e.target.value;save();});
  ['open-selection','closing-selection'].forEach(id=>$('#'+id).addEventListener('click',()=>{refreshSelection();openDialog($('#selection-dialog'));}));
  $('#download-selection').addEventListener('click',()=>{if(!selection.length&&!notes.trim()){toast('Choose an object or add a few notes first');return;}const text=['THRESHOLD FIELD / PROJECT BRIEF','DEFINE THE IN-BETWEEN.','',...selection.map(id=>{const p=products.find(x=>x.id===id);return `${id} / ${p.name} / ${p.cn}\nSuggested setting: ${p.place}`;}),'','Your space and requirements:',notes.trim()||'To be discussed.','','This brief records design interest. It is not an order or payment.'].join('\n');$('#brief-preview').hidden=false;$('#brief-text').value=text;const url=URL.createObjectURL(new Blob(['\ufeff',text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='THRESHOLD-FIELD-Project-Brief.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Your brief is ready to download or copy');});
  $('#copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#brief-text').value);toast('Brief copied to clipboard');}catch{$('#brief-text').focus();$('#brief-text').select();toast('Your brief is selected. Copy it to continue.');}});
  const archives={detail:['assets/t01-detail.png','T01 material and connection details on a pure white background','A quiet record of the metal spine, ice-blue guard and low connecting node.'],exploded:['assets/t01-exploded.png','T01 conceptual exploded structure on a pure white background','A concept assembly study. Engineering and manufacturing details will be verified during design development.'],views:['assets/t01-views.png','T01 front, side and top form studies','Three views of the same object, recording the relationship between its surfaces and silhouette.']};
  function setArchive(btn){all('[data-archive]').forEach(x=>{x.setAttribute('aria-selected',String(x===btn));x.tabIndex=x===btn?0:-1;});const perspectives=btn.dataset.archive==='perspectives';$('#perspective-studies').hidden=!perspectives;$('#archive-image').hidden=perspectives;if(perspectives){$('#archive-note').textContent='Three photographic viewpoints of the locked T01 form. The three-quarter view is the reference for the environmental composition.';}else{const item=archives[btn.dataset.archive];$('#archive-image').src=item[0];$('#archive-image').alt=item[1];$('#archive-note').textContent=item[2];}$('#archive-panel').setAttribute('aria-labelledby',btn.id);}
  all('[data-archive]').forEach(btn=>{btn.addEventListener('click',()=>setArchive(btn));btn.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=all('[data-archive]');let i=tabs.indexOf(btn);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[i].focus();setArchive(tabs[i]);});});
  refreshSelection();
  if(document.modelContext?.registerTool){
    const lifecycle=new AbortController();
    const register=tool=>{try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
    register({name:'read_threshold_collection',title:'Read THRESHOLD collection',description:'Read the six public art objects and their spatial roles.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({objects:products.map(p=>({id:p.id,name:p.name,role:p.role,setting:p.place}))})});
    register({name:'stage_threshold_project',title:'Add objects to project list',description:'Add selected THRESHOLD objects to this browser-local project list and optionally save project notes. This does not submit an inquiry, place an order or pay.',inputSchema:{type:'object',properties:{ids:{type:'array',items:{type:'string',enum:products.map(p=>p.id)},maxItems:6},notes:{type:'string',maxLength:2000}},required:['ids'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||!Array.isArray(input.ids)||input.ids.length>6||input.ids.some(id=>!products.some(p=>p.id===id))||input.notes!==undefined&&(typeof input.notes!=='string'||input.notes.length>2000))throw new Error('Provide valid object IDs and notes of at most 2000 characters.');for(const id of input.ids)if(!selection.includes(id))selection.push(id);if(input.notes!==undefined){notes=input.notes;$('#project-notes').value=notes;}save();refreshSelection();return {status:'staged_locally',selected:selection.slice(),submitted:false};}});
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
  const journey=$('.journey'),stage=$('.journey-stage'),header=$('.site-header');
  const environment=$('.environment'),plane=$('.scene-plane'),hall=$('.hall-image');
  const focusImage=$('.focus-image');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let current=0,target=0,raf=0,lastFrame=0,visible=!document.hidden,pastJourney=false,geometry=null;
  const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
  const smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a));return x*x*(3-2*x);};
  // Both photographic layers share one world transform and one master image.
  // The product never moves independently of its wall, shadow or surroundings.
  function fitScene(){
    const mobile=window.innerWidth<=700;
    const ratio=(hall.naturalWidth||Number(hall.getAttribute('width')))/(hall.naturalHeight||Number(hall.getAttribute('height')));
    const width=Math.max(environment.clientWidth,environment.clientHeight*ratio),height=width/ratio;
    geometry={left:(environment.clientWidth-width)*(mobile?.716:.78),top:(environment.clientHeight-height)*.53,anchorX:1277/1670*width,anchorY:571/942*height,width,height,viewportWidth:environment.clientWidth,viewportHeight:environment.clientHeight,maxZoom:mobile?1.045:1.75};
    Object.assign(plane.style,{width:`${width}px`,height:`${height}px`});
    render(reduced.matches?0:current);
  }
  function render(p){
    if(!geometry)return;
    if(reduced.matches)p=0;
    const focus=clamp(p/.85);
    const approach=smooth(0,.9,p),scale=1+(geometry.maxZoom-1)*approach;
    const pan=smooth(.12,.9,p);
    const {left,top,anchorX,anchorY,width,height,viewportWidth,viewportHeight}=geometry;
    const cameraX=left+anchorX*(1-scale),cameraY=top+anchorY*(1-scale);
    const dx=clamp(-Math.min(stage.clientWidth*.025,26)*pan,viewportWidth-cameraX-width*scale,-cameraX);
    const dy=clamp(-Math.min(stage.clientHeight*.008,8)*pan,viewportHeight-cameraY-height*scale,-cameraY);
    plane.style.transform=`translate3d(${cameraX+dx}px,${cameraY+dy}px,0) scale(${scale})`;
    const blur=reduced.matches?0:16*Math.pow(1-focus,2.15);
    hall.style.filter=`blur(${blur/scale}px)`;
    // A matched, clear crop appears inside the same world, without a new viewpoint.
    focusImage.style.opacity=focusImage.naturalWidth?String(smooth(.62,.88,p)):'0';
    stage.style.setProperty('--p',p.toFixed(4));
    stage.style.setProperty('--grain-opacity',reduced.matches?'0':(0.26*(1-focus)).toFixed(4));
    stage.dataset.phase=p>=.88?'near':p>.3?'approach':'arrival';
    header.classList.toggle('light',pastJourney||p>.78);
    stage.style.setProperty('--copy-opacity',String(1-smooth(.03,.38,p)));
    stage.style.setProperty('--copy-y',`${-approach*24}px`);
    const caption=smooth(.72,.9,p);
    stage.style.setProperty('--caption-opacity',String(caption));
    stage.style.setProperty('--caption-y',`${(1-caption)*12}px`);
    stage.style.setProperty('--caption-pointer',caption>.8?'auto':'none');
    $('#distance-value').textContent=p<.3?'FAR':p<.85?'CLOSER':'NEAR';
    $('.hero-copy').inert=p>.4;
    $('.object-caption').inert=caption<.8;
  }
  function frame(now){raf=0;if(reduced.matches){current=0;render(0);lastFrame=0;return;}const dt=lastFrame?clamp(now-lastFrame,1,64):16;lastFrame=now;current+=(target-current)*(1-Math.exp(-dt/85));if(Math.abs(target-current)<.0006)current=target;render(current);if(Math.abs(target-current)>.0006&&visible)raf=requestAnimationFrame(frame);else lastFrame=0;}
  function update(){const rect=journey.getBoundingClientRect();target=clamp(-rect.top/Math.max(1,journey.offsetHeight-stage.offsetHeight));pastJourney=rect.bottom<100;if(!raf&&visible)raf=requestAnimationFrame(frame);}
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',()=>{fitScene();update();},{passive:true});reduced.addEventListener('change',update);
  hall.addEventListener('load',fitScene,{once:true});
  focusImage.addEventListener('load',update,{once:true});
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)update();else if(raf){cancelAnimationFrame(raf);raf=0;}});
  $('#begin-journey').addEventListener('click',()=>{const y=reduced.matches?$('#object-01').offsetTop:journey.offsetTop+(journey.offsetHeight-stage.offsetHeight)*.91;window.scrollTo({top:y,behavior:reduced.matches?'instant':'smooth'});});
  fitScene();update();
})();
