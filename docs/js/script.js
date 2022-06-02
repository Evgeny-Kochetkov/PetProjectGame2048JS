//TODO 1) Move back
//TODO 2) Score and Best Score				5|10 DONE!
//TODO 3) Modal "Leaderboard"            	5|10 DONE!
//TODO 4) Btn New Game                    	5|10 DONE!
//TODO 5) Ability to change color
//TODO 6) Ability to change grid size
//TODO 7) Modal "How to play"              	DONE!
//TODO 8) Adaptation for mobile devices
//TODO 9) Modal "Game Over" and "You Win"	5|10 DONE!
//TODO 10) Social link

import Grid from "./grid.js";
import Tile from "./tile.js";

window.addEventListener('DOMContentLoaded', function() {

	let SCORE = 0;
	let MOVES = 0;
	let SEC = 0;
	let MIN = 0;
	let HOUR = 0;
	const SPAWN_CELL = 2;

	//HTML
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

	/* createNode('', '', '', '', '', ''); */
	createNode('body', 'div', '', 'modal', '', 'modal');
		createNode('.modal', 'div', '', '', '', 'content');
			createNode('.content', 'h1', '2048', '', '', 'modal__h1');
			createNode('.content', 'div', '', '', '', 'modal__btns');
				createNode('.modal__btns', 'button', 'Start playing', 'btn-start', '', 'btn', 'modal__btn');
				createNode('.modal__btns', 'button', 'New Game',  'btn-new-game', '', 'btn', 'modal__btn');
			createNode('.content', 'h2', 'HOW TO PLAY',  '', '', 'modal__how');
			createNode('.content', 'p', 'Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!',  '', '', 'modal__descr');
	createNode('body', 'button', '',  'btn-hamburger', '', 'btn', 'hamburger');
		createNode('.hamburger', 'div', '',  'hamburger-wrap', '', 'wrap', 'hamburger__wrap', 'hamburger__wrap_active');
			createNode('.hamburger__wrap', 'div', '',  '', '', 'hamburger__line');
			createNode('.hamburger__wrap', 'div', '',  '', '', 'hamburger__line');
			createNode('.hamburger__wrap', 'div', '',  '', '', 'hamburger__line');
	createNode('body', 'div', '', 'leaderboard', '', 'leaderboard');
		createNode('.leaderboard', 'div', '', '', '', 'leaderboard__wrap');
			createNode('.leaderboard__wrap', 'h2', 'Your results', '', '', 'leaderboard__title');
			createNode('.leaderboard__wrap', 'p', 'Top five scores', '', '', 'leaderboard__descr');
			createNode('.leaderboard__wrap', 'ul', '', '', '', 'leaderboard__best-score');
	createNode('body', 'button', '',  'btn-leaderboard', '', 'btn', 'btn-leaderboard');
	createNode('body', 'div', '', 'game-over', '', 'game-over', 'game-over_active');
		createNode('.game-over', 'div', '', '', '', 'game-over-content');
			createNode('.game-over-content', 'h2', 'GAME OVER!', '', '', 'game-over-content__title');
			createNode('.game-over-content', 'p', 'You have no moves left.', '', '', 'game-over-content__descr');
			createNode('.game-over-content', 'button', 'New Game',  'btn-new-game-g-o', '', 'btn', 'modal__btn');
			
	const body = document.querySelector('body');
	const modal = document.getElementById('modal');
	const hamburger = document.getElementById('btn-hamburger');
	const hamburgerWrap = document.getElementById('hamburger-wrap');
	const btnStart = document.getElementById('btn-start');
	const btnNewGame = document.getElementById('btn-new-game');
	const leaderboard = document.getElementById('leaderboard');
	const btnLeaderboadr = document.getElementById('btn-leaderboard');
	const arrBtnStart = [hamburger, btnStart, body];
	const gameOver = document.getElementById('game-over');
	const btnNewGameGO = document.getElementById('btn-new-game-g-o');

	function modalClose() {
		modal.classList.toggle('modal_active');
		hamburgerWrap.classList.toggle('hamburger__wrap_active');
	}

	function modalGameOverClose() {
		gameOver.classList.toggle('game-over_active');
		hamburgerWrap.classList.toggle('hamburger__wrap_active');
	}

	arrBtnStart.forEach((btn) => {
		if (btn !== body) {
			btn.addEventListener('click', modalClose);
		}
		btn.addEventListener('click', initializeNewGame, { once: true });
	});

	body.addEventListener('click', (event) => {
		if (event.target === body) {
			modal.classList.add('modal_active');
			hamburgerWrap.classList.remove('hamburger__wrap_active');
			leaderboard.classList.remove('leaderboard_active');
		}
	});

	btnLeaderboadr.addEventListener('click', () => {
		leaderboard.classList.toggle('leaderboard_active');
	});

	btnNewGame.addEventListener('click', () => {
		// Убрать все тайлы
		grid.clearCell();
		modalClose();

	});

	btnNewGameGO.addEventListener('click', () => {
		// Убрать все тайлы

		modalGameOverClose();

		hamburger.removeEventListener('click', modalGameOverClose);

		hamburger.addEventListener('click', modalClose);
		
	});




	function sortScore() {
		if (!localStorage.getItem('result')) {
			return false;
		}

		const sortScore = JSON.parse(localStorage.getItem('result')).sort((a, b) => {
			if (+a.score >= +b.score) {
				return -1;
			}

			if (+a.score < +b.score) {
				return 1;
			}
		});
		
		if (sortScore.length > 4) {
			sortScore.splice(5);
		}

		localStorage.setItem('result', JSON.stringify(sortScore));

		const ul = document.querySelector('.leaderboard__best-score');
		while (ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}

		sortScore.forEach((item, i) => {
			createNode('.leaderboard__best-score', 'li', `${i+1}. Score: ${item.score} Moves: ${item.moves} \n Time: ${item.time}`, '', '', 'li');
		});
	}

	sortScore();

	//GAME
	const gameBoard = document.getElementById("game-board");

	const grid = new Grid(gameBoard);

	function initializeNewGame () {
		for (let i = 0; i < SPAWN_CELL; i ++) {
			grid.randomEmptyCell().tile = new Tile(gameBoard);
		}
		arrBtnStart.forEach((btn) => {
			btn.removeEventListener('click', initializeNewGame);
		});
	}

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

		MOVES++;

		if (MOVES === 1) {
			localStorage.removeItem('timer');
			localStorage.removeItem('score');
			localStorage.removeItem('moves');
			init();
			createNode('body', 'div', `Score\n${SCORE}`,  'score', '', 'statistics', 'score');
			createNode('body', 'div', `Moves\n${MOVES}`,  'moves', '', 'statistics', 'moves');
			createNode('body', 'div', `Time\n00:00:00`,  'timer', '', 'statistics', 'timer');
		} else {
			document.querySelector('#moves').innerHTML = `Moves\n${MOVES}`;
			localStorage.setItem('moves', MOVES);
		}

		if (localStorage.getItem('score')) {
			document.querySelector('#score').innerHTML = "Score" + "\n" + localStorage.getItem('score');	
		} else {
			document.querySelector('#score').innerHTML = `Score\n${SCORE}`;
		}

		if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
			newTile.waitForTransition(true).then(() => {
				clearInterval(intervalId);
				
				gameOver.classList.remove('game-over_active');

				const result = {
					time : localStorage.getItem('timer'),
					score : localStorage.getItem('score'),
					moves : localStorage.getItem('moves')
				};

				if (localStorage.getItem('result')) {
					const newResult = JSON.parse(localStorage.getItem('result'));
					newResult.push(result);
					localStorage.setItem('result', JSON.stringify(newResult));
				} else {
					localStorage.setItem('result', JSON.stringify([result]));
				}

				sortScore();

				if (!leaderboard.classList.contains('leaderboard_active')) {
					leaderboard.classList.add('leaderboard_active');
				}

				if (!modal.classList.contains('modal_active')) {
					modal.classList.add('modal_active');
				}

				if (!hamburgerWrap.classList.contains('hamburger__wrap_active')) {
					hamburgerWrap.classList.add('hamburger__wrap_active');	
				}

				hamburger.removeEventListener('click', modalClose);

				hamburger.addEventListener('click', modalGameOverClose);
				
			});

			return;
		}

		setupInput();
	}

	let intervalId;
	function init() {
		intervalId = setInterval(tick, 1000);
	}

	function tick() {
		SEC++;

		if (SEC >= 60) {
			MIN++;
			SEC = SEC - 60;
		}

		if (MIN >= 60) {
			HOUR++;
			MIN = MIN - 60;
		}

		document.querySelector('#timer').innerHTML = 
		'Time\n' + getZero(HOUR) + ':' + getZero(MIN) + ':' + getZero(SEC);
		localStorage.setItem('timer', getZero(HOUR) + ':' + getZero(MIN) + ':' + getZero(SEC));
	}

	function getZero(num){
		if (num >= 0 && num < 10) { 
			return '0' + num;
		} else {
			return num;
		}
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
});
