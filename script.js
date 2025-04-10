let fields = [
    null, null, null,
    null, null, null,
    null, null, null
];

let currentShape = 'circle';
let gameOver = false;

function init() {
    render();
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

    // Funktion, um den Mittelpunkt eines Feldes zu berechnen
    const p1 = getCenter(combo[0]); // Mittelpunkt des ersten Feldes
    const p2 = getCenter(combo[2]); // Mittelpunkt des dritten Feldes

    // Berechnung der Distanz und des Winkels zwischen den beiden Mittelpunkten
    const length = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

    const line = document.createElement("div");
    line.className = "winning-line";

    // Setze die Position der Linie am ersten Punkt
    line.style.left = `${p1.x}px`;
    line.style.top = `${p1.y}px`;

    // Drehe die Linie so, dass sie zwischen den beiden Punkten passt
    line.style.transform = `rotate(${angle}rad)`;

    // Start mit einer Breite von 0px, damit wir die Animation triggern können
    line.style.width = "0px";
    document.body.appendChild(line);

    // Triggern der Animation für die Linie, damit sie die richtige Länge bekommt
    requestAnimationFrame(() => {
        line.style.width = `${length}px`; // Endbreite der Linie
    });
}

// Funktion, um den Mittelpunkt eines Feldes zu berechnen
function getCenter(index) {
    const tdElements = document.querySelectorAll("td");
    const rect = tdElements[index].getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY
    };
}

function generateSymbol(shape) {
    return shape === 'circle' ? generateCircle() : generateCross();
}

init();
