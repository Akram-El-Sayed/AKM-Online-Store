import React from "react";
import { Container, Card, ListGroup } from "react-bootstrap";

export default function Support({ theme }) {
  return (
    <Container className="py-5">
      <Card className={theme === "dark" ? "bg-dark text-light" : ""}>
        <Card.Body>
          <h2 className="font4 mb-3">Customer Support</h2>
          <p>
            We’re here to help you 24/7. If you have any questions or issues,
            please reach out to us.
          </p>
            <ListGroup>
                <ListGroup.Item>
                    <p>Email: <strong>support@akmstore.com</strong></p>
                </ListGroup.Item>
                 <ListGroup.Item>
                    <p>Phone: <strong>+20 100 000 0000</strong></p>
                </ListGroup.Item>
                 <ListGroup.Item>
                    <p>Live Chat: Available 24/7</p>
                </ListGroup.Item>
            </ListGroup>
        
          <p className="mt-3 text-secondary">
            Response time is usually within 24 hours.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
