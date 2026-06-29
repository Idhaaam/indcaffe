import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PublicImpactPage from './pages/PublicImpactPage';
import ProdukPage from './pages/ProdukPage';
import StokMasukPage from './pages/StokMasukPage';
import ExpiryAlertPage from './pages/ExpiryAlertPage';
import CafeSurplusPage from './pages/CafeSurplusPage';
import MitraDonasiTersediaPage from './pages/MitraDonasiTersediaPage';
import MitraKlaimSayaPage from './pages/MitraKlaimSayaPage';
import MitraRiwayatDonasiPage from './pages/MitraRiwayatDonasiPage';
import CafeProfilePage from './pages/CafeProfilePage';
import MitraProfilePage from './pages/MitraProfilePage';
import CafeKlaimMasukPage from './pages/CafeKlaimMasukPage';
import ChatPage from './pages/ChatPage';
import MitraChatPage from './pages/MitraChatPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import PelangganProfilePage from './pages/PelangganProfilePage';
import PelangganRiwayatPage from './pages/PelangganRiwayatPage';
import PelangganChatPage from './pages/PelangganChatPage';
import RegisterCafePage from './pages/RegisterCafePage';
import RegisterMitraPage from './pages/RegisterMitraPage';
import AdminApprovalsPage from './pages/AdminApprovalsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import ForumPage from './pages/ForumPage';
import ForumDetailPage from './pages/ForumDetailPage';
import StorePage from './pages/StorePage';
import CartPage from './pages/CartPage';
import ReviewPage from './pages/ReviewPage';
import InventoryPage from './pages/InventoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider } from './context/AppContext';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

const NotFoundPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F8F9FA' }}>
    <h1 style={{ fontSize: '72px', color: 'var(--primary-color)', margin: 0 }}>404</h1>
    <h2 style={{ color: 'var(--text-primary)' }}>Halaman Tidak Ditemukan</h2>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
    <a href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>Kembali ke Beranda</a>
  </div>
);
function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/impact" element={<PublicImpactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-cafe" element={<RegisterCafePage />} />
            <Route path="/register-mitra" element={<RegisterMitraPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/produk" element={<ProtectedRoute allowedRoles={['CAFE']}><ProdukPage /></ProtectedRoute>} />
            <Route path="/stok-masuk" element={<ProtectedRoute allowedRoles={['CAFE']}><StokMasukPage /></ProtectedRoute>} />
            <Route path="/expiry-alert" element={<ProtectedRoute allowedRoles={['CAFE']}><ExpiryAlertPage /></ProtectedRoute>} />
            <Route path="/cafe-surplus" element={<ProtectedRoute allowedRoles={['CAFE']}><CafeSurplusPage /></ProtectedRoute>} />
            <Route path="/cafe-klaim" element={<ProtectedRoute allowedRoles={['CAFE']}><CafeKlaimMasukPage /></ProtectedRoute>} />
            <Route path="/cafe-profile" element={<ProtectedRoute allowedRoles={['CAFE']}><CafeProfilePage /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            
            {/* Mitra Routes */}
            <Route path="/mitra-donasi" element={<ProtectedRoute allowedRoles={['MITRA']}><MitraDonasiTersediaPage /></ProtectedRoute>} />
            <Route path="/mitra-klaim" element={<ProtectedRoute allowedRoles={['MITRA']}><MitraKlaimSayaPage /></ProtectedRoute>} />
            <Route path="/mitra-chat" element={<ProtectedRoute allowedRoles={['MITRA']}><MitraChatPage /></ProtectedRoute>} />
            <Route path="/mitra-riwayat" element={<ProtectedRoute allowedRoles={['MITRA']}><MitraRiwayatDonasiPage /></ProtectedRoute>} />
            <Route path="/mitra-profile" element={<ProtectedRoute allowedRoles={['MITRA']}><MitraProfilePage /></ProtectedRoute>} />
            
            {/* Pelanggan Routes */}
            <Route path="/pelanggan-chat" element={<ProtectedRoute allowedRoles={['PELANGGAN']}><PelangganChatPage /></ProtectedRoute>} />
            <Route path="/pelanggan-profile" element={<ProtectedRoute allowedRoles={['PELANGGAN']}><PelangganProfilePage /></ProtectedRoute>} />
            <Route path="/pelanggan-riwayat" element={<ProtectedRoute allowedRoles={['PELANGGAN']}><PelangganRiwayatPage /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/approvals" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminApprovalsPage /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCategoriesPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsersPage /></ProtectedRoute>} />
            
            {/* Manager & Community */}
            <Route path="/manager/analytics" element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/manager/reports" element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}><ReportsPage /></ProtectedRoute>} />
            <Route path="/community/forum" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
            <Route path="/community/forum/:id" element={<ProtectedRoute><ForumDetailPage /></ProtectedRoute>} />
            
            {/* Store & Orders */}
            <Route path="/store" element={<StorePage />} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout-success" element={<ProtectedRoute><CheckoutSuccessPage /></ProtectedRoute>} />
            <Route path="/review/:cafeId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
            <Route path="/warehouse/inventory" element={<ProtectedRoute allowedRoles={['GUDANG', 'ADMIN']}><InventoryPage /></ProtectedRoute>} />
            
            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AppProvider>
    </HelmetProvider>
  );
}

export default App;
