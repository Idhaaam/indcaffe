import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [claims, setClaims] = useState([]);
  const [chats, setChats] = useState({
    'panti-kasih': [
      { id: 1, sender: 'system', text: 'Hari ini, 14:28 WIB — Memulai Percakapan', isSystem: true },
      { id: 2, sender: 'mitra', text: 'Halo Admin KKS, saya ingin menanyakan mengenai donasi ini.', time: '14:32' },
      { id: 3, sender: 'admin', text: 'Halo Pak Budi. Tentu saja boleh Pak.', time: '14:33' }
    ]
  });

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ totalProducts: 0, totalSurplusPosts: 0, totalWasteSavedKg: 0 });
  const [expiryAlerts, setExpiryAlerts] = useState([]);

  const fetchAllData = () => {
    fetchProducts();
    fetchClaims();
    fetchDashboardStats();
    fetchAllProducts();
    fetchExpiryAlerts();
    fetchCategories();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchCategories = async () => {
    try {
      const cafeId = localStorage.getItem('cafeId');
      if (cafeId && cafeId !== 'null') {
        const res = await api.get(`/master/categories/cafe/${cafeId}`);
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const cafeId = localStorage.getItem('cafeId');
      if (cafeId && cafeId !== 'null') {
        const res = await api.get(`/master/products/cafe/${cafeId}`);
        setAllProducts(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch all products:", err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const cafeId = localStorage.getItem('cafeId');
      if (cafeId && cafeId !== 'null') {
        const res = await api.get(`/transactions/analytics/cafe/${cafeId}`);
        setDashboardStats(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  const fetchExpiryAlerts = async () => {
    try {
      const cafeId = localStorage.getItem('cafeId');
      if (cafeId && cafeId !== 'null') {
        const res = await api.get(`/master/products/expiry-alerts/cafe/${cafeId}`);
        setExpiryAlerts(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch expiry alerts:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/transactions/surplus');
      const mapped = res.data.map(sp => ({
        id: sp.id,
        name: sp.product?.name,
        category: sp.product?.category?.name,
        expiry: new Date(sp.expiryDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        sisa: sp.quantity,
        status: sp.status === 'TERSEDIA' ? 'Tersedia' : (sp.status === 'DIKLAIM' ? 'Dipesan' : 'Habis'),
        cafe: sp.cafe?.name || 'IndCaffe Network',
        cafeUserId: sp.cafe?.user?.id,
        cafeUsername: sp.cafe?.user?.username,
        price: sp.price || 0,
        imageUrl: sp.product?.imageUrl
      }));
      setProducts(mapped);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchClaims = async () => {
    try {
      const role = localStorage.getItem('role');
      let res;
      if (role === 'CAFE') {
        res = await api.get('/orders/cafe');
      } else if (role === 'MITRA' || role === 'PELANGGAN') {
        res = await api.get('/orders/my-orders');
      }

      if (res && res.data) {
        const mapped = res.data.map(c => {
          let status = c.status;
          if (c.status === 'PENDING') status = 'Menunggu';
          else if (c.status === 'PAID') status = 'Disetujui';
          else if (c.status === 'COMPLETED') status = 'Selesai';
          else if (c.status === 'CANCELLED' || c.status === 'REJECTED') status = 'Ditolak';

          return {
            id: c.id,
            productId: c.items?.[0]?.product?.id,
            productName: c.items?.map(i => i.productName).join(', ') || 'Pesanan',
            quantity: c.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
            buyerName: c.buyerName || 'Pembeli',
            status: status,
            date: new Date(c.orderDate || new Date()).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
            totalPrice: c.totalAmount || 0
          };
        });
        setClaims(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('isDarkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('isDarkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AppContext.Provider value={{
      products, setProducts, fetchProducts,
      claims, setClaims, fetchClaims,
      chats, setChats,
      allProducts, dashboardStats, expiryAlerts, fetchAllData, categories,
      isDarkMode, toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
