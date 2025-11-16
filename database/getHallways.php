<?php
    header('Content-Type: application/json; charset=utf-8');

    $file_db = "../database/labyrinthe.db";
    $sqlite = new SQLite3(filename: $file_db);
        
    $sql = 'select couloir.id, couloir.type from couloir;';

    $result = $sqlite->query($sql);

    $data = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $data[] = $row;
    }

    // return as json
    echo json_encode($data);
?>