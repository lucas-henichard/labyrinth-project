<?php
    header('Content-Type: application/json; charset=utf-8');

    $file_db = "../database/labyrinthe.db";
    $sqlite = new SQLite3(filename: $file_db);
    
    if (isset($_GET['id']))
    {
        $sql = 'update couloir set type="vide" where id=:id;'; 
    }
    else
    {
        // TODO: Raise error
    }

    $request = $sqlite -> prepare($sql);
    $request -> bindValue(':id', $id, SQLITE3_INTEGER);

    $result = $request -> execute();
?>