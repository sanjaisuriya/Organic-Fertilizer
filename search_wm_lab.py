import urllib.request, json, urllib.parse

params = urllib.parse.urlencode({
    "action": "query",
    "generator": "search",
    "gsrsearch": "filetype:bitmap soil testing report laboratory chart",
    "gsrnamespace": "6",
    "gcmlimit": "30",
    "prop": "imageinfo",
    "iiprop": "url|size",
    "format": "json"
})
url = f"https://commons.wikimedia.org/w/api.php?{params}"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode("utf-8"))
    for pid, pdata in data.get("query", {}).get("pages", {}).items():
        ii = pdata.get("imageinfo", [{}])[0]
        title = pdata.get("title", "").encode("ascii", "ignore").decode("ascii")
        print(title, ii.get("width"), ii.get("height"), ii.get("url"))
