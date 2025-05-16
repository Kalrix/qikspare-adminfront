import React, { useEffect, useState } from "react";
import { Table, Input, message, Tag, Button, Tabs, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/API";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import UserCreateModal from "../../components/users/UserCreateModal";
import "../dashboard/Dashboard.css";

const { TabPane } = Tabs;

interface User {
  _id: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string | null;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API.USERS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
        },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsers(data);
      } else {
        message.error(data?.detail || "Failed to fetch users");
      }
    } catch (err) {
      message.error("Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredByRole = (role: string) =>
    users.filter(
      (u) =>
        u.role === role &&
        (u.full_name.toLowerCase().includes(search.toLowerCase()) ||
          u.phone.includes(search))
    );

  const handleView = (user: User) => {
    navigate(`/users/${user._id}`);
  };

  const handleDelete = async (userId: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will permanently delete the user.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await fetch(`${API.USERS}/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            message.success("User deleted");
            fetchUsers();
          } else {
            message.error(data?.detail || "Failed to delete user");
          }
        } catch {
          message.error("Something went wrong");
        }
      },
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "full_name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) =>
        date && moment(date).isValid()
          ? moment(date).format("DD MMM YYYY, h:mm A")
          : "—",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="small" onClick={() => handleView(record)}>View</Button>
          <Button size="small" danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <Topbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-content">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2>👥 Manage Users</h2>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowModal(true)}
              >
                Create User
              </Button>
            </div>

            <Input.Search
              placeholder="Search by name or phone"
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 300, marginBottom: 16 }}
            />

            <Tabs defaultActiveKey="garage">
              {["garage", "vendor", "delivery", "admin"].map((role) => (
                <TabPane tab={role.toUpperCase()} key={role}>
                  <Table
                    columns={columns}
                    dataSource={filteredByRole(role)}
                    rowKey="_id"
                    loading={loading}
                    bordered
                  />
                </TabPane>
              ))}
            </Tabs>

            <UserCreateModal
              visible={showModal}
              onClose={() => setShowModal(false)}
              onSuccess={fetchUsers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
