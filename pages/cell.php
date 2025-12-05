<?php
    $cellId = isset($_GET['id']) ? intval($_GET['id']) : -1;
    // TODO: add key help to know which key do what (zqsd)
    // TODO: show how many keys the player has if he has any (in js prolly)
?>

<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="../style/style.css" >
    </head>
    
    <body>
        <canvas id="cellCanvas"></canvas>
        <canvas id="gifCanvas"></canvas>
        
        <script src="../js/mazeData.js" defer type="module"></script>
        <script src="../js/mainCell.js" defer type="module"></script>
        <script src="../js/playerMovement.js" defer type="module"></script>
    </body>
</html>