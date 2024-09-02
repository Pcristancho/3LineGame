import { useState } from 'react'
import confetti from "canvas-confetti" 
import './App.css'

function App() {
  const TURNS={
    X:'x',
    O:'o'
  }
  const Winner_POS=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]


  // componente de cada cuadro /////////
  function Square ({children,isSelected,updateBoard,index}){
    const className= isSelected===true ? "is-selected" : " ";

    function clicBoton(){
      // updateBoard(board[index]="d")
      console.log("se hizo clic al cuadro ")
      updateBoard(index)
    }
    return(
      <div className={'square'+" "+className} onClick={clicBoton}>{children}</div>
    );
  }
  //////////////////////////////////
  const [board,setBoard]=useState(()=>{
    const boardFromStorage=JSON.parse(window.localStorage.getItem('board'));
    return boardFromStorage || Array(9).fill(null) // si no existe valor en local storage da un tablero vacio por defecto
  });
  const [turn,setTurn]=useState(()=>{
    const turnoFromStorage=window.localStorage.getItem('turn')
    return turnoFromStorage || TURNS.X
  })
  const [winerState,setWinerState]=useState(null);

  const handleTurn=(indiceC)=>{
    //primero verifica si ya tenia algo puesto de X o O
    if(board[indiceC] || winerState){return;}  //si el cuadro tiene algo como x o O ,o si  ya hay ganador no continual el proceso 
    let newBoard=[...board]; // una copia con estado acual del tablero 
    newBoard[indiceC]=turn;
    setBoard(newBoard);
    let newWinner= evaluateWin(newBoard);
    //guarda partida por si se reinicia la pagina 
    window.localStorage.setItem('board',JSON.stringify(newBoard))
    let newTurn= turn ==TURNS.X ? TURNS.O : TURNS.X
    window.localStorage.setItem('turn',newTurn) //turn ya es string
    ////
    //checa al ganador 
    if(newWinner){
      confetti();

      setWinerState((previusWinner)=>{
        console.log(`ganador es : ${newWinner} , el anterior era ${previusWinner}`)

        return newWinner
      })
    } else if(validarEmpate(newBoard)){ //valida si hay empate en cambio a de si alguien ya gano
      setWinerState(false) 
    } 
    setTurn(turn===TURNS.X ? TURNS.O : TURNS.X ) //cambia el turno general al que sigue jugar

  }
function validarEmpate(boardC){
  let newBoard =[... boardC];
  return newBoard.every((casilla)=>casilla !== null)
}

  function evaluateWin(boardN){
    
    console.log("Después de forEach");

    const boardAct=[...boardN];
    for(const posibilidad of Winner_POS){ 
      let [a,b,c]=[...posibilidad];

      if(board[a] && (boardAct[a]==boardAct[b] && boardAct[b]==boardAct[c])){
        console.log("hay ganador");
        console.log("el return "+board[a])
        return(board[a]);
      }

    }


    return null;
  }
  function resetGame(){ //se traduce simpmente a retomrar valores originales
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinerState(null)
    //limpiar el local storage
    window.localStorage.removeItem('board');
    window.localStorage.removeItem('turn')
  }

  return(
    <div >
      <div className="board">
      <h1>3 en linea</h1>
      <button onClick={resetGame}>Reiniciar juego</button>
      <section className="game">
        
        {board.map(( _,indice) =>{
            return(
              <div key={indice}>
                <Square key={indice} index={indice} updateBoard={handleTurn}>{board[indice]}</Square>
              </div>
            );
        })}
      </section>
      <section className="turn"  >
        <Square isSelected={turn==TURNS.X ? true:false}>X</Square>
        <Square isSelected={turn==TURNS.O ? true: false}>O</Square>
      </section>
      </div>
      {
        winerState !== null && (
          <section className='winner'>
            <div className='text'>
              <h2>
              {
                winerState==false ? 'Empate' : 'Ganó'
              }
              </h2>
              {winerState!==false &&<header className='win'>
                {winerState && <Square>{winerState}</Square>}
              </header>}
              <footer>
                <button onClick={resetGame}>Empezar de nuevo</button>
              </footer>
              
            </div>
          </section>
        )
      }
      <div className='By'>
        <h3>By Javier Ernesto Pérez</h3>
      </div>
    </div>
    
  );
}

export default App
