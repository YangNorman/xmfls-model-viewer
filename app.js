import { CAMPUS, ROOM, places, roomViews, images } from './places.js';

const $ = id => document.getElementById(id);
const mobile = matchMedia('(max-width:700px)');
let active = 'overview';
let model;
let modelFile;
let ready = false;
let loadGeneration = 0;
let slide = 0;
let library;
let slowTimer;

function setStatus(message, retry=false) {
  $('status').textContent = message;
  $('status-box').hidden = !message;
  $('retry').hidden = !retry;
  $('room-views').hidden = !ready || active !== 'room';
}

function liveControls(enabled) {
  ready = enabled;
  document.querySelectorAll('[data-live]').forEach(b => b.disabled = !enabled);
  if (!enabled) closePan();
}

function closePicker() {
  document.querySelector('.rail').classList.remove('open');
  $('place-picker').setAttribute('aria-expanded','false');
}

function closePan() {
  $('pan-pad').hidden = true;
  $('pan-button').setAttribute('aria-expanded','false');
}

function buildNav() {
  for (const [id, place] of Object.entries(places)) {
    const link = document.createElement('a');
    link.href = '#'+id;
    const thumb = new Image();
    thumb.src = './images/tour/thumbs/'+id+'.jpg';
    thumb.alt = '';
    thumb.width = 43;
    thumb.height = 31;
    link.append(thumb,document.createTextNode(place.name));
    if (id === 'room') link.className = 'indoor';
    if (id === 'plan') link.className = 'mobile-plan';
    link.addEventListener('click', () => {
      if (location.hash === link.hash) resetCamera();
      if (mobile.matches) $('place-picker').focus();
      closePicker();
    });
    $('destinations').append(link);
  }
}

function resetCamera() {
  if (!model) return;
  const interior = active === 'room';
  const view = interior ? roomViews[$('room-view').selectedIndex] : places[active];
  const offset = view.eye.map((value,i) => value-view.target[i]);
  const radius = Math.hypot(...offset);
  const theta = Math.atan2(offset[0],offset[2]);
  const phi = Math.acos(offset[1]/radius);
  const widthRatio = $('stage').clientWidth / Math.max($('stage').clientHeight,1);
  const wideView = ['overview','plan','sports'].includes(active);
  let distance=radius;
  let fov=view.fov || 58;
  if (widthRatio<1) {
    if(wideView) distance*=1.19;
    if(active==='gate') distance*=1.32;
    if(active==='stand' || active==='gym') {
      const fit=Math.min(1.7,Math.max(1,(active==='gym'?1.10:.99)/widthRatio));
      fov=2*Math.atan(Math.tan(fov*Math.PI/360)*fit)*180/Math.PI;
    }
  }
  model.setAttribute('min-camera-orbit',interior?'auto 1deg 0.12m':'auto 0deg 2m');
  model.setAttribute('max-camera-orbit',interior?'auto 178deg 14m':'auto 90deg 3200m');
  model.setAttribute('camera-target',view.target.map(n => n+'m').join(' '));
  model.setAttribute('camera-orbit',theta+'rad '+phi+'rad '+distance+'m');
  model.setAttribute('field-of-view',fov+'deg');
  // Custom element properties are applied in a microtask before snapping.
  const target = model;
  target.updateComplete?.then(() => { if (target === model) target.jumpCameraToGoal(); });
}

