const products={
  l1:{code:'LIGHT 01 / MADE TO ORDER',name:'L1 Pivot Task Light',price:3980,image:'./assets/archive-master.png',description:'为专注工作建立一片克制的光域。薄锐悬臂、矿物基座与烟熏琥珀转轴共同组成系列的第一件原型。',edition:'Open edition',size:'W 720 × H 430 × D 145 mm',material:'Aluminium / Mineral composite / Amber resin',lead:'3–4 weeks'},
  l2:{code:'LIGHT 02 / ED. 01 OF 36',name:'L2 Wall Rail',price:5600,image:'./assets/l2-wall-rail.png',description:'将 L1 的薄锐轮廓转向墙面。连续暖光悬浮于建筑表面，琥珀节点成为唯一可见的连接。',edition:'36 + 4 AP',size:'W 960 × H 160 × D 100 mm',material:'Aluminium / Smoked amber resin',lead:'6–8 weeks'},
  l3:{code:'LIGHT 03 / ED. 01 OF 18',name:'L3 Floor Totem',price:8800,image:'./assets/l3-floor-totem.png',description:'一件介于落地灯与光雕之间的垂直对象。折叠金属平面在琥珀核心处转向，让暖光沿高度上升。',edition:'18 + 2 AP',size:'W 210 × H 1480 × D 180 mm',material:'Aluminium / Mineral composite / Amber resin',lead:'8–10 weeks'},
  a1:{code:'OBJECT 01 / ED. 01 OF 60',name:'A1 Amber Node',price:1280,image:'./assets/a1-amber-node.png',description:'从灯具转轴独立出来的材料收藏物。它可以是微光物件、镇纸，也可以是一枚关于连接的样本。',edition:'60 + 6 AP',size:'W 210 × H 150 × D 95 mm',material:'Folded aluminium / Cast mineral / Amber resin',lead:'2–3 weeks'}
};
const hero=document.querySelector('.cinematic-hero');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduceMotion){document.body.classList.add('is-ready','intro-done')}
else{
  requestAnimationFrame(()=>document.body.classList.add('is-ready'));
  window.setTimeout(()=>document.body.classList.add('intro-done'),2300);
  hero?.addEventListener('pointermove',event=>{
    const bounds=hero.getBoundingClientRect();
    const x=(event.clientX-bounds.left)/bounds.width-.5;
    const y=(event.clientY-bounds.top)/bounds.height-.5;
    hero.style.setProperty('--hero-x',`${x*-12}px`);
    hero.style.setProperty('--hero-y',`${y*-8}px`);
  });
  hero?.addEventListener('pointerleave',()=>{hero.style.setProperty('--hero-x','0px');hero.style.setProperty('--hero-y','0px')});
}
const money=value=>`¥ ${value.toLocaleString('zh-CN')}`;
const progressBar=document.querySelector('#progress-bar');
const countNode=document.querySelector('#selection-count');
const drawer=document.querySelector('#selection-drawer');
const backdrop=document.querySelector('#drawer-backdrop');
const selectionItems=document.querySelector('#selection-items');
const selectionEmpty=document.querySelector('#selection-empty');
const drawerFoot=document.querySelector('#drawer-foot');
const selectionTotal=document.querySelector('#selection-total');
const toast=document.querySelector('#toast');
let selection=JSON.parse(localStorage.getItem('luma-field-selection')||'[]').filter(id=>products[id]);

function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;progressBar.style.width=`${max>0?(window.scrollY/max)*100:0}%`;if(hero&&!reduceMotion){const amount=Math.min(window.scrollY/(hero.offsetHeight||1),1);hero.style.setProperty('--hero-shift',`${amount*52}px`);hero.style.setProperty('--hero-scale',`${1.065-amount*.045}`)}}
window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
document.querySelectorAll('.reveal').forEach((node,index)=>{node.style.transitionDelay=`${Math.min(index%3*70,140)}ms`;observer.observe(node)});

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(item=>item.classList.toggle('is-active',item===button));
  document.querySelectorAll('.product-card').forEach(card=>card.classList.toggle('is-hidden',button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter));
}));

