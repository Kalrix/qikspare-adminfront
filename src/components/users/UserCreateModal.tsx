import React from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { API } from "../../config/API";

const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UserCreateModal: React.FC<Props> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const res = await fetch(API.ADMIN_CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        message.success("User created successfully");
        form.resetFields();
        onSuccess();
        onClose();
      } else {
        message.error(data?.detail || "Failed to create user");
      }
    } catch (err) {
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      title="Create New User"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Create"
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          name="full_name"
          label="Full Name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Phone is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Role is required" }]}
        >
          <Select placeholder="Select role">
            <Option value="garage">Garage</Option>
            <Option value="vendor">Vendor</Option>
            <Option value="delivery">Delivery</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreateModal;
