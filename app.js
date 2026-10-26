import './vendor/model-viewer.min.js';
const ModelViewer=customElements.get('model-viewer');
ModelViewer.dracoDecoderLocation=new URL('./vendor/draco/',import.meta.url).href;
const model=document.querySelector('#campus');
const load=document.querySelector('#load-model');
const status=document.querySelector('#load-status');
const progress=document.querySelector('#progress');
const state=document.querySelector('#viewer-state');
const message=document.querySelector('#viewer-message');
const rotate=document.querySelector('#rotate');
const presets={
  overview:{target:'0m 12m 0m',orbit:'38deg 52deg 650m'},
  courtyard:{target:'93m 16m -90m',orbit:'48deg 64deg 185m'},
  sports:{target:'-128m 5m -35m',orbit:'-45deg 36deg 320m'},
  plan:{target:'0m 0m 0m',orbit:'0deg 0deg 760m'},
};
function start(){
  load.disabled=true;load.textContent='正在载入校园…';status.textContent='正在下载模型，请稍候。';progress.hidden=false;
  model.src=new URL('./campus.glb',import.meta.url).href;
}
load.addEventListener('click',start);
model.addEventListener('progress',event=>{
  if(!model.src)return;
  const value=event.detail.totalProgress;progress.value=value;
  status.textContent=value<.99?`模型加载中 · ${Math.round(value*100)}%`:'正在准备三维画面…';
});
model.addEventListener('load',()=>{
  model.dismissPoster();state.textContent='三维校园 · 可以拖动探索';
  document.querySelectorAll('.controls button').forEach(button=>button.disabled=false);
});
model.addEventListener('error',()=>{
  model.showPoster();load.disabled=false;load.textContent='重新加载';
  status.textContent='模型未能加载。请检查网络，或使用支持 WebGL 的浏览器重试。';
  progress.hidden=true;state.textContent='暂时无法打开三维模型';
});
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  const view=presets[button.dataset.view];model.cameraTarget=view.target;model.cameraOrbit=view.orbit;
  model.autoRotate=false;rotate.setAttribute('aria-pressed','false');rotate.textContent='自动旋转';
  document.querySelectorAll('[data-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
rotate.addEventListener('click',()=>{
  model.autoRotate=!model.autoRotate;rotate.setAttribute('aria-pressed',String(model.autoRotate));
  rotate.textContent=model.autoRotate?'暂停旋转':'自动旋转';
});
document.querySelector('#fullscreen').addEventListener('click',async()=>{
  try{
    if(document.fullscreenElement)await document.exitFullscreen();
    else if(document.querySelector('#exhibit').requestFullscreen)await document.querySelector('#exhibit').requestFullscreen();
    else message.textContent='此浏览器不支持全屏，可横屏查看模型。';
  }catch{message.textContent='无法进入全屏，可继续在页面中旋转和缩放。';}
});
document.addEventListener('fullscreenchange',()=>document.querySelector('#fullscreen').textContent=document.fullscreenElement?'退出全屏':'全屏观看');
