import 
{
    cellType, cellColor, tknD, neiCells, face, cellUrl,
    doorCells, playerCellId, gifFrames, gifCurrentFrame,
    keyAmnt, setDoorOpened
} from "./mazeData.js";


// Canvas setup
const canvas = document.getElementById("cellCanvas");
const ctx = canvas.getContext("2d");

const gifCanvas = document.getElementById("gifCanvas");
const gifCtx = gifCanvas.getContext("2d");

const textCanvas = document.getElementById("textCanvas");
const textCtx = textCanvas.getContext("2d");

// GIF settings
const gifFps = 30;
const frameDuration = 1000 / gifFps;
let lastTime = 0;


export async function drawInFront(shouldOpenDoor = false)
{
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);

    let facedId = neiCells.get(face);
    let imgSrc = cellUrl[cellType[facedId]];

    // Default background if no image
    if (imgSrc === undefined)
    {
        ctx.fillStyle = cellColor[cellType[facedId]];
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    else
    {
        drawImage(imgSrc, 0, 0, canvas.width, canvas.height, ctx);
    }

    // Door closed
    if (doorCells.has(facedId) && !tknD.has(facedId) && doorCells.get(facedId) == playerCellId)
    {
        drawImage(cellUrl["grille"], 0, 0, canvas.width, canvas.height, ctx);
    }

    if (cellType[facedId] == "sortie" && shouldOpenDoor)
    {
        await startGif("../res/images/exitDoor.gif", 0, 0, gifCanvas.width, gifCanvas.height, false);
        gifCtx.clearRect(0, 0, gifCanvas.width, gifCanvas.height);
        setDoorOpened(true);
    }

    // Renders chainsaw
    if (keyAmnt > 0)
    {
        startGif("../res/images/chainsaw.gif", gifCanvas.width/4, gifCanvas.height/2, gifCanvas.width/2, gifCanvas.height/2);
    }
    else
    {
        drawImage("../res/images/chainsaw/frame_0.png", gifCanvas.width/4, gifCanvas.height/2, gifCanvas.width/2, gifCanvas.height/2, gifCtx);
    }
}


function drawImage(imgSrc, x, y, width, height, context)
{
    const img = new Image();
    img.src = imgSrc;
    img.onload = function()
    {
        context.drawImage(img, x, y, width, height);
    };
}


async function loadGifFrames(gifPath)
{
    const folderPath = gifPath.replace(".gif", "/");

    const response = await fetch(folderPath + "gifInfo.txt");  // Only contains frame amount
    if (!response.ok)
        throw new Error("Error reading gifInfo.txt");

    const frameAmnt = parseInt(await response.text());
    const frames = [];

    for (let i = 0; i < frameAmnt; i++)
    {
        const img = new Image();
        img.src = folderPath + "frame_" + i + ".png";
        await new Promise(res => img.onload = res);
        frames.push(img);
    }

    gifFrames.set(gifPath, frames);
    gifCurrentFrame.set(gifPath, { index: 0, prevIndex: -1, finished: false });
}


async function startGif(gifPath, x, y, width, height, inf = true)
{
    if (!gifFrames.has(gifPath))
    {
        await loadGifFrames(gifPath);
    }

    animateGif(gifPath, x, y, width, height, 0, inf);
}


function animateGif(gifPath, x, y, width, height, time = 0, inf)
{
    const frames = gifFrames.get(gifPath);
    if (!frames)
        return;

    if (time - lastTime >= frameDuration)
    {
        const frameData = gifCurrentFrame.get(gifPath);
        const frameIndex = frameData.index;

        gifCtx.clearRect(x, y, width, height);
        gifCtx.drawImage(frames[frameIndex], x, y, width, height);

        let newIndex = inf ? (frameIndex + 1) % frames.length : frameIndex + 1;

        if (!inf && newIndex >= frames.length)
        {
            newIndex = frames.length - 1;

            if (!frameData.finished && frameData.prevIndex !== frameIndex)
            {
                frameData.finished = true;
                jumpScare();
            }
        }

        frameData.prevIndex = frameData.index;
        frameData.index = newIndex;
        gifCurrentFrame.set(gifPath, frameData);
        lastTime = time;
    }

    if (inf || !gifCurrentFrame.get(gifPath).finished)
    {
        requestAnimationFrame(t => animateGif(gifPath, x, y, width, height, t, inf));
    }
}


function jumpScare()
{
    const audio = new Audio("../res/sounds/foxy_screamer.m4a");
    audio.play();

    drawImage("../res/images/cyberdemon.webp", 0, 0, canvas.width, canvas.height, gifCtx);
}


export function displayMsg(message, x = 0, y = 0, textSizeDivisor = 32)
{
    textCtx.clearRect(x, y, canvas.width, canvas.height);
    textCtx.font = Math.round(textCanvas.height/textSizeDivisor) + "px serif";
    textCtx.fillStyle = "gray";
    textCtx.fillText(message, textCanvas.width/10, textCanvas.height - (9*textCanvas.height/10));
}