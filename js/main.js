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