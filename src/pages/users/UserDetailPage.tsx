// UserDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Tabs,
  Spin,
  Button,
  Row,
  Col,
  Avatar,
  message,
  Typography,
  Form
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { API } from "../../config/API";
import Topbar from "../../components/layout/Topbar";
import Sidebar from "../../components/layout/Sidebar";
import GeneralInfoForm from "./components/GeneralInfoForm";
import RoleSpecificFields from "./components/RoleSpecificFields";
import ManageAddresses from "./components/ManageAddresses";
import ComingSoon from "./components/ComingSoon";
import "./UserDetailPage.css";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const [generalForm] = Form.useForm();
  const [roleForm] = Form.useForm();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API.USERS}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        message.error("Failed to load user.");
      }
    } catch {
      message.error("Something went wrong.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleRefresh = () => fetchUser();

  const handleSave = async () => {
    try {
      const generalValues = await generalForm.validateFields();
      const roleValues = await roleForm.validateFields();

      const payload = {
        ...generalValues,
        ...roleValues,
      };

      const res = await fetch(`${API.USERS}/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        message.success("Changes saved successfully!");
        setEditMode(false);
        fetchUser();
      } else {
        const err = await res.json();
        message.error(err?.detail || "Save failed");
      }
    } catch (error) {
      message.error("Please fix form errors before saving.");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return <GeneralInfoForm user={user} editMode={editMode} form={generalForm} />;
      case "role":
        return <RoleSpecificFields user={user} editMode={editMode} form={roleForm} />;
      case "addresses":
        return (
          <ManageAddresses
            userId={user._id}
            addresses={user.addresses || []}
            onRefresh={handleRefresh}
          />
        );
      default:
        return <ComingSoon title={activeTab} />;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Topbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <Card className="user-detail-card" bordered={false}>
            {loading ? (
              <Spin size="large" />
            ) : (
              <>
                <Row gutter={24} align="middle" className="user-detail-header">
                  <Col>
                    <Avatar size={72} icon={<UserOutlined />} />
                  </Col>
                  <Col flex="auto">
                    <Title level={4} style={{ margin: 0 }}>{user?.full_name}</Title>
                    <Text>{user?.role?.toUpperCase()}</Text><br />
                    <Text type="secondary">{user?.phone}</Text> • <Text type="secondary">{user?.email || "No Email"}</Text>
                  </Col>
                  <Col>
                    <Button onClick={() => setEditMode(!editMode)} type="primary">
                      {editMode ? "Cancel" : "Edit"}
                    </Button>
                  </Col>
                </Row>

                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  tabBarGutter={32}
                  type="line"
                >
                  <TabPane tab="Basic Info" key="info" />
                  <TabPane tab="Role Specific" key="role" />
                  <TabPane tab="Addresses" key="addresses" />
                  <TabPane tab="Sales Pipeline" key="sales" />
                  <TabPane tab="Order Book" key="orders" />
                  <TabPane tab="Ledger" key="ledger" />
                  <TabPane tab="Wallet & Promotions" key="wallet" />
                </Tabs>

                <div className="tab-content">{renderTabContent()}</div>

                {editMode && (
                  <div className="save-button">
                    <Button type="primary" size="large" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
