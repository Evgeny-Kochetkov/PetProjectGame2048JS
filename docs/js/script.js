//TODO 1) Move back
//TODO 2) Score and Best Score
//TODO 3) Modal "Leaderboard"
//TODO 4) Btn New Game
//TODO 5) Ability to change color
//TODO 6) Ability to change grid size
//TODO 7) Modal "How to play"
//TODO 8) Adaptation for mobile devices
//TODO 9) Modal "Game Over" and "You Win"
//TODO 10) Social link

import Grid from "./grid.js";
import Tile from "./tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);

grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

setupInput();

function setupInput() {
	window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
	switch (e.key) {
		case "ArrowUp":
		if (!canMoveUp()) {
			setupInput();
			return;
		}
		await moveUp();
		break;
		case "ArrowDown":
		if (!canMoveDown()) {
			setupInput();
			return;
		}
		await moveDown();
		break;
		case "ArrowLeft":
		if (!canMoveLeft()) {
			setupInput();
			return;
		}
		await moveLeft();
		break;
		case "ArrowRight":
		if (!canMoveRight()) {
			setupInput();
			return;
		}
		await moveRight();
		break;
		default:
		setupInput();
		return;
	}

  	grid.cells.forEach(cell => cell.mergeTiles());

  	const newTile = new Tile(gameBoard);
  	grid.randomEmptyCell().tile = newTile;

	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		newTile.waitForTransition(true).then(() => {
			alert("Game over");
		});
		return;
  	}

  setupInput();
}

function moveUp() {
	return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  	return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
}

function moveLeft() {
  	return slideTiles(grid.cellsByRow);
}

function moveRight() {
  	return slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
}

function slideTiles(cells) {
  	return Promise.all(
		cells.flatMap(group => {
			const promises = [];
			for (let i = 1; i < group.length; i++) {
				const cell = group[i];
				if (cell.tile == null) {
					continue;
				}
				let lastValidCell;
				for (let k = i - 1; k >= 0; k--) {
					const moveToCell = group[k];
					if (!moveToCell.canAccept(cell.tile)) {
						break;
					}
					lastValidCell = moveToCell;
				}
				if (lastValidCell != null) {
					promises.push(cell.tile.waitForTransition());
					if (lastValidCell.tile != null) {
						lastValidCell.mergeTile = cell.tile;
					} else {
						lastValidCell.tile = cell.tile;
					}
					cell.tile = null;
				}
			}
			return promises;
		})
  	);
}

function canMoveUp() {
  	return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  	return canMove(grid.cellsByColumn.map(column => [...column].reverse()));
}

function canMoveLeft() {
  	return canMove(grid.cellsByRow);
}

function canMoveRight() {
  	return canMove(grid.cellsByRow.map(row => [...row].reverse()));
}

function canMove(cells) {
  	return cells.some(group => {
		return group.some((cell, index) => {
			if (index === 0) {
				return false;
			}
			if (cell.tile == null) {
				return false;
			}
			const moveToCell = group[index - 1];
			return moveToCell.canAccept(cell.tile);
		});
  	});
}

function createNode(parentSelector, element, text, id, href, ...classes) {
	const parrentNode = document.querySelector(parentSelector);
	const elementNode = document.createElement(element);
	parrentNode.append(elementNode);
	if (text) {elementNode.textContent = text;}
	if (id) {elementNode.id = id;}
	if (href) {elementNode.href = href;}
	if (classes) {
		classes.forEach(className => elementNode.classList.add(className));
	} else {
		elementNode.classList.add('');
	}
}

/* new createNode('', '', '', '', '', ''); */
createNode('body', 'div', '', '', '', 'modal');
	createNode('.modal', 'div', '', '', '', 'content');
		createNode('.content', 'h1', '2048', '', '', 'modal__h1');
		createNode('.content', 'nav', '', '', '', 'modal__nav');
			createNode('.modal__nav', 'button', 'Start playing', '', '', 'btn', 'modal__btn');
			createNode('.modal__nav', 'button', 'New Game',  '', '', 'btn', 'modal__btn');
		createNode('.content', 'h2', 'HOW TO PLAY',  '', '', 'modal__how');
		createNode('.content', 'p', 'Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!',  '', '', 'modal__descr');
		createNode('.content', 'button', '',  '', '', 'hamburger', 'modal__hamburger');
			createNode('.hamburger', 'div', '',  '', '', 'wrap', 'hamburger__wrap', 'hamburger__wrap_active');
				createNode('.hamburger__wrap', 'div', '',  '', '', 'hamburger__line');
				createNode('.hamburger__wrap', 'div', '',  '', '', 'hamburger__line');
				createNode('.hamburger__wrap', 'div', '',  '', '', 'hamburger__line');
	
