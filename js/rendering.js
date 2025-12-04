import { cellType, cell1, cell2, face1, face2, doorType, cellColor,
    doorColor, tknK , tknD, cellSize, neiCells, face, refreshNeiCells, cellUrl,
    doorCells,
    playerCellId
 } from "./mazeData.js";


export function drawCloseMaze(playerId)
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


export function placeCell(x, y, cellsType)
{
    const canvas = document.getElementById("cellCanvas");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = cellColor[cellsType];
    console.log(cellColor[cellsType]);
    console.log(cellsType);
    ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
}


export function drawEdge(x, y, doorId, face)
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
    let imgSrc = cellUrl[cellType[facedId]];
    if (imgSrc === undefined)
    {
        ctx.fillStyle = cellColor[cellType[facedId]];
        ctx.fillRect(0, 0, 300, 300);
        return;
    }
    
    if (doorCells.has(facedId) && !tknD.has(facedId) && doorCells.get(facedId) == playerCellId)
    {
        // TODO: change canvas size to match other images
        drawImage(cellUrl["grille"], 0, 0, 300, 300);
        return;
    }

    drawImage(imgSrc, 0, 0, 300, 300);
}

// TODO: change canvas' aspect ration (hardcode it on images used)
function drawImage(imgSrc, x, y, width, height)
{
    const canvas = document.getElementById("cellCanvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imgSrc;
    img.onload = function() {
        ctx.drawImage(img, x, y, width, height);
    };
}