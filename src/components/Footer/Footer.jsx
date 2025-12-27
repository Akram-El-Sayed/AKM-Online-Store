import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FcShop } from "react-icons/fc";
import toast from "react-hot-toast";
import { imge } from "../../images/images";

export default function Footer({ theme }) {
  const [joinEmail, setJoinEmail] = useState("")
  const handlejoin = () => {
  if (!joinEmail.trim()) {
    toast.error("Email is required");
    return;
  }

  if (!joinEmail.includes("@")) {
    toast.error("Please enter a valid email");
    return;
  }

  toast.success("Email Sent");
};
  return (
    <footer
      className={`border-top mt-auto ${
        theme === "light"
          ? "bg-light text-dark border-secondary"
          : "bg-dark text-light border-secondary"
      }`}
    >
      
      <Container fluid className="px-3 px-lg-5 py-5  ">
        
          {/* Brand */}
         <div className="d-flex justify-content-around flex-wrap">
          <div className=" d-flex justify-content-center flex-column align-items-center">
            <h3 className="font5 d-flex align-items-center gap-2">
              <img src={imge.logo} style={{width:'90px',height:'60px'}}/> AKM Store
            </h3>
            <p className="text-secondary">
              Your destination for the best products online.<br/>  
              Shop smart, fast, and secure.
            </p>
            </div>
         
          {/* Links */}
            <div className=" d-flex justify-content-around align-items-center align-items-center flex-wrap">
         
           <div className=" align-items-center m-5">
            <h6 className="fw-bold">Explore</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/products" className="footer-link">Products</Link></li>
              <li><Link to="/cart" className="footer-link">Cart</Link></li>
            </ul>
           </div>
        

          {/* Help */}
             <div className=" align-items-center m-5">
            <h6 className="fw-bold">Help</h6>
            <ul className="list-unstyled">
              <li><Link to="/support" className="footer-link">Support</Link></li>
              <li><Link to="/returns" className="footer-link">Returns</Link></li>
              <li><Link to="/shipping" className="footer-link">Shipping</Link></li>
            </ul>
            </div>
           </div>
          {/* Newsletter */}
             <div className=" d-flex justify-content-center flex-column align-items-center ">
         
            <h6 className="fw-bold">Join our newsletter</h6>
            <p className="text-secondary">
              Get offers & product updates.
            </p>
            <Form className="d-flex gap-2">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={joinEmail}
                onChange={(e)=> setJoinEmail(e.target.value)}
              />
              <Button variant="primary"  onClick={handlejoin}>Join</Button>
            </Form>
           </div>
           </div>
        <hr />

        <div className="text-center text-secondary small">
          © {new Date().getFullYear()} AKM Store. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
