import config from '../../payload.config'
import {getPayload} from 'payload'
const payload=await getPayload({config})
const tests=[
 {label:'N03a update staging no transaction',fn:()=>payload.update({collection:'pages',id:4,data:{title:'Centronic'},draft:false,depth:0,disableTransaction:true} as any)},
 {label:'N03b update existing media',fn:async()=>{const m=await payload.findByID({collection:'media',id:2,depth:0});return payload.update({collection:'media',id:2,data:{alt:m.alt},depth:0,overrideAccess:true})}},
]
for(const t of tests){try{await t.fn();console.log(t.label,'PASS')}catch(e:any){console.error(t.label,'FAIL',e.message,JSON.stringify(e.data?.errors))}}
process.exit(0)
