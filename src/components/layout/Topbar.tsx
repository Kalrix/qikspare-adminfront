import React from "react";
import { Input, Avatar, Space, Tooltip } from "antd";
import {
  BellOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import "./Topbar.css";

const Topbar: React.FC = () => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <img src="/logo.png" alt="logo" className="topbar-logo" />
      </div>
      <div className="topbar-center">
        <Input.Search placeholder="Search anything..." className="topbar-search" />
      </div>
      <div className="topbar-right">
        <Space size="large">
          <Tooltip title="Knowledge Base">
            <QuestionCircleOutlined />
          </Tooltip>
          <Tooltip title="Chat">
            <MessageOutlined />
          </Tooltip>
          <Tooltip title="Notifications">
            <BellOutlined />
          </Tooltip>
          <Avatar src="/logo192.png" size="large" />
        </Space>
      </div>
    </div>
  );
};

export default Topbar;
