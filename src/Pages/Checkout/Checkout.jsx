import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, FormControl, InputGroup, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { BiSolidCreditCardAlt } from "react-icons/bi";
import { FaCcVisa } from "react-icons/fa6";
import { FaCcPaypal } from "react-icons/fa6";
import { Loading } from '../../components/Loading/Loading';
import { CiCreditCardOff } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { confirmOrder } from '../../Store/Slices/cartSlice';
import Footer from '../../components/Footer/Footer';
import { createorder, updateOrderStatus } from '../../Store/Slices/orderSlice';

export default function Checkout() {
   const { userInfo} = useSelector((state)=> state.user)
   const {totalAmount, totalItems ,discount, cartItems ,subtotal } = useSelector((state) => state.cart);
  const [cardHolderName,setCardHolderName] = useState(userInfo?.username || "")
   const [cardNumber,setCardNumber] = useState( 4 + userInfo?.bank?.cardNumber || "")
   const [cardExpDate,setCardExpDate] = useState(userInfo?.bank?.cardExpire || "")
  const [cardCVC,setCardCVC] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  
 

    const formatCardNumber = (num = "") =>
  num.split("").filter(c => c >= "0" && c <= "9") .slice(0, 16).join("").match(/.{1,4}/g)?.join(" ") || ""; 

 

const detectCardType = (num = "") => {
  const clean = num.replace(/\D/g, ""); 
  if (!clean) return "unknown";

 
  if (clean.startsWith("4")) return "visa";

  
  const firstTwo = parseInt(clean.slice(0, 2), 10);
  const firstFour = parseInt(clean.slice(0, 4), 10);

  if ((firstTwo >= 51 && firstTwo <= 55) || (firstFour >= 2221 && firstFour <= 2720)) {
    return "mastercard";
  }

  return "unknown";
};
const go = useNavigate()
const dispatch = useDispatch()

function HandlePayNow() {
  if (processing) return;
  setProcessing(true);

  const order = {
    id: Date.now(),
    items: cartItems.map(item => ({ ...item })),
    totalAmount,
    totalItems,
    discount,
    subtotal,
    paymentMethod,
    status: "processing",
    address: userInfo.address,
    createdAt: new Date().toISOString(),
  };

  if (paymentMethod === "paypal") {
    dispatch(createorder(order)); 

    toast.success("Redirecting to PayPal in 5 seconds...", { duration: 5000 });
    setTimeout(() => {
      dispatch(updateOrderStatus({ id: order.id, status: "Paid" }));
      dispatch(confirmOrder());
      setProcessing(false);
      window.location.href = "https://www.paypal.com/signin";
    }, 5000);
    return;
  }

  if (!cardCVC || !cardHolderName || !cardExpDate || !cardNumber) {
    toast.error("Payment information required", { duration: 3000 });
    setProcessing(false);
    return;
  }

  toast.success("Processing your card payment...", { duration: 3000 });

  dispatch(createorder(order)); 
  go("/orders")
  setTimeout(() => {
    dispatch(updateOrderStatus({ id: order.id, status: "Paid" }));
    dispatch(confirmOrder());
    toast.success("Paid Successfully", { duration: 3000 });
    setProcessing(false);
    ;
  }, 5000);
}

  
  
   if (!userInfo) return <Loading/>

  return (
    <Container fluid className=' px-3'>
       <Toaster position="bottom-right"></Toaster>
      <Row>
        <Col md={8} xs={12}>
        <Card className='mt-3'>
          <Card.Body>
            <Card.Title >
             <h3 className='font4'>Address Information</h3> 
            </Card.Title>
            <ListGroup >
              <Row>
                <Col md={6} >
                <label className=' fw-bolder'>Country:</label>
                 <ListGroup.Item className=' rounded-2'>
                 {userInfo?.address?.country}
              </ListGroup.Item>
              <label className=' fw-bolder'>Address:</label>
               <ListGroup.Item className=' rounded-2'>
                    {userInfo?.address?.address}
              </ListGroup.Item>
                </Col>
                 <Col md={6} >
                 <label className=' fw-bolder'> State:</label>
                 <ListGroup.Item className=' rounded-2'>
                  {userInfo?.address?.state}
              </ListGroup.Item>
              <label className=' fw-bolder'> City:</label>
               <ListGroup.Item className=' rounded-2'>
                  {userInfo?.address?.city}
              </ListGroup.Item>
                </Col>
                
              </Row>
            </ListGroup>
          </Card.Body>
        </Card>
        <Card className='mt-2'>
          <Card.Body>
            <Card.Title className='font4'>
             <h3 className='font4'>Payment Method</h3>
            </Card.Title>
            <Row>
              <Col md={6} >
              <ListGroup className='mb-2'>
                <ListGroup.Item className=' d-flex justify-content-between align-items-center'>
              <Form.Check type='radio' name="payment" id="card" label="Debit Card / Credit Card" checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}/>
               <span className='dis-sm dis-lg fs-4'><FaCcVisa /><span><BiSolidCreditCardAlt className='fs-3' /></span></span>
           
                </ListGroup.Item>
              </ListGroup>
        
              </Col>
              <Col md={6} >
               <ListGroup className='mb-2'>
                <ListGroup.Item className=' d-flex justify-content-between align-items-center'>
              <Form.Check type='radio' name="payment" id="card" label="Paypal" checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")} />
               <span className='dis-sm dis-lg fs-3'><FaCcPaypal /></span>
           
                </ListGroup.Item>
              </ListGroup>
              </Col>
            </Row>
            {paymentMethod === "card" && (<>  <h6>Cardholder Name:</h6>
            <ListGroup className='mb-2'>
              <ListGroup.Item>
                 <Form.Control type='text' value={cardHolderName} onChange={(e)=> setCardHolderName(e.target.value)} />
              </ListGroup.Item>
            </ListGroup>
            <h6>Card Number:</h6>
            <ListGroup className='mb-2'>
              <ListGroup.Item>
                <InputGroup>
                 <Form.Control type='text' value={formatCardNumber(cardNumber)} 
                 placeholder="1234 5678 9012 3456"
                 maxLength={19}
                 onChange={(e)=> {const digits = e.target.value.split("").filter(c => c >= "0" && c <= "9").join("");
                 setCardNumber(digits);}}/>
                 <InputGroup.Text className="fs-3">
                  {detectCardType(cardNumber) === "visa" && <FaCcVisa />}
                  {detectCardType(cardNumber) === "mastercard" && <BiSolidCreditCardAlt />}
                   {detectCardType(cardNumber) === "unknown" && <CiCreditCardOff />}
                 </InputGroup.Text>
                </InputGroup>
              </ListGroup.Item>
            </ListGroup>
              <Row>
              <Col md={9} xs={8}>
              <h6>Expiry Date:</h6>
              <ListGroup>
                <ListGroup.Item >
              <Form.Control type='text' name="payment" id="card" placeholder=''value={cardExpDate} onChange={(e)=> setCardExpDate(e.target.value)} />
             
           
                </ListGroup.Item>
              </ListGroup>
        
              </Col>
              <Col md={3} xs={4}>
              <h6>CVC:</h6>
               <ListGroup>
                <ListGroup.Item >
              <Form.Control type='text' name="payment" id="card" placeholder=''value={cardCVC} onChange={(e)=> setCardCVC(e.target.value)} />
             
           
                </ListGroup.Item>
              </ListGroup>
              </Col>
            </Row></>)}
          
        {paymentMethod === "paypal" && (
                <div className="text-center mt-3">
                  <FaCcPaypal className="fs-1 " />
                  <p>You'll be redirected to PayPal to complete your payment.</p>
                </div>
              )}
           
          </Card.Body>
        </Card>
        </Col>
        <Col md={4} xs={12}>
         <Card className='my-3'>
          <Card.Body>
            <Card.Title>
             <h3 className='font4'> Order Details</h3>
            </Card.Title>
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
            <Button  className='w-100' onClick={HandlePayNow}>Pay now</Button>
          </Card.Body>
        </Card>
        </Col>
      </Row>
 
    </Container>
  )
}
