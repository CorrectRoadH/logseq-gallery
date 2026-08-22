import type { PageEntity } from "@logseq/libs/dist/LSPlugin";
import React from "react";

const WIDTH = 15
const HEIGHT = 8

function stringToDarkerColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // 限制颜色的亮度和饱和度
  let color = '#';
  for (let i = 0; i < 3; i++) {
    // 使用位运算确保颜色值不会太高，以生成较暗的颜色
    const value = (hash >> (i * 8)) & 0xFF;
    // 通过减小颜色值的范围来确保颜色较暗
    const darkValue = Math.floor((value % 128) + 64).toString(16); // 限制在64-192之间以确保颜色不会太亮
    color += (darkValue.length < 2 ? '0' : '') + darkValue;
  }
  return color;
}

// 示例

function processCoverURL(rawCoverURL: string): string {
  rawCoverURL = String(rawCoverURL).trim();
  
  const markdownImageRegex = /!\[.*\]\((.*)\)/;
  const matches = rawCoverURL.match(markdownImageRegex);
  if (matches && matches.length > 1) {
      return matches[1];
  }
  return rawCoverURL;
}
import Markdown from 'react-markdown'

interface NoteProps {
  page: PageEntity
  graphPath:string
}

const processMarkdown = (markdown:string|undefined) => {
  if (!markdown) {
    return markdown
  }
  // remove all xx:: xx
  const propsRegex = /.*::.*/
  while (markdown.match(propsRegex)) {
    markdown = markdown.replace(propsRegex, "")
  }

  // // remove -
  // markdown = markdown.replaceAll("- ", "")


  return markdown
}

const Tag = ({tag}:{tag:string}) => {
  const color = stringToDarkerColor(tag)
  return (
    <div
      className="rounded-sm p-1 text-xs text-white"
      style={{      
        backgroundColor: color,      
      }}
    >{tag}</div>
  )
}


const Note = ({page,graphPath}:NoteProps) => {
  const rawCoverURL = page.properties?.cover || page.properties?.banner || ""

  // replace markdown image path to assert path if it is 
  // to judge if it is a markdown image path like ![xxx](path)
  const propsBanner =  rawCoverURL.startsWith("http") ? rawCoverURL: encodeURI("assets://" + processCoverURL(rawCoverURL).replace("..", ""))

  // check is file exist

  const markdown = processMarkdown(page.content)
  return (
    <div className="whitespace-nowrap rounded-lg cursor-pointer overflow-hidden"
      style={{
        width: `${WIDTH}rem`,
      }}
      data-on-click="openPage"
      data-on-click-args={page.name}
    >
      <div className="relative flex flex-col align-middle justify-center overflow-hidden"
        style={{
          height: `${HEIGHT}rem`,
          width: `${WIDTH}rem`,
          backgroundColor: 'var(--ls-tertiary-background-color)'
        }}
      >
        {
          rawCoverURL && 
          <img 
            style={{
              objectFit: "cover",
              height: `${HEIGHT}rem`,
              width: `${WIDTH}rem`,
            }}
            alt={page.name}
            src={propsBanner} 
          />
        }
        {
          !rawCoverURL && markdown && (
            <div
              style={{ 
                position: 'absolute',
                height: `${HEIGHT/0.4}rem`,
                width: `${WIDTH/0.4}rem`,
                top: '0',
                margin: '2px',
                transform: `scale(0.4)`,
                transformOrigin: 'left top',
              }}
            >
              <Markdown>{markdown}</Markdown>
            </div>
          )
        }
        {
          !rawCoverURL && !markdown && 
            <div className="m-auto"
              style={{
                color: 'var(--ls-quaternary-text-color)',
              }}
            >No Cover</div>
        }
      </div>
      <div 
        className="flex flex-col h-full p-2 rounded-b-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--ls-quaternary-background-color)'
        }}
      > 
        <div className="flex gap-1">
          <div className="my-auto">{page.properties?.icon || `📄`}</div>
          <div className="my-auto page-ref truncate">{page.originalName || page.page.originalName}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {
            page.properties && page.properties.tags && Array.isArray(page.properties.tags) && page.properties.tags.length > 0 ? (
              page.properties.tags.map((tag: string) => (
                <Tag key={tag} tag={tag} />
              ))
            ) : (
              <div></div>
            )
          }
        </div>
      </div>
    </div>
  )
}

interface GalleryProps {
  pages: PageEntity[]
  graphPath:string
  title: string
}
function Gallery({pages,graphPath,title}:GalleryProps) {
  return (
    <main>
      <h3>{title}</h3>
      <div className="flex gap-4 flex-wrap">
        {
          pages.map((page) => 
            <Note 
              key={page.id}
              page={page}
              graphPath={graphPath}
            />)
        }
        {/* click here in to edit */}
        {
          pages.length === 0 && <div>There is nothing</div>
        }
      </div>
    </main>
  );
  
}

export default Gallery;
