import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AiFillProduct } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import {
  Row,
  Col,
  Nav,
  Button,
  Table,
  Spinner,
  Form,
  Card,
  Container,
  Pagination,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { api } from "../../utils/api";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Store/Slices/UserSlice";

/* --- Storage Helpers --- */
const getStored = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const setStored = (key, data) => localStorage.setItem(key, JSON.stringify(data));

function AdPagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const getVisiblePages = (curr, total) => {
    let start = Math.max(curr - 1, 1);
    let end = Math.min(start + 2, total);
    if (end === total) start = Math.max(end - 2, 1);
    const p = [];
    for (let i = start; i <= end; i++) p.push(i);
    return p;
  };
  const visible = getVisiblePages(page, pages);

  return (
    <Pagination className="justify-content-center mt-3">
      <Pagination.First onClick={() => onChange(1)} disabled={page === 1} />
      {visible.map((n) => (
        <Pagination.Item key={n} active={n === page} onClick={() => onChange(n)}>
          {n}
        </Pagination.Item>
      ))}
      <Pagination.Last onClick={() => onChange(pages)} disabled={page === pages} />
    </Pagination>
  );
}

export default function Dashboard() {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}>
          <Card className="shadow-sm border-0 p-2">
            <Nav className="flex-column nav-pills">
              <Nav.Link as={Link} to="/dashboard" >Overview</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/products" >Products</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/users" >Users</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/carts">Carts</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/auth">Admin Session</Nav.Link>
            </Nav>
          </Card>
        </Col>
        <Col md={9}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="carts" element={<CartsAdmin />} />
            <Route path="auth" element={<AuthAdmin />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}


function Overview() {
  const [totals, setTotals] = useState({ p: 0, u: 0, c: 0 });
  useEffect(() => {
    const p = getStored("products").length;
    const u = getStored("users").length;
    const c = getStored("carts").length;
    setTotals({ p, u, c });
  }, []);

  return (
    <Row className="g-4">
      <Col md={4}><Card className="text-center p-4 border-0 shadow-sm bg-primary text-white"><h3><span className=" text-dark fs-1"><AiFillProduct /></span>{totals.p}</h3>Products</Card></Col>
      <Col md={4}><Card className="text-center p-4 border-0 shadow-sm bg-success text-white"><h3><span className=" text-dark fs-1"><FaUsers /></span> {totals.u}</h3>Users</Card></Col>
      <Col md={4}><Card className="text-center p-4 border-0 shadow-sm bg-warning text-white"><h3><span className=" text-dark fs-1"><GiShoppingCart /></span>{totals.c}</h3>Carts</Card></Col>
    </Row>
  );
}


