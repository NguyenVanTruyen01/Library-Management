// import AssemblyAPI from 'api/assembly.api'
import AuthServices from 'api/auth.api'
// import GroupAPI from 'api/group.api'
import TopicService from 'api/topic.api'
import  { createContext, useState,PropsWithChildren, useEffect, useCallback } from 'react'
import { Response } from '@type/ListResponse'

interface Totals {
  account:number
  topic:number
  assembly:number
  group:number
}
  
const AppCtx = createContext<Totals | null>({
  topic: 0,
  account: 0,
  group: 0,
  assembly:0
});
  
function ContextTotalProvider(props:PropsWithChildren<{}>) {

  const [totals,setTotals] = useState<Totals>({account:0,topic:0,assembly:0,group:0})

  const callTotalAccount = useCallback(async()=>{
    return await AuthServices.getTotalAccount()
  },[])
  const callTotalTopic = useCallback(async()=>{
    return await TopicService.getTotalTopic()
  },[])
  // const callTotalGroup = useCallback(async()=>{
  //   return await GroupAPI.getTotalGroup()
  // },[])
  // const callTotalAssembly = useCallback(async()=>{
  //   return await AssemblyAPI.getTotalAssembly()
  // },[])
  useEffect(()=>{
    callTotalAccount().then((data:Response|undefined)=>{
      setTotals((prevState)=>{return {...prevState,account:data?.data}})
    })
    callTotalTopic().then((data:Response|undefined)=>{
      setTotals((prevState)=>{return {...prevState,topic:data?.data}})
    })
    // callTotalGroup().then((data:Response|undefined)=>{
    //   setTotals((prevState)=>{return {...prevState,group:data?.data}})
    // })
    // callTotalAssembly().then((data:Response|undefined)=>{
    //   setTotals((prevState)=>{return {...prevState,assembly:data?.data}})
    // })
  },[])

    return <AppCtx.Provider value={totals} {...props}/>
}

export default ContextTotalProvider;