/* =========================================================
   TIENDA v2 — catálogo con búsqueda, filtros, orden, ficha rápida y carrito.
   Para cambiar productos, editar el array PRODUCTS. No hay que tocar el HTML.
   image2 (opcional) es la foto que aparece al pasar el mouse.
   ========================================================= */
var WHATSAPP_NUMBER='5491100000000';
var PRODUCTS=[
 {id:'p1',name:'Bolso de lino crudo',price:18500,category:'accesorios',tag:'Nuevo',image:'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80',description:'Tote de lino 100% natural con forro interior y bolsillo para celular. 40x35 cm.'},
 {id:'p2',name:'Cinturón de cuero trenzado',price:12800,category:'accesorios',image:'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80',description:'Cuero vacuno trenzado a mano, hebilla de metal envejecido. Varios talles.'},
 {id:'p3',name:'Jarrón de cerámica esmaltada',price:22900,category:'ceramica',tag:'Más vendido',image:'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80',description:'Torneado a mano y esmaltado en horno de alta temperatura. Pieza única.'},
 {id:'p4',name:'Set de tazas de cerámica x2',price:15400,category:'ceramica',image:'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',description:'Dos tazas de 250 ml hechas a mano, aptas para lavavajillas y microondas.'},
 {id:'p5',name:'Manta de algodón tejida',price:27500,category:'textiles',image:'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80',description:'Algodón 100% tejido en telar. 130x180 cm, ideal para sillón o pie de cama.'},
 {id:'p6',name:'Cojín de lino natural',price:9800,category:'textiles',image:'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80',description:'Funda de lino 45x45 cm con relleno incluido y cierre invisible.'},
 {id:'p7',name:'Espejo con marco de mimbre',price:31200,category:'decoracion',tag:'Nuevo',image:'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80',description:'Espejo redondo de 50 cm con marco de mimbre tejido a mano.'},
 {id:'p8',name:'Portavelas de cerámica x3',price:13900,category:'decoracion',image:'https://acdn-us.mitiendanube.com/stores/118/808/products/chatgpt-image-28-ene-2026-06_42_56-p-m-e4b76b3c94d7e31a8f17696365952740-480-0.webp',description:'Tres portavelas de distintos tamaños, esmalte mate. Incluye velas de regalo.'}
];

var cart={},state={cat:'todos',price:'todos',q:'',sort:'rel'},$=function(id){return document.getElementById(id)};
var money=function(n){return '$'+n.toLocaleString('es-AR')};
var find=function(id){return PRODUCTS.filter(function(p){return p.id===id})[0]};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};

function render(){
  var list=PRODUCTS.filter(function(p){
    if(state.cat!=='todos'&&p.category!==state.cat)return false;
    if(state.q&&p.name.toLowerCase().indexOf(state.q)===-1)return false;
    if(state.price!=='todos'){var r=state.price.split('-');if(p.price<+r[0]||p.price>+r[1])return false}
    return true});
  if(state.sort==='asc')list.sort(function(a,b){return a.price-b.price});
  if(state.sort==='desc')list.sort(function(a,b){return b.price-a.price});
  if(state.sort==='az')list.sort(function(a,b){return a.name.localeCompare(b.name,'es')});
  $('result').textContent=list.length+(list.length===1?' producto':' productos');
  $('grid').innerHTML=list.length?list.map(function(p){return '<article class="card"><div class="media" data-open="'+p.id+'" role="button" tabindex="0" aria-label="Ver '+esc(p.name)+'">'+(p.tag?'<span class="badge">'+esc(p.tag)+'</span>':'')+'<img src="'+p.image+'" alt="'+esc(p.name)+'" loading="lazy">'+(p.image2?'<img class="img2" src="'+p.image2+'" alt="" loading="lazy">':'')+'<span class="quick">Vista rápida</span></div><div class="info"><h3>'+esc(p.name)+'</h3><span class="price">'+money(p.price)+'</span></div><p class="cat-l">'+esc(p.category)+'</p><button class="btn btn-out add" data-add="'+p.id+'">Agregar</button></article>'}).join(''):'<p class="empty">No encontramos productos con esos filtros.</p>';
}

