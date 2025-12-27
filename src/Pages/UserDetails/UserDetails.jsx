import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge, Card, ListGroup } from "react-bootstrap";
import { Loading } from "../../components/Loading/Loading";
import { api } from "../../utils/api";

export default function UserDetails({theme}) {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading ,setLoading] = useState(true)

  useEffect(() => {
    async function Fetchuser() {
      try {
        const res = await api.get(`/users/${id}`)
        setProfile(res.data)
      } catch (error) {
        console.log(error)
      }finally{
        setLoading(false)
      }
    }
   Fetchuser()
  }, [id]);

  if (loading) return <Loading />;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="d-flex  flex-wrap gap-4">
        <img src={profile.image} alt="avatar" className={` rounded-circle border p-3  ${theme === "light" ? " border-secondary" : "border-light" }`} style={{width: '130px',height: '130px'}} />
        <div>
          <h3>{profile.firstName} {profile.lastName}</h3>
          <p className="text-muted">{profile.company?.title} at {profile.company?.name}</p>
          <Badge bg="primary" className="me-2 fs-6 text-dark">{profile.gender}</Badge>
          <Badge bg="warning" className=" fs-6 text-dark">Age: {profile.age}</Badge>
          <hr />
          <ListGroup>
            <ListGroup.Item>
             <strong>Email:</strong> {profile.email}
            </ListGroup.Item>
            <ListGroup.Item>
             <strong>Birth-Date:</strong> {profile.birthDate}
            </ListGroup.Item>
          </ListGroup>
        </div>
      </Card.Body>
    </Card>
  );
}