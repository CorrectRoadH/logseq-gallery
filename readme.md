# Logseq Gallery

## Features
Offering gallery view for result of page query in Logseq. like Notion.

![](./imgs/screenshot-1.png)

## Roadmap
- [] Display Tags under title
- [] Support generate cover from content
- [] Add generate cover from PDF files
- [] Support into editor mode when click the space of gallery
- [] Support support https url image as cover

## Usage
```
{{renderer :gallery, <page query>, <title>}}
```
Support property Field
| Function | Field | Example |
| -- | -- | -- |
| Cover | `cover` | `cover:: ../assets/IMG_2694_1706277077580_0.jpeg`  |
| Banner | `banner` | `banner:: ![untitle](../assets/IMG_2694_1706277077580_0.jpeg)`|
| Icon | `icon` | `icon:: 💻` |  

**Note**
`cover` and `banner` are both support `../assets/IMG_2694_1706277077580_0.jpeg` and  `![untitle](../assets/IMG_2694_1706277077580_0.jpeg)`.
