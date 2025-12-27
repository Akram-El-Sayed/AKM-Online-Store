import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Carousel,ListGroup, } from 'react-bootstrap'
import { ImStarFull } from "react-icons/im";
import { FaDollarSign } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { MdRemoveShoppingCart } from "react-icons/md";
import { addToCart } from '../../Store/Slices/cartSlice';
import { useDispatch } from 'react-redux';

export default function ProductCartTopRated({item , theme}) {
  const dispatch = useDispatch();
  function handleAddToCart() {
    dispatch(addToCart(item));
  }
  return (
    <Card   className={`w-100 h-100 dis-sm  position-relative rounded-4 ${
    theme === "light" ? "shadow" : "shadow-dark"}`} >
          <span className="best-seller-badge">
             Top Rated
          </span>
           <Button disabled={item.stock == 0} className='btn-sm btn-cart btn-fs ' variant={item.stock == 0? "secondary": "primary"} onClick={handleAddToCart}>{item.stock == 0? <MdRemoveShoppingCart />:<MdAddShoppingCart  />}</Button>
          <Carousel className='product-card-carousel' data-bs-theme={theme === "light" ? "dark" : "light"} controls={item.images.length < 2 ? false : true} indicators={false } >
            
    {item.images.map((img, index) => (
      <Carousel.Item key={index}>
        <img
          src={img}
          className="d-block w-100"
          alt={item.title}
          
        />
      </Carousel.Item>
    ))}
  </Carousel>
      <Card.Body >
        <Card.Title className='font4 title-sm'>{item.title}</Card.Title>
        <Card.Text className='dis-sm mb-0'>
         {item.description.length > 80 ? item.description.slice(0, 50) + "..." : item.description}
          </Card.Text>
          <ListGroup>
          <div className=' mb-3 d-flex justify-content-between align-items-center border border-secondary rounded-2 p-1  flex-wrap'>
           <div className=' d-flex align-items-center  text-nowrap dis-sm'>
             <span> Price: {item.price} </span>
             <FaDollarSign className=' text-success'/>
             </div>
           <div className='d-flex align-items-center text-nowrap dis-sm '>
                 <span>Rating: {item.rating}</span>
                    <ImStarFull className='rate' />
           </div> 
        </div>
        </ListGroup>
           <div className=' mb-3'>
                     <Button className='btn-sm w-100' variant="primary" as={Link} to={`/products/${item.id}`}>See More</Button>
                    
                   </div>
      </Card.Body></Card>
  )
}
