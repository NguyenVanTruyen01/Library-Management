import React from 'react'
import styles from './styles/button.module.scss'

interface Property {
    bgColor:string,
    color:string
}
const Button:React.FC<Property> = ({bgColor,color}) => {
   
  return (
    <button style={{
        backgroundColor:bgColor,
        color,
        border:"none",
        borderRadius:3,
        }}>
        Button
    </button>
  )
}

export default Button