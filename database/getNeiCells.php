<?php
    header('Content-Type: application/json; charset=utf-8');

    $file_db = "../database/labyrinthe.db";
    $sqlite = new SQLite3(filename: $file_db);
    
    $playersCell = $_GET("id");

    $sql = 'select * from passage where couloir1=:playerPos or couloir2=:playerPos;';
    
	$query = $sqlite -> prepare($sql);	
	$query -> bindValue(':playerPos', $playersCell);
	
	$result = $query -> execute();

    $data = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) 
    {
        $data[] = $row;
    }

    echo json_encode($data);
?>
