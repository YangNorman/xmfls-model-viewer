import { CAMPUS, reconstruction } from './reconstruction.js?v=forecourt-20261120';
export { CAMPUS };
export const ROOM = './studio/haicang-open-classroom.glb';

// Camera positions are in the coordinate system of the existing campus GLB.
export const places = {
  overview: { name: '校园全景', eye: [365,255,-352], target: [18,-5,-18], fov: 37, image: 'images/haicang-20261120/overview.jpg' },
  gate: { ...reconstruction.gate[0], name: '校门' },
  courtyard: { ...reconstruction.courtyard[0], name: '教学广场' },
  pool: { name: '双环水池', eye: [128,8.1,-102], target: [105.5,1.9,-86], fov: 39, image: 'images/haicang-20261120/pool.jpg' },
  tower: { name: '穹顶楼', eye: [129,24,-164], target: [82,22,-119], fov: 43, image: 'images/haicang-20261120/tower.jpg' },
  clock: { name: '钟楼步道', eye: [-28,18,-95], target: [-6,18,-49], fov: 43, image: 'images/final_07.jpg' },
  hall: { name: '礼堂', eye: [180,18,-105], target: [163,5,-66.7], fov: 42, image: 'images/tour/hall.jpg' },
  sports: { name: '运动场', eye: [-334,180,43], target: [-108,6,10], fov: 46, image: 'images/haicang-20261120/sports.jpg' },
  stand: { ...reconstruction.stand[0], name: '主席台' },
  gym: { ...reconstruction.gym[0], name: '体育馆' },
  film: { ...reconstruction.film[0], name: '影片教室' },
  room: { name: '公开课室', eye: [0,2.05,4.65], target: [0,1.7,-5.2], fov: 58, image: 'studio/images/open-classroom-front.jpg' },
  garden: { ...reconstruction.garden[0], name: '庭园小景' },
  plan: { name: '总平面', eye: [0,610,.01], target: [0,0,0], fov: 43, image: 'images/haicang-20261120/plan.jpg' }
};

export const roomViews = [
  places.room,
  {eye:[3.6,1.8,-1.3],target:[-2.7,1.55,-4.8]},
  {eye:[-3.8,1.8,-3.3],target:[2,1.4,2.1]},
  {eye:[.1,1.4,1.1],target:[-1.2,.65,-.3]},
  {eye:[2.5,1.8,1.5],target:[0,1.15,6.3]}
];

export const viewOptions = {
  ...reconstruction,
  room: roomViews.map((pose,i)=>({...pose,id:'room-'+(i+1),file:ROOM,label:['后排看讲台','左侧教学区','侧墙与桌椅','桌椅细节','后排观察席'][i]})),
  courtyard: reconstruction.courtyard.filter(v=>v.id!=='plaza-round'),
  hall: [reconstruction.courtyard.find(v=>v.id==='plaza-round'),{...places.hall,id:'outside',label:'礼堂全景'}]
};

export const images = [
  ['校园全景',places.overview.image,'overview'],
  ['双环水池',places.pool.image,'pool'],
  ['穹顶楼',places.tower.image,'tower'],
  ['钟楼步道',places.clock.image,'clock'],
  ['运动场',places.sports.image,'sports'],
  ...['gate','courtyard','stand','gym','film','garden','hall'].flatMap(id=>(viewOptions[id]||[]).map(v=>[
    [v.family || places[id].name,v.label].join(' · '),v.image,id,v.id])),
  ['教学楼窗部','images/tour/windows.jpg','courtyard'],
  ['校园平面',places.plan.image,'plan'],
  ['公开课室 · 教学区',places.room.image,'room','room-1'],
  ['公开课室 · 侧墙','studio/images/open-classroom-side.jpg','room','room-2'],
  ['公开课室 · 桌椅','studio/images/open-classroom-detail.jpg','room','room-4']
];
