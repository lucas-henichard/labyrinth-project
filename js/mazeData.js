import { getCellId } from "./mainCell.js";


export const cellSize = 100;

export var keyAmnt = 0;
export var doorCells = new Map();
export var face = "N";

export var IdArr, cellType, cell1, cell2, face1, face2;
export var playerCellId = -1;
export var neiCells = new Map();  // face: cellId
export var tknK = new Set();  // Keys alr taken
export var tknD = new Set();  // Doors alr taken
export var score = 100;
export var exitCell = -1;

export var gifFrames = new Map();  // gifPath: [frame1Path, frame2Path, ...]
export var gifCurrentFrame = new Map();  // gifPath: currentFrameIndex

export var doorOpening = false;
export var doorOpened = false;

export const cellColor = 
{
    "vide": "lightgray",
    "cle": "yellow",
    "depart": "green",
    "sortie": "blue",
    "undefined": "black"
};

export const cellUrl = 
{
    "undefined": "../res/images/wall.png",
    "grille": "../res/images/door.jpg",
    "vide": "../res/images/empty hallway.jpg",
    "cle": "../res/images/jerrycanHalo.jpg",
    "sortie": "../res/images/exitDoor/frame_0.png",
    "depart": "../res/images/empty room.png"
}


export async function fetchSql()
{
    if (!cellType || !IdArr)
    {
        IdArr = new Array();
        cellType = new Array();

        await fetch("../database/getHallways.php")
            .then(response =>
            {
                if (!response.ok)
                    throw new Error("Network error");
                return response.json(); // <-- transform json stream to js object
            })
            .then(data => 
            {
                // loop through result
                for (let i = 0; i < data.length; i++)
                {
                    let id = data[i].id;
                    IdArr[i] = id;
                    cellType[id] = data[i].type;
                }
            })
            .catch(error => console.error("Error :", error));
    }

    if (doorCells.size == 0 || !doorCells)
    {
        await fetch("../database/getClosedDoors.php")
            .then(response => 
            {
                if (!response.ok)
                    throw new Error ("Network error");
                return response.json();
            })
            .then(data =>
            {
                // loop through result
                for (let i = 0; i < data.length; i++)
                {
                    doorCells.set(data[i].couloir1, data[i].couloir2);
                    doorCells.set(data[i].couloir2, data[i].couloir1);
                }
            })
            .catch(error => console.error("Error: ", error));
    }

    if (playerCellId == -1 || playerCellId == undefined)
        setPlayerCellId(getCellId("depart"));
    
    await refreshNeiCells();
}


export async function refreshNeiCells()
{
    neiCells.clear();

    await fetch(`../database/getNeiCells.php?playerCellId=${playerCellId}`)
        .then(response =>
        {
            if (!response.ok)
                throw new Error("Network error");
            return response.json();
        })
        .then(data =>
        {
            for (const face in data)
            {
                neiCells.set(face, data[face]);
            }
        })
        .catch(error => console.error("Error: ", error));
}



export function setPlayerCellId(id)
{
    playerCellId = id;
}


export function setKeyAmnt(amnt)
{
    keyAmnt = amnt;
}


export function setFace(newFace)
{
    face = newFace;
}


export function setGifFrames(gifPath, frames)
{
    gifFrames.set(gifPath, frames);
}


export function setGifCurrentFrame(gifPath, frameData)
{
    gifCurrentFrame.set(gifPath, frameData);
}


export function setDoorOpening(isOpening)
{
    doorOpening = isOpening;
}


export function setScore(newScore)
{
    score = newScore; 
}


export function setExitCell(exitCellId)
{
    exitCell = exitCellId;
}


export function setDoorOpened(isOpened)
{
    doorOpened = isOpened;
}

export function setIdArr(newIdArr)
{
    IdArr = newIdArr;
}


export function setCellType(newCellType)
{
    cellType = newCellType;
}


export function setDoorCells(newDoorCells)
{
    doorCells = newDoorCells;
}
