import urllib.request
from PIL import Image

url = "https://upload.wikimedia.org/wikipedia/commons/f/fa/Laboratory_analysis_of_soil_samples_from_different_locations_using_universal_indicator.jpg"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    with open("dl_lab_analysis_samples.jpg", "wb") as f:
        f.write(resp.read())

im = Image.open("dl_lab_analysis_samples.jpg")
print("Downloaded dl_lab_analysis_samples:", im.size)
