import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { clearUser } from "../../Store/Slices/UserSlice";
import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
  const go = useNavigate()
  // dispatch
  const dispatch = useDispatch();

  function handleLogout() {
    // Clear Info Redux
    dispatch(clearUser());

    // Clear Info LocalStorage
    localStorage.removeItem("userInfo");
    go("/")
    // Message
    toast.success("User Logout Successfully!");
  }

  return (
    <Button variant="outline-danger" className=' font4 me-2 mb-lg-0 mb-2' size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
};
