import React from "react";
import { Container, Card, ListGroup } from "react-bootstrap";

export default function Returns({ theme }) {
  return (
    <Container className="py-5">
      <Card className={theme === "dark" ? "bg-dark text-light" : ""}>
        <Card.Body>
          <h2 className="font4 mb-3">Returns & Refunds</h2>

          <p>
            We offer a **30-day return policy** on most items.
          </p>
           <ListGroup>
            <ListGroup.Item>
                <p>Items must be unused and in original packaging</p>
            </ListGroup.Item>
             <ListGroup.Item>
                <p>Proof of purchase is required</p>
            </ListGroup.Item>
             <ListGroup.Item>
                <p>Refunds processed within 5–7 business days</p>
            </ListGroup.Item>
           </ListGroup>
          

          <p className="text-secondary mt-3">
            Shipping fees are non-refundable unless the item is defective.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
