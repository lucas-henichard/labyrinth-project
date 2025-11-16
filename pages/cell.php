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
        <h1>
            <?php echo "Cell ID: " . $cellId; ?>
        </h1>
        
        <canvas id="cellCanvas" width="300" height="300" style="border:1px solid black;"></canvas>
        <script src="../js/cell.js" defer></script>
        
    </body>
</html>