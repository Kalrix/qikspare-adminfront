import React, { useState } from "react";
import {
  Card,
  List,
  Typography,
  Form,
  Input,
  Button,
  message,
  Tag,
  Row,
  Col,
  Space,
  Select,
  Modal,
} from "antd";
import { API } from "../../../config/API";

const { Text } = Typography;
const { Option } = Select;

interface Address {
  _id?: string;
  address_line?: string;
  city?: string;
  state?: string;
  pincode?: string;
  is_default?: boolean;
}

interface Props {
  userId: string;
  addresses: Address[];
  onRefresh: () => Promise<void>;
}

const ManageAddresses: React.FC<Props> = ({ userId, addresses, onRefresh }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const showEditModal = (addr?: Address) => {
    if (addr) {
      form.setFieldsValue({ ...addr });
      setEditingAddress(addr);
    } else {
      form.resetFields();
      setEditingAddress(null);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (values: Address) => {
    setLoading(true);
    try {
      let updatedAddresses: Address[] = [];

      if (editingAddress) {
        // Update existing address
        updatedAddresses = addresses.map((addr) =>
          addr._id === editingAddress._id
            ? { ...addr, ...values }
            : values.is_default ? { ...addr, is_default: false } : addr
        );
      } else {
        // Add new address
        updatedAddresses = values.is_default
          ? addresses.map((addr) => ({ ...addr, is_default: false }))
          : [...addresses];

        updatedAddresses.push(values);
      }

      const res = await fetch(`${API.USERS}/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
        },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });

      if (res.ok) {
        message.success(editingAddress ? "Address updated" : "Address added");
        form.resetFields();
        setModalOpen(false);
        setEditingAddress(null);
        await onRefresh();
      } else {
        const err = await res.json();
        message.error(err?.detail || "Failed to update addresses");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <Card title="Manage Addresses" style={{ marginTop: 24 }}>
      <List
        dataSource={addresses}
        bordered
        locale={{ emptyText: "No addresses added yet." }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="link" size="small" onClick={() => showEditModal(item)}>
                Edit
              </Button>,
            ]}
          >
            <Text>
              📍 {item.address_line}, {item.city}, {item.state} - {item.pincode}
            </Text>
            {item.is_default && (
              <Tag color="green" style={{ marginLeft: 8 }}>
                Primary
              </Tag>
            )}
          </List.Item>
        )}
      />

      <Button type="primary" onClick={() => showEditModal()} style={{ marginTop: 24 }}>
        Add New Address
      </Button>

      <Modal
        title={editingAddress ? "Edit Address" : "Add Address"}
        open={modalOpen}
        onOk={() => form.submit()}
        onCancel={() => setModalOpen(false)}
        confirmLoading={loading}
        okText="Save"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="address_line"
            label="Address Line"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Street no. 4, Sector 23" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="state" label="State" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pincode" label="Pincode" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="is_default" label="Make Primary">
                <Select>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageAddresses;
