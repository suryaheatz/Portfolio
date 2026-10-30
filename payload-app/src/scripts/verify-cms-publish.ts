import config from '../../payload.config'
import { getPayload } from 'payload'
const payload=await getPayload({config})
const check=(d:any)=>({
 blocks:(d.layout||[]).length,
 linked:(d.layout||[]).filter((b:any)=>b.blockType==='caseStudyMediaGroup').reduce((sum:number,b:any)=>sum+(b.images||[]).filter((i:any)=>!!i.media).length,0),
})
const attempt=async(id:number,slug:string,blocks:number,linked:number)=>{
 const before=await payload.findByID({collection:'pages',id,depth:0,overrideAccess:true})
 if(before.slug!==slug)throw new Error('ID/slug mismatch '+slug)
 const a=check(before)
 if(a.blocks!==blocks||a.linked!==linked)throw new Error('Pre-save count mismatch '+slug+' '+JSON.stringify(a))
 console.log('SK GATE PRECHECK',slug,JSON.stringify(a))
 const saved=await payload.update({collection:'pages',id,depth:0,draft:false,overrideAccess:true,data:{title:before.title} as any})
 if(saved.id!==id)throw new Error('Wrong returned id '+slug)
 const after=await payload.findByID({collection:'pages',id,depth:0,overrideAccess:true})
 const b=check(after)
 if(b.blocks!==blocks||b.linked!==linked||after.title!==before.title)throw new Error('Save/readback mismatch '+slug+' '+JSON.stringify(b))
 const list=await payload.find({collection:'pages',where:{slug:{equals:slug}},limit:2,depth:0,overrideAccess:true})
 if(list.docs.length!==1||check(list.docs[0]).blocks!==blocks)throw new Error('List mismatch '+slug)
 console.log('SK GATE PUBLISHED SAVE PASS',slug,'id='+id,'blocks='+blocks,'linked='+linked,'updatedAt='+after.updatedAt)
}
try{
 await attempt(1,'centronic',9,20)
 await attempt(2,'haptix',13,55)
 console.log('SK GATE ALL PUBLISHED WRITES PASS')
 process.exit(0)
}catch(error){console.error('SK GATE PUBLISHED WRITE FAILED',error);process.exit(1)}
