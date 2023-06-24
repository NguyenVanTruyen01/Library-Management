import React from "react"
import {useSearchParams} from "react-router-dom"

const Content=()=>{

    const [params]=useSearchParams()
    const pageRender=()=>{
        let pagesString=params.get('Page')

        if(pagesString!==null){
            const component =()=>require(`../${pagesString}/${pagesString}`).default
            return React.createElement(component())
        }
        else {
            const component =()=>require(`../Profile/Profile`).default
            return React.createElement(component())
        }
    }

    return (
        <>
            {
                pageRender()
            }
        </>
    )
}
export default  Content