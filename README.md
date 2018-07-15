# React-Tic-Tac-Toe
Solutions for the Tic Tac Toe game improvements challenge at the end of the official React tutorial.

Project started with create-react-app. Main changes in `src/App.js`

Initial commit is the `Final Result` of the [wrapping up](https://reactjs.org/tutorial/tutorial.html#wrapping-up) section.

There are many ways to solve these problems, some better than others. The solutions offered here are just what I came up this weekend while feeling like going back to basics just for fun. There is undoubtedly better approaches.

The tutorial mentions:
> [Here] are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty

I have found that the `increasing difficulty` is hugely relative.
(For example, point 6, _the Draw scenario_, was the easiest to solve.)

# Point 6
## When no one wins, display a message about the result being a draw.

```
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
```
We destructure
```
const history = this.state.history;
// becomes:
const { history } = this.state;
```
We get stepNumber
```
const { history, stepNumber } = this.state;
```
And the `if` there is `no winner` but we have reached `step #9` then there is no more moves left to play, therefore this is a `draw`.
Otherwise, we carry on.

# Point 2
## Bold the currently selected item in the move list.
Admittedly even easier than point `6`, but still also a lot simpler than point `1`.

```
let desc = move ?
    'Go to move #' + move :
    'Go to game start';
if (move === stepNumber) {
    desc = <b>{desc}</b>;
}
```
We make desc modifiable
```
const desc
// becomes:
let desc
```
And `if` the `index` of the `move` currently displayed `matches` the `stepNumber`, then we are viewing the step the link refers to.

# Point 3
## Rewrite Board to use two loops to make the squares instead of hardcoding them.
```
// class Board


// renderSquare

// ...
return (
      <Square
        key={i}
        // ...
    />
);


// render

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
```
<Square key={i} ... />
```

The 1st loop speciffies how many `divs` we want. `3` divs === 3 `rows`. `i` becomes the unique index of each div.

The 2nd loop speciffies how many `<Square />`s we want `per row`. Both `i` & `j` are used to calculate the unique index of each square.
There are `9` squares in total and their `indices` must be a continuity from `0 to 8` in increments of 1.

# Point 4
## Add a toggle button that lets you sort the moves in either ascending or descending order.

We create a new variable in the `state` of `Game`, and set its default value to false.
```
this.state = {
      // ...
      descOrder: false
    };
```
We create a function to switch its value from the opposite of what it last was.
If false, the order is ascending, if true, the order is descending.
```
toggleOrder() {
    this.setState({
      descOrder: !this.state.descOrder
    });
  }
```
In the render method we get descOrder
```
const { history, stepNumber, descOrder } = this.state;
```
If descOrder is true, we sort the list of moves in descending order
```
let reversed; // We need this one to update the numbers of each <li> in the <ol>
    if (descOrder) {
      moves.sort(((a, b) => a.key < b.key)); // pass a compareFunction to Array.sort()
      reversed = 'reversed'; // For HTML5 <ol reversed>
    }
```
We create a toggle button that runs the toggle function when clicked
```
const toggleOrder = <button onClick={() => this.toggleOrder()}>Toggle</button>
```
We update the return value of the render method
```
<div className="game-info">
    <div>{status}</div>
    <ol reversed={reversed}>{toggleOrder}{moves}</ol>
</div>
```