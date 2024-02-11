import { PageEntity } from "@logseq/libs/dist/LSPlugin";
import React from "react";

const WIDTH = 12
const HEIGHT = 6

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

const Note = ({page,graphPath}:NoteProps) => {
  const rawCoverURL = page.properties?.cover || page.properties?.banner || ""

  // replace markdown image path to assert path if it is 
  // to judge if it is a markdown image path like ![xxx](path)
  const propsBanner =  rawCoverURL.startsWith("http") ? rawCoverURL: encodeURI("assets://" + graphPath + processCoverURL(rawCoverURL).replace("..", ""))

  // check is file exist

  const markdown = processMarkdown(page.content)
  return (
    <div className="w-48 whitespace-nowrap rounded-lg cursor-pointer overflow-hidden"
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
      <div className="flex gap-1 w-48 align-middle"
        style={{
          height: '3rem',
          backgroundColor: 'var(--ls-quaternary-background-color)'
        }}
      >
        <div className="my-auto ml-2">{page.properties?.icon || `📄`}</div>
        <div className="my-auto page-ref truncate">{page.originalName || page.page.originalName}</div>
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
