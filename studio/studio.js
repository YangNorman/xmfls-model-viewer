import {correctCampus} from './evidence-campus.js';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {SSAOPass} from 'three/addons/postprocessing/SSAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {makeClassroom} from './photo-classroom.js';
import {texture,planarUV} from './materials.js';
const $=s=>document.querySelector(s),viewport=$('#viewport'),loading=$('#loading');
const scene=new T.Scene();scene.background=new T.Color('#d9dcd4');
const camera=new T.PerspectiveCamera(58,1,.06,100);camera.position.set(3.7,2.15,4.75);
let renderer;
try{renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});}catch(e){loading.textContent='此浏览器无法启动三维画面，请使用支持 WebGL 2 的浏览器。';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;viewport.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(-.5,1.4,-2.8);controls.enableDamping=true;controls.dampingFactor=.09;controls.maxPolarAngle=Math.PI*.92;controls.minDistance=.35;controls.maxDistance=17;controls.enablePan=true;controls.update();
const fill=new T.HemisphereLight('#dce8f1','#8e795c',1.05);scene.add(fill);
const sun=new T.DirectionalLight('#fff0d7',3);sun.position.set(-10,9,-3);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.00015;sun.shadow.normalBias=.025;scene.add(sun,sun.target);
const composer=new EffectComposer(renderer);composer.renderTarget1.samples=4;composer.renderTarget2.samples=4;composer.addPass(new RenderPass(scene,camera));const ao=new SSAOPass(scene,camera,640,480,16);ao.kernelRadius=.35;ao.minDistance=.001;ao.maxDistance=.14;composer.addPass(ao);composer.addPass(new OutputPass());
const classroom=makeClassroom();scene.add(classroom.group);let current='room',campus=null,campusPromise=null,activeView=0,quality=true,requestId=0,frames=0;
const stage=new T.Mesh(new T.PlaneGeometry(2000,2000),new T.MeshStandardMaterial({color:'#d0d0bb',roughness:1}));stage.rotation.x=-Math.PI/2;stage.position.y=-6.1;stage.receiveShadow=true;stage.visible=false;scene.add(stage);
const campusViews=[{name:'庭院光影',position:[180,80,-180],target:[85,10,-80]},{name:'全校鸟瞰',position:[420,360,440],target:[0,0,0]},{name:'校门前',position:[174,22,-109],target:[139,7,-109],fov:52},{name:'钟楼步道',position:[-28,18,-95],target:[-6,18,-49]},{name:'体育泳馆',position:[-180,28,38],target:[-122,6,100]},{name:'入口礼堂',position:[213,28,-22],target:[163,5,-67]}];
function invalidate(){frames=60;if(!requestId)requestId=requestAnimationFrame(tick);}
function tick(){requestId=0;controls.update();if(current==='room'){camera.position.clamp(new T.Vector3(-4.28,.45,-5.25),new T.Vector3(4.28,3.33,7.25));controls.target.clamp(new T.Vector3(-4.2,.3,-5.1),new T.Vector3(4.2,3.2,7.1));camera.lookAt(controls.target);}if(quality)composer.render();else renderer.render(scene,camera);if(--frames>0)requestId=requestAnimationFrame(tick);}
controls.addEventListener('change',()=>{frames=Math.max(frames,3);if(!requestId)requestId=requestAnimationFrame(tick);});
function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;renderer.setSize(w,h);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();invalidate();}
new ResizeObserver(resize).observe(viewport);
function shadowBounds(size,far){const c=sun.shadow.camera;c.left=c.bottom=-size;c.right=c.top=size;c.near=.1;c.far=far;c.updateProjectionMatrix();sun.shadow.needsUpdate=true;}
function setLight(){const t=Number($('#light').value)/100;$('#light-name').textContent=t<.25?'日光':t<.65?'午后':'斜阳';sun.color.set(t>.65?'#ffd3a0':'#fff0db');
 if(current==='room'){sun.position.set(-10,5.8-t*3,-6+t*8);sun.target.position.set(0,0,0);sun.intensity=3.2;fill.intensity=.7;scene.environmentIntensity=.3;classroom.lights.forEach(l=>{l.color.set(t>.65?'#fff0d8':'#f3f3ec');l.intensity=24*(.85+t*.3);});$('#light-name').textContent=t>.65?'暖白':'自然白';sun.shadow.normalBias=.025;sun.shadow.bias=-.00015;shadowBounds(12,55);ao.kernelRadius=.23;ao.maxDistance=.04;}
 else{sun.position.set(90-t*100,210-t*95,-170);sun.target.position.set(0,0,0);sun.intensity=3.3;fill.intensity=.6;scene.environmentIntensity=.38;sun.shadow.normalBias=.5;sun.shadow.bias=-.0004;shadowBounds(275,650);ao.kernelRadius=2.5;ao.maxDistance=.08;}
 invalidate();}
