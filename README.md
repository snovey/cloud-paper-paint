# cloud-paper-paint
cloud-paper 画板

`papaer_render` 具有基础的渲染方法。

`lib.js` 中有 `DrawInfo` 类，存储信息。

`paper_writter` 与 `paper_reader` 分别代表读者与写者，继承自 `papaer_render`。

接口已按照要求重新整理，`writter` 的消息通过 `callback` 进行 `dispatch` 传入 `reader` 内部。

目前只具有画线，橡皮，矩形，椭圆，清空的基础功能。清空是在外部绑定的数据。

打开 html 文件就可以直接体验了。

将来还有很多功能待补充。
