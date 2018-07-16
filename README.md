# React Tic-Tac-Toe
### Solutions for the Tic Tac Toe game improvements challenge at the end of the [official React tutorial](https://reactjs.org/tutorial/tutorial.html).

Project started with [create-react-app](https://www.npmjs.com/package/create-react-app). Main changes in `src/App.js`

Initial commit is the `Final Result` of the [wrapping up](https://reactjs.org/tutorial/tutorial.html#wrapping-up) section.

- There are many ways to solve these problems, some better than others.
The solutions offered here are just what I came up this weekend while feeling like going back to basics just for fun.
There are undoubtedly better approaches.

The tutorial mentions:
> [Here] are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty

I have found that the `increasing difficulty` is hugely relative.
(For example, point 6 - _the Draw scenario_ - was the easiest to solve.)

## 6 | When no one wins, display a message about the result being a draw.
### Check the [diff](https://github.com/johanfive/React-Tic-Tac-Toe/commit/3893934ca31dba3e98b772eeb0977c84a530bbdb#diff-14b1e33d5bf5649597cdc0e4f684daddL85)

```javascript
// Game

render() {
    const { history, stepNumber } = this.state;
    // ...

    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else if (stepNumber === 9) {
        status = 'Draw';
    } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    // ...
}
```

- We destructure
```javascript
const history = this.state.history;
// becomes:
const { history } = this.state;
```

- We get stepNumber
```javascript
const { history, stepNumber } = this.state;
```

- And then `if` there is `no winner` but we have reached `step #9` then there is no more move left to play, therefore this is a `draw`.
Otherwise, we carry on.

## 2 | Bold the currently selected item in the move list.
### Check the [diff](https://github.com/johanfive/React-Tic-Tac-Toe/commit/708649c7cec6e1bedf364cdb947b4047a22cdde9#diff-14b1e33d5bf5649597cdc0e4f684daddL88)

Admittedly even easier than point `6`, but still also a lot simpler than point `1`.

```javascript
// Game

render() {
    // ...

    const moves = history.map((step, move) => {
        // ...

        let desc = move ?
            'Go to move #' + move :
            'Go to game start';
        if (move === stepNumber) {
            desc = <b>{desc}</b>;
        }
        // ...

    });
}
```

- We make desc modifiable
```javascript
const desc
// becomes:
let desc
```

- And `if` the `index` of the `move` currently displayed `matches` the `stepNumber`, then we are viewing the step the link refers to.

## 3 | Rewrite Board to use two loops to make the squares instead of hardcoding them.
### Check the [diff](https://github.com/johanfive/React-Tic-Tac-Toe/commit/696afc0b719676b9fdd6dfb31b2a9f8df46cfd75#diff-14b1e33d5bf5649597cdc0e4f684daddL13)

```javascript
// Board

renderSquare(i) {
    // ...
    return (
        <Square
            key={i}
            // ...
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
```

The key thing here is to remember `jsx`'s magic and that when we pass in a `simple array` as a variable to a jsx element, React just intelligently figures out what to render.

We also need to specify a unique `key` for each element of an array otherwise we get the following warning:
> Warning: Each child in an array or iterator should have a unique "key" prop.

Hence
```javascript
<Square key={i} ... />
```

- The 1st loop speciffies how many `divs` we want. `3` divs === 3 `rows`. `i` becomes the unique index of each div.
- The 2nd loop speciffies how many `<Square />`s we want `per row`. Both `i` & `j` are used to calculate the unique index of each square.
There are `9` squares in total and their `indices` must be a continuity from `0 to 8` in increments of 1.

## 4 | Add a toggle button that lets you sort the moves in either ascending or descending order.
### Check the [diff](https://github.com/johanfive/React-Tic-Tac-Toe/commit/8445dd8a92a2db244f4200c43a463dc4a28dc02c#diff-14b1e33d5bf5649597cdc0e4f684daddL38)

```javascript
// Game

constructor(props) {
    // ...

    this.state = {
        // ...

        descOrder: false
    };
}

toggleOrder() {
    this.setState({
        descOrder: !this.state.descOrder
    });
}
// ...

render() {
    const { history, stepNumber, descOrder } = this.state;
    // ...

    let reversed;
    if (descOrder) {
        moves.sort(((a, b) => a.key < b.key));
        reversed = 'reversed';
    }

    const toggleOrder = <button onClick={() => this.toggleOrder()}>Toggle</button>

    return (
        // ...

        <div className="game-info">
            <div>{status}</div>
            <ol reversed={reversed}>{toggleOrder}{moves}</ol>
        </div>
        // ...

    );
}
```

- We create a new variable in the `state` of `Game`, and set its default value to false.
```javascript
this.state = {
      // ...
      descOrder: false
    };
```

- We create a function to switch its value from the opposite of what it last was.
If `false`, the order is `ascending`, if `true`, the order is `descending`.
```javascript
toggleOrder() {
    this.setState({
        descOrder: !this.state.descOrder
    });
}
```

- In the render method we get descOrder
```javascript
const { history, stepNumber, descOrder } = this.state;
```

- If `descOrder` is `true`, we sort the list of moves in `descending` order
```javascript
let reversed; // We need this one to update the numbers of each <li> in the <ol>
if (descOrder) {
    moves.sort(((a, b) => a.key < b.key)); // pass a compareFunction to Array.sort()
    reversed = 'reversed'; // For HTML5 <ol reversed>
}
```

- We create a `toggle button` that runs the toggle function when clicked
```javascript
const toggleOrder = <button onClick={() => this.toggleOrder()}>Toggle</button>
```

- We update the return value of the render method
```javascript
<div className="game-info">
    <div>{status}</div>
    <ol reversed={reversed}>{toggleOrder}{moves}</ol>
</div>
```

## 5 | When someone wins, highlight the three squares that caused the win.

- First, we modify the `return value` of the `calculateWinner()` function
```javascript
if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    const winner = {
        name: squares[a],
        line: lines[i]
    }
    return winner;
}
```
Now instead of just getting an `X` or an `O`, we also get the winning line (eg: `[0, 1, 2]`).

### Check the [diff](https://github.com/johanfive/React-Tic-Tac-Toe/commit/14f88c019971ffb8069cd87a119c4279eac490a0#diff-ac5f32af117b8a14f49fce70447dd64fL32)

```javascript
// Square

const Square = props => (
    <button className={props.squarewin ? "square win" : "square"} onClick={props.onClick} >
        {props.value}
    </button>
);


// Board

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
            squarewin={squarewin}
            // ...

        />
    );
}


// Game

render() {
    // ...

    const winner = calculateWinner(current.squares); // unchanged except for its return value
    //...

    let status;
    let winningLine;
    if (winner) {
        status = `Winner: ${winner.name}`;
        winningLine = winner.line;
    } // ...

    return (
        // ...

        <div className="game-board">
            <Board
                winningLine={winningLine}
                // ...

            />
        </div>
        //...

    );
}
```

- We make use of the winning line in the render method of `Game`
```javascript
const winner = calculateWinner(current.squares); // unchanged except for its return value
//...

let status;
let winningLine;
if (winner) {
    status = `Winner: ${winner.name}`;
    winningLine = winner.line;
}
```

- We pass the `winning line` as a `prop` to `<Board />`
```javascript
<div className="game-board">
    <Board
        winningLine={winningLine}
        // ...
    />
</div>
```

- We update `Board`'s `renderSquare` in preparation for making use of its new `winningLine prop` by destructuring
```
renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
```
becomes
```javascript
renderSquare(i) {
    const { squares } = this.props;
    let value = squares[i];
    return (
        <Square
            key={i}
            value={value}
            onClick={() => this.props.onClick(i)}
        />
    );
}
```

- Using the winningLine prop. `If` the `index` of the `square` being rendered
is `equal` to `any` of the `values` of the `winning line`,
then this square should be highlighted
```javascript
const { squares, winningLine } = this.props;
// ...
if (winningLine && (winningLine.some(position => position === i))) {
    value = <i>{squares[i]}</i>;
}
// ...
```

At this point, the winning line is displayed in italic,
which is enough to consider the goal met.
But if we really want the `square` to be `highlighted` instead of its `children`,
then...
- We can create a special `CSS class`.
```css
// css file

.win {
    color: springgreen;
    // changing the border's color didn't look nice
    // and changing the background is just too much green
}
```

- In order to assign this class to the `<Square />` component being rendered,
we need to notify it with a prop.
```javascript
// Board

renderSquare(i) {
    // ...

    let value = squares[i];
    let squarewin;
    if (winningLine && (winningLine.some(position => position === i))) {
        value = <i>{squares[i]}</i>;
        squarewin = true;
    }
    // ...
    return (
        <Square
            // ...buncha props
            squarewin={squarewin}
        />
    );
}
```

- And now we can assign the CSS class `conditionally` in the Square component
```
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
```
becomes
```javascript
const Square = props => (
    <button className={props.squarewin ? "square win" : "square"} onClick={props.onClick} >
        {props.value}
    </button>
);
```

Et [voil&#224;](https://johanfive.github.io/React-Tic-Tac-Toe), glorious green!

And finaly, for what was supposed to be the easiest:

## 1 | Display the location for each move in the format (col, row) in the move history list.
There is a couple things we need in order to show the location of a particular move:
- We must distinguish which Square has been ticked the latest
- We must calculate the location of this square

So we make functions:

```javascript
/**
 * Get which square is different in the current board
 * compared to the previous one
 * @param {array} previous. The squares prop of a particular step in history
 * @param {array} current. The squares prop of the step being assessed
 */
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
```

Given a Square's index, return its location on the Board
```javascript
function getLocation(index) {
    const row = getRowNum(index);
    const col = getColNum(index);
    return {row, col};
}
```

Given a Square's index, return the row it belongs to on the Board.
```javascript
function getRowNum(index) {
    let row = 1;
    if (index > 2) {
        row = index > 5 ? 3 : 2;
    }
    return row;
}
```

Given a Square's index, return the column it belongs to on the Board.
```javascript
function getColNum(index) {
    let col = 3;
    if (index % 3 === 0) {
        col = 1;
    } else if (index === 1 || index === 4 || index === 7) {
        col = 2;
    }
    return col;
}
```

And now we use them.

### Check the [diff](https://github.com/johanfive/React-Tic-Tac-Toe/commit/fb498bbc4a2d3452523c68741bf968c0f5569566#diff-ac5f32af117b8a14f49fce70447dd64fL52)

```javascript
// Game

render() {
    // ...

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
        // ...

        return (
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
                &nbsp;{locInfo}
            </li>
        );
    });
    // ...

}
```

- First we determine the previous state of the Board
```javascript
// Game render method

// ...
const moves = history.map((step, move) => {
    const previous = history[move - 1];
    // ...
}
```

- So that we can determine the new move
```
const newMove = getNewMove(previous.squares, step.squares);
```
in
```javascript
const moves = history.map((step, move) => {
    const previous = history[move - 1];
    if (previous) { // There is no prior move at the beginning of the game
        const newMove = getNewMove(previous.squares, step.squares);
    }
    // ...
}
```

- And from there we can get its location
```
location = getLocation(newMove.index);
```
in
```javascript
const moves = history.map((step, move) => {
    const previous = history[move - 1];
    let location;
    if (previous) {
        const newMove = getNewMove(previous.squares, step.squares);
        location = getLocation(newMove.index);
    }
    // ...
}
```

- This allows us to enrich the moves list with location info.

`Instead` of doing something like:
```
let desc = move ?
    `Go to move #${move} (${location.row}, ${location.col})` :
    'Go to game start';
```

I prefer to get the location info out of the button,
and provide a `tooltip` so that we know what each number corresponds to.
```javascript
const moves = history.map((step, move) => {
    const previous = history[move - 1];
    let location, locInfo; // add locInfo
    if (previous) {
        const newMove = getNewMove(previous.squares, step.squares);
        location = getLocation(newMove.index);
        const row = <div className="tooltip">{location.row}<span className="tooltiptext">Row</span></div>;
        const col = <div className="tooltip">{location.col}<span className="tooltiptext">Column</span></div>;
        locInfo = <small style={{color: 'grey'}}>({row}, {col})</small>;
    }
    // ...
}
```
(Remember to update the CSS file so the tooltip looks nice. I got mine straight for W3S [here](https://www.w3schools.com/howto/howto_css_tooltip.asp))

- Now we can insert the location information in the moves list
```javascript
return (
    <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
        &nbsp;{locInfo}
    </li>
);
```

- Bonus: thanks to the `getNewMove()` function, it's easy to specify which player is making the move
```javascript
if (previous) {
    // ...
    locInfo = <small style={{color: 'grey'}}>{newMove.player} at ({row}, {col})</small>;
}
```

Check the diffs of each commit on the Master branch. It should highlight nicely all the steps taken.