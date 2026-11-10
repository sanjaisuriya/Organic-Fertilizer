import os
import re
from html.parser import HTMLParser

html_files = [
    'index.html',
    'home-2.html',
    'about.html',
    'services.html',
    'products.html',
    'usage-guide.html',
    'blog.html',
    'blog-details.html',
    'contact.html'
]

print("=== Scanning HTML files for potential contrast and alignment issues ===")

for fname in html_files:
    if not os.path.exists(fname):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()
    
    text_dark_matches = re.findall(r'class="[^"]*\btext-dark\b[^"]*"', html)
    text_muted_matches = re.findall(r'class="[^"]*\btext-muted\b[^"]*"', html)
    bg_white_matches = re.findall(r'class="[^"]*\bbg-white\b[^"]*"', html)
    bg_light_matches = re.findall(r'class="[^"]*\bbg-light\b[^"]*"', html)
    text_white_matches = re.findall(r'class="[^"]*\btext-white\b[^"]*"', html)
    
    # Inline style checks
    inline_styles = re.findall(r'style="([^"]*)"', html)
    suspicious_inline = []
    for s in inline_styles:
        s_lower = s.lower()
        if 'color:' in s_lower or 'color :' in s_lower:
            if any(c in s_lower for c in ['#000', '#111', '#1f', '#212529', '#222', '#333', 'black']):
                suspicious_inline.append(f"Hardcoded dark color: {s}")
            if any(c in s_lower for c in ['#fff', '#ffffff', 'white']) and 'background' not in s_lower:
                suspicious_inline.append(f"Hardcoded white text without bg: {s}")

    print(f"\n[{fname}]")
    print(f" - text-dark occurrences: {len(text_dark_matches)}")
    print(f" - text-muted occurrences: {len(text_muted_matches)}")
    print(f" - bg-white occurrences: {len(bg_white_matches)}")
    print(f" - bg-light occurrences: {len(bg_light_matches)}")
    print(f" - text-white occurrences: {len(text_white_matches)}")
    if suspicious_inline:
        print(f" - Suspicious inline colors ({len(suspicious_inline)}):")
        for s in suspicious_inline[:4]:
            print(f"    * {s}")
