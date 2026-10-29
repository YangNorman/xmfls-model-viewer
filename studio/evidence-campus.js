import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {mat,planarUV} from './materials.js';
// Source: XMU 2020 gate photo, school 2024 fountain photo, school 2025
// Haicang sports photo + user's location identification. Unseen geometry remains estimated.
export async function correctCampus(root){
 const discard=[];root.traverse(o=>{if(/^(石材主门|校门[ _]*·[ _]*(英文校名|中文校名|顶部细格栅)|游泳设施|双环水池|喷泉水面|喷泉池底|喷泉喷头)/.test(o.name))discard.push(o);});discard.forEach(o=>o.removeFromParent());
 const group=new T.Group();group.name='实拍校正 · 校门 喷泉 体育泳馆';root.add(group);
 const white=mat('#dcded7',.8),trim=mat('#a5afa9',.5,.2),brick=mat('#be927a',.86),dark=mat('#53666a',.4,.25),gold=mat('#bc9647',.28,.7);
 function box(name,p,s,m,parent=group){const g=new T.BoxGeometry(...s);g.deleteAttribute('uv');planarUV(g);const o=new T.Mesh(g,m);o.name=name;o.position.set(...p);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 function pipe(name,a,b,r,m,parent=group){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);const o=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),8),m);o.name=name;o.position.copy(av).add(bv).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());o.castShadow=true;parent.add(o);return o;}
 // Gate: much lighter grey stone, a deep secondary opening tucked behind
 // the right jamb, separately spaced English words, smaller top ladder rails.
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#d5d4ca';ctx.fillRect(0,0,512,512);let seed=2;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<9500;i++){const v=170+random()*65;ctx.fillStyle=`rgba(${v},${v},${v-4},.1)`;ctx.fillRect(random()*512,random()*512,1+random()*4,1+random()*5);}
 ctx.strokeStyle='#a6a69c88';ctx.lineWidth=1;for(let y=0;y<512;y+=128){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();for(let x=(y/128%2)*128;x<512;x+=256){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+128);ctx.stroke();}}
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(.5,.5);map.anisotropy=8;const stone=mat('#ffffff',.72);stone.map=map;stone.bumpMap=map;stone.bumpScale=.008;
 const gate=new T.Group();gate.name='实拍校门';gate.position.set(139,.32,-109);gate.rotation.y=Math.PI/2+.079;group.add(gate);
 box('门柱左',[-20,5.35,0],[3.6,10.7,3.5],stone,gate);box('门柱右',[20,5.35,0],[3.6,10.7,3.5],stone,gate);box('门额',[0,9.55,0],[43.6,3.2,3.5],stone,gate);
 box('侧门后柱',[15.25,2.8,-2.1],[1.2,5.6,1.3],stone,gate);box('侧门后楣',[17.4,5.4,-2.1],[5.5,1.2,1.3],stone,gate);
 const letteringModel=await new GLTFLoader().loadAsync('./gate-lettering.glb');
 letteringModel.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});gate.add(letteringModel.scene);
 for(let x=-21.5;x<=21.5;x+=1.7)pipe('顶部横向细杆',[x,11.26,-1.6],[x,11.26,2],.055,trim,gate);
 for(const z of [-1.1,1.5])pipe('顶部纵向细杆',[-22,11.26,z],[22,11.26,z],.055,trim,gate);
 // Fountain: stepped inner basin and segmented stone coping. The photographs
 // show an inactive pool; no invented tall jets or ornamental sculpture.
 const pool=new T.Group();pool.name='双环水池 · 实拍层次';pool.position.set(109,0,-89);group.add(pool);
 const mosaic=mat('#8c7854',.86),coping=mat('#aaa28e',.7),water=new T.MeshPhysicalMaterial({color:'#526c56',roughness:.16,metalness:.16,clearcoat:1,clearcoatRoughness:.1});
 function ring(ro,ri,h,y,m){const shape=new T.Shape();shape.absarc(0,0,ro,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,ri,0,Math.PI*2,true);shape.holes.push(hole);const geo=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false,curveSegments:96});geo.rotateX(-Math.PI/2);const ob=new T.Mesh(geo,m);ob.position.y=y;ob.castShadow=ob.receiveShadow=true;pool.add(ob);return ob;}
 ring(7.4,7.04,.44,.3,mosaic);ring(7.48,6.98,.09,.74,coping);ring(3.9,3.55,.71,.3,mosaic);ring(3.98,3.49,.09,1.01,coping);
 const surface=new T.Mesh(new T.CircleGeometry(7.02,128),water);surface.rotation.x=-Math.PI/2;surface.position.y=.54;pool.add(surface);
 const inside=new T.Mesh(new T.CircleGeometry(3.54,96),water);inside.rotation.x=-Math.PI/2;inside.position.y=.87;pool.add(inside);
 const joint=mat('#65675e',.94);for(const [r,y] of [[7.25,.838],[3.74,1.108]])for(let i=0;i<64;i++){const a=i*Math.PI/32;const seam=box('池沿分块缝',[Math.cos(a)*r,y,Math.sin(a)*r],[.45,.006,.012],joint,pool);seam.rotation.y=-a;}
 const nozzle=new T.Mesh(new T.TorusGeometry(5.8,.022,6,96),trim);nozzle.rotation.x=-Math.PI/2;nozzle.position.y=.48;pool.add(nozzle);
 // Sports/pool hall: footprint from existing map; field-facing wall details
 // from 2025 photo. Roof/profile/height are not fully visible and are estimates.
 const gym=new T.Group();gym.name='体育泳馆 · 用户定位及实拍局部';gym.position.set(-122.9,0,111.05);group.add(gym);
 box('浅色馆体',[0,6.8,0],[49.3,13.1,62.9],white,gym);box('暂定屋面',[0,13.5,0],[50.5,.35,64],mat('#a6afa9',.82),gym);
 for(const x of [-23,-16,-8,8,16,23])box('立面竖向分缝',[x,7,-31.48],[.1,12.7,.08],trim,gym);
 for(const x of [20,17,14]){box('陶土竖框',[x,8.4,-31.6],[1.65,4.8,.22],brick,gym);box('窄竖向窗带',[x,8.4,-31.74],[.74,4.5,.06],dark,gym);}
 // Approximate the observed terracotta athlete motif as geometry-independent art.
 const mc=document.createElement('canvas');mc.width=512;mc.height=768;const mx=mc.getContext('2d');mx.fillStyle='#bb9985';
 const person=(x,y,a)=>{mx.save();mx.translate(x,y);mx.rotate(a);mx.beginPath();mx.ellipse(0,-95,23,25,0,0,7);mx.fill();mx.lineCap='round';mx.lineWidth=30;mx.strokeStyle='#bb9985';for(const pts of [[[0,-60],[8,15],[-35,120]],[[8,15],[85,65],[130,55]],[[0,-45],[-65,-90],[-125,-110]],[[0,-35],[75,-15],[130,-65]]]){mx.beginPath();pts.forEach((p,i)=>i?mx.lineTo(...p):mx.moveTo(...p));mx.stroke();}mx.restore();};person(220,220,-.6);person(265,430,.4);person(190,615,-.2);
 const mt=new T.CanvasTexture(mc);mt.colorSpace=T.SRGBColorSpace;const mural=new T.Mesh(new T.PlaneGeometry(11,11),new T.MeshStandardMaterial({map:mt,transparent:true,alphaTest:.2,roughness:1}));mural.rotation.y=Math.PI;mural.position.set(-6,7.2,-31.65);mural.name='运动人物图案 · 依据局部照片近似';gym.add(mural);
 for(let i=0;i<24;i++)box('外楼梯踏步',[-26,.3+(i+1)*.19,-28+i*.37],[3.6,.19,.39],white,gym);
 for(const x of [-24.2,-27.8]){pipe('外梯扶手',[x,1.4,-28],[x,5.8,-19.5],.055,white,gym);for(let i=0;i<12;i++)pipe('外梯栏杆',[x,.5+i*.38,-28+i*.74],[x,1.4+i*.38,-28+i*.74],.035,white,gym);}
 for(let x=-24;x<24;x+=4){pipe('檐下网架局部',[x,13.3,-31.6],[x+2,12.7,-31.6],.065,white,gym);pipe('檐下网架局部',[x+2,12.7,-31.6],[x+4,13.3,-31.6],.065,white,gym);}
 gym.userData={identity:'User points to field-side square sports hall; swimming hall may be integrated',exterior:'2025 school sports photo partial wall',roof:'unverified; provisional outline',height:'estimated'};
 return group;
}
