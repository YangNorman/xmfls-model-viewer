import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mat,labelTexture} from './materials.js';
export function makeClassroom(){
 const room=new T.Group();room.name='海沧 · 日光教室 / Concept classroom';
 const materials={oak:mat('#ffffff',.48,0,'wood'),wall:mat('#ffffff',.94,0,'plaster'),green:mat('#34554c',.56),frame:mat('#2a3c35',.32,.65),white:mat('#f2f0e7',.65),black:mat('#172923',.8),fabric:mat('#bba780',.96),paper:mat('#e5dfc9',.85)};
 const geoCache=new Map();
 function box(name,pos,size,m,r=.018,parent=room){const key=size.join(',')+r;let geo=geoCache.get(key);if(!geo){geo=r?new RoundedBoxGeometry(...size,2,Math.min(r,...size.map(v=>v/3))):new T.BoxGeometry(...size);geoCache.set(key,geo);}const o=new T.Mesh(geo,m);o.name=name;o.position.set(...pos);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 function cyl(name,pos,r,h,m,parent=room){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,16),m);o.name=name;o.position.set(...pos);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 // Architectural shell: actual window openings admit the directional sunlight.
 const floorMat=materials.oak.clone();floorMat.map=materials.oak.map.clone();floorMat.map.repeat.set(4,4);floorMat.bumpMap=floorMat.map;
 box('Oak floor',[0,-.09,0],[9.3,.18,11.3],floorMat,0);
 box('Front plaster wall',[0,1.8,-5.6],[9.3,3.6,.18],materials.wall,0);
 box('Rear plaster wall',[0,1.8,5.6],[9.3,3.6,.18],materials.wall,0);
 box('East wall',[4.6,1.8,0],[.18,3.6,11.3],materials.wall,0);
 // Closed classroom entrance, recessed visually against the corridor-side wall.
 box('Door leaf',[4.47,1.14,-3.5],[.07,2.28,1.12],materials.oak,.015);
 for(const z of [-4.09,-2.91])box('Door jamb',[4.42,1.18,z],[.12,2.36,.075],materials.frame,.008);
 box('Door header',[4.42,2.36,-3.5],[.12,.075,1.25],materials.frame,.008);
 box('Door vision panel',[4.42,1.73,-3.5],[.012,.64,.36],materials.frame,.01);
 box('Door handle',[4.35,1.06,-3.07],[.12,.035,.14],materials.frame,.012);
 box('Window sill wall',[-4.6,.48,0],[.18,.96,11.3],materials.wall,0);
 box('Window lintel',[-4.6,3.4,0],[.18,.4,11.3],materials.wall,0);
 for(const x of [-4.48,4.48])box('Skirting',[x,.07,0],[.08,.14,11.2],materials.oak,.008);
 for(const z of [-5.48,5.48])box('Skirting',[0,.07,z],[9,.14,.08],materials.oak,.008);
 for(let z=-5.5;z<=5.5;z+=2.2){box('Window pier',[-4.6,2.08,z],[.21,2.24,.18],materials.wall,.01);box('Bronze mullion',[-4.59,2.08,z+1.1],[.1,2.24,.055],materials.frame,.005);}
 for(const y of [1,2.8,3.18])box('Window transom',[-4.58,y,0],[.09,.065,11.05],materials.frame,.005);
 const glass=new T.MeshPhysicalMaterial({color:'#c4d9cf',transparent:true,opacity:.12,roughness:.08,metalness:.1,depthWrite:false,side:T.DoubleSide});
 const glazing=box('Clear window glass',[-4.6,2.08,0],[.018,2.15,11.02],glass,0);glazing.castShadow=false;
 box('Continuous oak sill',[-4.45,.99,0],[.5,.07,11.1],materials.oak,.015);
 // Acoustic ceiling and suspended linear luminaires.
 box('Ceiling',[0,3.68,0],[9.3,.16,11.3],materials.wall,0);
 for(let z=-5;z<=5;z+=.5)box('Acoustic ceiling slat',[0,3.54,z],[9.1,.1,.045],materials.oak,.008);
 const glow=new T.MeshStandardMaterial({color:'#fff4db',emissive:'#ffe8b7',emissiveIntensity:2.1});
 const lights=[];
 for(const x of [-2,2])for(const z of [-3,0,3]){box('Pendant frame',[x,3.22,z],[2.1,.07,.23],materials.frame);box('Pendant diffuser',[x,3.175,z],[2.04,.012,.18],glow,.004);for(const dx of [-.85,.85])cyl('Pendant cable',[x+dx,3.4,z],.006,.37,materials.frame);const l=new T.PointLight('#ffe8bc',9,5,2);l.position.set(x,3,z);room.add(l);lights.push(l);}
 // Teaching wall: oak acoustic backing, green board, narrow chalk tray.
 box('Board oak backing',[0,1.86,-5.43],[6.5,2.5,.1],materials.oak);
 for(let x=-3.15;x<=3.15;x+=.13)box('Board acoustic slat',[x,1.86,-5.35],[.07,2.42,.04],materials.oak,.004);
 box('Board frame',[0,2,-5.25],[5.25,1.85,.1],materials.frame);
 const chalk=new T.MeshStandardMaterial({map:labelTexture(['一起，看见更大的世界','LANGUAGE  ·  CULTURE  ·  CURIOSITY','Explore.  Connect.  Create.']),roughness:.92});
 box('Teaching chalkboard',[0,2,-5.186],[5.12,1.71,.012],chalk,.003);
 box('Chalk tray',[0,1.09,-5.1],[5.3,.045,.16],materials.frame,.008);
 for(let i=0;i<3;i++)box('Chalk',[1.7+i*.12,1.12,-5.09],[.07,.014,.014],materials.paper,.004);
 box('Teacher podium',[.8,.46,-4.37],[1.8,.9,.67],materials.green,.04);box('Teacher oak top',[.8,.94,-4.35],[1.95,.07,.8],materials.oak,.025);
 // Twenty individual student workstations with bag hooks and storage trays.
 const desk=new T.Group();desk.name='Student workstation';
 box('Oak desktop',[0,.76,0],[1.22,.055,.62],materials.oak,.028,desk);
 box('Underdesk shelf',[0,.53,.01],[1.02,.025,.46],materials.green,.012,desk);
 for(const x of [-.49,.49])for(const z of [-.21,.21]){box('Steel desk leg',[x,.36,z],[.032,.72,.032],materials.frame,.007,desk);box('Desk foot cap',[x,.025,z],[.045,.05,.045],materials.black,.008,desk);}
 box('Desk brace',[0,.21,.2],[1,.025,.025],materials.frame,.005,desk);
 box('Seat',[0,.43,.77],[.43,.065,.43],materials.green,.035,desk);
 const back=box('Chair back',[0,.71,.98],[.43,.36,.045],materials.oak,.035,desk);back.rotation.x=-.1;
 for(const x of [-.16,.16])for(const z of [.62,.92])box('Chair legs',[x,.215,z],[.026,.43,.026],materials.frame,.006,desk);
 for(const x of [-.17,.17])box('Back uprights',[x,.64,.96],[.024,.45,.024],materials.frame,.005,desk);
 for(let row=0;row<5;row++)for(let col=0;col<4;col++){
  const item=desk.clone(true);item.position.set(-2.8+col*1.86,0,-2.85+row*1.48);room.add(item);
  if((row+col)%3===0){const x=item.position.x,z=item.position.z;const cover=mat(['#b05e41','#54756d','#c1a66b'][(row+col)%3],.8);const book=box('Student notebook',[x-.18,.806,z-.05],[.29,.023,.2],cover,.007);book.rotation.y=.12;box('Notebook pages',[x-.18,.818,z-.05],[.276,.007,.187],materials.paper,.002);cyl('Pencil cup',[x+.38,.84,z-.14],.035,.12,materials.green);}
 }
 // Rear book wall, exhibition pinboard, and an upholstered reading bench.
 box('Library backing',[0,1.1,5.43],[5.9,2.1,.12],materials.oak);
 for(const y of [.15,.65,1.15,1.65,2.15])box('Library shelf',[0,y,5.2],[6,.045,.5],materials.oak);
 for(const x of [-3,-1,1,3])box('Library divider',[x,1.15,5.2],[.045,2.05,.5],materials.oak);
 const bookMats=['#425c52','#a55c44','#b49c70','#d7c8aa','#758c90'].map(c=>mat(c,.82));
 for(let shelf=0;shelf<4;shelf++)for(let i=0;i<24;i++){const h=.22+(i%4)*.04;const b=box('Library book',[-2.8+i*.22,.18+shelf*.5+h/2,5.19],[.065+(i%2)*.015,h,.25],bookMats[(i+shelf)%5],.003);b.rotation.z=i%8===0?.16:0;}
 box('Reading bench',[3.8,.25,3.9],[1.1,.5,2],materials.oak,.04);box('Bench cushion',[3.8,.56,3.9],[1.07,.15,1.96],materials.fabric,.06);
 const pin=new T.MeshStandardMaterial({map:labelTexture(['OUR WORLD','语言，让世界相遇','READ  /  THINK  /  SHARE'],{bg:'#c0aa7d',fg:'#354b40'}),roughness:.9});
 const panel=box('Notice board',[4.48,2.1,1.6],[.08,1.35,2.7],pin,.015);
 // Round analog clock on front wall.
 const clock=cyl('Clock',[3.7,2.8,-5.42],.27,.06,materials.white);clock.rotation.x=Math.PI/2;
 for(let i=0;i<12;i++){const a=i*Math.PI/6;const tick=box('Clock tick',[3.7+Math.sin(a)*.22,2.8+Math.cos(a)*.22,-5.37],[.018,.045,.01],materials.frame,.002);tick.rotation.z=-a;}
 const h=box('Hour hand',[3.65,2.84,-5.36],[.02,.15,.01],materials.frame,.002);h.rotation.z=.9;
 const minute=box('Minute hand',[3.78,2.87,-5.35],[.016,.23,.01],materials.frame,.002);minute.rotation.z=-.9;
 // Potted plants, with individually oriented leaves.
 function plant(x,z,scale=1){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(scale);room.add(g);cyl('Terracotta planter',[0,.22,0],.23,.44,mat('#b7845f'),g);cyl('Soil',[0,.445,0],.2,.015,mat('#39382a'),g);
  const leafMat=mat('#4d6e42',.75);for(let i=0;i<18;i++){const a=i*2.4,y=.6+(i%6)*.14;const stem=cyl('Plant stem',[Math.sin(a)*.08,y/2+.43,Math.cos(a)*.08],.008,y,materials.green,g);const leaf=new T.Mesh(new T.SphereGeometry(1,10,7),leafMat);leaf.position.set(Math.sin(a)*.22,y+.4,Math.cos(a)*.22);leaf.scale.set(.1,.018,.28);leaf.rotation.set(.5,a,.3);leaf.castShadow=true;g.add(leaf);}}
 plant(-3.85,-4.7,1.25);plant(3.8,-4.8,.9);plant(-3.8,4.6,1.4);
 // Outside planting is scenery only, not a claim about this room's location.
 const outdoor=mat('#6d875d',.95);box('Outside ground',[-13,-.2,0],[17,.2,35],mat('#a8af8b'),0);
 for(let i=0;i<7;i++){const x=-13-(i%2)*2,z=-12+i*4;cyl('Outside trunk',[x,1.4,z],.12,2.8,mat('#6d6451'));for(let k=0;k<14;k++){const a=k*2.4;const tree=new T.Mesh(new T.IcosahedronGeometry(.65+(k%3)*.13,2),outdoor);tree.position.set(x+Math.cos(a)*1.1,2.7+(k%4)*.3,z+Math.sin(a)*1.1);tree.scale.y=.8;tree.castShadow=true;room.add(tree);}}
 room.userData={design:'Concept classroom, not a measured reconstruction',seats:20,width_m:9.2,length_m:11.2,ceiling_m:3.6};
 return {group:room,lights,presets:[
  {name:'后排全景',position:[3.7,2.15,4.75],target:[-.5,1.4,-2.8]},
  {name:'窗边日光',position:[-3.7,1.75,3.8],target:[1,1.25,-2.8]},
  {name:'讲台回望',position:[2.8,1.85,-4.55],target:[-.2,1.3,2.8]},
  {name:'课桌细节',position:[1.25,1.45,.7],target:[.92,.6,-1.1]},
  {name:'书墙一角',position:[-2.9,1.7,2.9],target:[1.1,1.3,5.2]},
 ]};
}