function total(){return Object.keys(cart).reduce(function(s,id){return s+find(id).price*cart[id]},0)}
function renderCart(){
  var ids=Object.keys(cart);
  $('count').textContent=ids.reduce(function(s,id){return s+cart[id]},0);
  $('items').innerHTML=ids.length?ids.map(function(id){var p=find(id),q=cart[id];return '<div class="li"><img src="'+p.image+'" alt="'+esc(p.name)+'"><div><h4>'+esc(p.name)+'</h4><small>'+money(p.price)+' c/u</small><div class="qty"><button data-dec="'+id+'" aria-label="Restar">−</button><span>'+q+'</span><button data-inc="'+id+'" aria-label="Sumar">+</button></div><button class="rm" data-rm="'+id+'">Quitar</button></div><strong>'+money(p.price*q)+'</strong></div>'}).join(''):'<p style="color:var(--color-soft);text-align:center;padding:2rem 0">Tu carrito está vacío.</p>';
  $('sub').textContent=$('tot').textContent=money(total());
  $('checkout').disabled=!ids.length;
}
function openCart(o){$('drawer').classList.toggle('open',o);$('overlay').classList.toggle('open',o)}
function add(id){cart[id]=(cart[id]||0)+1;renderCart();openCart(true)}
var modalId=null;
function openModal(id){var p=find(id);modalId=id;$('mImg').src=p.image;$('mImg').alt=p.name;$('mCat').textContent=p.category;$('mName').textContent=p.name;$('mPrice').textContent=money(p.price);$('mDesc').textContent=p.description;$('mo').classList.add('open');$('mClose').focus()}
function closeModal(){$('mo').classList.remove('open')}

document.addEventListener('DOMContentLoaded',function(){
  render();renderCart();

  $('burger').addEventListener('click',function(){var o=$('navL').classList.toggle('open');this.setAttribute('aria-expanded',o)});
  $('navL').querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){$('navL').classList.remove('open')})});
  $('fbtn').addEventListener('click',function(){var o=$('filters').classList.toggle('open');this.setAttribute('aria-expanded',o)});

  $('q').addEventListener('input',function(){state.q=this.value.trim().toLowerCase();render()});
  $('sort').addEventListener('change',function(){state.sort=this.value;render()});
  document.querySelectorAll('input[name=cat]').forEach(function(r){r.addEventListener('change',function(){state.cat=r.value;render()})});
  document.querySelectorAll('input[name=price]').forEach(function(r){r.addEventListener('change',function(){state.price=r.value;render()})});
  document.querySelectorAll('.cat').forEach(function(c){c.addEventListener('click',function(){
    state.cat=c.getAttribute('data-cat');
    document.querySelectorAll('input[name=cat]').forEach(function(r){r.checked=r.value===state.cat});
    render();$('catalogo').scrollIntoView({behavior:'smooth'})})});

  $('grid').addEventListener('click',function(e){
    var a=e.target.closest('[data-add]');if(a){add(a.getAttribute('data-add'));return}
    var o=e.target.closest('[data-open]');if(o)openModal(o.getAttribute('data-open'))});
  $('grid').addEventListener('keydown',function(e){if(e.key==='Enter'){var o=e.target.closest('[data-open]');if(o)openModal(o.getAttribute('data-open'))}});

  $('cartBtn').addEventListener('click',function(){openCart(true)});
  $('cartClose').addEventListener('click',function(){openCart(false)});
  $('overlay').addEventListener('click',function(){openCart(false)});
  $('items').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var id=b.getAttribute('data-inc')||b.getAttribute('data-dec')||b.getAttribute('data-rm');
    if(b.hasAttribute('data-inc'))cart[id]++;
    if(b.hasAttribute('data-dec')){cart[id]--;if(cart[id]<=0)delete cart[id]}
    if(b.hasAttribute('data-rm'))delete cart[id];
    renderCart()});

  $('mClose').addEventListener('click',closeModal);
  $('mo').addEventListener('click',function(e){if(e.target===this)closeModal()});
  $('mAdd').addEventListener('click',function(){add(modalId);closeModal()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModal();openCart(false)}});

  $('checkout').addEventListener('click',function(){
    var lines=Object.keys(cart).map(function(id){var p=find(id);return '• '+p.name+' x'+cart[id]+' — '+money(p.price*cart[id])});
    if(!lines.length)return;
    var txt='Hola! Quiero hacer este pedido:\n'+lines.join('\n')+'\n\nTotal: '+money(total());
    window.open('https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent(txt),'_blank')});

  var f=$('form'),st=$('status');
  f.addEventListener('submit',function(e){e.preventDefault();
    var n=f.nombre.value.trim(),em=f.email.value.trim(),m=f.msg.value.trim();
    if(!n||!em||!m){st.textContent='Completá todos los campos.';st.className='status show';return}
    st.textContent='Te redirigimos a WhatsApp…';st.className='status show';
    window.open('https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent('Hola! Soy '+n+' ('+em+'). '+m),'_blank');f.reset()});
});
