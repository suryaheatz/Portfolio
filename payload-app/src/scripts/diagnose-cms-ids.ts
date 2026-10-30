import config from '../../payload.config'
import {getPayload} from 'payload'
const payload=await getPayload({config})
for(const test of [
 {label:'N04a draft update',data:{title:'Centronic'},draft:true},
 {label:'N04b version restore update',data:{title:'Centronic'},draft:false,disableTransaction:true}
]){
 try{const o=await payload.update({collection:'pages',id:4,depth:0,overrideAccess:true,...test} as any);console.log(test.label,'PASS',o.id)}
 catch(e:any){console.error(test.label,'FAIL',e.message,JSON.stringify(e.data?.errors))}
}
process.exit(0)
