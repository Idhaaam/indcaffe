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
        status: sp.status === 'AVAILABLE' ? 'Tersedia' : (sp.status === 'CLAIMED' ? 'Dipesan' : 'Habis'),
        cafe: sp.cafe?.name || 'IndCaffe Network'
      }));
      setProducts(mapped);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchClaims = async () => {
    try {
      const cafeId = localStorage.getItem('cafeId');
      if (cafeId && cafeId !== 'null') {
         const res = await api.get(`/transactions/surplus/claims/cafe/${cafeId}`);
         const mapped = res.data.map(c => ({
           id: c.id,
           productId: c.product?.id,
           productName: c.product?.name,
           quantity: c.quantity,
           mitra: c.claimedBy?.name || 'Panti Asuhan Kasih',
           delivery: 'Jemput Sendiri',
           status: c.status === 'CLAIMED' ? 'Menunggu' : (c.status === 'PICKED_UP' ? 'Selesai' : 'Kadaluarsa'),
           date: new Date(c.claimDate || new Date()).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
         }));
         setClaims(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    }
  };

  return (
    <AppContext.Provider value={{
      products, setProducts, fetchProducts,
      claims, setClaims, fetchClaims,
      chats, setChats,
      allProducts, dashboardStats, expiryAlerts, fetchAllData, categories
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
