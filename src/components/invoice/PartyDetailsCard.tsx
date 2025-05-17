import React from "react";
import { Card, Form, Input, Typography, Row, Col } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

type Props = {
  type: "seller" | "buyer";
  form: any;
};

const PartyDetailsCard: React.FC<Props> = ({ type, form }) => {
  const title = type === "seller" ? "Seller (Vendor)" : "Buyer (Garage)";

  return (
    <Card title={title} className="party-card">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={[type, "name"]} label="Name">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={[type, "phone"]} label="Phone">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={[type, "email"]} label="Email">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={[type, "gstin"]} label="GSTIN">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name={[type, "address"]} label="Address">
            <TextArea rows={2} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default PartyDetailsCard;