function setView(index){const view=(current==='room'?classroom.presets:campusViews)[index];activeView=index;camera.fov=view.fov??(current==="room"?58:43);camera.updateProjectionMatrix();camera.position.set(...view.position);controls.target.set(...view.target);controls.update();$('#views').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));invalidate();}
function showViews(){const views=current==='room'?classroom.presets:campusViews;$('#views').replaceChildren(...views.map((v,i)=>{const b=document.createElement('button');b.textContent=v.name;b.setAttribute('aria-pressed',String(i===0));b.onclick=()=>setView(i);return b;}));}
async function loadCampus(){
 const draco=new DRACOLoader().setDecoderPath('../vendor/draco/');const loader=new GLTFLoader().setDRACOLoader(draco);
 const gltf=await loader.loadAsync('../campus.glb',e=>{if(current==='campus')loading.textContent=`正在打开光影校园… ${e.total?Math.round(e.loaded/e.total*100)+'%':''}`;});
 const root=gltf.scene;root.name='Haicang campus · material and light study';const materials=new Map();
 root.traverse(o=>{if(!o.isMesh)return;o.castShadow=!/leaves|fronds|flowers|花瓣/i.test(o.name);o.receiveShadow=true;planarUV(o.geometry);
  const upgrade=m=>{if(materials.has(m))return materials.get(m);const n=m.clone();const name=m.name;let kind=null;
   if(/Facade|砖红/.test(name))kind='brick';else if(/Concrete trim|暖白/.test(name))kind='tile';else if(/Paving|广场|Limestone/.test(name))kind='stone';else if(/Turf|Lawn|草坪|草地/.test(name))kind='grass';
   if(kind){n.map=texture(kind);n.color.set('#ffffff');n.bumpMap=n.map;n.bumpScale=kind==='brick'?.018:.012;n.roughness=kind==='grass'?.97:.74;}
   if(/Glazing|玻璃/.test(name)){n.color.set('#567e83');n.metalness=.5;n.roughness=.18;}
   if(/foliage/.test(name)){n.color.multiplyScalar(.72);n.roughness=.95;n.side=T.DoubleSide;}
   n.envMapIntensity=.7;materials.set(m,n);return n;};o.material=Array.isArray(o.material)?o.material.map(upgrade):upgrade(o.material);
 });await correctCampus(root);scene.add(root);root.visible=false;draco.dispose();return root;
}
async function switchScene(name){
 current=name;$('#exhibit').dataset.scene=name;document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===name)));
 classroom.group.visible=name==='room';stage.visible=name==='campus';if(campus)campus.visible=false;
 $('#download').disabled=name==='campus'&&!campus;$('#scene-label').textContent=name==='room'?'海沧公开课室 · 实拍参考':'海沧校区 · 光影增强版';
 $('#scene-title').innerHTML=name==='room'?'海沧公开课室':'海沧校园';
 $('#scene-kicker').textContent=name==='room'?'THE SUNLIT CLASSROOM':'THE CAMPUS IN LIGHT';
 $('#scene-description').textContent=name==='room'?'依据2026年海沧语文、英语公开课照片。尺寸与桌椅数量为估计。':'校门、喷泉及体育馆按实拍校正。完整屋顶与尺寸仍待核。';
 camera.near=name==='room'?.06:.4;camera.far=name==='room'?100:1800;camera.fov=name==='room'?58:43;camera.updateProjectionMatrix();controls.minDistance=name==='room'?.35:8;controls.maxDistance=name==='room'?17:1100;
 scene.background.set(name==='room'?'#d9dcd4':'#d5d9cc');showViews();setView(0);setLight();
 if(name==='campus'){
  loading.hidden=false;loading.textContent='正在打开光影校园…';
  try{campusPromise??=loadCampus();campus=await campusPromise;if(current==='campus'){campus.visible=true;loading.hidden=true;$('#download').disabled=false;invalidate();}}
  catch(e){campusPromise=null;if(current==='campus')loading.textContent='校园模型加载失败，请切回教室后重试。';console.error(e);}
 }else loading.hidden=true;
}
document.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>switchScene(b.dataset.scene));
$('#light').oninput=setLight;
$('#quality').onclick=()=>{quality=!quality;$('#quality').textContent=`接触阴影 · ${quality?'已开启':'已关闭'}`;$('#quality').setAttribute('aria-pressed',String(quality));invalidate();};
document.querySelectorAll('[data-nudge]').forEach(b=>b.onclick=()=>{const step=current==='room'?.35:8;const d=b.dataset.nudge;const v=new T.Vector3();v.setFromMatrixColumn(camera.matrix,d==='up'||d==='down'?1:0).multiplyScalar(step*(d==='left'||d==='down'?-1:1));controls.target.add(v);camera.position.add(v);controls.update();invalidate();});
document.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{const delta=camera.position.clone().sub(controls.target);delta.multiplyScalar(b.dataset.zoom==='in'?.82:1.22);delta.clampLength(controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(delta);controls.update();invalidate();});
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('#exhibit').requestFullscreen)await $('#exhibit').requestFullscreen();else $('#render-status').textContent='此浏览器可横屏查看';}catch{$('#render-status').textContent='无法全屏，可在页面继续探索';}};
function download(blob,name){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
$('#capture').onclick=()=>{if(quality)composer.render();else renderer.render(scene,camera);renderer.domElement.toBlob(b=>{if(b)download(b,`haicang-${current}-${Date.now()}.png`);});};
$('#download').onclick=()=>{const a=document.createElement('a');a.href=current==='room'?'./haicang-open-classroom.glb':'./haicang-campus-photo-refined.glb';a.download=a.href.split('/').pop();a.click();};
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();loading.hidden=false;loading.textContent='三维上下文已暂停，请刷新页面恢复。';});
new HDRLoader().load('../environment.hdr',hdr=>{hdr.mapping=T.EquirectangularReflectionMapping;scene.environment=hdr;setLight();invalidate();},undefined,()=>{$('#render-status').textContent='使用基础光照';});
showViews();setView(0);setLight();resize();loading.hidden=true;$('#render-status').textContent='拖动即可探索';$('#exhibit').dataset.scene='room';
