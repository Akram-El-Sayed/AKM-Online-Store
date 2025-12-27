import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import { Button, Card, Carousel, Col, Container, Form, Row } from 'react-bootstrap';
import { Loading } from '../../components/Loading/Loading';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Toaster } from 'react-hot-toast';
import { imge } from '../../images/images';
import Pagination from "react-bootstrap/Pagination";


export default function Products({theme}) {
  const limit = 8;
  const [categories, setCategories] = useState([])
  
  const [activeCategory, setactiveCategory] = useState("")
  const [search, setsearch] = useState("")
  const [sortType, setSortType] = useState("");
  const [products, setproducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page , setpage] = useState(1)
  const pages = Math.ceil(total / limit);
const currentPage = page;

  
  useEffect(()=>{
    async function fetchCategory() {
      try {
        const response = await api.get("/products/category-list")
        setCategories(response.data)
      } catch (error) {
        console.log(error)
        
      }
      
    }
    fetchCategory()
  },[])
  const getApiSortParams = () => {
    if (!sortType) return "";

    const order =
      sortType === "price-desc" || sortType === "rating-desc"
        ? "desc"
        : "asc";

    const sortBy = sortType.includes("price")
      ? "price"
      : sortType.includes("title")
      ? "title"
      : "rating";

    return `&sortBy=${sortBy}&order=${order}`;
  };
  const clientSort = (items) => {
    if (!sortType) return items;

    return [...items].sort((a, b) => {
      if (sortType === "price-asc") return a.price - b.price;
      if (sortType === "price-desc") return b.price - a.price;
      if (sortType === "title-asc")
        return a.title.localeCompare(b.title);
      if (sortType === "rating-desc") return b.rating - a.rating;
      return 0;
    });
  };
  
  const loadProducts = async (options = {}) => {
    const {
      category = activeCategory,
      searchTerm = search,
      pageNumber = page,
    } = options;
  try {
    let Url = ""
    const skip = (pageNumber - 1) * limit;

     if (searchTerm.trim()) {
       Url = `/products/search?q=${searchTerm}&limit=${limit}&skip=${skip}`;
     } else if (category) {
      Url = `/products/category/${category}?limit=${limit}&skip=${skip}`;
       Url += getApiSortParams()
     } 
       else{
       Url = `/products?limit=${limit}&skip=${skip}`;
       Url += getApiSortParams();
     }
     
     const res = await api.get(Url)
    
    
     setproducts(res.data.products)
     setTotal(res.data.total)
     setpage(pageNumber)
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  } };

  const handleChangePage = (pageNumber) => {
  setpage(pageNumber);
  loadProducts({ pageNumber });
  window.scrollTo({ top: 0, behavior: "smooth" });
};
 
const getVisiblePages = (currentPage, totalPages, maxVisible = 3) => {
  let startPage = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
  let endPage = startPage + maxVisible - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxVisible + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
};


 useEffect(() => {
    loadProducts({ pageNumber: 1 });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadProducts({ searchTerm: search, pageNumber: 1 });
    }, 500);

    return () => clearTimeout(debounce);
    //eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    loadProducts({ pageNumber: 1 });
    setpage(1);
    // eslint-disable-next-line
  }, [sortType, activeCategory]);

  const handleCategoryClick = (category) => {
    if (activeCategory === category) {
       setactiveCategory("");
    setpage(1);
    loadProducts({ category: "", pageNumber: 1 });
    }else{
      setactiveCategory(category)
    setsearch("");
    setSortType("");
     setpage(1);
    loadProducts({ category, pageNumber: 1 });
    }
    
  };
  
  const finalProducts = search
    ? clientSort(products) 
    : products;
   if(loading) return <Loading/>
  return (
    <div style={{ padding: "10px" }}>
      <Toaster
  position="bottom-right"
  reverseOrder={false}
/>
  <Carousel className=' mb-3 rounded-2 Home-carousel'data-bs-theme={theme === "light" ? "dark" : "light"} fade controls={false}>
        {theme === "light" ? (
        <Carousel.Item >
        <img src={imge.productsLight} alt="products" className='carousel-img  rounded-2'/>
        <Carousel.Caption className={`bg-light rounded-3 `} >
          <h3 className='font4 dis-sm  '>Explore Our Products</h3>
          <p className=' dis-sm'>Smart shopping for everyday life</p>
        </Carousel.Caption>
        </Carousel.Item>): (
        <Carousel.Item >
        <img src={imge.productsblack} alt="products" className='carousel-img  rounded-2'/>
        <Carousel.Caption className={`bg-black rounded-3 `} >
          <h3 className='font4 dis-sm  '>Explore Our Products</h3>
          <p className=' dis-sm'>Smart shopping for everyday life</p>
        </Carousel.Caption>
        </Carousel.Item>)}
      </Carousel>
       <Form.Control
        type="text"
        placeholder="Search products..."
        className="mb-3"
        value={search}
        onChange={(e) =>{ setsearch(e.target.value)
          setactiveCategory("")
          setSortType("")
        }}
      />
    <div className="category-slider mb-3">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "warning" : "outline-warning"}
            onClick={() => handleCategoryClick(cat)}
            style={{ minWidth: "150px" }}
  
          >
            {cat.toUpperCase()}
          </Button>
        ))}
      </div>
        <Form.Select
        className="mb-3"
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
      >
        <option value="">Sort by...</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="title-asc">Title: A → Z</option>
        <option value="rating-desc">Rating: High → Low</option>
      </Form.Select>
      
       <Container fluid className='px-1 px-lg-5 mb-4'>
          <Row className="g-4 ">
          {finalProducts.map((p) => (
            <Col key={p.id} xs={6} sm={6} md={4} lg={3} className="d-flex">
            <ProductCard key={p.id} item={p} theme={theme}/>
            </Col>
          ))}
          </Row>
        </Container>
        <div className="pagination-wrapper">
<Pagination className="justify-content-center mb-4">

  {currentPage !== 1 && <Pagination.First onClick={() => handleChangePage(1)} />}
  <Pagination.Prev
    onClick={() => handleChangePage(currentPage - 1)}
    disabled={currentPage === 1}
  />

  
  {getVisiblePages(currentPage, pages)[0] > 1 && (
    <>
      <Pagination.Item onClick={() => handleChangePage(1)}>1</Pagination.Item>
      {getVisiblePages(currentPage, pages)[0] > 2 && <Pagination.Ellipsis disabled />}
    </>
  )}

  {getVisiblePages(currentPage, pages).map((pageNumber) => (
    <Pagination.Item
      key={pageNumber}
      active={currentPage === pageNumber}
      onClick={() => handleChangePage(pageNumber)}
    >
      {pageNumber}
    </Pagination.Item>
  ))}

  
  {getVisiblePages(currentPage, pages).slice(-1)[0] < pages && (
    <>
      {getVisiblePages(currentPage, pages).slice(-1)[0] < pages - 1 && <Pagination.Ellipsis disabled />}
      <Pagination.Item onClick={() => handleChangePage(pages)}>{pages}</Pagination.Item>
    </>
  )}

  <Pagination.Next
    onClick={() => handleChangePage(currentPage + 1)}
    disabled={currentPage === pages}
  />
  {currentPage !== pages && <Pagination.Last onClick={() => handleChangePage(pages)} />}

</Pagination>
</div>
      </div>
  )
}