async function loadModel(file) {
  const generation = ++loadGeneration;
  clearTimeout(slowTimer);
  model?.remove();
  model = null;
  modelFile = file;
  liveControls(false);
  $('poster').hidden = false;
  setStatus(active === 'room'?'正在打开公开课室…':'正在打开校园…');
  const fail = () => {
    if (generation !== loadGeneration) return;
    clearTimeout(slowTimer);
    model?.remove();
    model = null;
    modelFile = null;
    liveControls(false);
    $('poster').hidden = false;
    setStatus('三维暂时无法显示，可浏览效果图。',true);
  };
  try {
    library ??= import('./vendor/model-viewer.min.js?v=20261119-sports');
    await library;
    if (generation !== loadGeneration) return;
    customElements.get('model-viewer').dracoDecoderLocation = new URL('./vendor/draco/',import.meta.url).href;
    const element = document.createElement('model-viewer');
    model = element;
    const properties = {
      alt: places[active].name+'三维模型', 'camera-controls':'', 'disable-tap':'',
      loading:'eager', 'touch-action':'none', 'interaction-prompt':'none',
      'environment-image':'./environment.hdr','shadow-softness':'0.8',
      'shadow-intensity':$('shadows').checked?'0.24':'0',
      exposure:effectiveExposure(), 'tone-mapping':'aces',
      'min-field-of-view':'16deg','max-field-of-view':'70deg'
    };
    for (const [k,v] of Object.entries(properties)) element.setAttribute(k,v);
    element.addEventListener('error',fail,{once:true});
    element.addEventListener('load',() => {
      if (generation !== loadGeneration) return;
      clearTimeout(slowTimer);
      const backdrop=element.model.getMaterialByName('背景 · Warm mist');
      if(backdrop){
        backdrop.setAlphaMode('MASK');
        backdrop.setAlphaCutoff(.5);
        backdrop.pbrMetallicRoughness.setBaseColorFactor([1,1,1,0]);
      }
      liveControls(true);
      $('poster').hidden = true;
      setStatus('');
      resetCamera();
    },{once:true});
    slowTimer = setTimeout(() => {
      if (!ready && generation===loadGeneration) setStatus('正在准备三维画面，可先浏览效果图。');
    },15000);
    $('viewport').append(element);
    resetCamera();
    element.src = file;
  } catch {
    library = undefined;
    fail();
  }
}

function selectPlace() {
  const hash = location.hash.slice(1);
  active = Object.hasOwn(places,hash) ? hash : 'overview';
  const place = places[active];
  document.title = place.name+' · 厦外海沧';
  for (const a of document.querySelectorAll('#destinations a,.plan-link')) {
    if (a.hash === '#'+active) a.setAttribute('aria-current','location');
    else a.removeAttribute('aria-current');
  }
  $('place-picker').firstChild.textContent = place.name+' ';
  $('stage').setAttribute('aria-label',place.name+'三维模型');
  $('stage').dataset.close = String(!['overview','sports','plan','room'].includes(active));
  $('room-view').selectedIndex = 0;
  $('room-views').hidden = active!=='room' || !ready;
  $('rotation').checked = false;
  $('rotation').disabled = active==='room';
  if (model) { model.autoRotate=false; model.resetTurntableRotation(); }
  closePan();
  closePicker();
  const file = active === 'room' ? ROOM : CAMPUS;
  $('download').href = file;
  $('download').textContent = active==='room'?'下载课室模型':'下载校园模型';
  $('poster').src = place.image || places.overview.image;
  $('poster').alt = (place.image?place.name:'校园全景')+'渲染';
  if (file !== modelFile) loadModel(file);
  else {
    if (model) model.alt = place.name+'三维模型';
    resetCamera();
  }
  if (hash === 'gallery' && !$('gallery').open) openGallery();
  if (hash === 'about' && !$('settings').open) $('settings').showModal();
}

