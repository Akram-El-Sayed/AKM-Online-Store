import React, { useState } from 'react'
import { Button, Card, Col, Container, FormControl, ListGroup, Row } from "react-bootstrap";
import { FaDollarSign } from "react-icons/fa";

import { TiShoppingCart } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { MdRemoveShoppingCart } from "react-icons/md";
import { CgRemove } from "react-icons/cg";
import {
  applyCoupon,
  clearCart,
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "../../Store/Slices/cartSlice";
import { FaTruckArrowRight } from "react-icons/fa6";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FaRegTrashCan } from "react-icons/fa6";
import { Form, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../../components/Footer/Footer';

export default function Cart({theme}) {
  const [coupon,setCoupon] = useState("")
  const CouponCode = "1ab3cdserre"
  const { isLoggedIn} = useSelector((state)=> state.user)
  
   const { cartItems, totalAmount, totalItems ,discount, usedCoupons,subtotal } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    function handleCoupon() {
      if (!coupon.trim()) {
    toast.error("Coupon is required");
    return;
  }
  if (coupon !== CouponCode) {
      toast.error("Please enter a valid Coupon");
      return;
    }

    if (usedCoupons.includes(coupon)) {
      toast.error("You already applied a coupon");
       return;
    }
   
  dispatch(applyCoupon({ code: coupon, value: 0.15 }));
  toast.success("Coupon Applied Successfully");

   
      
    }
    
  return (
    <Container fluid className=" px-3">
  <Toaster position="bottom-right" reverseOrder={false}/>
      {cartItems.length == 0 ? (<p className='shadow p-4 d-flex align-items-center justify-content-center text-secondary fs-4  rounded-2'>Your Cart is Empty</p>):( 
        
        <Row className='g-2' >
          
          <div className=' d-flex justify-content-between align-items-center'>
            <h3 className="d-flex align-items-center  mb-4 pt-4">
       <TiShoppingCart  className=' fs-1'/>
        <span className='font4'>Cart <span className='fs-6 text-secondary'>({totalItems}: items)</span></span>
      </h3>
            <Button variant="danger" className='' onClick={() => dispatch(clearCart())}>
             <MdRemoveShoppingCart /> Clear Cart 
            </Button>
          </div>
      
        <Col md={8} xs={12}>
        <ListGroup  >
         {cartItems.map((p)=>(
          <ListGroup.Item key={p.id} > 
            <Row>
              <Col md={3} xs={3} lg={2} >
              <img src={p.thumbnail} alt={p.title} className="w-100"  />
              </Col>
              <Col md={9} xs={9} lg={10} >
               <div className=' d-flex justify-content-between  align-items-center'>
                <h4 className='fon4 text-decoration-underline  dis-sm'><Link to={`/products/${p.id}`} className=' text-body-emphasis font4'>{p.title}</Link></h4>
                <div className='d-flex align-items-center text-nowrap  '>
                <h5 className='dis-sm'>{(p.price * p.quantity).toFixed(2)}<FaDollarSign className=' text-success dis-sm'/></h5>
                </div>
              </div>
              <div className=' d-flex justify-content-between  align-items-start flex-nowrap'>
             <p className='dis-sm dis-lg text-secondary'><LiaShippingFastSolid className='dis-sm dis-lg text-success' /> {p.shippingInformation}</p>
             <span className='dis-sm dis-lg text-nowrap'><FaTruckArrowRight className='text-success dis-sm ' /> <span className=' text-secondary text-nowrap'>Free Delivery</span></span>
                </div>
                <div className=' d-flex justify-content-between  align-items-center'>
                 
                <div>
                  <Button
                  size='sm'
                      variant={
                        p.quantity == 1 ? "secondary" : "primary"
                      }
                      onClick={() => dispatch(decreaseQty(p.id))}
                      disabled={p.quantity == 1} className='dis-sm btn-sm2 dis-lg '
                    >
                      -
                    </Button>
                    <span className="mx-2 ">{p.quantity}</span>
                    <Button
                     size='sm'
                      variant={
                        p.stock == p.quantity
                          ? "secondary"
                          : "primary"
                      }
                      onClick={() => dispatch(increaseQty(p.id))}
                      disabled={p.stock == p.quantity} className='dis-sm btn-sm2 dis-lg '
                    >
                      +
                    </Button>
                    </div>
                     <Button size='sm' variant="outline-danger"
                      className="dis-sm btn-sm2 dis-lg "
                      onClick={() => dispatch(removeFromCart(p.id))} ><FaRegTrashCan /></Button>
                </div>
              </Col>

            </Row>
          </ListGroup.Item>
         ))}
          
        </ListGroup>
        </Col>
        <Col md={4} xs={12}>
        <Card className='mb-3'>
          <Card.Body>
            <Card.Title>
             <h3 className='font4'> Order Summary</h3>
            </Card.Title>

            <div className='d-flex justify-content-center align-items-center flex-nowrap'>
              <FormControl id="newsletter1" type="text" className="form-control rounded-1" placeholder="Coupon Code" value={coupon}
                onChange={(e) => setCoupon(e.target.value)}/> 
                        <Button onClick={handleCoupon} variant={usedCoupons.includes(coupon) ? "secondary" : "primary"} disabled={usedCoupons.includes(coupon)} className=' rounded-1'>{usedCoupons.includes(coupon) ? "Applied" : "Apply"}</Button> 
            </div>
            <hr />
            <div className='d-flex justify-content-between align-items-center mt-3 text-secondary'>
              <Card.Subtitle >
              Subtotal: <span className=' fs-6'>({totalItems}:items)</span>
            </Card.Subtitle>
            <Card.Subtitle>
            ({subtotal.toFixed(2)})
            </Card.Subtitle>
            </div>
             <div className='d-flex justify-content-between align-items-center mt-3 text-secondary'>
              <Card.Subtitle >
              Shipping Fee
            </Card.Subtitle>
            <Card.Subtitle className=' text-success  fw-bolder'>
            FREE
            </Card.Subtitle>
            </div>
            {discount > 0 &&(
              <div className='d-flex justify-content-between align-items-center mt-3 text-secondary'>
              <Card.Subtitle >
              Discount
            </Card.Subtitle>
            <Card.Subtitle className='fw-bolder'>
             -{discount * 100}%
            </Card.Subtitle>
            </div>)} 
            <hr />
            <div className='d-flex justify-content-between align-items-center mt-3 dis-lg dis-sm '>
              <Card.Subtitle >
              <h3>Total:</h3>
            </Card.Subtitle>
           <div className='d-flex justify-content-center flex-nowrap'>{discount > 0 && (
  <span className=" text-secondary fw-bold text-decoration-line-through fs-6">
    ${subtotal.toFixed(2)}
  </span>
)}
<h5 className=" text-success ">
  ${totalAmount.toFixed(2)}
</h5></div>
            </div>
            <Button as={Link} to={!isLoggedIn ? "/login" : "/Checkout"} className='w-100'>CHECKOUT</Button>
          </Card.Body>
        </Card>
        
        </Col>
      </Row>)}
     
    </Container>
  )
}
