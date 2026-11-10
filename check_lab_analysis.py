from PIL import Image

im = Image.open("dl_lab_analysis_samples.jpg")
print("Size:", im.size)
w, h = im.size
print("Center:", im.getpixel((w//2, h//2)))
print("Points:", [im.getpixel((w//4, h//4)), im.getpixel((3*w//4, h//4)), im.getpixel((w//4, 3*h//4)), im.getpixel((3*w//4, 3*h//4))])
