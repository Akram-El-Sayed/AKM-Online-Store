
import './App.css'
import {Link, Navigate, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Products from './Pages/Products/Products'
import Cart from './Pages/Cart/Cart'
import ProductDetails from './Pages/ProductDetails/ProductDetails'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { api } from './utils/api'
import { clearUser, setUser} from './Store/Slices/UserSlice'
import { Loading } from './components/Loading/Loading'
import { ProtectedAdminRoute } from './routs/ProtectedAdminRoute'
import Dashboard from './Pages/Dashboard/Dashboard'
import {Navbar as BootstrapNavbar,
  Button,
  Nav,
} from "react-bootstrap";
import { Toaster } from 'react-hot-toast'
import { LogoutButton } from './components/LogoutButton/LogoutButton.JSX'
import Login from './Pages/Login/Login'
import { FcShop } from "react-icons/fc";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import Footer from './components/Footer/Footer'
import { TiShoppingCart } from "react-icons/ti";
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Checkout from './Pages/Checkout/Checkout'
import Support from './Pages/Support/Support'
import Returns from './Pages/Returns/Returns'
import Shipping from './Pages/Shipping/Shipping'
import Register from './Pages/Register/Register'
import { CgProfile } from "react-icons/cg";
import { initOrders } from './Store/Slices/orderSlice'
import Profile from './Pages/Profile/Profile'
import Orders from './Pages/Orders/Orders'
import Users from './Pages/Users/Users'
import UserDetails from './Pages/UserDetails/UserDetails'
import { imge } from './images/images'

function App() {
  const { isLoggedIn, role, userInfo } = useSelector((state) => state.user);
   const [isLoading,setLoading] = useState(true)
   const [expanded, setExpanded] = useState(false);
   const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "light";})
    const {totalItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch()
 


  useEffect(function () {
    async function checkMe() {
      try {
        // Get Data
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // Data LocalStorage -> User Login
        if (userInfo) {
          const token = userInfo.accessToken;

          // Endpoint => /auth/me
          const response = await api.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Store Globel Redux
          dispatch(setUser(response.data));
        }
      } catch (error) {
        console.log(error);
        // Clear User Info
        dispatch(clearUser());
        // Clear LocalStorage
        localStorage.removeItem("userInfo");
      } finally {
        setLoading(false);
      }
    }

    checkMe();
  }, [dispatch]);

  useEffect(() => {
  localStorage.setItem("theme", theme);
  document.body.setAttribute("data-bs-theme", theme);
}, [theme]);

useEffect(() => {
  if (userInfo?.id) {
    dispatch(initOrders(userInfo.id));
  }
}, [userInfo, dispatch]);
   
  if (isLoading) return <Loading />
    
  
  return (
    <div className="d-flex flex-column min-vh-100" >
      <div>
     <BootstrapNavbar expand="md" bg={theme === "light" ?  "info": theme} data-bs-theme={theme} className=' border-bottom border-secondary'>
        <Container>
          <BootstrapNavbar.Brand as={Link} to="/" className='font5'>
         <span><img src={imge.logo} style={{width:'90px',height:'60px'}}/></span>AKM-Store
          </BootstrapNavbar.Brand>

          <BootstrapNavbar.Toggle ></BootstrapNavbar.Toggle>

          <BootstrapNavbar.Collapse className="ms-3" >
            <Nav className='ms-auto  '>
              <Nav.Link as={Link} to="/"  className=' font4' >
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/products" className=' font4'>
                Products
              </Nav.Link>
               {role === 'admin' && <Nav.Link as={Link} to={'/dashboard'}className=' font4'>
                Dashboard
              </Nav.Link> }
                {isLoggedIn && <Nav.Link as={Link} to={'/profile'}className='font4'>
                <CgProfile className=' fs-2' />
              </Nav.Link> }
              <Nav.Link as={Link} to="/cart" className=' font4' >
              <div className='d-flex  align-items-center text-nowrap '>
              <span className=' itm-cart rounded-3 '>{totalItems}</span> <TiShoppingCart className=' fs-2 ' />
               </div>
              </Nav.Link>
                 <div className="d-flex   align-items-center">
              {isLoggedIn ? (
                <LogoutButton  ></LogoutButton>
              ) : (
                <Button variant="outline-primary" className=' font4 me-2 mb-lg-0 mb-2 fw-bold' size='sm' as={Link} to="/login">
                  Login
                </Button>
              )}
            </div>
            <div className="d-flex   align-items-center">
            <Button size='sm'variant="outline-primary" onClick={()=>setTheme((prev)=>prev === "light"? "dark" : "light" )}>{theme === "light"?<MdDarkMode className='fs-5' />:<MdOutlineLightMode className='fs-5' />}</Button>
            </div>
            </Nav>
           
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      </div>
      <div  className={`flex-grow-1 ${
      theme === "light"
        ? "bg-light text-dark"
        : "bg-dark text-light"
    }` } >
     

     <ScrollToTop/>
    <Routes>
      
      <Route path="/" element={<Home theme={theme}/>} />
      <Route path="products" element={<Products theme={theme}/>} />
      <Route path="/cart" element={<Cart theme={theme}/>} />
      <Route path="/products/:id" element={<ProductDetails theme={theme}/>} />
       <Route path="/Checkout" element={<Checkout theme={theme}/>} />
       <Route path="/support" element={<Support theme={theme} />} />
       <Route path="/returns" element={<Returns theme={theme} />} />
       <Route path="/shipping" element={<Shipping theme={theme} />} />
        <Route path="/register" element={<Register theme={theme} />} />
        <Route path="/orders" element={<Orders theme={theme} />} />
        <Route path="/users" element={<Users theme={theme} />} />
        <Route path='/userDetails/:id' element={<UserDetails theme={theme}/>}/>



       <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to={role === "admin" ? "/dashboard" : "/"} /> : <Login theme={theme}/>
            }
          />
           <Route
            path="/profile"
            element={
              !isLoggedIn ? <Navigate to={ "/login"} /> : <Profile theme={theme}/>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedAdminRoute>
                <Dashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    
   <Footer theme={theme}/>
    </div>
    </div>


  )
}

export default App
