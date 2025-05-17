import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Divider, Typography, message, Spin } from "antd";
import dayjs from "dayjs";
import axios from "axios";

import Topbar from "../../components/layout/Topbar";
import Sidebar from "../../components/layout/Sidebar";
import InvoiceMeta from "../../components/invoice/InvoiceMeta";
import PartySelector from "../../components/invoice/PartySelector";
import PartyDetailsCard from "../../components/invoice/PartyDetailsCard";
import InvoiceItemsList from "../../components/invoice/InvoiceItemsList";
import SummaryAndPayment from "../../components/invoice/SummaryAndPayment";
import { API } from "../../config/API";
import "./CreateInvoice.css";

const { Title } = Typography;

const CreateInvoice: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    if (id) {
      setMode("edit");
      fetchInvoiceData();
    }
  }, [id]);

  const fetchInvoiceData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.INVOICE_DETAIL(id!), {
        headers: { Authorization: `Bearer ${localStorage.getItem("qik_token")}` },
      });
      const data = res.data;
      form.setFieldsValue({
        ...data,
        invoiceDate: dayjs(data.invoiceDate),
        paymentDate: data.paymentDate ? dayjs(data.paymentDate) : null,
      });
    } catch {
      message.error("❌ Failed to load invoice data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const sellerId = values?.seller?.userId;
      const buyerId = values?.buyer?.userId;
      if (!sellerId || !buyerId) {
        return message.error("❌ Vendor or Garage is missing userId");
      }

      const items = (values.items || []).map((item: any) => {
        const qty = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);
        const gross = qty * unitPrice;
        const discountAmount = Number(item.discountAmount || 0);
        const gstRate = Number(item.gst || 0);

        const taxable = gross - discountAmount;
        const gstAmt = (taxable * gstRate) / 100;
        const total = taxable + gstAmt;

        return {
          partName: item.partName,
          modelNo: item.modelNo || "",
          category: item.category || "",
          unitPrice,
          quantity: qty,
          discountAmount,
          discountPercent: Number(item.discountPercent || 0),
          gst: gstRate,
          totalPriceBeforeTax: +taxable.toFixed(2),
          totalTaxAmount: +gstAmt.toFixed(2),
          totalAmount: +total.toFixed(2),
        };
      });

      const subTotal = items.reduce((sum: number, i: any) => sum + i.totalPriceBeforeTax, 0);
      const totalGst = items.reduce((sum: number, i: any) => sum + i.totalTaxAmount, 0);
      const delivery = Number(values.deliveryCharge || 0);
      const platform = Number(values.platformFee || 0);
      const deliveryGst = (delivery * Number(values.deliveryGst || 0)) / 100;
      const platformGst = (platform * Number(values.platformGst || 0)) / 100;
      const paid = Number(values.paidAmount || 0);

      const grandTotal = subTotal + totalGst + delivery + platform + deliveryGst + platformGst;
      let status = "draft";
      if (values.paymentStatus === "paid") status = "completed";
      else if (paid > 0 && paid < grandTotal) status = "pending";

      const payload = {
        invoiceType: values.invoiceType,
        seller: { ...values.seller, userId: sellerId },
        buyer: { ...values.buyer, userId: buyerId },
        garageId: values.garageId || buyerId,
        items,
        deliveryCharge: delivery,
        platformFee: platform,
        deliveryChargeGst: Number(values.deliveryGst || 0),
        platformFeeGst: Number(values.platformGst || 0),
        paymentMode: values.paymentMode,
        paymentStatus: values.paymentStatus,
        paidAmount: paid,
        paymentDate: values.paymentDate ? dayjs(values.paymentDate).toISOString() : null,
        transactionId: values.transactionId || "",
        invoiceDate: dayjs(values.invoiceDate).format("YYYY-MM-DD"),
        referenceNumber: values.referenceNumber || "",
        notes: values.notes || "",
        subTotal: +subTotal.toFixed(2),
        totalGst: +totalGst.toFixed(2),
        grandTotal: +grandTotal.toFixed(2),
        updatedAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        status,
      };

      if (mode === "edit" && id) {
        await axios.patch(API.INVOICE_UPDATE(id), payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("qik_token")}` },
        });
        message.success("✅ Invoice updated successfully 🧾", 3);
        fetchInvoiceData();
      } else {
        await axios.post(API.INVOICE_CREATE, {
          ...payload,
          createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
          version: 1,
          isDeleted: false,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("qik_token")}` },
        });
        message.success("✅ Invoice created successfully!", 3);
        form.resetFields();
      }
    } catch (err: any) {
      const details = err.response?.data?.detail;
      const errorMsg = Array.isArray(details) && details[0]?.msg
        ? details[0].msg
        : "Something went wrong";
      setTimeout(() => message.error(errorMsg), 0);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "10% auto" }} />;
  }

  return (
    <div className="dashboard-wrapper">
      <Topbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-content">
            <Title level={2}>{mode === "edit" ? "✏️ Edit Invoice" : "🧾 Create Invoice"}</Title>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                invoiceType: "customer",
                paymentMode: "cash",
                paymentStatus: "unpaid",
                items: [{ quantity: 1, unitPrice: 0, gst: 0 }],
              }}
            >
              <InvoiceMeta />
              <Divider />
              <PartySelector form={form} />
              <div className="party-grid">
                <PartyDetailsCard type="seller" form={form} />
                <PartyDetailsCard type="buyer" form={form} />
              </div>
              <Divider />
              <InvoiceItemsList form={form} />
              <Divider />
              <SummaryAndPayment
                form={form}
                showDetail={showPaymentDetail}
                setShowDetail={setShowPaymentDetail}
              />
              <Divider />
              <Form.Item>
                <Button type="primary" size="large" block onClick={handleSave}>
                  Save Invoice
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
