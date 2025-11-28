import {neiCells, doorCells, playerCellId, keyAmnt, tknK, tknD, setKeyAmnt, face, setFace} from "./mazeData.js";
import {drawInFront} from "./mainCell.js";

var faces = ["O", "N", "E", "S"];


window.addEventListener('keydown', (event) =>
{
    switch(event.key.toLowerCase())
    {
        case 'z':
            movePlayer(face);
            break;
        case 's':
            // TODO: delete
            //movePlayer("S");
            break;
        case 'd':
            //movePlayer("E");
            setFace(faces[(faces.indexOf(face) + 1) % 4])
            console.log(face);
            break;
        case 'q':
            //movePlayer("O");
            setFace(faces[(faces.indexOf(face) - 1) % 4])
            if (face == undefined)
                setFace("S");
            console.log(face);
            break;
        case " ":
            movePlayer("C");
            break;
        case "r":
            localStorage.clear();
            localStorage.setItem("id", playerCellId.toString());
            window.location.href = "cell.php";
            break;
        case "t":
            localStorage.clear();
            localStorage.setItem("id", "13");
            window.location.href = "cell.php";
            break;
    }

    drawInFront();
});


export function movePlayer(direction)
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
                setKeyAmnt(keyAmnt - 1);
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
    localStorage.setItem("face", face);                                  // faced direction

    window.location.href = "cell.php";
}
