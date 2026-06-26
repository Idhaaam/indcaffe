import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PublicImpactPage from './pages/PublicImpactPage';
import ProdukPage from './pages/ProdukPage';
import StokMasukPage from './pages/StokMasukPage';
import ExpiryAlertPage from './pages/ExpiryAlertPage';
import MitraDonasiTersediaPage from './pages/MitraDonasiTersediaPage';
import MitraKlaimSayaPage from './pages/MitraKlaimSayaPage';
import MitraRiwayatDonasiPage from './pages/MitraRiwayatDonasiPage';
import CafeProfilePage from './pages/CafeProfilePage';
import MitraProfilePage from './pages/MitraProfilePage';
import CafeKlaimMasukPage from './pages/CafeKlaimMasukPage';
import ChatPage from './pages/ChatPage';
import MitraChatPage from './pages/MitraChatPage';
import RegisterCafePage from './pages/RegisterCafePage';
import RegisterMitraPage from './pages/RegisterMitraPage';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/impact" element={<PublicImpactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-cafe" element={<RegisterCafePage />} />
        <Route path="/register-mitra" element={<RegisterMitraPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/produk" element={<ProdukPage />} />
        <Route path="/stok-masuk" element={<StokMasukPage />} />
        <Route path="/expiry-alert" element={<ExpiryAlertPage />} />
        <Route path="/cafe-klaim" element={<CafeKlaimMasukPage />} />
        <Route path="/cafe-profile" element={<CafeProfilePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/mitra-donasi" element={<MitraDonasiTersediaPage />} />
        <Route path="/mitra-klaim" element={<MitraKlaimSayaPage />} />
        <Route path="/mitra-riwayat" element={<MitraRiwayatDonasiPage />} />
        <Route path="/mitra-profile" element={<MitraProfilePage />} />
        <Route path="/mitra-chat" element={<MitraChatPage />} />
      </Routes>
    </Router>
    </AppProvider>
  );
}

export default App;
