import React from "react";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
const ComponentPage=(props:any)=>{
    return (
        <>
            {props.isHiddenHeader===true&&<Header/>}
            {props.children}
            {props.isHiddenFooter===true&&<Footer/>}
        </>
    )
}
export default ComponentPage;