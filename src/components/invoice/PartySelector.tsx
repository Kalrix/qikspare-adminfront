import React, { useEffect, useState } from "react";
import { Select, Form, Row, Col, message, Spin } from "antd";
import axios from "axios";
import { API } from "../../config/API";

const { Option } = Select;

type Props = {
  form: any;
};

type RawLocation = {
  address_line?: string;
  addressLine?: string; // Accept both camelCase and snake_case just in case
  city?: string;
  state?: string;
  pincode?: string;
};

type Party = {
  _id: string;
  full_name: string;
  phone: string;
  email?: string;
  gstin?: string;
  role: string;
  location?: RawLocation;
  addresses?: RawLocation[];
};

const PartySelector: React.FC<Props> = ({ form }) => {
  const [vendors, setVendors] = useState<Party[]>([]);
  const [garages, setGarages] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API.USERS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("qik_token")}`,
          },
        });

        const data = res.data;
        console.log("📦 RAW USERS DATA", data);

        if (Array.isArray(data)) {
          setVendors(data.filter((u) => u.role === "vendor"));
          setGarages(data.filter((u) => u.role === "garage"));
        }
      } catch {
        message.error("❌ Failed to load vendors and garages");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getDisplayAddress = (party: Party): string => {
    const loc = party.location?.addressLine || party.location?.address_line;
    const alt =
      party.addresses?.find(
        (a) => a.addressLine || a.address_line
      )?.addressLine || party.addresses?.[0]?.address_line;

    return loc || alt || "Address not available";
  };

  const handleSelect = (role: "vendor" | "garage", id: string) => {
    const list = role === "vendor" ? vendors : garages;
    const party = list.find((u) => u._id === id);
    if (!party) return;

    const key = role === "vendor" ? "seller" : "buyer";

    form.setFieldsValue({
      [key]: {
        userId: party._id,
        name: party.full_name,
        phone: party.phone,
        email: party.email || "",
        gstin: party.gstin || "",
        address: getDisplayAddress(party),
      },
      ...(role === "garage" ? { garageId: party._id } : {}),
    });
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Select Vendor (Seller)"
            name={["seller", "userId"]}
            rules={[{ required: true, message: "Please select a vendor" }]}
          >
            <Select
              placeholder="Choose a vendor"
              onChange={(id) => handleSelect("vendor", id)}
              showSearch
              optionFilterProp="children"
              allowClear
            >
              {vendors.map((v) => (
                <Option key={v._id} value={v._id}>
                  {v.full_name} - {v.phone}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Select Garage (Buyer)"
            name={["buyer", "userId"]}
            rules={[{ required: true, message: "Please select a garage" }]}
          >
            <Select
              placeholder="Choose a garage"
              onChange={(id) => handleSelect("garage", id)}
              showSearch
              optionFilterProp="children"
              allowClear
            >
              {garages.map((g) => (
                <Option key={g._id} value={g._id}>
                  {g.full_name} - {g.phone}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Spin>
  );
};

export default PartySelector;
