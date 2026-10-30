import config from '../../payload.config'
import {getPayload} from 'payload'
import {sql} from '@payloadcms/db-postgres'
const payload=await getPayload({config})
const db=(payload.db as any).drizzle
const before=await payload.findByID({collection:'pages',id:4,depth:0})
const oldId=before.id
console.log('N01 source id',oldId,'layout length',before.layout?.length)
const item=before.layout?.find((b:any)=>b.blockType==='caseStudyMediaGroup') as any
console.log('N01 block ids',JSON.stringify({block:item?.id,firstItem:item?.images?.[0]?.id}))
const cloned=(before.layout||[]).map((x:any)=>({...x}))
try{await payload.update({collection:'pages',id:4,data:{title:'Centronic'},draft:false,depth:0});console.log('N01 update pass')}catch(e:any){console.error('N01 update failed',e?.message,JSON.stringify(e?.data?.errors))}
process.exit(0)