function renderSlide() {
  const [label,src] = images[slide];
  $('gallery-image').src = src;
  $('gallery-image').alt = label+'渲染';
  $('image-title').textContent = label;
  $('image-count').textContent = (slide+1)+' / '+images.length;
}
function openGallery() {
  slide = Math.max(0,images.findIndex(p => p[2]===active));
  renderSlide();
  $('gallery').showModal();
}
function shiftSlide(delta) {
  slide = (slide+delta+images.length)%images.length;
  renderSlide();
}
function stopRotation() {
  $('rotation').checked = false;
  if(model) model.autoRotate=false;
}
function zoom(factor) {
  if (!ready) return;
  stopRotation();
  const {theta,phi,radius} = model.getCameraOrbit();
  model.setAttribute('camera-orbit',theta+'rad '+phi+'rad '+radius*factor+'m');
}
function pan(direction) {
  if (!ready) return;
  stopRotation();
  const {theta,phi,radius} = model.getCameraOrbit();
  const angle = theta-model.turntableRotation;
  const p = model.getCameraTarget();
  const x = Number(direction==='right')-Number(direction==='left');
  const y = Number(direction==='up')-Number(direction==='down');
  const step = radius*.048;
  const coords = [p.x+step*(x*Math.cos(angle)-y*Math.cos(phi)*Math.sin(angle)),
    p.y+step*y*Math.sin(phi),p.z+step*(-x*Math.sin(angle)-y*Math.cos(phi)*Math.cos(angle))];
  model.setAttribute('camera-target',coords.map(n => n+'m').join(' '));
}

$('place-picker').onclick = () => {
  const open = document.querySelector('.rail').classList.toggle('open');
  $('place-picker').setAttribute('aria-expanded',String(open));
  if(open) $('destinations').querySelector('[aria-current]')?.focus();
};
$('viewport').addEventListener('pointerdown',() => {closePicker();closePan();});
$('room-view').onchange = resetCamera;
$('reset').onclick = () => { stopRotation(); model.resetTurntableRotation(); resetCamera(); };
$('zoom-in').onclick = () => zoom(.8);
$('zoom-out').onclick = () => zoom(1.25);
$('pan-button').onclick = () => {
  $('pan-pad').hidden = !$('pan-pad').hidden;
  $('pan-button').setAttribute('aria-expanded',String(!$('pan-pad').hidden));
};
$('pan-pad').onclick = e => { if(e.target.dataset.pan) pan(e.target.dataset.pan); };
$('retry').onclick = () => loadModel(active==='room'?ROOM:CAMPUS);
$('gallery-button').onclick = openGallery;
$('prev').onclick = () => shiftSlide(-1);
$('next').onclick = () => shiftSlide(1);
$('settings-button').onclick = () => $('settings').showModal();
document.querySelectorAll('dialog').forEach(d => {
  d.querySelector('.close').onclick = () => d.close();
  d.addEventListener('click',e => {
    if(e.target!==d) return;
    const r=d.getBoundingClientRect();
    if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) d.close();
  });
});
function effectiveExposure() {
  return Number($('exposure').value)*(active==='room'?.69:.86);
}
$('exposure').oninput = () => { if(model) model.exposure=effectiveExposure(); };
$('shadows').onchange = () => { if(model) model.shadowIntensity=$('shadows').checked?.24:0; };
$('rotation').onchange = () => { if(model) model.autoRotate=$('rotation').checked; };
$('capture').onclick = async () => {
  if(!ready) return;
  try {
    const data=await model.toBlob({mimeType:'image/png'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(data); a.download=places[active].name+'.png'; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),10000);
  } catch { $('settings').close(); setStatus('当前浏览器无法保存画面。'); }
};
$('fullscreen').onclick = async () => {
  try {
    if(document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { setStatus('当前浏览器不支持全屏。'); }
};
document.addEventListener('fullscreenchange',() => {
  const label=document.fullscreenElement?'退出全屏':'全屏';
  $('fullscreen').setAttribute('aria-label',label); $('fullscreen').title=label;
});
window.addEventListener('keydown',e => {
  if($('gallery').open && ['ArrowLeft','ArrowRight'].includes(e.key)){
    e.preventDefault(); shiftSlide(e.key==='ArrowRight'?1:-1);
  }
  if(e.key==='Escape'){
    if(document.querySelector('.rail.open')) $('place-picker').focus();
    closePicker(); closePan();
  }
});
mobile.addEventListener('change',()=>{closePicker(); resetCamera();});
window.addEventListener('hashchange',selectPlace);
buildNav();
selectPlace();
