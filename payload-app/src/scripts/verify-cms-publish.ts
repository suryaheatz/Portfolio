import config from '../../payload.config'
import { getPayload } from 'payload'
const payload=await getPayload({config})

const stripIds = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(stripIds)
  if (v && typeof v === 'object') {
    const out:Record<string, unknown> = {}
    for(const [k,item] of Object.entries(v)) if (k!=='id' && k!=='createdAt' && k!=='updatedAt') out[k]=stripIds(item)
    return out
  }
  return v
}
const inspect=(doc:any)=>({
 blocks:(doc.layout||[]).length,
 linked:(doc.layout||[]).filter((b:any)=>b.blockType==='caseStudyMediaGroup').reduce((n:number,b:any)=>n+(b.images||[]).filter((i:any)=>!!i.media).length,0),
 paths:(doc.layout||[]).filter((b:any)=>b.blockType==='caseStudyMediaGroup').flatMap((b:any)=>(b.images||[]).map((i:any)=>i.sourcePath)).sort()
})
const assertCounts=(label:string,doc:any,blocks:number,linked:number,paths:string[])=>{
 const s=inspect(doc)
 if(s.blocks!==blocks||s.linked!==linked||JSON.stringify(s.paths)!==JSON.stringify(paths))
   throw new Error(label+' failed: '+JSON.stringify({blocks:s.blocks,linked:s.linked,paths:s.paths.length}))
}
const verify=async(id:number,slug:string,blocks:number,linked:number,cloneLayout=false)=>{
 const existing=await payload.findByID({collection:'pages',id,depth:0,overrideAccess:true})
 const source=cloneLayout ? await payload.findByID({collection:'pages',id:1,depth:0,overrideAccess:true}) : existing
 const expected=inspect(source)
 assertCounts('precheck '+slug,source,blocks,linked,expected.paths)
 const layout=cloneLayout ? stripIds(source.layout) : source.layout
 console.log('SK CMS PUBLISH PREFLIGHT',slug,'blocks',blocks,'linked',linked)
 const saved=await payload.update({collection:'pages',id,depth:0,draft:false,overrideAccess:true,
    data:{title:existing.title,layout} as any})
 if(saved.id!==id)throw new Error('ID changed during publish '+slug)
 const reread=await payload.findByID({collection:'pages',id,depth:0,overrideAccess:true})
 assertCounts('post-save '+slug,reread,blocks,linked,expected.paths)
 const listed=await payload.find({collection:'pages',where:{slug:{equals:slug}},depth:0,limit:2,overrideAccess:true})
 if(listed.docs.length!==1)throw new Error('List lookup missing or duplicate '+slug)
 assertCounts('list '+slug,listed.docs[0],blocks,linked,expected.paths)
 console.log('SK CMS PUBLISH VERIFIED',slug,'id',id,'updatedAt',reread.updatedAt)
}
try{
 await verify(4,'cms-rebuilt-centronic',9,20,true)
 await verify(1,'centronic',9,20)
 await verify(2,'haptix',13,55)
 console.log('SK CMS ALL THREE PUBLISH GATES PASSED')
 process.exit(0)
}catch(e){console.error('SK CMS PUBLISH GATE FAILED',e);process.exit(1)}
