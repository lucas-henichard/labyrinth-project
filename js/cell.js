const cellSize = 100;

var keyAmnt = 0;
var doorCells = new Map();

var IdArr, cellType, cell1, cell2, face1, face2, doorType;
var playerCellId = -1;
var neiCells = new Map();
var tknK = new Set();  // Keys alr taken
var tknD = new Set();  // Doors alr taken

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


async function cell_onLoad()
{
    await fetchSql();

    /*
    playerCellId = cellId;
    keyAmnt = keyNb;
*/
    // If no cell specified, load start
    if (playerCellId == -1)
        playerCellId = loadStart();
    
    drawCloseMaze(playerCellId);
    
    if (cellType[playerCellId] == "cle")
    {
        if (!tknK.has(playerCellId))
        {
            keyAmnt++;
            tknK.add(playerCellId);
            
            console.log("You found a key! You now have " + keyAmnt + " keys."); 
            for (let i = 0; i < tknK.length; i++)
            {
                console.log("tknK" + i + ": " + tknK[i]);
            }
            console.log("tknK[0] " + tknK[0]);
        }
        else
        {
            console.log("You alr took this key earlier, you have " + keyAmnt + " keys.");
        }
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
            console.log("couloirs: ", data);
            
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
            console.log("passages: ", data);

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
            console.log("Grilles: ", data);

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

        if (cellType[currCell] == "cle" && tknK.has(currCell))
        {
            placeCell(newX, newY, "vide");
        }
        else
        {
            placeCell(newX, newY, cellType[currCell]);
        }
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

    // Vérifier si la porte est déjà ouverte
    let cellA = cell1[doorId];
    let cellB = cell2[doorId];
    if (tknD.has(cellA) || tknD.has(cellB)) 
    {
        ctx.strokeStyle = doorColor["libre"];  // gris
    } else 
    {
        ctx.strokeStyle = doorColor[doorType[doorId]];  // couleur normale
    }

    ctx.lineWidth = 4;

    ctx.beginPath();

    let startX = 1 * cellSize;
    let startY = 1 * cellSize;
    
    let endX = (1 + x) * cellSize;
    let endY = (1 + y) * cellSize;

    switch (face)
    {
        case "N": 
            endY += cellSize; break;
        case "S": 
            startY += cellSize; break;
        case "E": 
            startX += cellSize; break;
        case "W":
        case "O": 
            endX += cellSize; break;
        case "C": 
            return;  // no edge for secret passage
    }

    if (x == 1) { endY -= cellSize; }
    if (y == 1) { endX -= cellSize; }

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


window.addEventListener('DOMContentLoaded', async () => 
{
    playerCellId = parseInt(localStorage.getItem("id"));
    if (isNaN(playerCellId)) playerCellId = -1;

    keyAmnt = parseInt(localStorage.getItem("keys"));
    if (isNaN(keyAmnt)) keyAmnt = 0;

    tknK.clear();
    const tknKStr = localStorage.getItem("takenKeys");
    if (tknKStr && tknKStr.length > 0)
    {
        tknKStr.split(',').forEach(id => 
        {
            if (id !== '') tknK.add(parseInt(id));
        });
    }

    tknD.clear();
    const tknDStr = localStorage.getItem("takenDoors");
    if (tknDStr && tknDStr.length > 0)
    {
        tknDStr.split(',').forEach(id => 
        {
            if (id !== '') tknD.add(parseInt(id));
        });
    }

    await cell_onLoad();
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
        case "r":
            localStorage.clear();
            localStorage.setItem("id", playerCellId.toString());
            window.location.href = "cell.php";
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
    if (doorCells.has(playerCellId) && doorCells.get(playerCellId) === newCellId) 
    {
        // if door is closed
        if (!tknD.has(playerCellId) && !tknD.has(newCellId)) 
        {
            if (keyAmnt > 0)
            {
                keyAmnt--;
                console.log("Used a key to open the door. Keys left: " + keyAmnt);

                // Remove door (unlock)
                doorCells.delete(playerCellId);
                doorCells.delete(newCellId);
                tknD.add(playerCellId);
            } 
            else  // Door is locked and no keys
            {
                console.log("Door is locked! You need a key to open it.");
                return;
            }
        } 
        else  // Door already opened
        {
            console.log("Door already opened, passing through.");
        }
    }

    // Save new state to localStorage
    localStorage.setItem("id", newCellId.toString());                    // new player position
    localStorage.setItem("keys", keyAmnt.toString());                    // keys amount
    localStorage.setItem("takenKeys", Array.from(tknK).join(','));       // collected keys
    localStorage.setItem("takenDoors", Array.from(tknD).join(','));      // opened doors 

    window.location.href = "cell.php";
}