const productDialog=document.querySelector('#product-dialog');let activeProduct=null;
function openProduct(id){const product=products[id];activeProduct=id;document.querySelector('#dialog-image').src=product.image;document.querySelector('#dialog-image').alt=product.name;document.querySelector('#dialog-code').textContent=product.code;document.querySelector('#dialog-title').textContent=product.name;document.querySelector('#dialog-description').textContent=product.description;document.querySelector('#dialog-price').textContent=money(product.price);document.querySelector('#dialog-specs').innerHTML=`<div><dt>Edition</dt><dd>${product.edition}</dd></div><div><dt>Dimensions</dt><dd>${product.size}</dd></div><div><dt>Materials</dt><dd>${product.material}</dd></div><div><dt>Lead time</dt><dd>${product.lead}</dd></div>`;productDialog.showModal()}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>openProduct(button.dataset.view)));
document.querySelector('.dialog-close').addEventListener('click',()=>productDialog.close());
productDialog.addEventListener('click',event=>{if(event.target===productDialog)productDialog.close()});
document.querySelector('#dialog-add').addEventListener('click',()=>{addProduct(activeProduct);productDialog.close();openDrawer()});

function showToast(message){toast.textContent=message;toast.classList.add('is-visible');window.clearTimeout(showToast.timer);showToast.timer=window.setTimeout(()=>toast.classList.remove('is-visible'),2200)}
function persist(){localStorage.setItem('luma-field-selection',JSON.stringify(selection))}
function addProduct(id){if(!selection.includes(id)){selection.push(id);persist();renderSelection();showToast(`${products[id].name} 已加入收藏单`)}else showToast('这件作品已经在收藏单中')}
function removeProduct(id){selection=selection.filter(item=>item!==id);persist();renderSelection()}
document.querySelectorAll('[data-add]').forEach(button=>button.addEventListener('click',()=>addProduct(button.dataset.add)));

function renderSelection(){countNode.textContent=selection.length;selectionItems.innerHTML=selection.map(id=>{const p=products[id];return `<article class="selection-item"><img src="${p.image}" alt="${p.name}"><div><p>${p.code.split('/')[0]}</p><h3>${p.name}</h3><strong>${money(p.price)}</strong></div><button type="button" data-remove="${id}" aria-label="移除 ${p.name}">×</button></article>`}).join('');selectionItems.querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>removeProduct(button.dataset.remove)));const empty=selection.length===0;selectionEmpty.classList.toggle('is-visible',empty);drawerFoot.hidden=empty;selectionTotal.textContent=money(selection.reduce((sum,id)=>sum+products[id].price,0))}
function openDrawer(){drawer.classList.add('is-open');backdrop.classList.add('is-open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('drawer-open');document.querySelector('#selection-close').focus()}
function closeDrawer(){drawer.classList.remove('is-open');backdrop.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');document.body.classList.remove('drawer-open')}
document.querySelector('#selection-toggle').addEventListener('click',openDrawer);document.querySelector('#open-selection-bottom').addEventListener('click',openDrawer);document.querySelector('#selection-close').addEventListener('click',closeDrawer);backdrop.addEventListener('click',closeDrawer);document.addEventListener('keydown',event=>{if(event.key==='Escape'&&drawer.classList.contains('is-open'))closeDrawer()});document.querySelector('.selection-empty a').addEventListener('click',closeDrawer);
document.querySelector('#copy-selection').addEventListener('click',async()=>{const lines=['LUMA FIELD / ACQUISITION LIST','',...selection.map(id=>`${products[id].name} — ${money(products[id].price)} — ${products[id].edition}`),'',`Estimated total — ${money(selection.reduce((sum,id)=>sum+products[id].price,0))}`,'制作档期与可用编号需在正式预订前确认。'];try{await navigator.clipboard.writeText(lines.join('\n'));showToast('收藏清单已复制')}catch{showToast('无法自动复制，请截屏保存收藏单')}});
renderSelection();
