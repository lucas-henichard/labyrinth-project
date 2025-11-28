import { playerCellId, keyAmnt, doorCells, IdArr, cellType, cell1, cell2, face1, face2, doorType, cellColor,
    doorColor, fetchSql, setKeyAmnt, setPlayerCellId, tknK , tknD, cellSize, neiCells, setFace, face, refreshNeiCells
 } from "./mazeData.js";


async function cell_onLoad()
{
    await fetchSql();

    // If no cell specified, load start
    if (playerCellId == -1)
        playerCellId = loadStart();

    if (face == undefined)
        setFace("N");
    
    drawInFront();
    //drawCloseMaze(playerCellId);
    
    for (var elt of neiCells)
    {
        console.log(elt);
    }

    if (cellType[playerCellId] == "cle")
    {
        if (!tknK.has(playerCellId))
        {
            setKeyAmnt(keyAmnt + 1);
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
    setPlayerCellId(parseInt(localStorage.getItem("id")));
    if (isNaN(playerCellId)) setPlayerCellId(-1);

    setKeyAmnt(parseInt(localStorage.getItem("keys")));
    if (isNaN(keyAmnt)) setKeyAmnt(0);

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

    setFace(localStorage.getItem("face"));

    await cell_onLoad();
});


//////////////////////  DRAWINGS  //////////////////////
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

    // Check if the door was alr opened
    let cellA = cell1[doorId];
    let cellB = cell2[doorId];
    if (tknD.has(cellA) || tknD.has(cellB)) 
    {
        ctx.strokeStyle = doorColor["libre"];
    } 
    else 
    {
        ctx.strokeStyle = doorColor[doorType[doorId]];
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
            return;  // no edge for secret passage
    }

    if (x == 1) 
    { 
        endY -= cellSize; 

    }

    if (y == 1) 
    { 
        endX -= cellSize;
    }

    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    ctx.stroke();
}


export function drawInFront()
{
    const canvas = document.getElementById("cellCanvas");
    const ctx = canvas.getContext("2d");

    refreshNeiCells();
    
    let facedId = neiCells.get(face);
    ctx.fillStyle = cellColor[cellType[facedId]];
    ctx.fillRect(0, 0, 300, 300);
}
