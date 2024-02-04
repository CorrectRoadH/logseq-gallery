import "@logseq/libs";
import { renderToString } from "react-dom/server";
import React from "react";
import "./index.css";

import { logseq as PL } from "../package.json";
import Gallery from "./Gallery";
import { PageEntity } from "@logseq/libs/dist/LSPlugin";


const pluginId = PL.id;

function main() {

  logseq.provideModel({
    openPage (e: any) {
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
       key: 'h1-playground',
       slot, 
       template: html,
    })
  })

  console.info(`#${pluginId}: MAIN`);

}

logseq.ready(main).catch(console.error);
