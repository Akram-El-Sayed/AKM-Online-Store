import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Button,
  Form,
} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { FaBoxOpen, FaUsers, FaEdit } from "react-icons/fa";
import { updateAddress } from "../../Store/Slices/UserSlice";

export default function Profile({theme}) {
  const { userInfo, isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState({ ...userInfo.address });

  if (!isLoggedIn) return <Navigate to="/login" />;

  const handleSave = () => {
    dispatch(updateAddress(address));
    setEditing(false);
  };

  return (
    <Container className="mt-4">
      <Row className=" g-2">
        {/* LEFT */}
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <img
                src={userInfo?.image}
                alt={userInfo?.username}
                className={`rounded-circle border p-3 mb-3 ${theme === "light" ? " border-secondary" : "border-light" }`}
                width="120"
                height="120"
              />
              <h4>{userInfo?.username}</h4>
              <p className="text-secondary">{userInfo?.email}</p>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="font4 mb-3">
                Account Information
              </Card.Title>

              {/* ADDRESS VIEW */}
              {!editing && (
                <>
                <ListGroup className="mb-3" >
                <ListGroup.Item>
                  <strong>Full Name:</strong>{" "}
                  {userInfo?.firstName} {userInfo?.lastName}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Phone:</strong> {userInfo?.phone}
                </ListGroup.Item>
                </ListGroup>
                
               <Card.Title className="font4 mb-3">
                Account Address
              </Card.Title>
                  <ListGroup >
                    <ListGroup.Item>
                      <strong>Country:</strong> {userInfo?.address?.country}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>State:</strong> {userInfo?.address?.state}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>City:</strong> {userInfo?.address?.city}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Address:</strong> {userInfo?.address?.address}
                    </ListGroup.Item>
                  </ListGroup>

                  <Button
                    variant="outline-primary"
                    className="mt-3"
                    onClick={() => setEditing(true)}
                  >
                    <FaEdit /> Change Address
                  </Button>
                </>
              )}

              {/* ADDRESS EDIT */}
              {editing && (
                <Form className="mt-3">
                  <Form.Group className="mb-2">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      value={address.country}
                      onChange={(e) =>
                        setAddress({ ...address, country: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      value={address.address}
                      onChange={(e) =>
                        setAddress({ ...address, address: e.target.value })
                      }
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button variant="success" onClick={handleSave}>
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}

              <hr />

              {/* NAV BUTTONS */}
              <div className="d-flex gap-2 flex-wrap">
                <Button as={Link} to="/orders" variant="outline-primary">
                  <FaBoxOpen /> My Orders
                </Button>

                <Button as={Link} to="/users" variant="outline-success">
                  <FaUsers /> Users
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
