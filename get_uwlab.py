import urllib.request
import re

url = "https://uwlab.soils.wisc.edu/sample-reports/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8")
        links = re.findall(r'href="([^"]+\.pdf)"', html)
        for l in links:
            print("Found PDF:", l)
except Exception as e:
    print("Error:", e)
