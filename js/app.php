<script>

    var canvas;
    var ctx;
    var db;
    
    function mainPhp_onLoad()
    {
            var tiles = <?php
                $file_db .= "./database/labyrinthe.db";
                $sqlite = new SQLite3(filename: $file_db);
        
                $sql = 'select couloir.id, couloir.type from couloir;';
        
                /*
                $request = $sqlite->prepare($sql);
                $request->bindValue('','', SQLITE3_TEXT);
        
                $result = $request->execute();
                */

                $result = $sqlite->query($sql);
                echo $result;
            ?>
            
            for (let i = 0; i < 26; i++)
            {
                console.log(tiles[i] + ' ');
            }
    }

    function drawLabyrinth(canvas, ctx)
    {
        // position initiale x, y; taille des carreaux sur la taille du canvas et taille du lab
    }
    
    function getHallways()
    {
        // get positions of hallways and the walls / items + id 
    }

</script>