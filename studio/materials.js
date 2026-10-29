import * as T from 'three';
let seed=529;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const textures=new Map();
export function texture(kind){
 if(textures.has(kind))return textures.get(kind);
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');
 const base={wood:[180,141,96],plaster:[228,226,214],stone:[183,181,167],brick:[159,76,58],tile:[215,215,203],grass:[89,113,65],board:[30,62,53]}[kind]||[150,150,150];
 const im=ctx.createImageData(512,512);
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){
  let n=(rand()-.5)*(kind==='grass'?44:12);
  if(kind==='wood')n+=2.5*Math.sin(x*.25+Math.sin(y*.016)*2)+1.6*Math.sin(x*.98+Math.sin(y*.03));
  const i=(y*512+x)*4;for(let k=0;k<3;k++)im.data[i+k]=base[k]+n;im.data[i+3]=255;
 }ctx.putImageData(im,0,0);
 if(kind==='wood'){ctx.fillStyle='#76533455';for(let x=0;x<512;x+=64)ctx.fillRect(x,0,1.2,512);}
 if(kind==='brick'){ctx.strokeStyle='#9b8f79';ctx.lineWidth=2;for(let y=0;y<512;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();for(let x=(y/32%2)*64;x<512;x+=128){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+32);ctx.stroke();}}}
 if(kind==='tile'||kind==='stone'){ctx.strokeStyle=kind==='tile'?'#adb1a7':'#94988d';ctx.lineWidth=kind==='tile'?1.5:2;const step=kind==='tile'?64:256;for(let i=0;i<512;i+=step){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,512);ctx.moveTo(0,i);ctx.lineTo(512,i);ctx.stroke();}}
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.anisotropy=8;textures.set(kind,map);return map;
}
export function mat(color,roughness=.6,metalness=0,kind=null){const m=new T.MeshStandardMaterial({color,roughness,metalness});if(kind){m.map=texture(kind);m.bumpMap=m.map;m.bumpScale=kind==='wood'?.006:.003;}return m;}
export function labelTexture(lines,{bg='#244b40',fg='#e4ead6',size=1024}={}){
 const c=document.createElement('canvas');c.width=size;c.height=size/2;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);
 ctx.strokeStyle=fg+'22';for(let y=110;y<480;y+=64){ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(size-60,y);ctx.stroke();}
 ctx.fillStyle=fg;ctx.textAlign='center';lines.forEach((line,i)=>{ctx.font=`${i===0?64:32}px "Microsoft YaHei",sans-serif`;ctx.fillText(line,size/2,110+i*95);});
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;return tex;
}
export function planarUV(geometry){
 if(geometry.getAttribute('uv'))return;
 const p=geometry.getAttribute('position'),n=geometry.getAttribute('normal');if(!p||!n)return;
 const uv=new Float32Array(p.count*2);
 for(let i=0;i<p.count;i++){const a=Math.abs(n.getX(i)),b=Math.abs(n.getY(i)),c=Math.abs(n.getZ(i));uv[i*2]=a>b&&a>c?p.getZ(i):p.getX(i);uv[i*2+1]=b>a&&b>c?p.getZ(i):p.getY(i);}
 geometry.setAttribute('uv',new T.BufferAttribute(uv,2));
}
