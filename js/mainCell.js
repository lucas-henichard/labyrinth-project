import
{
    playerCellId, keyAmnt, cellType, fetchSql, setKeyAmnt,
    setPlayerCellId, tknK , tknD, setFace, face, score, exitCell,
    setExitCell, IdArr, setScore, setIdArr, setCellType,
    setDoorCells,
} from "./mazeData.js";

import { drawInFront, displayMsg, displayHelp } from "./rendering.js";


const RATIO = 16 / 9;
let canvas, ctx;
let gifCanvas, gifCtx;
let textCanvas, textCtx;


async function cell_onLoad()
{
    await fetchSql();

    if (exitCell == -1)
        setExitCell(getCellId("sortie"));
    
    if (face == undefined)
        setFace("N");
    
    if (cellType[playerCellId] == "sortie")
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        displayMsg("You reached the exit! Your score is: " + score, canvas.width / 5, canvas.height / 2, 16);
        return;
    }

    drawInFront();

    if (cellType[playerCellId] == "depart")
    {
        displayHelp();
    }

    if (cellType[playerCellId] == "cle")
    {
        if (!tknK.has(playerCellId))
        {
            setKeyAmnt(keyAmnt + 1);
            tknK.add(playerCellId);
        }
    }
}


export function getCellId(cell)
{
    for (let i = 0; i < cellType.length; i++)
    {
        if (cellType[i] == cell)
        {
            return i;
        }
    }
}


window.addEventListener('DOMContentLoaded', async () => 
{
    // Load saved data
    loadData();

    // Canvas setup
    canvas = document.getElementById("cellCanvas");
    gifCanvas = document.getElementById("gifCanvas");
    textCanvas = document.getElementById("textCanvas");
    
    ctx = canvas.getContext("2d");
    gifCtx = gifCanvas.getContext("2d");
    textCtx = textCanvas.getContext("2d");

    resizeCanvas(false);

    await cell_onLoad();
});


function resizeCanvas()
{
    if (!canvas || !gifCanvas || !textCanvas)
        return;

    const dpr = window.devicePixelRatio || 1;
    const windowWidth  = window.innerWidth;
    const windowHeight = window.innerHeight;

    let width  = windowWidth;
    let height = width / RATIO;
    if (height > windowHeight) 
    {
        height = windowHeight;
        width  = height * RATIO;
    }

    [ {canvas, ctx}, {canvas: gifCanvas, ctx: gifCtx} ].forEach(c =>
    {
        c.canvas.style.width  = width + "px";
        c.canvas.style.height = height + "px";
    });

    // textCanvas gets a better resolution for clearer text
    textCanvas.style.width  = width + "px";
    textCanvas.style.height = height + "px";
    textCanvas.width  = width * dpr;
    textCanvas.height = height * dpr;
    textCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}


window.addEventListener("resize", () =>
{
        resizeCanvas();
});


function loadData()
{
    setPlayerCellId(parseInt(localStorage.getItem("id")));
    if (isNaN(playerCellId))
        setPlayerCellId(-1);
    
    setKeyAmnt(parseInt(localStorage.getItem("keys")));
    if (isNaN(keyAmnt))
        setKeyAmnt(0);

    tknK.clear();
    const tknKStr = localStorage.getItem("takenKeys");
    if (tknKStr && tknKStr.length > 0)
    {
        tknKStr.split(',').forEach(id => 
        {
            if (id !== '')
                tknK.add(parseInt(id));
        });
    }

    tknD.clear();
    const tknDStr = localStorage.getItem("takenDoors");
    if (tknDStr && tknDStr.length > 0)
    {
        tknDStr.split(',').forEach(id => 
        {
        if (id !== '')
            tknD.add(parseInt(id));
        });
    }
    
    setFace(localStorage.getItem("face"));
    
    const savedScore = parseInt(localStorage.getItem("score"));
    setScore(Number.isNaN(savedScore) ? 100 : savedScore);

    setExitCell(parseInt(localStorage.getItem("exitCell")));
    if (isNaN(exitCell))
        setExitCell(-1);

    setIdArr(localStorage.getItem("IdArr") ? localStorage.getItem("IdArr").split(',').map(id => parseInt(id)) : []);
    if (!IdArr || IdArr.length == 0)
        setIdArr(undefined);

    setCellType(localStorage.getItem("cellType") ? localStorage.getItem("cellType").split(',') : []);
    if (!cellType || cellType.length == 0)
        setCellType(undefined);

    setDoorCells(new Map());
    const doorCellsStr = localStorage.getItem("doorCells");
    if (doorCellsStr && doorCellsStr.length > 0)
    {
        const doorEntries = JSON.parse(doorCellsStr);
        setDoorCells(new Map(doorEntries));
    }
}
