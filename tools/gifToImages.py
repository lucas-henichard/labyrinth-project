# TODO: add a readme to help ppl how to execute this (pyinstaller command)

from PIL import Image
import os

gif_path: str = '../res/images/exitDoor.gif'

im: Image = Image.open(gif_path)

gif_name: str = os.path.splitext(os.path.basename(gif_path))[0]

output_dir: str = os.path.join('../res/images', gif_name)
os.makedirs(output_dir, exist_ok=True)

frame_number: int = 0
try:
    while True:
        # Transparency if possible
        transparency = im.info.get('transparency')

        frame_path: str = os.path.join(output_dir, f'frame_{frame_number}.png')

        # Save frame
        im.save(frame_path, transparency=transparency)
        print(f'Saved {frame_path}')

        # next frame
        frame_number += 1
        im.seek(im.tell() + 1)

except EOFError:
    # No more frame
    print(f'Total frames saved: {frame_number}')

file_path: str = os.path.join(output_dir, "gifInfo.txt")
with open(file_path, "w", encoding="utf-8") as f:
    f.write(str(frame_number))