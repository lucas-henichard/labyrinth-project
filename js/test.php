<?php
    header('Content-Type: application/json; charset=utf-8');

    $file_db .= "../database/labyrinthe.db";
    $sqlite = new SQLite3(filename: $file_db);
        
    $sql = 'select couloir.id, couloir.type from couloir;';
        
    /*
    $request = $sqlite->prepare($sql);
    $request->bindValue('','', SQLITE3_TEXT);
        
    $result = $request->execute();
    */

    $result = $sqlite->query($sql);
    
    //echo $data = $result->fetchArray(SQLITE3_ASSOC);
    
    /*
    <script>
        
        var data = <?php echo $data; ?>
        console.log(data);
        for (let i = 0; i < 26; i++)
        {
            console.log(data[i]);
        }
        
    </script> */
    $data = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $data[] = $row;
    }

    // On renvoie le tableau sous forme JSON
    echo json_encode($data);

?>
