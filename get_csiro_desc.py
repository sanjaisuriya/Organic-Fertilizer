import urllib.request, json

for title in [
    "File:CSIRO_ScienceImage_617_Excavated_Soil_Samples_and_Field_Equipment.jpg",
    "File:Análise_física_do_solo.jpg"
]:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=extmetadata&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        for pid, pdata in data.get("query", {}).get("pages", {}).items():
            em = pdata.get("imageinfo", [{}])[0].get("extmetadata", {})
            print(title)
            print("  Desc:", em.get("ImageDescription", {}).get("value"))
