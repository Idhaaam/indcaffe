import os
import re

base_dir = "C:/Users/Budiman/.gemini/antigravity/scratch/indcaffe-frontend"
pages_dir = os.path.join(base_dir, "pages")

# Load templates
with open(os.path.join(pages_dir, "dashboard.html"), "r", encoding="utf-8") as f:
    dashboard_html = f.read()

with open(os.path.join(pages_dir, "login.html"), "r", encoding="utf-8") as f:
    login_html = f.read()

# Extract dashboard layout (everything before <main class="flex-1...>)
main_start_idx = dashboard_html.find('<main class="flex-1')
main_end_idx = dashboard_html.find('</main>') + len('</main>')

dashboard_header = dashboard_html[:main_start_idx]
dashboard_footer = dashboard_html[main_end_idx:]

def create_internal_page(filename, title, heading, icon):
    # Update title
    html = re.sub(r'<title>.*?</title>', f'<title>{title} | IndCaffe</title>', dashboard_header)
    
    # Update breadcrumb/topbar title
    html = re.sub(r'<div class="font-headline-md text-headline-md font-semibold hidden md:block">\s*Dashboard\s*</div>',
                  f'<div class="font-headline-md text-headline-md font-semibold hidden md:block">{heading}</div>', html)
    
    # Add main content
    content = f'''<main class="flex-1 p-4 md:p-container_padding flex flex-col gap-stack_lg">
    <section class="bg-white rounded-lg p-6 shadow-level-1">
        <h2 class="font-headline-lg text-headline-lg text-primary flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined">{icon}</span>
            {heading}
        </h2>
        <p class="font-body-md text-on-surface-variant">Halaman ini sedang dalam tahap pengembangan (Prototype).</p>
    </section>
</main>'''
    
    full_html = html + content + dashboard_footer
    
    with open(os.path.join(pages_dir, filename), "w", encoding="utf-8") as f:
        f.write(full_html)
        
    print(f"Created {filename}")

def create_public_page(filename, title, heading):
    # Very simple extraction for auth pages from login
    html = login_html.replace('Login', title)
    html = html.replace('Selamat Datang Kembali', heading)
    html = html.replace('Silakan masuk ke akun manajemen Anda.', 'Silakan isi form di bawah ini.')
    
    with open(os.path.join(pages_dir, filename), "w", encoding="utf-8") as f:
        f.write(html)
        
    print(f"Created {filename}")

# Create internal pages
internal_pages = [
    ('categories.html', 'Manajemen Kategori', 'Manajemen Kategori', 'category'),
    ('suppliers.html', 'Manajemen Supplier', 'Manajemen Supplier', 'local_shipping'),
    ('products.html', 'Manajemen Produk', 'Manajemen Produk', 'inventory_2'),
    ('incoming.html', 'Stok Masuk', 'Transaksi Stok Masuk', 'input'),
    ('outgoing.html', 'Stok Keluar', 'Transaksi Stok Keluar', 'output'),
    ('surplus.html', 'Surplus Marketplace', 'Surplus Marketplace', 'eco'),
    ('claims.html', 'Klaim Masuk', 'Kelola Klaim', 'assignment_turned_in'),
    ('expiry-alerts.html', 'Expiry Alert', 'Peringatan Kadaluarsa', 'notification_important'),
    ('reports-stock.html', 'Laporan Stok', 'Laporan Stok Real-time', 'inventory'),
    ('reports-transactions.html', 'Laporan Transaksi', 'Laporan Riwayat Transaksi', 'receipt_long'),
    ('waste-analytics.html', 'Waste Analytics', 'Waste Analytics', 'analytics'),
    ('users.html', 'Manajemen User', 'Kelola User', 'people'),
    ('profile.html', 'Profil', 'Profil & Settings', 'person'),
    
    ('mitra-donations.html', 'Donasi Tersedia', 'Donasi Tersedia', 'shopping_cart'),
    ('mitra-claims.html', 'Klaim Saya', 'Klaim Saya', 'list_alt'),
    ('mitra-history.html', 'Riwayat Donasi', 'Riwayat & Dampak Saya', 'history')
]

for p in internal_pages:
    create_internal_page(p[0], p[1], p[2], p[3])

# Create public/auth pages
public_pages = [
    ('register-cafe.html', 'Register Café', 'Daftar Café Baru'),
    ('register-mitra.html', 'Register Mitra', 'Daftar Sebagai Mitra'),
    ('map.html', 'Peta Interaktif', 'Peta Interaktif IndCaffe')
]

for p in public_pages:
    create_public_page(p[0], p[1], p[2])

print("All pages generated successfully!")
