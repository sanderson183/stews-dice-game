//------------------------Menu Button-----------------------//

(function(d){
    const $nav = d.querySelector('nav');
    const $btn = d.querySelector('.btn-menu');
    $btn.addEventListener('click', () =>{
        $nav.classList.toggle('show');
    });
})(document);


//-----------------Dice Animation Functions-----------------//


const rollBtn = document.getElementById("roll")

const yDie1 = document.getElementById("you-die-1")
const yDie2 = document.getElementById("you-die-2")
const oDie1 = document.getElementById("opp-die-1")
const oDie2 = document.getElementById("opp-die-2")

const yourScoreOutput = document.getElementById("your-score")
const yourValueOutput = document.getElementById("your-value")

const oppValueOutput = document.getElementById("opp-value")
const oppScoreOutput = document.getElementById("opp-score")

const buttonDice = document.getElementById(`button-dice`)

const popUp = document.getElementById("pop-up")
const popUpOutput = document.getElementById("pop-up-content")
const playAgain = document.getElementById("play-again")

const blurContainer = document.getElementById(`blur-container`)

let i = 1  // Roll animation frame counter
let j = 0  // Flip animation frame counter
let rolls = 0       // Rolls counter
let active = false  // Used to disable roll button while rolling

let yRoll1
let yRoll2
let oRoll1
let oRoll2

// Sets default scores to 0
let yourScore = 0
let oppScore = 0
yourScoreOutput.innerHTML = `${yourScore}`
oppScoreOutput.innerHTML = `${oppScore}`

//Player object constructor
function Player(name, valueOutput, scoreOutput) {
    this.name = name
    this.victory = false
    this.value = 0
    this.score = 0
    this.valueOutput = valueOutput
    this.scoreOutput = scoreOutput
    //Player function to calculate their score and update scoreboard
    this.updateScore = function (die1, die2) {
        this.value = calculateValue(die1, die2)
        this.valueOutput.innerHTML = this.value
        this.score += this.value
        this.scoreOutput.innerHTML = `${this.score}`
    }   
    //Changes display based on which type of score was made (single / double)
    this.valueDisplay = function valueDisplay() {
        if (scoreOne) {
            this.valueOutput.style.color = `#F25757`
        } else if (scoreDouble) {
            this.valueOutput.style.fontWeight = `bold`
        }
    }
    this.resetValueDisplay = function resetValueDisplay() {
        this.valueOutput.style.color = `black`
        this.valueOutput.style.fontWeight = `normal`
    }
}

//Creating two player objects
const you = new Player(`You`, yourValueOutput, yourScoreOutput )
const opponent = new Player("Opponent", oppValueOutput, oppScoreOutput)

function randNum() {  //Generates Random number from 1 to 6
    return Math.floor(Math.random() * 6 ) + 1
}

// Helper function to make setTimeout and requestAnimationFrame functions easier 
function diceAnimation() {
    requestAnimationFrame(rollDice)
}


function rollDice() {
    // Generates 4 random numbers for the individual die rolls
    if (i < 20) {
        active = true
        i++
        yRoll1 = randNum()
        yDie1.src = `../img/dice-${yRoll1}.png`
        yRoll2 = randNum()
        yDie2.src = `../img/dice-${yRoll2}.png`
        oRoll1 = randNum()
        oDie1.src = `../img/dice-${oRoll1}.png`
        oRoll2 = randNum()
        oDie2.src = `../img/dice-${oRoll2}.png`
        setTimeout(diceAnimation, 120)

    // After 20 frames, cancels animation, updates scores, and enables button via active variable 
    } else {
        cancelAnimationFrame(diceAnimation)
        flipScore()
        // Hides inactive button during roll animation
        rollBtn.classList.add(`pop`)
        rollBtn.classList.remove(`disabled`)
        buttonDice.classList.remove(`bounce`)

        active = false
        i = 1
        rolls++
        //Updates players scores using the Player object functions
        you.updateScore(yRoll1, yRoll2)
        you.resetValueDisplay()
        you.valueDisplay()
        opponent.updateScore(oRoll1, oRoll2)
        opponent.resetValueDisplay()
        opponent.valueDisplay()
      

        // At 3 rolls the victor is determined and displayed in the delayed popup
        if (rolls === 3) {
            rollBtn.classList.add(`disabled`)
            if (you.score > opponent.score) {
                you.victory = true
                you.valueOutput.innerHTML = `Winner!`
                you.valueOutput.classList.add(`win-pop`)
                you.valueOutput.style.color = `black`
                you.valueOutput.style.fontWeight = `bold`

            } else if (opponent.score > you.score) {
                opponent.victory = true
                opponent.valueOutput.innerHTML = `Winner!`
                opponent.valueOutput.classList.add(`win-pop`)
                opponent.valueOutput.style.color = `black`
                opponent.valueOutput.style.fontWeight = `bold`
            }
            setTimeout(displayWinner, 2000)
        }
    }
}

//Helper function to tidy up animation frame calls
function flipAnimation() {
    requestAnimationFrame(flipScore)
}

// Runs an animation on the scores x-axis over
function flipScore() {
    if (j < 360) {
        j += 20
    yourScoreOutput.style.transform = `rotateX(${j}deg`
    oppScoreOutput.style.transform = `rotateX(${j}deg`
        flipAnimation()
    } else {
        cancelAnimationFrame(flipAnimation)
        j = 0
    }
}

//Variables used to track score type (single / double)
let scoreOne
let scoreDouble

//Score calculator (game rules)
function calculateValue( die1, die2) {
    let value
    scoreOne = false
    scoreDouble = false
    if (die1 === 1 || die2 === 1) {
        value = 0
        scoreOne = true
    } else if (die1 === die2){
        value = (die1 + die2) * 2
        scoreDouble = true
    } else {
        value = die1 + die2
    }
    return value
}

//Displays popup with winner info and image
function displayWinner() {
    if (you.victory) {
        popUpOutput.innerHTML = `<h2>${you.name} Win!</h2><img src="../img/flames.gif" alt="flames">`
    } else if (opponent.victory) {
        popUpOutput.innerHTML = `<h2>${opponent.name} Wins!</h2><img src="../img/angry-dog.gif" alt="dag">`
    }
    blurContainer.classList.toggle(`blurred`)
    popUp.style.display = `flex`
    popUp.style.opacity = `1`
}

//Runs roll dice animation on click and disables button while rolling
rollBtn.addEventListener(`click`, function() {
    rollBtn.classList.remove(`pop`)
    rollBtn.classList.add(`disabled`)
    buttonDice.classList.add(`bounce`)
    rollDice()
})


//---------------------Popup Functions------------------------//


//Play again button exits the popup and resets game variables
playAgain.addEventListener(`click`, () => {
    you.value = 0
    you.valueOutput.innerHTML = 0
    you.score = 0
    you.scoreOutput.innerHTML = 0
    yourValueOutput.classList.remove(`win-pop`)
    you.resetValueDisplay()

    opponent.value = 0
    opponent.valueOutput.innerHTML = 0
    opponent.score = 0
    opponent.scoreOutput.innerHTML = 0
    oppValueOutput.classList.remove(`win-pop`)
    opponent.resetValueDisplay()
    
    rolls = 0

    rollBtn.classList.remove(`disabled`)
    blurContainer.classList.toggle(`blurred`)
    popUp.style.opacity = `0`
    popUp.style.display = `none`
})

 


