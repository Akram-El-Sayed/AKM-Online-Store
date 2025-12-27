import React, { useEffect, useState } from 'react'
import { Button, Card, Carousel, Col, Container, Form, ListGroup, Row } from 'react-bootstrap'
import { images } from '../../images/images'
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineSupportAgent } from "react-icons/md";
import { SiAuthy } from "react-icons/si";
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { images1 } from '../../images/images';
import ProductCartTopRated from '../../components/ProductCartTopRated/ProductCartTopRated';
import toast, { Toaster } from 'react-hot-toast';
import { imge } from '../../images/images'
import { Loading } from '../../components/Loading/Loading';
import { FaLongArrowAltRight } from "react-icons/fa";
export default function Home({theme}) {
  const [email, setEmail] = useState("");
  const [BestSellers,SetBestSellers] = useState([])
  const [loading,setLoading] = useState(true)
  const handleSubmit = () => {
  if (!email.trim()) {
    toast.error("Email is required");
    return;
  }

  if (!email.includes("@")) {
    toast.error("Please enter a valid email");
    return;
  }

  toast.success("Email Sent");
};
  useEffect(()=>{
    async function FetchTopRatingProducts() {
      try {
        const response = await api.get("/products?limit=1000")
        const topRating = response.data.products.filter((p)=>p.rating > 4.5).sort((a,b)=>b.rating !== a.rating
    ? b.rating - a.rating
    : b.stock - a.stock).slice(0,8)
    SetBestSellers(topRating)
      } catch (error) {
        console.log(error)
      }finally{
        setLoading(false)
      }
      
    }
    FetchTopRatingProducts()
  },[])
  if(loading) return <Loading/>
  return (
    <main>
      <section className=' vh-100 d-flex flex-column'>
      <Carousel className=' rounded-bottom-2 Home-carousel'data-bs-theme={theme === "light" ? "dark" : "light"} fade>
        {theme === "light" ? images.map((item, inex)=>(
        <Carousel.Item key={inex}>
        <img src={item.img} alt={item.title} className='carousel-img  rounded-bottom-2'/>
        <Carousel.Caption className={`bg-light rounded-3 `} >
          <h3 className='font4 dis-sm  '>{item.title}</h3>
          <p className=' dis-sm'>{item.subtitle} <span><Link to={"/products"} className='  text-nowrap'>Shop Now<FaLongArrowAltRight /></Link></span></p>
        </Carousel.Caption>
        </Carousel.Item>)): images1.map((item, inex)=>(
        <Carousel.Item key={inex}>
        <img src={item.img} alt={item.title} className='carousel-img  rounded-bottom-2'/>
        <Carousel.Caption className={`bg-black rounded-3 `} >
          <h3 className='font4 dis-sm'>{item.title}</h3>
          <p className=' dis-sm'>{item.subtitle} <span><Link to={"/products"} className='   text-nowrap '>Shop Now<FaLongArrowAltRight /></Link></span></p>
        </Carousel.Caption>
        </Carousel.Item>))}
      </Carousel>
     <div className="flex-grow-1 d-flex align-items-center ">
      <Container>
  <div className="row g-4 justify-content-center text-center row-cols-1 row-cols-lg-3  "> 
    <div className="col d-flex align-items-start justify-content-center  "> 
      <div className='icon-square p-0 border border-light rounded-3 d-inline-flex align-items-center justify-content-center flex-shrink-0 me-3'>
      <div className="icon-square border border-black d-inline-flex align-items-center justify-content-center fs-2 flex-shrink-0 text-body-emphasis rounded-3 p-1"> <TbTruckDelivery /> </div> </div>
<div> 
  <h5 className=" text-body-emphasis m-0 font4">Free Delivery</h5> 
  <p className="text-body-emphasis">Fast & Free Shipping on All Orders</p>
  </div> 
  </div> 
  <div className="col d-flex align-items-start justify-content-center "> 
    <div className='icon-square p-0 border border-light rounded-3 d-inline-flex align-items-center justify-content-center flex-shrink-0 me-3'>
    <div className="icon-square border border-black border-light text-body-emphasis  d-inline-flex align-items-center justify-content-center fs-2 flex-shrink-0  rounded-3 p-1">
      <MdOutlineSupportAgent /> </div> </div>
<div> 
  <h5 className="text-body-emphasis m-0 font4">Support 24/7</h5> 
  <p className="text-body-emphasis">We’re Here to Help Anytime, Anywhere</p>
  </div> 
  </div> 
  <div className="col d-flex align-items-start justify-content-center"> 
     <div className='icon-square p-0 border border-light rounded-3 d-inline-flex align-items-center justify-content-center flex-shrink-0 me-3'>
    <div className="icon-square border border-black text-body-emphasis  d-inline-flex align-items-center justify-content-center fs-2 flex-shrink-0 rounded-3 p-1"> 
   <SiAuthy />
</div>
</div> 
<div> 
  <h5 className=" text-body-emphasis m-0 font4">100% Authentic</h5> 
  <p className="text-body-emphasis">Guaranteed Original & Trusted Products</p> 
  </div> 
  </div> 
  </div>
  </Container>
</div>
</section>
<section className={` mb-5 border-top ${theme === "light" ? " border-secondary" : "border-light" }`}>
  <Container fluid className='px-3 px-lg-5'>
    <h3 className='text-center mb-5 text-body-emphasis pt-5 font4'>Top Rated</h3>
     <Row className="g-4 ">
  {BestSellers.map(item => (
    <Col key={item.id} xs={6} sm={6} md={4} lg={3} className="d-flex">
      <ProductCartTopRated item={item} theme={theme} />
    </Col>
  ))}
</Row>
  </Container>
</section>
<Toaster
  position="bottom-right"
  reverseOrder={false}
/>


<div className={`border-top  ${theme === "light" ? " border-secondary" : "border-light" } p-5`}>
  
  <div className="px-4 py-5  text-center "> 
    <h3 className="fw-bold  text-body-emphasis font4">Join Our MailingList</h3> 
    <div className="col-lg-6 mx-auto"> 
      <p className="lead mb-4">Send Us your Email to receive inspiration, product updates,and spectial offers from our team.</p> 
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center"> 
        <div className="d-flex flex-column flex-sm-row w-100 "> 
          <Form.Label htmlFor="newsletter1" className="visually-hidden">Email address</Form.Label> 
          <Form.Control id="newsletter1" type="email" className="form-control rounded-1" placeholder="akskwa@gmail.com" value={email}
  onChange={(e) => setEmail(e.target.value)}/> 
          <Button onClick={handleSubmit} className=' rounded-1'>Join</Button> 
          </div> 
          </div> 
          </div> 
          </div>
</div>
<div className='d-flex justify-content-around flex-wrap  border-top border-secondary'>
  <div className="text-start  p-5 ">
         <h3 className="strtxt font5">AKM Store</h3>
    <p className="text-secondary strtxt">your destination for the best products online.<br/> 
        Explore, shop, and enjoy a seamless shopping experience.</p>
    <Link to="/products" className=" link-underline-opacity-0 strtxt font4">Shop Now</Link>
   
    </div>
    <div className="text-start  p-5">
    <h3 className="instxt font5">AKM</h3>
    <div className="d-flex justify-content-around flex-wrap gap-2">
     <img src={imge.Car} className="rounded-2 siz" alt="..." />
     <img src={imge.SmartDevicesBlack} className="rounded-2 siz" alt="..." />
     <img src={imge.BeautyBlack} className="rounded-2 siz" alt="..." />
     <img src={imge.ClothesBlack} className="rounded-2 siz" alt="..."/>
    </div>
   
  </div>
</div>
   
    </main>
  )
}
