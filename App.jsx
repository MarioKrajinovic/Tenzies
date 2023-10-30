import React from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

export default function App(){
    const[numbers, setNumbers] = React.useState(allNewDice())

    const[tenzies, setTenzies] = React.useState(false)

    const[choosenNumber, setChoosenNumber] = React.useState("")

    const[choosed, setChoosed] = React.useState(true)

    const[count, setCount] = React.useState(0)

    const[bestScore, setBestScore] = React.useState(() => JSON.parse(localStorage.getItem("bestScore")) || 0)

    React.useEffect(() => {
        localStorage.setItem("bestScore", JSON.stringify(bestScore))
    }, [bestScore])

    React.useEffect(() => {
        const allHeld = numbers.every(die => die.isHeld)
        const firstValue = numbers[0].value
        const allSameValue = numbers.every(die => die.value === firstValue)
        if(allHeld && allSameValue){
            setTenzies(true)
        }
    },[[numbers]])

    function allNewDice(){
        var newDice = []
        for(var i = 0; i<10; i++){
            newDice[i] = {
                id: nanoid(),
                value: Math.ceil(Math.random() * 6),
                isHeld: false
            }
        }
        return newDice
    }
    const number = numbers.map(item => {
        return <Die 
            value={item.value} 
            key={item.id} 
            isHeld={item.isHeld} 
            handleClick={() => held(item.id)}
            getChoosenNumber={() => getChoosenNumber(item.value, item.id)}
        />
    }) 

    function newDice(){
        if(!tenzies){
            setNumbers(prevNumbers => prevNumbers.map(die => {
                return die.isHeld ? die : {...die, id: nanoid(), value: Math.ceil(Math.random() * 6)}
            }))
            setCount(preCount => preCount += 1)
        }
        else{
            setNumbers(allNewDice())
            setChoosenNumber("")
            setChoosed(true)
            setCount(0)
            setTenzies(false)
            if(bestScore === 0){
                setBestScore(count)
            }
            else{
                setBestScore(prevScore => {
                    return count <= prevScore  ? count : prevScore
                })
            }
            
        }
    }
    function getChoosenNumber(value, id){
        if(choosed){
            setChoosenNumber(value)
            setChoosed(false)
            console.log(choosenNumber)
            setNumbers(prevNumbers => {
                return prevNumbers.map(die => {
                    if(die.id === id && die.value === value){
                        return{...die, isHeld: true}
                    }
                    else{
                        return die
                    }
                })
            }
            )
        }
    }
    function held(clickedId){
        /* setNumbers(prevNumbers => {
            return prevNumbers.map(die => {
                if(die.id === clickedId && die.value === choosenNumber){
                    return{...die, isHeld: true}
                }
                else{
                    return die
                }
            })
        } 
        )*/
        setNumbers(prevNumbers => prevNumbers.map(die => {
            return die.id === clickedId && die.value === choosenNumber ? {...die, isHeld: true} : die
        }))
    }
    return(
        <div id="tenzies">
            {tenzies && <Confetti/>}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die<br/> to freeze it at its current value between rolls.</p>
            <div id="die">
                {number}
            </div>
            {tenzies && <span>Your score is: {count}</span>}
            <button className="button" onClick={newDice}>{tenzies ? "New Game" : "Roll"}</button>
            <div className="score">Best score: {bestScore}</div>
        </div>
    )
}