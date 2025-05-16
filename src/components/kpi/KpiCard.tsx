import React from "react";
import "./KpiCard.css";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-title">
        {icon && <span className="emoji">{icon}</span>} {title}
      </div>
      <div className="kpi-value">{value}</div>
    </div>
  );
};

export default KpiCard;
