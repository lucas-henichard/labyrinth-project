import { cellType, cell1, cell2, face1, face2, doorType, cellColor,
    doorColor, tknK , tknD, cellSize, neiCells, face, refreshNeiCells, cellUrl,
    doorCells, playerCellId, gifFrames, setGifFrames, setGifCurrentFrame, gifCurrentFrame,
    keyAmnt,
 } from "./mazeData.js";

const canvas = document.getElementById("cellCanvas");
const ctx = canvas.getContext("2d");

const gifCanvas = document.getElementById("gifCanvas");
const gifCtx = gifCanvas.getContext("2d");
const canvasWidth = gifCanvas.width;
const canvasHeight = gifCanvas.height;

const gifFps = 30;
const frameDuration = 1000 / gifFps;
let lastTime = 0;


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
    ctx.fillStyle = cellColor[cellsType];
    console.log(cellColor[cellsType]);
    console.log(cellsType);
    ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
}


export function drawEdge(x, y, doorId, face)
{
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


export async function drawInFront(shouldOpenDoor = false)
{
    const canvas = document.getElementById("cellCanvas");
    const ctx = canvas.getContext("2d");

    refreshNeiCells();

    let facedId = neiCells.get(face);
    let imgSrc = cellUrl[cellType[facedId]];

    // Default background if no image
    if (imgSrc === undefined)
    {
        ctx.fillStyle = cellColor[cellType[facedId]];
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    else
    {
        drawImage(imgSrc, 0, 0, canvasWidth, canvasHeight, ctx);
    }

    // Door closed
    if (doorCells.has(facedId) && !tknD.has(facedId) && doorCells.get(facedId) == playerCellId)
    {
        drawImage(cellUrl["grille"], 0, 0, canvasWidth, canvasHeight, ctx);
    }

    if (cellType[facedId] == "sortie" && shouldOpenDoor)
    {
        startGif("../res/images/exitDoor.gif", 0, 0, canvasWidth, canvasHeight, false);
    }

    // Renders chainsaw
    if (keyAmnt > 0)
    {
        startGif("../res/images/chainsaw.gif", canvasWidth/4, canvasHeight/2, canvasWidth/2, canvasHeight/2);
    }
    else
    {
        drawImage("../res/images/chainsaw/frame_0.png", canvasWidth/4, canvasHeight/2, canvasWidth/2, canvasHeight/2, gifCtx);
    }
}


// TODO: change canvas' aspect ration (hardcode it on images used or do it dynamically)
function drawImage(imgSrc, x, y, width, height, context)
{
    const img = new Image();
    img.src = imgSrc;
    img.onload = function()
    {
        context.drawImage(img, x, y, width, height);
    };
}


async function loadGifFrames(gifPath)
{
    const folderPath = gifPath.replace(".gif", "/");

    const response = await fetch(folderPath + "gifInfo.txt");  // Only contains frame amount
    if (!response.ok)
        throw new Error("Error reading gifInfo.txt");

    const frameAmnt = parseInt(await response.text());
    const frames = [];

    for (let i = 0; i < frameAmnt; i++)
    {
        const img = new Image();
        img.src = folderPath + "frame_" + i + ".png";
        await new Promise(res => img.onload = res);
        frames.push(img);
    }

    gifFrames.set(gifPath, frames);
    gifCurrentFrame.set(gifPath, { index: 0, prevIndex: -1, finished: false });
}


async function startGif(gifPath, x, y, width, height, inf = true)
{
    if (!gifFrames.has(gifPath))
    {
        await loadGifFrames(gifPath);
    }
    animateGif(gifPath, x, y, width, height, 0, inf);
}


function animateGif(gifPath, x, y, width, height, time = 0, inf)
{
    const frames = gifFrames.get(gifPath);
    if (!frames)
        return;

    if (time - lastTime >= frameDuration)
    {
        const frameData = gifCurrentFrame.get(gifPath);
        const frameIndex = frameData.index;

        gifCtx.clearRect(x, y, width, height);
        gifCtx.drawImage(frames[frameIndex], x, y, width, height);

        let newIndex = inf ? (frameIndex + 1) % frames.length : frameIndex + 1;

        if (!inf && newIndex >= frames.length)
        {
            newIndex = frames.length - 1;

            if (!frameData.finished && frameData.prevIndex !== frameIndex)
            {
                frameData.finished = true;
                jumpScare();
            }
        }

        frameData.prevIndex = frameData.index;
        frameData.index = newIndex;
        gifCurrentFrame.set(gifPath, frameData);
        lastTime = time;
    }

     if (inf || !gifCurrentFrame.get(gifPath).finished)
    {
        requestAnimationFrame(t => animateGif(gifPath, x, y, width, height, t, inf));
    }
}


function jumpScare()
{
    drawImage("../res/images/cyberdemon.webp", 0, 0, canvasWidth, canvasHeight, gifCtx);

    const audio = new Audio("../res/sounds/foxy_screamer.m4a");
    audio.play();
}