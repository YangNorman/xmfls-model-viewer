export const CAMPUS = './models/campus-sports-20261119.glb';
export const ROOM = './studio/haicang-open-classroom.glb';

// Camera positions are in the coordinate system of the existing campus GLB.
export const places = {
  overview: { name: '校园全景', eye: [365,255,-352], target: [18,-5,-18], fov: 37, image: 'images/tour/campus.jpg' },
  gate: { name: '校门', eye: [175,18,-108], target: [138,6.7,-109], fov: 42, image: 'images/tour/gate.jpg' },
  courtyard: { name: '教学广场', eye: [134,3.6,-95], target: [69,9.8,-85], fov: 53, image: 'images/court-20261119.jpg' },
  pool: { name: '双环水池', eye: [128,8.1,-102], target: [105.5,1.9,-86], fov: 39, image: 'images/tour/pool.jpg' },
  tower: { name: '穹顶楼', eye: [129,24,-164], target: [82,22,-119], fov: 43, image: 'images/final_06.jpg' },
  clock: { name: '钟楼步道', eye: [-28,18,-95], target: [-6,18,-49], fov: 43, image: 'images/final_07.jpg' },
  hall: { name: '礼堂', eye: [180,18,-105], target: [163,5,-66.7], fov: 42, image: 'images/tour/hall.jpg' },
  sports: { name: '运动场', eye: [-334,180,43], target: [-108,6,10], fov: 46, image: 'images/tour/sports.jpg' },
  stand: { name: '主席台', eye: [-140.78,2.05,-33.71], target: [-86.75,6.2,-44.01], fov: 32, image: 'images/tour/stand.jpg' },
  gym: { name: '体育馆', eye: [-125.9,3.5,18.6], target: [-122.9,11.7,82.6], fov: 39, image: 'images/tour/gym.jpg' },
  room: { name: '公开课室', eye: [0,2.05,4.65], target: [0,1.7,-5.2], fov: 58, image: 'studio/images/open-classroom-front.jpg' },
  plan: { name: '总平面', eye: [0,610,.01], target: [0,0,0], fov: 43, image: 'images/tour/plan.jpg' }
};

export const roomViews = [
  places.room,
  {eye:[3.6,1.8,-1.3],target:[-2.7,1.55,-4.8]},
  {eye:[-3.8,1.8,-3.3],target:[2,1.4,2.1]},
  {eye:[.1,1.4,1.1],target:[-1.2,.65,-.3]},
  {eye:[2.5,1.8,1.5],target:[0,1.15,6.3]}
];

export const images = [
  ['校园全景',places.overview.image,'overview'],
  ['校门',places.gate.image,'gate'],
  ['教学广场',places.courtyard.image,'courtyard'],
  ['双环水池',places.pool.image,'pool'],
  ['穹顶楼窗部','images/tour/tower.jpg','tower'],
  ['校训墙与连廊','images/tour/teaching.jpg','courtyard'],
  ['钟楼步道',places.clock.image,'clock'],
  ['礼堂',places.hall.image,'hall'],
  ['运动场',places.sports.image,'sports'],
  ['主席台',places.stand.image,'stand'],
  ['膜顶与灯架','images/tour/stand-under.jpg','stand'],
  ['从中线看主席台','images/tour/midfield.jpg','stand'],
  ['体育馆',places.gym.image,'gym'],
  ['体育馆外梯与挑檐','images/tour/gym-side.jpg','gym'],
  ['教学楼窗部','images/tour/windows.jpg','courtyard'],
  ['穹顶与庭院','images/final_08.jpg','tower'],
  ['教学楼群','images/final_02.jpg','courtyard'],
  ['暮色灯光习作','images/final_08_dusk.jpg','courtyard'],
  ['校园平面',places.plan.image,'plan'],
  ['公开课室 · 教学区',places.room.image,'room'],
  ['公开课室 · 侧墙','studio/images/open-classroom-side.jpg','room'],
  ['公开课室 · 桌椅','studio/images/open-classroom-detail.jpg','room']
];
