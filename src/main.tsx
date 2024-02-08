import "@logseq/libs";
import { renderToString } from "react-dom/server";
import React from "react";
import "./index.css";

// import { logseq as PL } from "../package.json";
import Gallery from "./Gallery";
import { PageEntity,BlockEntity } from "@logseq/libs/dist/LSPlugin";

async function processPages(pages: (PageEntity | BlockEntity)[]) {
  const processedPages = await Promise.all(pages.map(async (page) => {
    if (page.content != undefined) {
      return (await logseq.Editor.getPage(page.page.id)) || page;
    }
    return page;
  }));
  return processedPages as PageEntity[]; // 返回的是 PageEntity[]
}

function main() {

  logseq.provideModel({
    // @ts-ignore
    openPage (e: any) {
      console.info(e)
      logseq.App.pushState('page',{name:e.dataset.onClickArgs})
    }
   })
   
  logseq.App.onMacroRendererSlotted(async ({ slot, payload}) => {
    const [type,query,title] = payload.arguments

    if (type !== ':gallery') return

    const pages = await logseq.DB.q(query) as PageEntity[] | BlockEntity[]
    console.log(await logseq.DB.q(query))
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
