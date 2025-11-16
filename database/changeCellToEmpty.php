<?php
    header('Content-Type: application/json; charset=utf-8');

    $file_db = "../database/labyrinthe.db";
    $sqlite = new SQLite3(filename: $file_db);
        
    $sql = 'select * from passage where type = "grille";';  // TODO: change this to change a specific cell to empty, might be done in cell.php instead

    $result = $sqlite->query($sql);  // Change this to only change the db but not return anything
?>
