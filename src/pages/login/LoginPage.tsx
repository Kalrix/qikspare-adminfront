import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, message } from "antd";
import Lottie from "lottie-react";
import kungFuPandaAnim from "../../assets/kungfu.json";
import { API } from "../../config/API";
import "./LoginPage.css";

const { Title } = Typography;

const quotes = [
  "Believe in yourself – Kung Fu Panda",
  "Remember who you are – Lion King",
  "The past can hurt. But you can either run from it or learn from it.",
  "There is no secret ingredient – Po",
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const onFinish = async (values: { phone: string; pin: string }) => {
    try {
      const res = await fetch(API.LOGIN_PIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("qik_token", data.access_token);
        localStorage.setItem("qik_user", JSON.stringify(data.user));
        message.success("Logged in successfully!");
        navigate("/dashboard");
      } else {
        message.error(data?.detail || "Invalid credentials");
      }
    } catch (err) {
      message.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      {/* Left Section: Animation + Quote */}
      <div className="login-left">
        <Lottie animationData={kungFuPandaAnim} style={{ width: "100%", maxWidth: 400 }} />
        <div className="quote">{quotes[quoteIndex]}</div>
      </div>

      {/* Right Section: Logo + Login Form */}
      <div className="login-right">
        <div className="login-logo-wrapper">
          <img src="/logo.png" alt="QikSpare Logo" className="big-login-logo" />
        </div>

        <Card className="login-card">
          <Title level={3} style={{ textAlign: "center", fontWeight: "bold", marginBottom: 24 }}>
            LOGIN Champion
          </Title>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input placeholder="Enter phone" />
            </Form.Item>
            <Form.Item name="pin" label="4-Digit PIN" rules={[{ required: true }]}>
              <Input.Password placeholder="Enter PIN" maxLength={4} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log In
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
