import {neiCells, doorCells, playerCellId, keyAmnt, tknK, tknD, setKeyAmnt} from "./mazeData.js";

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

    window.location.href = "cell.php";
}