import React, { useEffect, useState } from "react";
import { Button, Card, Container, FormControl, ListGroup } from "react-bootstrap";
import { api } from "../../utils/api";
import { Loading } from "../../components/Loading/Loading";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading ,setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
        try {
        const endpoint = search.trim()
          ? `/users/search?q=${search}`
          : `/users`;

        const res = await api.get(endpoint);
        setUsers(res.data.users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
   fetchUsers()
    
  }, [search]);

  
   if(loading) return <Loading/>
  return (
    <Container className="mt-4">
      <h3 className="mb-3 font4">Users</h3>

      <FormControl
        placeholder="Search user..."
        className="mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
     
      <ListGroup>
        {users.length === 0 && (
          <ListGroup.Item className="text-center text-secondary">
            No users found
          </ListGroup.Item>
        )}
        {users.map(user => (
             
          <ListGroup.Item key={user.id}>
            <div className=" d-flex justify-content-between align-items-center flex-wrap gap-2 ">
            <div className="d-flex align-items-center gap-3">
              <img
                src={user.image}
                alt={user.firstName}
                width="50"
                height="50"
                className="rounded-circle"
              />
              <div>
                <strong>
                  {user.firstName} {user.lastName}
                </strong>
                <div className="text-secondary d-flex flex-wrap ">{user.email}</div>
              </div>
            </div>
            <Button variant="outline-warning" size="sm" as={Link} to={`/userDetails/${user.id}`}>Veiw Profile</Button>
            </div>
          </ListGroup.Item>
          
        ))}
      </ListGroup>
   </Container>
  );
}
