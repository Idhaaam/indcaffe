import React from "react";
import InternalLayout from "../components/InternalLayout";
import {
  Package,
  Inbox,
  ArrowUpRight,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const DashboardPage = () => {
  const { dashboardStats, expiryAlerts } = useAppContext();

  return (
    <InternalLayout title="Dashboard / Overview">
      <div className="grid grid-cols-4 gap-6" style={{ marginBottom: "32px" }}>
        <div className="card" style={{ background: "#E8F5E9", border: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                padding: "12px",
                background: "white",
                borderRadius: "12px",
              }}
            >
              <Package color="#2E7D32" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: "#2E7D32" }}>
                {dashboardStats.totalProducts}
              </h2>
              <p style={{ color: "#4CAF50", margin: 0, fontWeight: "500" }}>
                Total Produk
              </p>
            </div>
          </div>
        </div>
        <div className="card" style={{ background: "#E3F2FD", border: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                padding: "12px",
                background: "white",
                borderRadius: "12px",
              }}
            >
              <Inbox color="#1565C0" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: "#1565C0" }}>
                {dashboardStats.totalSurplusPosts}
              </h2>
              <p style={{ color: "#42A5F5", margin: 0, fontWeight: "500" }}>
                Post Donasi
              </p>
            </div>
          </div>
        </div>
        <div className="card" style={{ background: "#FFF3E0", border: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                padding: "12px",
                background: "white",
                borderRadius: "12px",
              }}
            >
              <ArrowUpRight color="#E65100" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: "#E65100" }}>
                {dashboardStats.totalWasteSavedKg} kg
              </h2>
              <p style={{ color: "#FF9800", margin: 0, fontWeight: "500" }}>
                Total Diselamatkan
              </p>
            </div>
          </div>
        </div>
        <Link
          to="/expiry-alert"
          className="card"
          style={{
            background: "#FFEBEE",
            border: "none",
            cursor: "pointer",
            display: "block",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                padding: "12px",
                background: "white",
                borderRadius: "12px",
              }}
            >
              <AlertTriangle color="#C62828" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: "#C62828" }}>
                {expiryAlerts.length}
              </h2>
              <p style={{ color: "#EF5350", margin: 0, fontWeight: "500" }}>
                Expiry Alert
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h4 style={{ margin: 0 }}>⚠️ Expiry Alert</h4>
            <Link
              to="/expiry-alert"
              style={{
                color: "var(--accent-blue)",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>
          {expiryAlerts.length === 0 ? (
            <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>
              Tidak ada produk yang mendekati masa kadaluarsa.
            </p>
          ) : (
            <ul
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {expiryAlerts.slice(0, 5).map((p) => {
                const daysLeft = Math.ceil(
                  (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24),
                );
                return (
                  <li
                    key={p.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: "16px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <div>
                      <h5 style={{ margin: 0 }}>{p.name}</h5>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Sisa {p.currentStock} {p.unit}
                      </span>
                    </div>
                    <span
                      className={`badge ${daysLeft <= 1 ? "badge-red" : "badge-orange"}`}
                    >
                      {daysLeft <= 0 ? "HARI INI" : `${daysLeft} hari lagi`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h4 style={{ margin: 0 }}>📋 Aktivitas Terakhir (Donasi)</h4>
            <Link
              to="#"
              style={{
                color: "var(--accent-blue)",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>
          <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>
            Belum ada aktivitas terbaru.
          </p>
        </div>
      </div>
    </InternalLayout>
  );
};

export default DashboardPage;
