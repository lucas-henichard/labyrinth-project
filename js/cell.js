const cellSize = 100;

var keyAmnt = 0;
var doorCells = new Map();

var IdArr, cellType, cell1, cell2, face1, face2, doorType;
var playerCellId = -1;
var neiCells = new Map();


const cellColor = 
{
    "vide": "lightgray",
    "cle": "yellow",
    "depart": "green",
    "sortie": "blue",
};


const doorColor = 
{
    "libre": "lightgray",
    "grille": "yellow",
}


async function cell_onLoad(cellId, keyNb)
{
    await fetchSql();

    playerCellId = cellId;
    keyAmnt = keyNb;

    // If no cell specified, load start
    if (cellId == -1)
    {
        playerCellId = loadStart();
    }
    
    drawCloseMaze(playerCellId);
    
    if (cellType[playerCellId] == "cle")
    {
        keyAmnt++;
        await removeCellFromDB(playerCellId);  // TODO: fix this not working
        console.log("You found a key! You now have " + keyAmnt + " keys."); 
    }

    if (cellType[playerCellId] == "sortie")
    {
        console.log("You reached the exit");
    }
}


async function fetchSql()
{
    // Cell id and description
    IdArr = new Array();
    cellType = new Array();

    // ways between cells
    cell1 = new Array();
    cell2 = new Array();
    face1 = new Array();
    face2 = new Array();
    doorType = new Array();

    await fetch("../database/getHallways.php")
        .then(response =>
        {
            if (!response.ok) throw new Error("Network error");
            return response.json(); // <-- transform json stream to js object
        })
        .then(data => 
        {
            console.log("Réponse SQL :", data);
            
            // loop through result
            for (let i = 0; i < data.length; i++)
            {
                let id = data[i].id;

                IdArr[id] = id;
                cellType[id] = data[i].type;
            }
        })
        .catch(error => console.error("Error :", error));
        
    await fetch("../database/getDoors.php")
        .then(response => 
        {
            if (!response.ok) throw new Error ("Network error");
            return response.json();
        })
        .then(data =>
        {
            console.log("SQL answer!", data);

            // loop through result
            for (let i = 0; i < data.length; i++)
            {
                cell1[i] = data[i].couloir1;
                cell2[i] = data[i].couloir2;
                face1[i] = data[i].position1;
                face2[i] = data[i].position2;
                doorType[i] = data[i].type;
            }
        })
        .catch(error => console.error("Error: ", error));

        await fetch("../database/getClosedDoors.php")
        .then(response => 
        {
            if (!response.ok) throw new Error ("Network error");
            return response.json();
        })
        .then(data =>
        {
            console.log("SQL answer!", data);

            // loop through result
            for (let i = 0; i < data.length; i++)
            {
                doorCells.set(data[i].couloir1, data[i].couloir2);
                doorCells.set(data[i].couloir2, data[i].couloir1);
            }
        })
        .catch(error => console.error("Error: ", error));
}


// TODO: handle player rotation (only see in front of him and add a rotation button + player's facing in url)
function drawCloseMaze(playerId)
{
    console.log("Drawing from cell: " + playerId + " type: " + cellType[playerId]);
    // Place middle cell, player's pos
    placeCell(1, 1, cellType[playerId]);

    // Setup visited's set
    var visited = new Set();
    visited.add(playerId);

    for (let i = 0; i < cell1.length; i++)
    {
        // Cell isnt linked to player's
        if (cell1[i] != playerId && cell2[i] != playerId)
            continue;

        var playerOn1 = cell1[i] == playerId;
        console.log(playerOn1);
        var currCell = playerOn1 ? cell2[i] : cell1[i];  // Other is player's cell
        var face = !playerOn1 ? face1[i] : face2[i];  // Where the next cell is

        if (visited.has(currCell))
            continue;

        visited.add(currCell);

        var newX = 1;
        var newY = 1;

        switch (face)
        {
            case "N":
                newY -= 1;
                neiCells.set(face, currCell);
                break;

            case "S":
                newY += 1;
                neiCells.set(face, currCell);
                break;

            case "E":
                newX += 1;
                neiCells.set(face, currCell);
                break;

            case "W":
            case "O":
                newX -= 1;
                neiCells.set(face, currCell);
                break;
            case "C":
                newX = 0;
                newY = 0;
                neiCells.set(face, currCell);
        }

        console.log("currcell " + currCell);
        placeCell(newX, newY, cellType[currCell]);
        drawEdge(newX, newY, i, face);
    }

    for (let [direction, cellId] of neiCells)
    {
        console.log("Neighbor in direction " + direction + ": Cell ID " + cellId);
    }
}


