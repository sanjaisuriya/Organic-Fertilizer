import urllib.request
from PIL import Image

headers = {"User-Agent": "Mozilla/5.0"}

urls = [
    ("csiro_soil_samples", "https://upload.wikimedia.org/wikipedia/commons/7/72/CSIRO_ScienceImage_617_Excavated_Soil_Samples_and_Field_Equipment.jpg"),
    ("analise_solo", "https://upload.wikimedia.org/wikipedia/commons/8/82/An%C3%A1lise_f%C3%ADsica_do_solo.jpg")
]

for name, url in urls:
    out = f"test_{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(out, "wb") as f:
            f.write(resp.read())
        im = Image.open(out)
        print(f"Downloaded {name}: {im.size}")
    except Exception as e:
        print(f"Error {name}: {e}")
