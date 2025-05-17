import React from "react";
import { Row, Col, Form, Input, InputNumber, Select, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined, FileTextOutlined } from "@ant-design/icons";

const { Option } = Select;

const GST_OPTIONS = [5, 18, 28];

const InvoiceItemsList: React.FC<{ form: any }> = ({ form }) => {
  const calculateTotal = (index: number, changedField?: string) => {
    const items = form.getFieldValue("items") || [];
    const item = items[index];
    if (!item) return;

    const qty = Number(item.quantity || 0);
    const unitPrice = Number(item.unitPrice || 0);
    const gst = Number(item.gst || 0);
    let discountPercent = Number(item.discountPercent || 0);
    let discountAmount = Number(item.discountAmount || 0);

    const basePrice = qty * unitPrice;

    if (changedField === "discountPercent") {
      discountAmount = (basePrice * discountPercent) / 100;
    } else if (changedField === "discountAmount") {
      discountPercent = basePrice > 0 ? (discountAmount / basePrice) * 100 : 0;
    }

    const subtotal = basePrice - discountAmount;
    const gstAmount = (subtotal * gst) / 100;
    const total = subtotal + gstAmount;

    const updatedItems = [...items];
    updatedItems[index] = {
      ...item,
      discountPercent: parseFloat(discountPercent.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      totalAmount: parseFloat(total.toFixed(2)),
    };

    form.setFieldsValue({ items: updatedItems });
  };

  return (
    <div className="invoice-items">
      <h3 style={{ marginBottom: 16 }}>
        <FileTextOutlined style={{ marginRight: 8 }} /> Invoice Items
      </h3>

      <Row className="invoice-items-header" gutter={8}>
        <Col span={3}><b>Part Name</b></Col>
        <Col span={3}><b>Model No.</b></Col>
        <Col span={3}><b>Category</b></Col>
        <Col span={2}><b>Qty</b></Col>
        <Col span={2}><b>Unit ₹</b></Col>
        <Col span={2}><b>% Off</b></Col>
        <Col span={2}><b>₹ Off</b></Col>
        <Col span={2}><b>GST%</b></Col>
        <Col span={3}><b>Total ₹</b></Col>
        <Col span={2}></Col>
      </Row>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Row key={field.key} gutter={8} align="middle" style={{ marginBottom: 12 }}>
                <Col span={3}>
                  <Form.Item
                    name={[field.name, "partName"]}
                    rules={[{ required: true, message: "Part Name is required" }]}
                    validateTrigger={["onChange", "onBlur"]}
                  >
                    <Input placeholder="Part Name" />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name={[field.name, "modelNo"]}>
                    <Input placeholder="Model No." />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name={[field.name, "category"]}>
                    <Select placeholder="Category">
                      <Option value="engine">Engine</Option>
                      <Option value="brake">Brake</Option>
                      <Option value="electrical">Electrical</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item name={[field.name, "quantity"]} initialValue={1}>
                    <InputNumber min={1} style={{ width: "100%" }} onChange={() => calculateTotal(field.name)} />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item name={[field.name, "unitPrice"]} initialValue={0}>
                    <InputNumber min={0} style={{ width: "100%" }} onChange={() => calculateTotal(field.name)} />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item name={[field.name, "discountPercent"]}>
                    <InputNumber min={0} max={100} placeholder="%" style={{ width: "100%" }} onChange={() => calculateTotal(field.name, "discountPercent")} />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item name={[field.name, "discountAmount"]}>
                    <InputNumber min={0} placeholder="₹" style={{ width: "100%" }} onChange={() => calculateTotal(field.name, "discountAmount")} />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item name={[field.name, "gst"]} initialValue={18}>
                    <Select onChange={() => calculateTotal(field.name)} style={{ width: "100%" }}>
                      {GST_OPTIONS.map((rate) => (
                        <Option key={rate} value={rate}>{`${rate}%`}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name={[field.name, "totalAmount"]}>
                    <InputNumber disabled placeholder="₹ 0.00" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: "red", fontSize: 16 }} />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                + Add Item
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default InvoiceItemsList;
