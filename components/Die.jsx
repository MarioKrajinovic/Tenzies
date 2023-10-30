import React from "react"

export default function Die(props){
    const style = {
        backgroundColor: props.isHeld ? " rgb(77, 43, 199)" : "",
        color: props.isHeld ? "white" : ""
    }
    return(
        <div style={style} onClick={() => {
            props.getChoosenNumber()
            props.handleClick()
        }
        }>{props.value}</div>
    )

}