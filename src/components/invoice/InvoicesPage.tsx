import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  message,
  Card,
  Typography
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { API } from "../../config/API";
import "./InvoicesPage.css";

const { Title } = Typography;

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.INVOICE_LIST, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
        },
      });
      const data = res.data || [];
      setInvoices(data);
    } catch {
      message.error("❌ Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(API.INVOICE_DELETE(id), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
        },
      });
      message.success("✅ Invoice deleted");
      fetchInvoices();
    } catch {
      message.error("❌ Delete failed");
    }
  };

  const columns = [
    {
      title: "Invoice No.",
      dataIndex: "invoiceNumber",
    },
    {
      title: "Date",
      dataIndex: "invoiceDate",
      render: (val: string) =>
        new Date(val).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Buyer",
      dataIndex: ["buyer", "name"],
    },
    {
      title: "Seller",
      dataIndex: ["seller", "name"],
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const color =
          status === "paid"
            ? "green"
            : status === "draft"
            ? "blue"
            : status === "overdue"
            ? "red"
            : "default";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Total",
      dataIndex: "grandTotal",
      render: (val: number) => `₹${val?.toFixed(2)}`,
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/invoices/view/${record.id}`)}>View</Button>
          <Button type="link" onClick={() => navigate(`/invoices/edit/${record.id}`)}>Edit</Button>
          <Button danger type="link" onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
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

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <Title level={3} style={{ margin: 0 }}>🧾 Invoices</Title>
              <Button type="primary" onClick={() => navigate("/invoices/create")}>
                + Create Invoice
              </Button>
            </div>

            <Card bodyStyle={{ padding: 0 }}>
              <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={invoices}
                pagination={{ pageSize: 10 }}
              />
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;
