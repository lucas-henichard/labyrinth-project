export const cellSize = 100;

export var keyAmnt = 0;
export var doorCells = new Map();
export var face = "N";

export var IdArr, cellType, cell1, cell2, face1, face2, doorType;
export var playerCellId = -1;
export var neiCells = new Map();
export var tknK = new Set();  // Keys alr taken
export var tknD = new Set();  // Doors alr taken

export const cellColor = 
{
    "vide": "lightgray",
    "cle": "yellow",
    "depart": "green",
    "sortie": "blue",
    "undefined": "black"
};

export const doorColor = 
{
    "libre": "lightgray",
    "grille": "yellow",
}


export const cellUrl = 
{
    "undefined": "../res/images/wall.png",
    "grille": "../res/images/door.jpg",
    "vide": "../res/images/empty hallway.jpg",
    "cle": "../res/images/jerrycanHalo.jpg",
    /*"sortie": "../res/images/exit.png",  // TODO: find an exit image
    "cyberdemon": "../res/images/cyberdemon.png"*/  // screamer img
}
// "chainsaw": "../res/images/chainsaw.gif",  // TODO: dont forget to consider the extension


export async function fetchSql()
{
    // Cell id and description
    IdArr = new Array();
    cellType = new Array();

    // ways between cells
    cell1 = new Array();
    cell2 = new Array();
    face1 = new Array();
    face2 = new Array();
    doorType = new Array();

    await fetch("../database/getHallways.php")
        .then(response =>
        {
            if (!response.ok) throw new Error("Network error");
            return response.json(); // <-- transform json stream to js object
        })
        .then(data => 
        {
            console.log("couloirs: ", data);
            
            // loop through result
            for (let i = 0; i < data.length; i++)
            {
                let id = data[i].id;

                IdArr[id] = id;
                cellType[id] = data[i].type;
            }
        })
        .catch(error => console.error("Error :", error));
        
    await fetch("../database/getDoors.php")
        .then(response => 
        {
            if (!response.ok) throw new Error ("Network error");
            return response.json();
        })
        .then(data =>
        {
            console.log("passages: ", data);

            // loop through result
            for (let i = 0; i < data.length; i++)
            {
                cell1[i] = data[i].couloir1;
                cell2[i] = data[i].couloir2;
                face1[i] = data[i].position1;
                face2[i] = data[i].position2;
                doorType[i] = data[i].type;
            }
        })
        .catch(error => console.error("Error: ", error));

    await fetch("../database/getClosedDoors.php")
        .then(response => 
        {
            if (!response.ok) throw new Error ("Network error");
            return response.json();
        })
        .then(data =>
        {
            console.log("Grilles: ", data);

            // loop through result
            for (let i = 0; i < data.length; i++)
            {
                doorCells.set(data[i].couloir1, data[i].couloir2);
                doorCells.set(data[i].couloir2, data[i].couloir1);
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


export function refreshNeiCells()
{
    neiCells.clear();

    for (let i = 0; i < cell1.length; i++)
    {
        // Cell isnt linked to player's
        if (cell1[i] != playerCellId && cell2[i] != playerCellId)
            continue;
    
        var playerOn1 = cell1[i] == playerCellId;
        var currCell = playerOn1 ? cell2[i] : cell1[i];  // Other is player's cell
        var newFace = playerOn1 ? face2[i] : face1[i];  // Where the next cell is
            
        neiCells.set(newFace, currCell); 
    }
}