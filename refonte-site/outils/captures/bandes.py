# Découpe une capture haute en bandes posées côte à côte. Usage: bandes.py img.png sortie.png hauteur [largeur_max]
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB'); h=int(sys.argv[3]); wmax=int(sys.argv[4]) if len(sys.argv)>4 else im.width
im=im.crop((0,0,min(im.width,wmax),im.height))
n=(im.height+h-1)//h
out=Image.new('RGB',(n*(im.width+16),h),'#888')
for i in range(n):
    out.paste(im.crop((0,i*h,im.width,min(im.height,(i+1)*h))),(i*(im.width+16),0))
out.save(sys.argv[2]); print(n)
