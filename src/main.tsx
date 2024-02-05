import "@logseq/libs";
import { renderToString } from "react-dom/server";
import React from "react";
import "./index.css";

// import { logseq as PL } from "../package.json";
import Gallery from "./Gallery";
import { PageEntity } from "@logseq/libs/dist/LSPlugin";

function main() {

  logseq.provideModel({
    openPage (e: any) {
      console.info(e)
      logseq.App.pushState('page',{name:e.dataset.onClickArgs})
    }
   })
   
  logseq.App.onMacroRendererSlotted(async ({ slot, payload}) => {
    const [type,query,title] = payload.arguments

    if (type !== ':gallery') return

    const pages = await logseq.DB.q(query) as PageEntity[]
    const graphPath = (await logseq.App.getCurrentGraph())?.path || "";

    const html = renderToString(<Gallery pages={pages} graphPath={graphPath} title={title}/>)
    logseq.provideUI({
       key: `gallery-${payload.uuid}-${slot}`,
       slot, 
       template: html,
    })
  })
}

logseq.ready(main).catch(console.error);
