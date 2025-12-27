import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import { useParams } from 'react-router-dom'
import { Badge, Button, Card, Carousel, Col, Container, Image, ListGroup, Row } from 'react-bootstrap'
import { Loading } from '../../components/Loading/Loading'
import { FaDollarSign } from "react-icons/fa";
import { ImStarFull } from "react-icons/im";
import { LiaShippingFastSolid } from "react-icons/lia";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { TbTruckReturn } from "react-icons/tb";
import { GiCheckMark } from "react-icons/gi";
import { FaXmark } from "react-icons/fa6";
import { useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { addToCart } from '../../Store/Slices/cartSlice'
export default function ProductDetails({theme}) {
  const [loading,setLoading] = useState(true)
  const [product,setProduct] = useState()
  const{id} = useParams()
  const dispatch = useDispatch()
  function handleAddToCart() {
      dispatch(addToCart(product));
    }
  useEffect(()=>{
    async function FetchProduct() {
      try {
        const response = await api.get(`/products/${id}`)
        setProduct(response.data)
      } catch (error) {
        console.log(error)
      }finally{
        setLoading(false)
      }
      
    }
    FetchProduct()
  },[id])

   if (loading) return <Loading/>
  return (
    <div className=' mx-3  pt-3' >
      <Toaster
  position="bottom-right"
  reverseOrder={false}
/>
       <Card className="mb-3  ">
  <Row className="g-0">
    <Col md={4}>
      <Card.Img
        src={product.thumbnail}
        alt={product.title}
        className="h-100 object-fit-cover "
      />
    </Col>

    <Col md={8} className='  pt-lg-5  fs-5'>
      <Card.Body>
        <Card.Title><h1 className='font4  text-decoration-underline'>{product.title}</h1></Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>
          <span className="mt-3">
          {product.tags.map(tag => (
            <Badge bg="secondary" className="me-2" key={tag}>
              #{tag}
            </Badge>
          ))}
        </span>
        </Card.Text>
        <Card.Text>
          <span className=' d-flex align-items-center gap-1 text-nowrap'>
                       <span> Price: {product.price} </span>
                       <FaDollarSign className=' text-success'/> <Badge bg="success">
            -{product.discountPercentage}%
          </Badge>
                       </span>
                        <span className=' d-flex align-items-center gap-1 text-nowrap'>
                       <span> Rating: {product.rating} </span>
                        <ImStarFull className='rate align-middle' />
                       </span>
        <span>Status: {product.availabilityStatus}<span className=' ms-2'>{product.stock == 0 ? <FaXmark />:<GiCheckMark />}</span></span>
        </Card.Text>
        
        <ListGroup>
          <ListGroup.Item>
            <strong><span className=' me-2 fs-3 '><AiFillSafetyCertificate /></span>Warranty:</strong> <br/>
           {product.warrantyInformation}
          </ListGroup.Item>
           <ListGroup.Item>
            <strong><span className=' me-2 fs-3 '><LiaShippingFastSolid /></span>Shipping:</strong><br/> {product.shippingInformation}
          </ListGroup.Item>
           <ListGroup.Item>
           <strong><span className=' me-2 fs-3 '><TbTruckReturn /></span>Return Policy:</strong><br/> {product.returnPolicy}
          </ListGroup.Item>
          <ListGroup.Item className=' d-flex align-items-center justify-content-center w-100'>
            {product.stock == 0 ? <Button className=' w-100 text-secondary' disabled>Out Of Stock</Button>:<Button className=' w-100' onClick={handleAddToCart}>Add To Cart</Button>}  
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Col>
  </Row>
  <Row>
     <Col md={12}>
     <div className='px-4 mt-4'>
      <h4 className=' text-decoration-underline font4'>Dimensions</h4>
      <ListGroup>
        <ListGroup.Item>
          <strong>Width:</strong><span className=' ms-2'>{product.dimensions.width}</span>
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Height:</strong><span className=' ms-2'>{product.dimensions.height}</span>
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Depth:</strong><span className=' ms-2'>{product.dimensions.depth}</span>
        </ListGroup.Item>
      </ListGroup>
      <Carousel className='productDetails-card-carousel'data-bs-theme={theme === "light" ? "dark" : "light"} controls={product.images.length < 2 ? false : true} indicators={product.images.length < 2 ? false : true} >
              {product.images.map((img, index) => (
                <Carousel.Item key={index} >
                  <img
                    src={img}
                    className="d-block w-100 "
                    alt={product.title}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
             <h4 className=' text-decoration-underline font4'>Reviews</h4>
          {product.reviews?.map((review, index) => (
  <Card key={index} className="my-3 shadow-sm ">
    <Card.Body>
      <div className="d-flex justify-content-between">
        <Card.Title className="h6"><img src={`https://lipsum.app/random/30x30?${index +1}`} className=' rounded-5 me-2'/>{review.reviewerName}</Card.Title>
        <span className="rate">{review.rating} ★</span>
      </div>
      <Card.Text >{review.comment}</Card.Text>
      <small className="text-muted">{review.date}</small>
    </Card.Body>
  </Card>
))}

        </div>
        </Col>
  </Row>
</Card>
    </div>
  )
}
