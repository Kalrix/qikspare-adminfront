import React from "react";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  FileAddOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      localStorage.clear();
      navigate("/login");
    } else {
      navigate(key);
    }
  };

  return (
    <div className="sidebar">
      <Menu
        mode="vertical"
        onClick={handleClick}
        defaultSelectedKeys={["/dashboard"]}
        style={{ borderRight: "none" }}
      >
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="/users" icon={<UserOutlined />}>
          Users
        </Menu.Item>
        <Menu.Item key="/sales" icon={<AppstoreOutlined />}>
          Sales
        </Menu.Item>
        <Menu.SubMenu key="accounts" title="Accounts" icon={<FileTextOutlined />}>
          <Menu.Item key="/create-invoice" icon={<FileAddOutlined />}>
            Create Invoice
          </Menu.Item>
          <Menu.Item key="/invoices">Invoices</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
          Logout
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
