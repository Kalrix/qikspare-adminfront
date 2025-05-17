import React from "react";
import { Row, Col, Form, Input, DatePicker } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const InvoiceMeta: React.FC = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item
          name="invoiceDate"
          label={
            <span>
              <CalendarOutlined /> Invoice Date
            </span>
          }
          rules={[{ required: true, message: "Please select invoice date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="referenceNumber" label="Reference #">
          <Input placeholder="PO / Ref No." />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="notes" label="Notes / Remarks">
          <TextArea rows={1} placeholder="Any extra info…" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default InvoiceMeta;
