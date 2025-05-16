import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import KpiCard from "../../components/kpi/KpiCard";
import "./Dashboard.css";
import LineChartOrders from "../../components/charts/LineChartOrders";
import PieChartCategory from "../../components/charts/PieChartCategory";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-wrapper">
      {/* Full-width Topbar */}
      <Topbar />

      {/* Sidebar + Main */}
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-content">
            {/* KPIs */}
            <div className="dashboard-kpis">
              <KpiCard title="Orders Today" value="186" icon="📦" />
              <KpiCard title="Revenue" value="₹2,34,000" icon="💰" />
              <KpiCard title="Users" value="1,021" icon="👥" />
              <KpiCard title="Avg Delivery" value="32 min" icon="⏱" />
            </div>

            {/* Charts */}
            <div className="dashboard-charts">
  <div className="chart-card">
    <h4 style={{ marginBottom: 16 }}>📈 Orders Trend</h4>
    <LineChartOrders />
  </div>
  <div className="chart-card">
    <h4 style={{ marginBottom: 16 }}>🥧 Category Share</h4>
    <PieChartCategory />
  </div>
</div>


            {/* Table */}
            <div className="dashboard-orders">
              <h3>🧾 Recent Orders</h3>
              <div className="orders-placeholder">Order table will go here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
