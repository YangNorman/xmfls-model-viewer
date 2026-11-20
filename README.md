# 厦门外国语学校 · 海沧校区

打开[校园导览](https://yangnorman.github.io/xmfls-model-viewer/)，可直接进入[主席台](https://yangnorman.github.io/xmfls-model-viewer/#stand)、[体育馆](https://yangnorman.github.io/xmfls-model-viewer/#gym)或[运动场](https://yangnorman.github.io/xmfls-model-viewer/#sports)。

默认打开校园全景。选择地点可切换相机，选择公开课室可进入室内并切换座位视角。拖动旋转、滚轮或双指缩放，右下角提供平移、缩放、复位和全屏。右上角可以浏览效果图、保存画面和下载当前模型。

“影片教室”先选《Another Day of Sun》的自习、云朵、星夜或乐队陈设，再选对应镜头。自习含 49 天与 48 天两个状态，星夜含日景与暗场。庭园小景中可独立查看竹子林、木饰廊和三翼雕塑。效果图可以跳回相同的三维视角，带有片源的镜头可以打开对应影片时间点。

校门、广场、主席台和体育馆等地点共用一份校园模型。已有的 `studio/` 和 `study/` 地址会转到校园导览。用静态 HTTP 服务托管本目录即可本地预览，模型、纹理与依赖均随目录提供。

校门提供正面、门额斜视、从广场回望三个视角。教学广场可查看“進德修業”山墙、孔子像与花坛。“校训墙与花坛 · 修订对照”的效果图可并排查看同机位的修订前后渲染。

## 来源与许可

- 地图数据：© OpenStreetMap contributors，ODbL，https://www.openstreetmap.org/copyright 。对应的坐标与建筑轮廓提取文件位于 `map/haicang-layout-local.json`，沿用 ODbL。
- 渲染环境光与部分材质：Poly Haven，CC0，https://polyhaven.com/ 。网页环境光是 [Kloofendal 48d Partly Cloudy Pure Sky](https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky) 的缩小副本。
- Google `<model-viewer>` 4.4.0，Apache-2.0。随附版本在 GLTFLoader 建立 GPU 实例时传递原始图元的关联信息，供材质查询使用。第三方声明见 vendor/model-viewer-LICENSE.txt。
- Draco 1.5.6：Apache-2.0，详见 vendor/draco/LICENSE.txt。
- 星夜教室的喷绘参照梵高《星月夜》的公版复制图，按影片重新估计裁切与印色。[复制图来源与许可](https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg)
- 本项目不声明拥有学校名称、标识或第三方照片的权利。原始实拍照片和含实拍的 PDF 不包含在此公开仓库中。

公开展示不意味着所有内容都获授任意再分发许可；引用地图和第三方组件时须遵守对应条款。
