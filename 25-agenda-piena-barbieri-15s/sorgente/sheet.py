import sys
from PIL import Image
fs=[f'frames/s_{float(t):05.2f}.jpg' for t in sys.argv[1:]];W,H=270,480
s=Image.new('RGB',(W*len(fs)+4*len(fs),H),'white')
for i,f in enumerate(fs): s.paste(Image.open(f).resize((W,H)),(i*(W+4),0))
s.save('sheet.jpg',quality=85)
