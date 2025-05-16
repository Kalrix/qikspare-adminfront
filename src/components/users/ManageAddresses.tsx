import React from "react";
import {
  Card,
  List,
  Typography,
  Form,
  Input,
  Button,
  message,
  Tag,
} from "antd";
import { API } from "../../config/API";

const { Text } = Typography;

interface Address {
  addressLine?: string;
  city?: string;
  state?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
}

interface Props {
  userId: string;
  addresses: Address[];
  onRefresh: () => Promise<void>;
}

const ManageAddresses: React.FC<Props> = ({ userId, addresses, onRefresh }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: Address) => {
    try {
      const res = await fetch(`${API.USERS}/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
        },
        body: JSON.stringify({ addresses: [...addresses, values] }),
      });

      if (res.ok) {
        message.success("Address added");
        form.resetFields();
        await onRefresh(); // Refresh parent data
      } else {
        message.error("Failed to add address");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  return (
    <Card title="Manage Addresses" style={{ marginTop: 24 }}>
      <List
        dataSource={addresses}
        bordered
        locale={{ emptyText: "No addresses yet." }}
        renderItem={(item, index) => (
          <List.Item>
            <Text>
              📍 {item.addressLine}, {item.city}, {item.state}, {item.pincode}
            </Text>
            {index === 0 && (
              <Tag color="green" style={{ marginLeft: 8 }}>
                Primary
              </Tag>
            )}
          </List.Item>
        )}
      />

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="addressLine"
          label="Address Line"
          rules={[{ required: true, message: "Address Line is required" }]}
        >
          <Input placeholder="123 Street Name" />
        </Form.Item>

        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: "City is required" }]}
        >
          <Input placeholder="City" />
        </Form.Item>

        <Form.Item
          name="state"
          label="State"
          rules={[{ required: true, message: "State is required" }]}
        >
          <Input placeholder="State" />
        </Form.Item>

        <Form.Item
          name="pincode"
          label="Pincode"
          rules={[{ required: true, message: "Pincode is required" }]}
        >
          <Input placeholder="Pincode" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          ➕ Add Address
        </Button>
      </Form>
    </Card>
  );
};

export default ManageAddresses;
