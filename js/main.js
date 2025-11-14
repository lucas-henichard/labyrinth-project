const cellSize = 100;  // Size of cells in px
var labyrinth = new Array();  // Contains a string, type of cell (empty, key...) add p to the string where the player is located

var cellColor = 
{
    "vide": "lightgray",
    "cle": "yellow",
    "depart": "green",
    "sortie": "blue",
    "secret": "lightgray",
    "unknown": "black"
};

function playButton_onClick()
{
    window.open("pages/main.php");  // open main game page
    //document.getElementById(compiler).style.display="block"; 
}


async function testButton_onClick()
{
    // Cell id and description
    var cellId = new Array();
    var cellType = new Array();

    // ways between cells
    var cell1 = new Array();
    var cell2 = new Array();
    var face1 = new Array();
    var face2 = new Array();
    var doorType = new Array();

    await fetch("http://localhost/js/getHallways.php")
        .then(response =>
        {
            if (!response.ok) throw new Error("Network error");
            return response.json(); // <-- transform json stream to js object
        })
        .then(data => 
        {
            console.log("Réponse SQL :", data);
            
            // loop through result
            for (let i = 0; i < data.length; i++)
            {
                cellId[i] = data[i].id;
                cellType[i] = data[i].type;
            }

            //drawMap(idArr, typeArr);

        })
        .catch(error => console.error("Error :", error));
        

    await fetch("http://localhost/js/getDoors.php")
        .then(response => 
        {
            if (!response.ok) throw new Error ("Network error");
            return response.json();
        })
        .then(data =>
        {
            console.log("SQL answer!", data);

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

    /*
    placeCell(0,0, cellType[0]);
    // TODO: voir pour le faire à la fin
    createLabyrinth(cellId, cellType, cell1, cell2, face1, face2, doorType, 1, 0, 0, -1);
    */
    var start = loadStart(cellId, cellType);

    if (start == -1)
    {
        console.log("Error: starting point not found");
        return;
    }

    drawCloseMaze(cellId, cellType, cell1, cell2, face1, face2, doorType, start);
}


function drawCloseMaze(IdArr, typeArr, cell1, cell2, face1, face2, doorType, playerId)
{
    // Place middle cell, player's pos
    console.log("player" + playerId);
    placeCell(1, 1, typeArr[playerId]);

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
        var currCell = playerOn1 ? cell1[i] : cell2[i];  // Other is player's cell
        var face = !playerOn1 ? face1[i] : face2[i];  // Where the next cell is

        if (checkVisited(visited, currCell))
            continue;

        visited.add(currCell);

        var newX = 1;
        var newY = 1;

        switch (face)
        {
            case "N":
                newY -= 1;
                break;

            case "S":
                newY += 1;
                break;

            case "E":
                newX += 1;
                break;

            case "W":
            case "O":
                newX -= 1;
                break;
        }

        console.log("currcell " + currCell);
        placeCell(newX, newY, typeArr[currCell]);
    }
}


function playTurn()
{

}


function loadStart(IdArr, typeArr)
{
    for (let i = 0; i < IdArr.length; i++)
    {
        if (typeArr[IdArr[i]] == "depart")
        {
            return IdArr[i];
        }
    }

    return -1;
}


function createLabyrinth(idArr, typeArr, cell1, cell2, face1, face2, doorType, lastCell, lastX, lastY, previousCell)
{
    var couple = new Set();
    couple.add(previousCell);
    couple.add(lastCell);
    var totalOccurences = 0; //countOccurences(lastCell, cell1, cell2);

    for (let i = 0; i < cell1.length; i++)
    {
        if (cell1[i] == lastCell || cell2[i] == lastCell)
            totalOccurences++;
    }
    
    //if (couple[0] == -1)
        totalOccurences;


    for (let i = 0; i < cell1.length; i++)
    {
        // isnt linked to lastCell
        if (cell1[i] != lastCell && cell2[i] != lastCell)
            continue;

        //console.log(i);
        var isCell1 = cell1[i] == lastCell;
        var currCell = isCell1 ? cell1[i] : cell2[i];
        var nextCell = isCell1 ? cell2[i] : cell1[i];
        var face = isCell1 ? face1[i] : face2[i];
        var nextFace = isCell1 ? face2[i] : face1[i];

        // Cell was alr visited
        if (checkVisited(couple, nextCell))
            continue;

        couple.add(nextCell);

        console.log("total occ: " + totalOccurences)
        //console.log("cellId: " + currCell + ", lastCell: " + lastCell + ", cellType: " + typeArr[i]);

        var newX = lastX;
        var newY = lastY;

        switch (nextFace)
        {
            case "N":
                newY -= 1;
                break;

            case "S":
                newY += 1;
                break;

            case "E":
                newX += 1;
                break;

            case "W":
            case "O":
                newX -= 1;
                break;
        }

        /*if (labyrinth[newX] == undefined)
            labyrinth[newX] = new Array();*/
    
        //labyrinth[newX][newY] = typeArr[i];

        placeCell(newX, newY, typeArr[i]);

        if (couple.length == totalOccurences)
            return;

        createLabyrinth(idArr, typeArr, cell1, cell2, face1, face2, doorType, nextCell, newX, newY, previousCell);
    }
}


function placeCell(x, y, cellType)
{
    const canvas = document.getElementById("mainCanvas");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = cellColor[cellType];
    console.log(cellColor[cellType]);
    console.log(cellType);
    ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
}


function countOccurences(cellId, cell1, cell2)
{
    var count = 0;
    
    for (let i = 0; i < cell1.length; i++)
    {
        if (cell1 == cellId || cell2 == cellId)
        {
            count++;
        }
    }

    return count;
}


function checkVisited(visited, value)
{
    for (let i = 0; i < visited.length; i++)
    {
        if (value == visited[i])
            return true;
    }

    return false;
}