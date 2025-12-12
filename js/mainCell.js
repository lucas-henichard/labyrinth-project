import
{ 
    playerCellId, keyAmnt, doorCells, cellType, fetchSql, setKeyAmnt, IdArr,
    setPlayerCellId, tknK , tknD, neiCells, setFace, face, score, exitCell,
    setExitCell
} from "./mazeData.js";

import { drawInFront } from "./rendering.js";


async function cell_onLoad()
{
    await fetchSql();  // TODO: test if this is needed
    
    // If no cell is specified, load start
    if (playerCellId == -1)
        setPlayerCellId(getCellId("depart"));
    
    if (exitCell == -1)
        setExitCell(getCellId("sortie"));
    
    if (face == undefined)
        setFace("N");
    
    drawInFront();
    
    console.log("neiCells: ");
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
        console.log("Your score is: " + score);
        console.log("You reached the exit");  // TODO: show victory screen or smth similar
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

    await cell_onLoad();
});


window.addEventListener("resize", resizeCanvas, false);


function resizeCanvas() 
{
    //resize canvas
    if(window.innerHeight >= (16*window.innerWidth/9)) 
    {
        canvas.width  = window.innerWidth;
        canvas.height = Math.floor(16*canvas.width/9);

        textCanvas.width  = window.innerWidth;
        textCanvas.height = Math.floor(16*textCanvas.width/9);
        
        gifCanvas.width  = window.innerWidth;
        gifCanvas.height = Math.floor(16*gifCanvas.width/9);

    }
    else 
    {
        canvas.height = window.innerHeight;
        canvas.width  = Math.floor(9*canvas.height/16);
        
        gifCanvas.height = window.innerHeight;
        gifCanvas.width  = Math.floor(9*gifCanvas.height/16);
        
        textCanvas.height = window.innerHeight;
        textCanvas.width  = Math.floor(9*textCanvas.height/16);
    }
}
