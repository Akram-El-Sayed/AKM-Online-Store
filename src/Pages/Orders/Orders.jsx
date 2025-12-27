import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearOrders, initOrders } from '../../Store/Slices/orderSlice';
import { Button, Card, Container, ListGroup } from 'react-bootstrap';
import { FaDollarSign } from "react-icons/fa";
export default function Orders() {
    const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.user); 
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(initOrders(userInfo.id));
    }
  }, [dispatch, userInfo]);

   const toggleItems = (id) => {
    setOpenOrderId(prev => (prev === id ? null : id));
  };
  return (
    <div>{orders.length === 0 && (
      <Card className="p-4 text-center shadow-sm">
        <h5>No orders yet</h5>
        <p className="text-muted">Your orders will appear here</p>
      </Card>
    )}
    {orders.length > 0 && (
        <Container>
            <div className=' d-flex justify-content-between align-items-center'>
        <h5 className="my-3 font4">My Orders</h5>
        <Button variant='danger'onClick={()=> dispatch(clearOrders())} className="my-3">Clear Orders List</Button>
        </div>
        {orders.map(order => (
            
            <Card key={order.id} className="mb-3 p-3 shadow-sm">
                <Card.Body>
              <div><strong>Order ID:</strong> {order.id}</div>
              <div><strong>Total:</strong> {order.totalAmount}<FaDollarSign className=' text-success'/></div>
              <div><strong>Status:</strong> <span className={`${order.status === "Paid" ? "text-success" : "rate"}`}>
                    {order.status}
                  </span></div>
                  <Button
                  size="sm"
                  variant="outline-primary"
                  className="mt-2"
                  onClick={() => toggleItems(order.id)}
                >
                  {openOrderId === order.id ? "Hide Items" : "View Items"}
                </Button>
                {openOrderId === order.id && (
                  <ListGroup className="mt-3">
                    {order.items.map(item => (
                      <ListGroup.Item key={item.id} className="d-flex gap-3">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                        <div>
                          <div className="fw-semibold">{item.title}</div>
                          <div className=' d-flex flex-column'>
                          <small className="text-muted">
                            Qty: {item.quantity}
                          </small>
                          <small className="text-muted">
                            Price: {item.price}<FaDollarSign/>
                          </small>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
                </Card.Body>
            </Card>
          
          ))}
            </Container>
       
    )}</div>
  )
}
