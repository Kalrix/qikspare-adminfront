import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card, Typography, Descriptions, Button, Divider, Table, Tag, message, Spin
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { API } from "../../config/API";
import Topbar from "../../components/layout/Topbar";
import Sidebar from "../../components/layout/Sidebar";

const { Title } = Typography;

const ViewInvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.INVOICE_DETAIL(id!), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
        },
      });
      setInvoice(res.data);
    } catch {
      message.error("❌ Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchInvoice();
  }, [id]);

  if (loading || !invoice) {
    return <Spin size="large" style={{ margin: "10% auto", display: "block" }} />;
  }

  const itemColumns = [
    { title: "Part Name", dataIndex: "partName" },
    { title: "Model No", dataIndex: "modelNo" },
    { title: "Category", dataIndex: "category" },
    { title: "Qty", dataIndex: "quantity" },
    { title: "Unit Price", dataIndex: "unitPrice" },
    { title: "Total", dataIndex: "totalAmount" },
  ];

  return (
    <div className="dashboard-wrapper">
      <Topbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-content">

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Title level={3}>🧾 Invoice #{invoice.invoiceNumber}</Title>
              <Button type="primary" onClick={() => navigate(`/invoices/edit/${invoice.id}`)}>
                ✏️ Edit Invoice
              </Button>
            </div>

            <Divider />

            <Descriptions title="Invoice Summary" bordered column={2}>
              <Descriptions.Item label="Date">
                {dayjs(invoice.invoiceDate).format("DD MMM YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  invoice.status === "paid" ? "green" :
                  invoice.status === "draft" ? "blue" :
                  invoice.status === "overdue" ? "red" : "default"
                }>
                  {invoice.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Garage (Buyer)">
                <strong>{invoice.buyer?.name}</strong><br />
                {invoice.buyer?.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Vendor (Seller)">
                <strong>{invoice.seller?.name}</strong><br />
                {invoice.seller?.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Mode">{invoice.paymentMode}</Descriptions.Item>
              <Descriptions.Item label="Invoice Total">₹{invoice.grandTotal}</Descriptions.Item>
              <Descriptions.Item label="Paid">₹{invoice.paidAmount || 0}</Descriptions.Item>
              <Descriptions.Item label="Due">₹{(invoice.grandTotal || 0) - (invoice.paidAmount || 0)}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Card title="Invoice Items">
              <Table
                dataSource={invoice.items}
                columns={itemColumns}
                rowKey={(_, idx) => idx?.toString() || Math.random().toString()}
                pagination={false}
              />
            </Card>

            <Divider />

            <Descriptions title="Additional Details" bordered column={1}>
              <Descriptions.Item label="Delivery Charge">₹{invoice.deliveryCharge}</Descriptions.Item>
              <Descriptions.Item label="Platform Fee">₹{invoice.platformFee}</Descriptions.Item>
              <Descriptions.Item label="Notes">{invoice.notes || "—"}</Descriptions.Item>
            </Descriptions>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoicePage;
