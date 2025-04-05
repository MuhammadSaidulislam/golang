import React from "react";
import { Message, Icon, Button } from "semantic-ui-react";

const CheckoutSuccess = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f9f9f9",
    }}
  >
    <Message positive style={{ maxWidth: "500px", textAlign: "center" }}>
      <Icon name="check circle" size="big" color="green" />
      <Message.Header style={{ fontSize: "1.5em", marginBottom: "0.5em" }}>
        付款成功！
      </Message.Header>
      <p style={{ fontSize: "1.1em", marginBottom: "1em" }}>
        感谢您的付款！我们已收到您的订单。
      </p>
      <Button color="green" onClick={() => (window.location.href = "/")}>
        返回首页
      </Button>
    </Message>
  </div>
);

export default CheckoutSuccess;
