# Logseq Gallery

## Features
一个 Logseq 插件，给 page query 的结果提供 Gallery 视图。就像 Notion 一样。

![](./imgs/screenshot-1.png)

## Roadmap
- [x] Display Tags under title
- [x] Support generate cover from content
- [ ] Add generate cover from PDF files
- [ ] Support into editor mode when click the space of gallery
- [ ] Display the result of block query as a gallery

## 用例
```
{{renderer :gallery, <page query>, <title>}}
```
比如
```
{{renderer :gallery, (page-property tag area), Area}}
```

Support property Field
| Function | Field | Example |
| -- | -- | -- |
| Cover | `cover` | `cover:: ../assets/IMG_2694_1706277077580_0.jpeg`  |
| Banner | `banner` | `banner:: ![untitle](../assets/IMG_2694_1706277077580_0.jpeg)`|
| Icon | `icon` | `icon:: 💻` | 
| Tags | `tags` | `tags:: Computer, Operating System, MIT, RISC-V` |


**注意**
`cover` 和 `banner` 是同时支持 `../assets/IMG_2694_1706277077580_0.jpeg` 和 `![untitle](../assets/IMG_2694_1706277077580_0.jpeg)` 还有 `http(s)://xxx/xxx` 的语法.

如果covert和banner都为空，那么封面将会是 Markdown 渲染内容的结果。
