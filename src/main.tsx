import "@logseq/libs";
import { renderToString } from "react-dom/server";
import React from "react";
import "./index.css";

// import { logseq as PL } from "../package.json";
import Gallery from "./Gallery";
import { PageEntity,BlockEntity } from "@logseq/libs/dist/LSPlugin";

async function processPages(pages: (PageEntity | BlockEntity)[]):Promise<(PageEntity)[]> {
  const processedPages = await Promise.all(pages.map(async (page) => {
    if (page.originalName == undefined) {
      return (await logseq.Editor.getPage(page.page.id)) as PageEntity;
    }
    return page as PageEntity;
  }));
  return processedPages;
}

function main() {

  logseq.provideModel({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openPage (e: any) {
      logseq.App.pushState('page',{name:e.dataset.onClickArgs})
    }
   })
   
  logseq.App.onMacroRendererSlotted(async ({ slot, payload}) => {
    const [type,query,title] = payload.arguments

    if (type !== ':gallery') return

    const pages = await logseq.DB.q(query) as PageEntity[] | BlockEntity[]
    const graphPath = (await logseq.App.getCurrentGraph())?.path || "";

    const processPage = (await processPages(pages))
    // reduce duplicated pages
    const processPageSet = new Set(processPage.map((page) => page.id))
    const processPageArray = Array.from(processPageSet).map((id) => processPage.find((page) => page.id === id)) as PageEntity[]

    const html = renderToString(<Gallery pages={processPageArray} graphPath={graphPath} title={title}/>)
    logseq.provideUI({
       key: `gallery-${payload.uuid}-${slot}`,
       slot, 
       reset: true,
       template: html,
    })
  })
}

logseq.ready(main).catch(console.error);
