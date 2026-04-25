// import { useState } from "react";
// import { auth, db } from "./firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     if (!name || !email || !password) {
//       alert("Fill all fields");
//       return;
//     }

//     try {
//       const userCred = await createUserWithEmailAndPassword(auth, email, password);
//       await setDoc(doc(db, "users", userCred.user.uid), {
//         name: name,
//         email: email
//       });

//       navigate("/dashboard");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="wrapper">
//       <div className="card">
//         <h2>Create Account</h2>

//         <input
//           placeholder="Name"
//           onChange={(e) => setName(e.target.value)}
//         />

//         <input
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button onClick={handleSignup}>Sign Up</button>

//         <p className="link" onClick={() => navigate("/")}>
//           Already have an account?
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Signup;
import { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCred.user.uid), {
        name: name,
        email: email,
        points: 0
      });

      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="wrapper">
      <div className="card">

        <div className="header">
          <h2>Create Account</h2>
        </div>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Sign Up</button>

      </div>
    </div>
  );
}

export default Signup;