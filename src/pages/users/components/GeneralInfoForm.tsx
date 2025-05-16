import React, { useEffect } from "react";
import { Form, Input, Row, Col } from "antd";

interface Props {
  user: any;
  editMode: boolean;
  form: any;
}

const GeneralInfoForm: React.FC<Props> = ({ user, editMode, form }) => {
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        full_name: user.full_name || "",
        phone: user.phone || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user, form]);

  return (
    <Form form={form} layout="vertical" className="general-info-form">
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="full_name" label="Full Name">
            <Input disabled={!editMode} placeholder="Enter full name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="phone" label="Phone">
            <Input disabled placeholder="Phone number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="email" label="Email">
            <Input disabled={!editMode} placeholder="Email address" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="role" label="Role">
            <Input disabled placeholder="User role" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default GeneralInfoForm;
