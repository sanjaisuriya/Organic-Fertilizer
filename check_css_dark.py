with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

checks = [
    '[data-theme="dark"] .text-muted',
    '[data-theme="dark"] .text-dark',
    '[data-theme="dark"] .bg-white',
    '[data-theme="dark"] .bg-light',
    '[data-theme="dark"] .card',
    '[data-theme="dark"] .modal-content',
    '[data-theme="dark"] .table',
    '[data-theme="dark"] .accordion-button',
    '[data-theme="dark"] .form-control',
    '[data-theme="dark"] .dropdown-menu',
    '[data-theme="dark"] .badge'
]

for c in checks:
    print(f"{c} present: {c in css}")
