let fields = [
    null, null, null,
    null, null, null,
    null, null, null
];

let currentShape = 'circle';
let gameOver = false;
let scoreCircle = 0;
let scoreCross = 0;

function init() {
    render();
    document.getElementById("restart-container").style.display = "none"; // Neustart-Button verbergen
}

function render() {
    let html = '<table>';
    for (let i = 0; i < 3; i++) {
        html += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            html += renderCell(index);
        }
        html += '</tr>';
    }
    html += '</table>';
    document.getElementById('content').innerHTML = html;
}

function renderCell(index) {
    const shape = fields[index];
    const symbol = shape ? generateSymbol(shape) : '';
    const clickable = shape === null && !gameOver ? `onclick="handleClick(${index}, this)"` : '';
    return `<td ${clickable} data-index="${index}">${symbol}</td>`;
}

function handleClick(index, element) {
    if (fields[index] !== null || gameOver) return;

    fields[index] = currentShape;
    element.innerHTML = generateSymbol(currentShape);
    element.onclick = null;

    const result = checkWin();
    if (result) {
        gameOver = true;
        drawWinningLine(result);
        updateScore(currentShape);
        showStatusMessage(`${currentShape === 'circle' ? 'Kreis' : 'Kreuz'} gewinnt!`);
        document.getElementById("restart-container").style.display = "block";
    } else if (!fields.includes(null)) {
        gameOver = true;
        showStatusMessage("Unentschieden!");
        document.getElementById("restart-container").style.display = "block";
    }

    currentShape = currentShape === 'circle' ? 'cross' : 'circle';
}


function generateCircle() {
    return document.getElementById("circle-template").innerHTML;
}

function generateCross() {
    return document.getElementById("cross-template").innerHTML;
}

const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWin() {
    return winCombinations.find(([a, b, c]) =>
        fields[a] && fields[a] === fields[b] && fields[a] === fields[c]
    ) || null;
}

function drawWinningLine(combo) {
    const tdElements = document.querySelectorAll("td");

    // Berechne die Mitte des ersten und letzten Feldes der Gewinnkombination
    const p1 = getCenter(combo[0]);
    const p2 = getCenter(combo[2]);

    // Berechne die Länge und den Winkel der Linie
    const length = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

    // Erstelle eine Linie
    const line = document.createElement("div");
    line.className = "winning-line";

    line.style.left = `${p1.x}px`;
    line.style.top = `${p1.y}px`;
    line.style.transform = `rotate(${angle}rad)`;
    line.style.width = "0px";

    // Füge die Linie zum Spielfeld hinzu
    document.getElementById("content").appendChild(line);

    // Animationsstart
    requestAnimationFrame(() => {
        line.style.width = `${length}px`;
    });
}


function getCenter(index) {
    const tdElements = document.querySelectorAll("td");
    const rect = tdElements[index].getBoundingClientRect();
    const contentRect = document.getElementById("content").getBoundingClientRect();

    // Korrektur: Relative Position zu Gesamtbereich der Tische
    return {
        x: rect.left - contentRect.left + rect.width / 2,
        y: rect.top - contentRect.top + rect.height / 2
    };
}


function generateSymbol(shape) {
    return shape === 'circle' ? generateCircle() : generateCross();
}

// Neustart-Funktion
function restartGame() {
    fields = [null, null, null, null, null, null, null, null, null];
    currentShape = 'circle';
    gameOver = false;
    document.getElementById("restart-container").style.display = "none";
    document.getElementById("status-message").innerText = ""; // Nachricht zurücksetzen
    removeWinningLine(); // falls nötig
    render();
}


let score = {
    circle: 0,
    cross: 0
};

function updateScore(winner) {
    score[winner]++;
    document.getElementById(`score-${winner}`).innerText = score[winner];
}

function showStatusMessage(message) {
    document.getElementById("status-message").innerText = message;
}

function removeWinningLine() {
    const line = document.querySelector('.winning-line');
    if (line) {
        line.remove();
    }
}



init();
