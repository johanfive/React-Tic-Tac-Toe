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
