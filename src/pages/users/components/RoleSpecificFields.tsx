import React, { useEffect } from "react";
import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;

interface Props {
  user: any;
  editMode: boolean;
  form: any;
}

const RoleSpecificFields: React.FC<Props> = ({ user, editMode, form }) => {
  const role = user?.role;

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        ...user.kyc_details && {
          "kyc_details.driving_license": user.kyc_details.driving_license,
          "kyc_details.rc_book": user.kyc_details.rc_book,
          "kyc_details.fitness_certificate": user.kyc_details.fitness_certificate,
          "kyc_details.insurance": user.kyc_details.insurance,
        },
      });
    }
  }, [user, form]);

  return (
    <Form form={form} layout="vertical" className="role-specific-form">
      <Row gutter={24}>
        {role === "garage" && (
          <>
            <Col span={12}>
              <Form.Item name="garage_name" label="Garage Name">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="garage_size" label="Garage Size">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="brands_served" label="Brands Served">
                <Select mode="tags" disabled={!editMode} placeholder="e.g. TVS, Maruti" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vehicle_types" label="Vehicle Types">
                <Select mode="tags" disabled={!editMode} placeholder="e.g. 2W, 3W, 4W" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category_focus" label="Category Focus">
                <Select mode="tags" disabled={!editMode} placeholder="e.g. Engine, Tyre" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gstin" label="GSTIN">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pan_number" label="PAN Number">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
          </>
        )}

        {role === "vendor" && (
          <>
            <Col span={12}>
              <Form.Item name="business_name" label="Business Name">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="business_type" label="Business Type">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="brands_carried" label="Brands Carried">
                <Select mode="tags" disabled={!editMode} placeholder="e.g. TVS, Castrol" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category_focus" label="Category Focus">
                <Select mode="tags" disabled={!editMode} placeholder="e.g. Lubricants, Battery" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="distributor_size" label="Distributor Size">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gstin" label="GSTIN">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pan_number" label="PAN Number">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
          </>
        )}

        {role === "delivery" && (
          <>
            <Col span={12}>
              <Form.Item name="vehicle_type" label="Vehicle Type">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vehicle_number" label="Vehicle Number">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="warehouse_assigned" label="Warehouse Assigned">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="kyc_details.driving_license" label="Driving License">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="kyc_details.rc_book" label="RC Book">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="kyc_details.fitness_certificate" label="Fitness Certificate">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="kyc_details.insurance" label="Insurance">
                <Input disabled={!editMode} />
              </Form.Item>
            </Col>
          </>
        )}

        {["admin"].includes(role) && (
          <Col span={24}>
            <p>No role-specific fields for this user.</p>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default RoleSpecificFields;
