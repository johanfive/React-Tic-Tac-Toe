import React from 'react';
import './App.css';

const Square = props => (
  <button className={props.squarewin ? "square win" : "square"} onClick={props.onClick} >
      {props.value}
  </button>
);

class Board extends React.Component {
  renderSquare(i) {
    const { squares, winningLine } = this.props;
    let value = squares[i];
    let squarewin;
    if (winningLine && (winningLine.some(position => position === i))) {
      value = <i>{squares[i]}</i>;
      squarewin = true;
    }
    return (
      <Square
        key={i}
        value={value}
        onClick={() => this.props.onClick(i)}
        squarewin={squarewin}
      />
    );
  }

  render() {
    const board = [];
    for (let i = 0; i < 3; i++) {
      const squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare((i * 3) + j))
      }
      const row = <div className="board-row" key={i}>{squares}</div>;
      board.push(row);
    }
    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
          squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      descOrder: false
    };
  }

  toggleOrder() {
    this.setState({
      descOrder: !this.state.descOrder
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const { history, stepNumber, descOrder } = this.state;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const previous = history[move - 1];
      let location, locInfo;
      if (previous) {
        const newMove = getNewMove(previous.squares, step.squares);
        location = getLocation(newMove.index);
        const row = <div className="tooltip">{location.row}<span className="tooltiptext">Row</span></div>;
        const col = <div className="tooltip">{location.col}<span className="tooltiptext">Column</span></div>;
        locInfo = <small style={{color: 'grey'}}>{newMove.player} at ({row}, {col})</small>;
      }
      let desc = move ?
        'Go to move #' + move :
        'Go to game start';
      if (move === stepNumber) {
        desc = <b>{desc}</b>;
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          &nbsp;{locInfo}
        </li>
      );
    });

    let status;
    let winningLine;
    if (winner) {
      status = "Winner: " + winner.name;
      winningLine = winner.line;
    } else if (stepNumber === 9) {
      status = 'Draw';
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    let reversed;
    if (descOrder) {
      moves.sort((a, b) => a.key < b.key);
      reversed = 'reversed';
    }
    const toggleOrder = <button onClick={() => this.toggleOrder()}>Toggle</button>

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningLine={winningLine}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol reversed={reversed}>{toggleOrder}{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winner = {
        name: squares[a],
        line: lines[i]
      }
      return winner;
    }
  }
  return null;
}


function getNewMove(previous, current) {
  let nextMove = {};
  current.forEach((index, i) => {
    if (previous[i] !== index) {
      nextMove.index = i;
      nextMove.player = current[i];
    }
  });
  return nextMove;
}

function getLocation(index) {
  const row = getRowNum(index);
  const col = getColNum(index);
  return {row, col};
}

function getRowNum(index) {
  let row = 1;
  if (index > 2) {
    row = index > 5 ? 3 : 2;
  }
  return row;
}

function getColNum(index) {
  let col = 3;
  if (index % 3 === 0) {
    col = 1;
  } else if (index === 1 || index === 4 || index === 7) {
    col = 2;
  }
  return col;
}


export default Game;
