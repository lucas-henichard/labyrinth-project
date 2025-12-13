import 
{
    neiCells, doorCells, playerCellId, keyAmnt, tknK, tknD,
    setKeyAmnt, face, setFace, doorOpening, cellType, setDoorOpening,
    setScore, score, exitCell, doorOpened, IdArr,
} from "./mazeData.js";

import { drawInFront, displayMsg, displayHelp } from "./rendering.js";


const faces = ["O", "N", "E", "S"];
const movementFactor = 0.01;
const hiddenSum = 10;


window.addEventListener('keydown', (event) =>
{
    let shouldOpenDoor = false;
    let redraw = false;

    switch(event.key.toLowerCase())
    {
        case 'z':
            redraw = movePlayer(face);
            break;
        case 'd':
            setFace(faces[(faces.indexOf(face) + 1) % 4])
            console.log(face);
            redraw = true;
            break;
        case 'q':
            setFace(faces[(faces.indexOf(face) - 1) % 4])
            if (face == undefined)
                setFace("S");
            redraw = true;
            console.log(face);
            break;
        case " ":
            redraw = movePlayer("C");
            break;
        case "r":
            // Reset the game
            localStorage.clear();
            localStorage.setItem("id", "-1");
            window.location.href = "cell.php";
            break;
        case "e":
            if (cellType[neiCells.get(face)] == "sortie" && !doorOpening)
            {
                setDoorOpening(true);
                shouldOpenDoor = true;
            }
            redraw = true;
            break;
        case "t":
            displayHelp();
            break;
    }

    console.log("should redraw: " + redraw);
    if (redraw)
        drawInFront(shouldOpenDoor);
});


function movePlayer(direction)
{
    if (!neiCells.has(direction))
    {
        console.log("No cell in direction: " + direction);
        return false;
    }

    if (score == undefined)
        score = 100;

    if (direction == "C")
    {
        setScore(score + hiddenSum);
    }
    else
    {
        setScore(score - score * movementFactor);
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
                return false;
            }
        } 
        else  // Door already opened
        {
            console.log("Door already opened, passing through.");
        }
    }
    
    if (!doorOpened && cellType[neiCells.get(direction)] == "sortie")
    {
        displayMsg("Press e to open the door");
        return false;
    }
    
    // Save new state to localStorage
    localStorage.setItem("id", newCellId.toString());                                       // new player position
    localStorage.setItem("keys", keyAmnt.toString());                                       // keys amount
    localStorage.setItem("takenKeys", Array.from(tknK).join(','));                          // collected keys
    localStorage.setItem("takenDoors", Array.from(tknD).join(','));                         // opened doors 
    localStorage.setItem("face", face);                                                     // faced direction
    localStorage.setItem("exitCell", exitCell.toString());                                  // exitCell id
    localStorage.setItem("score", score.toString());                                        // score
    localStorage.setItem("cellType", cellType.join(','));                                   // cell type
    localStorage.setItem("IdArr", IdArr.join(','));                                         // all cell ids
    localStorage.setItem("doorCells", JSON.stringify(Array.from(doorCells.entries())));     // door cells

    window.location.href = "cell.php";

    return true;
}
