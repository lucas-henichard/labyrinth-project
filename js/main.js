function playButton_onClick()
{
    window.open("pages/cell.php");  
    localStorage.clear();
    playBgMusic();
}


function playBgMusic()
{
    const bgMusic = new Audio("../res/sounds/bg_music.m4a");
    bgMusic.volume = 0.2;
    bgMusic.loop = true;
    bgMusic.play();
}