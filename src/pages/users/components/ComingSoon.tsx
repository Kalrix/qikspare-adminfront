// src/pages/users/components/ComingSoon.tsx
import React from "react";
import { Empty } from "antd";

interface ComingSoonProps {
  title?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <Empty
        description={
          title ? `${title} section coming soon...` : "Coming soon..."
        }
      />
    </div>
  );
};

export default ComingSoon;
