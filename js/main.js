const cellSize = 50;  // Size of cells in px

function playButton_onClick()
{
    window.open("pages/main.php");  // open main game page
    //document.getElementById(compiler).style.display="block"; 
}
    
function mainPhp_onLoad()
{
    // display test
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");
        
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 150, 75);    
}

async function testButton_onClick()
{
    // Cell id and description
    var cellId = new Array();
    var cellType = new Array();

    // ways between cells
    var cell1 = new Array();
    var cell2 = new Array();
    var cell1Face = new Array();
    var cell2Face = new Array();
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
                cell1Face[i] = data[i].position1;
                cell2Face[i] = data[i].position2;
                doorType[i] = data[i].type;
            }
        })
        .catch(error => console.error("Error: ", error));

}

function drawMap(idArr, typeArr, cell1, cell2, cell1Face, cell2Face, doorType)
{
    
}