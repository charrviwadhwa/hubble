import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const handleRegister = async () => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log(user);
  } catch (error) {
    console.error(error.message);
  }
};
