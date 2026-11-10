with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if any(k in line for k in ['[data-theme="dark"] .text-muted', '[data-theme="dark"] .text-dark', '[data-theme="dark"] .bg-white', '[data-theme="dark"] .bg-light']):
        print(f"Line {i+1}:")
        start = max(0, i - 1)
        end = min(len(lines), i + 8)
        print(''.join(lines[start:end]))
        print("-" * 50)
