# 厦外 · 海沧校园三维展厅

在线查看：https://yangnorman.github.io/xmfls-model-viewer/

支持旋转、缩放、平移、四个预设视角、自动旋转与桌面全屏；手机可使用双指缩放。首次点击加载约 30 MB 的模型。

网页模型来自照片与公开地图辅助重建的海沧校区外观。为适合实时显示，树叶几何和程序材质做了简化；精细光照效果见页面中的九张渲染图。它不是测绘成果或学校官方网站，楼高、部分屋顶、泳馆及绿化仍为近似，未建完整室内。

完整 Blender 源文件、历史版本、参考照片及对照 PDF 保存在所有者的私有 `xmfls-model` 仓库归档中，不随本展示仓库公开。

## 本地浏览

通过静态 HTTP 服务打开本目录（不能直接双击 HTML 加载 GLB）。无需构建步骤。模型查看器、解码器与图像均在仓库内，无需外部 CDN。

## 来源与许可

- 地图数据：© OpenStreetMap contributors，ODbL，https://www.openstreetmap.org/copyright 。对应的坐标与建筑轮廓提取文件位于 `map/haicang-layout-local.json`，沿用 ODbL。
- 渲染环境光与部分材质：Poly Haven，CC0，https://polyhaven.com/ 。网页环境光是 [Kloofendal 48d Partly Cloudy Pure Sky](https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky) 的缩小副本。
- Google `<model-viewer>` 4.4.0：Apache-2.0；分发 bundle 内含第三方许可声明，详见 vendor/model-viewer-LICENSE.txt。
- Draco 1.5.6：Apache-2.0，详见 vendor/draco/LICENSE.txt。
- 本项目不声明拥有学校名称、标识或第三方照片的权利。原始实拍照片和含实拍的 PDF 不包含在此公开仓库中。

公开展示不意味着所有内容都获授任意再分发许可；引用地图和第三方组件时须遵守对应条款。
