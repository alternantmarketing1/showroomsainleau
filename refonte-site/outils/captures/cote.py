# Figma et préprod côte à côte, par tranches. Usage : python3 cote.py figma.png site.png prefixe [tranche]
import sys
from PIL import Image
f=Image.open(sys.argv[1]).convert('RGB'); s=Image.open(sys.argv[2]).convert('RGB'); pre=sys.argv[3]; t=int(sys.argv[4]) if len(sys.argv)>4 else 1400
if f.size[0]!=1440: f=f.resize((1440,round(f.size[1]*1440/f.size[0])))
H=max(f.size[1],s.size[1]); n=0
for y in range(0,H,t):
    c=Image.new('RGB',(1440*2+20,t),(214,214,214))
    c.paste(f.crop((0,y,1440,min(y+t,f.size[1]))) if y<f.size[1] else Image.new('RGB',(1,1),'white'),(0,0))
    c.paste(s.crop((0,y,1440,min(y+t,s.size[1]))) if y<s.size[1] else Image.new('RGB',(1,1),'white'),(1460,0))
    c.resize((c.size[0]//2,t//2)).save(f'{pre}-{n}.png'); n+=1
print(n)
