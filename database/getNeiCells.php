<?php
header('Content-Type: application/json; charset=utf-8');

$file_db = "../database/labyrinthe.db";
$sqlite = new SQLite3($file_db);

$playerCellId = intval($_GET['playerCellId'] ?? -1); 

$stmt = $sqlite->prepare('SELECT couloir1, couloir2, position1, position2 
                          FROM passage 
                          WHERE couloir1=:playerCellId OR couloir2=:playerCellId;');
$stmt->bindValue(':playerCellId', $playerCellId, SQLITE3_INTEGER);

$result = $stmt->execute();

$neiCells = []; // face -> cellId

while ($row = $result->fetchArray(SQLITE3_ASSOC))
{
    $playerOn1 = ($row['couloir1'] == $playerCellId);
    $currCell  = $playerOn1 ? $row['couloir2'] : $row['couloir1'];
    $newFace   = $playerOn1 ? $row['position2'] : $row['position1'];
    $neiCells[$newFace] = $currCell;
}

echo json_encode($neiCells);
