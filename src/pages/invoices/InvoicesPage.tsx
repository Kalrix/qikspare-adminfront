import React, { useEffect, useState } from "react";
import {
  Table, Tag, Button, Space, message,
  Input, Select, Row, Col, DatePicker, Card, Typography, Popconfirm
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { API } from "../../config/API";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import "./InvoicesPage.css";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>();
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.INVOICE_LIST, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
        },
      });

      const data = (res.data || []).filter((inv: any) => !inv.isDeleted);
      setInvoices(data);
      setFiltered(data);
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

  const handleFilter = () => {
    let result = [...invoices];

    if (statusFilter) {
      result = result.filter((i) => i.status === statusFilter);
    }

    if (searchText) {
      const search = searchText.toLowerCase();
      result = result.filter((i) =>
        i?.buyer?.name?.toLowerCase().includes(search) ||
        i?.seller?.name?.toLowerCase().includes(search) ||
        i?.invoiceNumber?.toLowerCase().includes(search)
      );
    }

    if (dateRange) {
      const [from, to] = dateRange;
      result = result.filter((i) => {
        const created = dayjs(i.invoiceDate);
        return created.isAfter(from, "day") && created.isBefore(to, "day");
      });
    }

    setFiltered(result);
  };

  useEffect(() => {
    const timeout = setTimeout(() => handleFilter(), 300);
    return () => clearTimeout(timeout);
  }, [statusFilter, searchText, dateRange, invoices]);

  const columns = [
    {
      title: "Invoice No.",
      dataIndex: "invoiceNumber",
    },
    {
      title: "Date",
      dataIndex: "invoiceDate",
      render: (val: string) => dayjs(val).format("DD MMM YYYY - hh:mm A"),
    },
    {
      title: "Garage (Buyer)",
      dataIndex: ["buyer", "name"],
    },
    {
      title: "Vendor (Seller)",
      dataIndex: ["seller", "name"],
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const color =
          status === "paid" ? "success" :
          status === "draft" ? "processing" :
          status === "overdue" ? "error" : "default";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Total (₹)",
      dataIndex: "grandTotal",
      render: (v: number) => `₹${v?.toFixed(2)}`,
    },
    {
      title: "Due (₹)",
      render: (r: any) =>
        `₹${((r.grandTotal || 0) - (r.paidAmount || 0)).toFixed(2)}`,
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/invoices/view/${record.id}`)}>
            View
          </Button>
          <Button type="link" size="small" onClick={() => navigate(`/invoices/edit/${record.id}`)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this invoice?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="link" size="small">
              Delete
            </Button>
          </Popconfirm>
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
              <Title level={3} style={{ margin: 0 }}>📄 Invoices</Title>
              <Button type="primary" onClick={() => navigate("/invoices/create")}>
                + Create Invoice
              </Button>
            </div>

            {/* Filters */}
            <Card style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Input
                    placeholder="🔍 Search Garage or Vendor"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col span={5}>
                  <Select
                    allowClear
                    placeholder="Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    style={{ width: "100%" }}
                  >
                    <Option value="draft">Draft</Option>
                    <Option value="paid">Paid</Option>
                    <Option value="unpaid">Unpaid</Option>
                    <Option value="overdue">Overdue</Option>
                  </Select>
                </Col>
                <Col span={8}>
                  <RangePicker
                    style={{ width: "100%" }}
                    onChange={(range) => setDateRange(range as any)}
                  />
                </Col>
              </Row>
            </Card>

            {/* Table */}
            <Card bodyStyle={{ padding: 0 }}>
              <Table
                rowKey="id"
                loading={loading}
                dataSource={filtered}
                columns={columns}
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