function placeCell(x, y, cellsType)
{
    const canvas = document.getElementById("cellCanvas");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = cellColor[cellsType];
    console.log(cellColor[cellsType]);
    console.log(cellsType);
    ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
}


function drawEdge(x, y, doorId, face)
{
    const canvas = document.getElementById("cellCanvas");
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = doorColor[doorType[doorId]];
    ctx.lineWidth = 4;

    ctx.beginPath();

    let startX = 1 * cellSize;
    let startY = 1 * cellSize;
    
    let endX = (1 + x) * cellSize;
    let endY = (1 + y) * cellSize;

    switch (face)
    {
        case "N":
            endY += cellSize;
            break;
        case "S":
            startY += cellSize;
            break;
        case "E":
            startX += cellSize;
            break;
        case "W":
        case "O":
            endX += cellSize;
            break;
        case "C":
            return;  // no edge for a secret passage
    }

    // Adjust so the door is on the edge
    if (x == 1) 
    {
        // horizontal
        startY = startY;
        endY   = endY - cellSize;
    }
    if (y == 1) 
    {
        // vertical
        startX = startX;
        endX   = endX - cellSize;
    }

    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    ctx.stroke();
}


function loadStart()
{
    for (let i = 0; i < IdArr.length; i++)
    {
        if (cellType[IdArr[i]] == "depart")
        {
            return IdArr[i];
        }
    }

    return -1;
}


function getCellIdFromUrl() 
{
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return id !== null ? parseInt(id) : -1;  // -1 if not present (should be start cell)
}


function getKeyAmntFromUrl()
{
    const params = new URLSearchParams(window.location.search);
    const keys = params.get('keys');
    return keys !== null ? parseInt(keys) : 0;
}


window.addEventListener('DOMContentLoaded', () => 
{
    const cellId = getCellIdFromUrl();
    const keyNb = getKeyAmntFromUrl();
    cell_onLoad(cellId, keyNb);
});


//////////////// Movement ////////////////

window.addEventListener('keydown', (event) =>
{
    switch(event.key.toLowerCase())
    {
        case 'z':
            movePlayer("N");
            break;
        case 's':
            movePlayer("S");
            break;
        case 'd':
            movePlayer("E");
            break;
        case 'q':
            movePlayer("O");
            break;
        case " ":
            movePlayer("C");
            break;
    }
});


function movePlayer(direction)
{
    if (!neiCells.has(direction))
    {
        console.log("No cell in direction: " + direction);
        return;
    }
    
    const newCellId = neiCells.get(direction);

    // Check for door before moving
    if (doorCells.has(playerCellId) && doorCells.get(playerCellId) == newCellId)
    {
        if (keyAmnt > 0)
        {
            keyAmnt--;
            console.log("Used a key to open the door. Keys left: " + keyAmnt);
            doorCells.delete(playerCellId);
            doorCells.delete(newCellId);
            // TODO: update DB to mark door as opened
        }
        else
        {
            console.log("Door is locked! You need a key to open it.");
            return;
        }
    }

    console.log("Moving to cell: " + newCellId);
    window.location.href = "cell.php?id=" + newCellId + "&keys=" + keyAmnt;
}


async function removeCellFromDB(id)
{
    await fetch("../database/changeCellToEmpty.php?id=" + id)
        .then(response => 
        {
            if (!response.ok) return -1;
            return 0;
        })
        .catch(error => console.error("Error: ", error));
}