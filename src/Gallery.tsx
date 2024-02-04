import { PageEntity } from "@logseq/libs/dist/LSPlugin";
import React from "react";


function processCoverURL(rawCoverURL: string): string {
  const markdownImageRegex = /!\[.*\]\((.*)\)/;
  const matches = rawCoverURL.match(markdownImageRegex);
  if (matches && matches.length > 1) {
      return matches[1];
  }
  return rawCoverURL;
}

interface NoteProps {
  page: PageEntity
  graphPath:string
}
const Note = ({page,graphPath}:NoteProps) => {

  const rawCoverURL = page.properties?.cover || page.properties?.banner

  // replace markdown image path to assert path if it is 
  // to judge if it is a markdown image path like ![xxx](path)

  const propsBanner =  encodeURI("assets://" + graphPath + processCoverURL(rawCoverURL).replace("..", ""))

  return (
    <div className="w-48 whitespace-nowrap rounded-lg cursor-pointer overflow-hidden"
      data-on-click="openPage"
      data-on-click-args={page.name}
    >
      <div className="flex flex-col align-middle justify-center overflow-hidden bg-black"
        style={{
          height: '6rem',
        }}
      >
        <img 
          style={{objectFit: "fill"}}
          alt={page.name}
          src={propsBanner} />
        </div>
      <div className="flex w-48 align-middle"
        style={{
          height: '3rem',
          backgroundColor: 'var(--ls-quaternary-background-color)'
        }}
      >
        <div className="m-auto page-ref">{page.name}</div>
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
      </div>
    </main>
  );
  
}

export default Gallery;
