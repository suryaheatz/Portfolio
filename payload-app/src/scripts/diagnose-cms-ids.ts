import config from '../../payload.config'
import {getPayload} from 'payload'
const payload=await getPayload({config})
const id=4
try{
 const result=await payload.update({collection:'pages',id,depth:0,overrideAccess:true,draft:true,data:{title:'Centronic',_status:'published'}} as any)
 console.log('N05 draft=true status=published PASS',result.id,result._status)
 const check=await payload.findByID({collection:'pages',id,depth:0,overrideAccess:true})
 console.log('N05 reread status',check._status,'updatedAt',check.updatedAt)
}catch(e:any){console.error('N05 publish attempt FAIL',e.message,JSON.stringify(e.data?.errors))}
process.exit(0)
