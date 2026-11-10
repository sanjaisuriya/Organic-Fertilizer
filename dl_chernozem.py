import urllib.request
from PIL import Image

headers = {"User-Agent": "Mozilla/5.0"}
url = "https://upload.wikimedia.org/wikipedia/commons/e/e1/%D0%92%D0%B8%D0%B7%D0%BD%D0%B5%D1%87%D0%B5%D0%BD%D0%BD%D1%8F_%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D1%81%D1%82%D1%96_%D1%83%D1%80%D0%B5%D0%B0%D0%B7%D0%B8_%D1%83_%D1%87%D0%BE%D1%80%D0%BD%D0%BE%D0%B7%D0%B5%D0%BC%D1%96_%D1%82%D0%B8%D0%BF%D0%BE%D0%B2%D0%BE%D0%BC%D1%83.jpg"

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp, open("dl_chernozem_lab.jpg", "wb") as f:
        f.write(resp.read())
    im = Image.open("dl_chernozem_lab.jpg")
    print("Downloaded chernozem lab:", im.size)
except Exception as e:
    print("Error:", e)