function ProductsAdmin() {
  const [list, setList] = useState([]);
  const [load, setLoad] = useState(true);
  const [fields, setFields] = useState({ title: "", price: "" });
  const [activeId, setActiveId] = useState(null);
  const [pg, setPg] = useState(1);
  const size = 10;

  useEffect(() => {
    const local = getStored("products");
    if (local.length > 0) {
      setList(local);
      setLoad(false);
    } else {
      api.get("/products?limit=1000").then(r => {
        setList(r.data.products);
        setStored("products", r.data.products);
      }).finally(() => setLoad(false));
    }
  }, []);

  const handleSave = async () => {
    try {
      if (activeId) {
        const { data } = await api.put(`/products/${activeId}`, fields);
        const updated = list.map(item => item.id === activeId ? { ...item, ...data } : item);
        setList(updated);
        setStored("products", updated);
      } else {
        const { data } = await api.post("/products/add", fields);
        const newList = [data, ...list];
        setList(newList);
        setStored("products", newList);
      }
      setFields({ title: "", price: "" });
      setActiveId(null);
    } catch (e) { alert("Error saving product"); }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      const filtered = list.filter(i => i.id !== id);
      setList(filtered);
      setStored("products", filtered);
    } catch (e) { alert("Delete failed"); }
  };

  if (load) return <Spinner animation="grow" />;
  const slice = list.slice((pg - 1) * size, pg * size);

  return (
    <Card className="border-0 shadow-sm p-3">
      <div className="d-flex gap-2 mb-3">
        <Form.Control value={fields.title} placeholder="Title" onChange={e => setFields({...fields, title: e.target.value})} />
        <Form.Control value={fields.price} type="number" placeholder="Price" onChange={e => setFields({...fields, price: e.target.value})} />
        <Button onClick={handleSave} variant="warning">{activeId ? "Update" : "Add"}</Button>
      </div>
      <Table hover>
        <thead><tr><th>Title</th><th>Price</th><th>Actions</th></tr></thead>
        <tbody>
          {slice.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td><td>${p.price}</td>
              <td>
                <Button variant="outline-primary" className="me-2" size="sm" onClick={() => {setActiveId(p.id); setFields({title: p.title, price: p.price})}}>Edit</Button>
                <Button variant="outline-danger" size="sm"  onClick={() => remove(p.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <AdPagination page={pg} pages={Math.ceil(list.length / size)} onChange={setPg} />
    </Card>
  );
}


function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [fields, setFields] = useState({ firstName: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [pg, setPg] = useState(1);
  let size = 10;

  useEffect(() => {
     const local = getStored("users");
  if (local?.length) {
    setUsers(local);
  }
    async function FetchUsers() {
      try {
        const r = await api.get("/users?limit=1000")
        setUsers(r.data.users)
        setStored("users", r.data.users)
      } catch (error) {
        console.log(error)
      }
    }
     FetchUsers()
  }, []);

  const commit = async () => {
    try {
      if (editId) {
        const { data } = await api.put(`/users/${editId}`, fields);
        const up = users.map(u => u.id === editId ? { ...u, ...data } : u);
        setUsers(up); 
        setStored("users", up);
      } else {
        const { data } = await api.post("/users/add", fields);
        const fresh = [data, ...users];
        setUsers(fresh); 
        setStored("users", fresh);
      }
      setFields({ firstName: "", email: "" }); 
      setEditId(null);
    } catch (e) { console.error(e); }
  };

  const del = async (id) => {
    await api.delete(`/users/${id}`);
    const filtered = users.filter(u => u.id !== id);
    setUsers(filtered); 
    setStored("users", filtered);
  };

  const slice = users.slice((pg - 1) * size, pg * size);

  return (
    <Card className="border-0 shadow-sm p-3">
      <div className="d-flex gap-2 mb-3">
        <Form.Control value={fields.firstName} placeholder="Name" onChange={e => setFields({...fields, firstName: e.target.value})} />
        <Form.Control value={fields.email} placeholder="Email" onChange={e => setFields({...fields, email: e.target.value})} />
        <Button onClick={commit}>{editId ? "Update" : "Register"}</Button>
      </div>
      <div className="table-responsive">
      <Table hover>
        <tbody>
          {slice.map(u => (
            <tr key={u.id}>
              <td>{u.firstName}</td><td className="dis-sm">{u.email}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => {setEditId(u.id); setFields({firstName: u.firstName, email: u.email})}}>Edit</Button>
                <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => del(u.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      <AdPagination page={pg} pages={Math.ceil(users.length / 5)} onChange={setPg} />
    </Card>
  );
}


function CartsAdmin() {
  const [carts, setCarts] = useState([]);
  const [pg, setPg] = useState(1);
  const [newCart, setNewCart] = useState({ userId: "", productId: "" });
  const [editing, setEditing] = useState(null);
  let size = 10;

  useEffect(() => {
     const local = getStored("carts");
    if (local.length){
       setCarts(local);
    }
    async function FetchCarts() {
      try {
        const res = await api.get("/carts?limit=1000")
        setCarts(res.data.carts);
        setStored("carts", res.data.carts); 
      } catch (error) {
        console.log(error)
      }
    }
   FetchCarts()
  }, []);

  const create = async () => {
    const { data } = await api.post("/carts/add", {
      userId: newCart.userId,
      products: [{ id: newCart.productId, quantity: 1 }]
    });
    const updated = [data, ...carts];
    setCarts(updated);
    setStored("carts", updated);
  };

  
  const saveUpdate = async () => {
    try {
      const { data } = await api.put(`/carts/${editing.id}`, { 
        products: editing.products 
      });
      
      const updatedList = carts.map(c => c.id === editing.id ? { ...c, products: data.products } : c);
      
      setCarts(updatedList);
      setStored("carts", updatedList);
      setEditing(null); 
    } catch (err) {
      alert("Update failed");
    }
  };

  const trash = async (id) => {
    await api.delete(`/carts/${id}`);
    const filtered = carts.filter(c => c.id !== id);
    setCarts(filtered);
    setStored("carts", filtered);
  };

  const slice = carts.slice((pg - 1) * size, pg * size);

  return (
    <Card className="border-0 shadow-sm p-3">
      <div className="d-flex gap-2 mb-3">
        <Form.Control placeholder="User ID" value={newCart.userId} onChange={e => setNewCart({...newCart, userId: e.target.value})} />
        <Form.Control placeholder="Product ID" value={newCart.productId} onChange={e => setNewCart({...newCart, productId: e.target.value})} />
        <Button onClick={create} variant="warning">New Cart</Button>
      </div>

      {editing && (
        <Card className="mb-3 border-warning ">
          <Card.Body>
            <h6>Editing Cart #{editing.id}</h6>
            {editing.products.map((p, i) => (
              <ListGroup className="mb-2">
                <ListGroup.Item>
              <div key={i} className="d-flex align-items-center gap-2 mb-2">
                <span><img src={p.thumbnail} style={{width: '70px', objectFit: 'cover'}} className="rounded" alt={p.title}/> <span className="dis-sm">{p.title}</span>:</span>
                <Form.Control 
                  type="number" 
                  size="sm" 
                  style={{width: '80px'}}
                  value={p.quantity}
                  onChange={(e) => {
                    const copy = [...editing.products];
                    copy[i].quantity = Number(e.target.value);
                    setEditing({...editing, products: copy});
                  }}
                />
              </div>
              </ListGroup.Item>
              </ListGroup>
            ))}
            <Button variant="success" size="sm" className="me-2" onClick={saveUpdate}>Save Changes</Button>
            <Button variant="outline-primary" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
          </Card.Body>
        </Card>
      )}
      
      <Table hover>
        <thead><tr><th>Cart ID</th><th>User</th><th>Items</th><th>Action</th></tr></thead>
        <tbody>
          {slice.map(c => (
            <tr key={c.id}>
              <td>#{c.id}</td>
              <td>User {c.userId}</td>
              <td>{c.products?.length || 0} items</td>
              <td>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => setEditing(c)}>
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => trash(c.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <AdPagination page={pg} pages={Math.ceil(carts.length / 5)} onChange={setPg} />
    </Card>
  );
}

function AuthAdmin() {
  const userInfo = useSelector(state => state.user?.userInfo ?? state.user?.user);
  const isLoggedIn = useSelector(state => state.user?.isLoggedIn ?? !!userInfo);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    try { localStorage.removeItem("userInfo"); } catch {}
    try { localStorage.removeItem("token"); } catch {}
    window.location.href = "/login";
  };

  return (
    <div>
      <h4>Authentication Admin</h4>
      {!isLoggedIn ? (
        <div>
          <p>No user logged in.</p>
          <p>Please <Link to="/login">login</Link>.</p>
        </div>
      ) : (
        <Card className="p-3 mb-3">
          <h5>Logged-in user</h5>
          <div><strong>ID:</strong> {userInfo?.id ?? "—"}</div>
          <div><strong>Username:</strong> {userInfo?.username ?? userInfo?.name ?? "—"}</div>
          <div><strong>Email:</strong> {userInfo?.email ?? "—"}</div>
          <div className="mt-3"><Button variant="danger" onClick={handleLogout}>Logout</Button></div>
        </Card>
      )}
    </div>
  );
}
