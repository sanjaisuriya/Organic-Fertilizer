import urllib.request
import re

url = "https://www.agvise.com/educational-articles/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8")
        links = re.findall(r'src="([^"]+\.(?:jpg|png))"', html)
        for l in links[:15]:
            print("Found image:", l)
except Exception as e:
    print("Error:", e)
