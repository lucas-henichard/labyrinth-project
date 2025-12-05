import
{ 
    playerCellId, keyAmnt, doorCells, IdArr, cellType, fetchSql, setKeyAmnt,
     setPlayerCellId, tknK , tknD, neiCells, setFace, face
} from "./mazeData.js";

import { drawInFront } from "./rendering.js";


async function cell_onLoad()
{
    await fetchSql();

    // If no cell specified, load start
    if (playerCellId == -1)
        setPlayerCellId(loadStart());

    if (face == undefined)
        setFace("N");
    
    drawInFront();
    
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
        console.log("You reached the exit");  // TODO: show victory screen or smth similar
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