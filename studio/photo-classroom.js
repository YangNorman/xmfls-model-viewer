import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mat,labelTexture} from './materials.js';
// 2026 Haicang open-lesson room, not a generic classroom. Dimensions and
// furniture counts are estimates; observed materials/layout follow the photos.
export function makeClassroom(){
 const room=new T.Group(),cache=new Map();room.name='海沧公开课室 · 照片辅助重建';
 const M={wall:mat('#ece9dc',.94),wood:mat('#ddd3b2',.7,0,'wood'),metal:mat('#d2d4cd',.4,.3),black:mat('#202827',.7),desk:mat('#ddd4b5',.7),floor:mat('#888b88',.96),curtain:mat('#79635d',.98),green:mat('#24483c',.9),pink:mat('#bd8090',.93),paper:mat('#eeeae0')};
 function box(name,p,s,m,r=.008,parent=room){const key=s.join(',')+r;let g=cache.get(key);if(!g){g=r?new RoundedBoxGeometry(...s,2,Math.min(r,...s.map(v=>v/3))):new T.BoxGeometry(...s);cache.set(key,g);}const o=new T.Mesh(g,m);o.name=name;o.position.set(...p);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 function cyl(name,p,r,h,m,parent=room){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,12),m);o.name=name;o.position.set(...p);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 box('灰色座位区地面',[0,-.08,1],[9.3,.16,13.3],M.floor,0);box('前区浅木地面',[0,.008,-4.5],[9.2,.018,2.1],M.wood,0);
 box('前墙',[0,1.8,-5.6],[9.3,3.6,.16],M.wood,0);box('后墙',[0,1.8,7.6],[9.3,3.6,.16],M.wall,0);
 for(const side of [-1,1])box('侧墙',[side*4.6,1.8,1],[.16,3.6,13.3],M.wall,0);
 const seam=mat('#756e59',.98);for(let x=-4.55;x<4.6;x+=.085)box('声学竖缝',[x,1.8,-5.507],[.013,3.5,.012],seam,0);
 // Only visible curtains are reconstructed; hidden window openings are unknown.
 for(const side of [-1,1]){for(let section=0;section<3;section++){const center=-2.8+section*4.1;
  for(let i=0;i<37;i++)box('棕色褶帘',[side*(4.4+.055*Math.cos(i*Math.PI)),1.9,center-1.85+i*.1],[.08,2.9,.11],M.curtain,.025);
  box('浅色墙带',[side*4.42,1.8,center+2.02],[.16,3.5,.2],M.wall,0);}
  const screen=box('侧墙显示器',[side*4.27,2.5,.7],[.13,.65,1.12],M.black,.02);screen.rotation.y=side*.12;
  box('屏幕支架',[side*4.4,2.5,.7],[.3,.07,.09],M.black);}
 box('吊顶',[0,3.6,1],[9.3,.1,13.3],M.wall,0);
 for(let x=-4.5;x<=4.5;x+=.6)box('顶面横格',[x,3.535,1],[.012,.013,13.1],M.metal,0);
 for(let z=-5.4;z<=7.4;z+=.6)box('顶面纵格',[0,3.535,z],[9.1,.013,.012],M.metal,0);
 const glow=new T.MeshStandardMaterial({color:'#f3f5ed',emissive:'#f0f4ed',emissiveIntensity:2.4}),lights=[];
 for(const x of [-3,0,3])for(const z of [-3.9,-.9,2.1,5.1]){box('嵌入方灯',[x,3.525,z],[.55,.016,.55],glow,0);const l=new T.PointLight('#f3f3e8',24,8,2);l.position.set(x,3.2,z);room.add(l);lights.push(l);}
 for(const x of [-2.2,1.8])for(const z of [-3,.4,3.8]){cyl('拾音吊杆',[x,3.25,z],.008,.55,M.metal);cyl('吊装拾音器',[x,2.95,z],.025,.19,M.black);}
 box('板面银框',[0,1.87,-5.36],[6.75,1.83,.09],M.metal,.01);
 for(const x of [-2.2,2.2])box('两侧绿板',[x,1.87,-5.296],[2.18,1.69,.015],M.green,.003);
 const display=new T.MeshStandardMaterial({map:labelTexture(['海沧校区公开课','课堂教学 · 实拍参考重建','2026'],{bg:'#d6e5e4',fg:'#244c51'}),roughness:.7});
 box('中央教学屏',[0,1.87,-5.286],[2.21,1.69,.02],display,.004);box('粉笔槽',[0,.92,-5.22],[6.8,.04,.16],M.metal,.006);
 for(const x of [-3.9,3.9])box('高位音箱',[x,3.12,-5.2],[.55,.38,.3],M.black,.02);
 box('云台底座',[0,2.92,-5.27],[.23,.06,.16],M.metal);cyl('板上摄像机',[0,3.04,-5.26],.075,.18,M.black);box('前左摄像机',[-4.03,2.7,-5.29],[.16,.25,.16],M.black,.025);
 box('前左柜式空调',[-4.04,1,-4.95],[.56,2,.39],mat('#dad7bd',.65),.03);for(let y=1.4;y<1.9;y+=.055)box('柜机风口',[-4.04,y,-4.745],[.43,.012,.01],M.black,0);
 box('教师控制台',[-3.13,.55,-4.15],[1.55,1.1,.75],M.desk,.035);box('控制台桌面',[-3.13,1.13,-4.15],[1.63,.05,.82],M.desk,.018);box('控制台显示器',[-3.1,1.36,-4.18],[.51,.3,.035],M.black,.01);
 box('活动绿板框',[3.72,1.72,-3.8],[1.2,1.45,.07],M.metal);box('活动绿板',[3.72,1.72,-3.75],[1.1,1.35,.014],M.green,.003);
 for(const x of [3.25,4.19]){box('活动板支脚',[x,.48,-3.8],[.04,.96,.04],M.metal);box('活动板底脚',[x,.07,-3.8],[.055,.05,.6],M.metal);}
 const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const ctx=canvas.getContext('2d');ctx.fillStyle='#202827';ctx.fillRect(0,0,64,64);ctx.fillStyle='#77817a';for(let x=0;x<64;x+=4)for(let y=0;y<64;y+=4)ctx.fillRect(x,y,2,2);const mt=new T.CanvasTexture(canvas);mt.colorSpace=T.SRGBColorSpace;const net=new T.MeshStandardMaterial({map:mt,color:'#515a54',roughness:.92});
 const table=new T.Group();table.name='带脚轮长桌与独立网背椅';box('浅色长桌面',[0,.77,0],[1.45,.035,.53],M.desk,.012,table);box('桌前挡板',[0,.48,-.19],[1.25,.43,.025],M.desk,.008,table);
 for(const x of [-.59,.59]){box('T形桌腿',[x,.38,0],[.05,.73,.055],M.metal,.01,table);box('T形底脚',[x,.08,0],[.07,.05,.5],M.metal,.01,table);for(const z of [-.2,.2]){const wheel=cyl('桌脚轮',[x,.045,z],.04,.04,M.black,table);wheel.rotation.z=Math.PI/2;}}
 for(const x of [-.36,.36]){box('黑椅座面',[x,.44,.68],[.43,.055,.42],M.black,.035,table);box('网背外框',[x,.73,.87],[.46,.43,.045],M.black,.025,table);box('网背',[x,.73,.843],[.39,.34,.006],net,.01,table);box('网背外侧',[x,.73,.897],[.39,.34,.006],net,.01,table);for(const dx of [-.17,.17])for(const z of [.53,.83])box('椅腿',[x+dx,.22,z],[.027,.44,.027],M.black,.006,table);}
 for(let row=0;row<5;row++)for(const x of [-2.9,-1.3,2]){const t=table.clone(true);t.position.set(x,0,-2.8+row*1.35);room.add(t);if(row%2===0)box('课堂纸张',[x,.793,t.position.z],[.3,.006,.21],M.paper,.001);}
 for(let row=0;row<2;row++)for(let i=0;i<7;i++){const x=-3.3+i*1.05,z=5.3+row*.9;box('后排粉色座面',[x,.46,z],[.6,.12,.48],M.pink,.045);box('后排粉色椅背',[x,.85,z+.24],[.62,.65,.1],M.pink,.04);for(const dx of [-.2,.2])box('观察席支脚',[x+dx,.25,z],[.045,.5,.04],M.metal);}
 room.userData={type:'2026 Haicang open-lesson room',dimensions:'estimated',seat_count:'illustrative',sources:'Chinese/English open-lesson photos; official index with publicly reposted image carrier'};
 return {group:room,lights,presets:[{name:'后排看讲台',position:[0,2.05,4.65],target:[0,1.7,-5.2]},{name:'左侧教学区',position:[3.6,1.8,-1.3],target:[-2.7,1.55,-4.8]},{name:'侧墙与桌椅',position:[-3.8,1.8,-3.3],target:[2,1.4,2.1]},{name:'桌椅细节',position:[.1,1.4,1.1],target:[-1.2,.65,-.3]},{name:'后排观察席',position:[2.5,1.8,1.5],target:[0,1.15,6.3]}]};
}
