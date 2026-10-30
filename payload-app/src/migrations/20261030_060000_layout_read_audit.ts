import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
export async function up({payload}:MigrateUpArgs):Promise<void>{
 const list=await payload.find({collection:'pages',limit:20,depth:0,overrideAccess:true,pagination:false})
 for (const slug of ['centronic','haptix']){
   const doc=list.docs.find(d=>d.slug===slug)
   if(!doc)throw new Error('CMS AUDIT FAILED: page missing from list '+slug)
   const detail=await payload.findByID({collection:'pages',id:doc.id,depth:0,overrideAccess:true})
   const summary={slug,listed:(doc.layout||[]).length,detail:(detail.layout||[]).length,updatedAt:doc.updatedAt}
   payload.logger.info('CMS DOCUMENT READ AUDIT '+JSON.stringify(summary))
   if(summary.detail!== (slug==='centronic'?9:13))throw new Error('CMS AUDIT FAILED: detail block count mismatch '+JSON.stringify(summary))
   if(summary.listed!==summary.detail)throw new Error('CMS AUDIT FAILED: find() and findByID() disagree '+JSON.stringify(summary))
 }
}
export async function down(_args:MigrateDownArgs):Promise<void>{}
