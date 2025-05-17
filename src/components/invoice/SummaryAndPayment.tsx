import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  InputNumber,
  Select,
  Radio,
  DatePicker,
  Input,
  Card,
  Divider,
  Typography,
  Descriptions,
} from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

type Props = {
  form: any;
  showDetail: boolean;
  setShowDetail: (v: boolean) => void;
};

const SummaryAndPayment: React.FC<Props> = ({ form, showDetail, setShowDetail }) => {
  const [summary, setSummary] = useState({
    grossTotal: 0,
    totalDiscount: 0,
    subTotal: 0,
    totalItemGst: 0,
    deliveryGstAmount: 0,
    platformGstAmount: 0,
    grandTotal: 0,
  });

  const calculateSummary = () => {
    const items = form.getFieldValue("items") || [];

    const deliveryCharge = Number(form.getFieldValue("deliveryCharge") || 0);
    const deliveryGstRate = Number(form.getFieldValue("deliveryGst") || 0);
    const platformFee = Number(form.getFieldValue("platformFee") || 0);
    const platformGstRate = Number(form.getFieldValue("platformGst") || 0);

    let gross = 0;
    let discount = 0;
    let net = 0;
    let itemGst = 0;

    items.forEach((item: any) => {
      const qty = Number(item.quantity || 0);
      const unit = Number(item.unitPrice || 0);
      const percent = Number(item.discountPercent || 0);
      const fixed = Number(item.discountAmount || 0);
      const gstRate = Number(item.gst || 0);

      const price = qty * unit;
      const disc = fixed > 0 ? fixed : (price * percent) / 100;
      const taxable = price - disc;
      const gstAmount = (taxable * gstRate) / 100;

      gross += price;
      discount += disc;
      net += taxable;
      itemGst += gstAmount;
    });

    const deliveryGstAmount = (deliveryCharge * deliveryGstRate) / 100;
    const platformGstAmount = (platformFee * platformGstRate) / 100;
    const grandTotal = net + itemGst + deliveryCharge + deliveryGstAmount + platformFee + platformGstAmount;

    const values = {
      grossTotal: +gross.toFixed(2),
      totalDiscount: +discount.toFixed(2),
      subTotal: +net.toFixed(2),
      totalItemGst: +itemGst.toFixed(2),
      deliveryGstAmount: +deliveryGstAmount.toFixed(2),
      platformGstAmount: +platformGstAmount.toFixed(2),
      grandTotal: +grandTotal.toFixed(2),
    };

    setSummary(values);

    form.setFieldsValue({
      subTotal: values.subTotal,
      totalGst: values.totalItemGst,
      grandTotal: values.grandTotal,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => calculateSummary(), 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="summary-payment">
      <Title level={4}>💰 Summary & Payment</Title>

      <Row gutter={24}>
        {/* Charges Section */}
        <Col span={14}>
          <Card title="📦 Charges & Mode" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="deliveryCharge" label="Delivery ₹">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="deliveryGst" label="GST %">
                  <Select>
                    {[0, 5, 18, 28].map((val) => (
                      <Option key={val} value={val}>
                        {val}%
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="platformFee" label="Platform ₹">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="platformGst" label="GST %">
                  <Select>
                    {[0, 5, 18, 28].map((val) => (
                      <Option key={val} value={val}>
                        {val}%
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="paymentMode" label="Payment Mode" rules={[{ required: true }]}>
                  <Select placeholder="Choose Mode">
                    <Option value="cash">Cash</Option>
                    <Option value="upi">UPI</Option>
                    <Option value="bank">Bank</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="paymentStatus" label="Payment Status">
                  <Radio.Group onChange={(e) => setShowDetail(e.target.value !== "unpaid")}>
                    <Radio value="unpaid">Unpaid</Radio>
                    <Radio value="partial">Partial</Radio>
                    <Radio value="paid">Paid</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Summary Section */}
        <Col span={10}>
          <Card title="📊 Total Summary" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Gross Item Amount">
                ₹ {summary.grossTotal.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="- Total Discount">
                ₹ {summary.totalDiscount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="= Subtotal">
                ₹ {summary.subTotal.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="+ GST on Items">
                ₹ {summary.totalItemGst.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="+ Delivery">
                ₹ {Number(form.getFieldValue("deliveryCharge") || 0).toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item
                label={`+ GST on Delivery (${form.getFieldValue("deliveryGst") || 0}%)`}
              >
                ₹ {summary.deliveryGstAmount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="+ Platform Fee">
                ₹ {Number(form.getFieldValue("platformFee") || 0).toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item
                label={`+ GST on Platform (${form.getFieldValue("platformGst") || 0}%)`}
              >
                ₹ {summary.platformGstAmount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="💵 Grand Total">
                <Text strong style={{ fontSize: 16 }}>
                  ₹ {summary.grandTotal.toFixed(2)}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Optional Payment Section */}
      {showDetail && (
        <>
          <Divider />
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="paidAmount" label="Paid Amount">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="transactionId" label="Txn ID">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="paymentDate" label="Payment Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default SummaryAndPayment;
