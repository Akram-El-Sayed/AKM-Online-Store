import React from "react";
import { Container, Card, ListGroup } from "react-bootstrap";
import { FaTruckArrowRight } from "react-icons/fa6";
import { TiStopwatch } from "react-icons/ti";
import { IoEarth } from "react-icons/io5";
export default function Shipping({ theme }) {
  return (
    <Container className="py-5">
      <Card className={theme === "dark" ? "bg-dark text-light" : ""}>
        <Card.Body>
          <h2 className="font4 mb-3">Shipping Information</h2>
            <ListGroup>
                <ListGroup.Item>
                    <p><FaTruckArrowRight className="fs-3" /> Free shipping on all orders</p>
                </ListGroup.Item>
                 <ListGroup.Item>
                    <p><TiStopwatch className="fs-3" /> Delivery time: 2–5 business days</p>
                </ListGroup.Item>
                 <ListGroup.Item>
                    <p><IoEarth className="fs-3" /> International shipping available</p>
                </ListGroup.Item>
            </ListGroup>
          <p className="text-secondary mt-3">
            Tracking information will be sent via email once your order ships.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
