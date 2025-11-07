function playButton_onClick()
{
    window.open("pages/main.php");  // open main game page
    //document.getElementById(compiler).style.display="block"; 
}
    
function mainPhp_onLoad()
{
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");
        
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 150, 75);    
}

function testButton_onClick()
{
    // Source - https://stackoverflow.com/a
    // Posted by JuNas
    // Retrieved 2025-11-07, License - CC BY-SA 4.0

    /*
    fetch('../js/test.php', {
        method: 'GET',
    }).then(response => response.json() ).then(result=>{
    alert(result);
    });*/

    var u = fetch("http://localhost/js/test.php")
        .then(response => {
            if (!response.ok) throw new Error("Erreur réseau");
            return response.json(); // <-- transforme le flux JSON en objet JS
        })
        .then(data => {
            console.log("Réponse SQL :", data.type);
            // Exemple : parcourir les résultats
            data.forEach(row => console.log(row.id, row.type));
        })
        .catch(error => console.error("Erreur :", error));

    //console.log(u.type);
    //window.open("js/test.php");
}