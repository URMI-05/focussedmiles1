import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { signInAnonymously } from "firebase/auth";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };
  const handleGuestLogin = async () => {
  try {
    await signInAnonymously(auth);
    navigate("/dashboard");
  } catch (err) {
    alert(err.message);
  }
};

return (
 
  <div className="wrapper">
    <div className="card">

      <div className="header">
        <h2>FocussedMiles </h2>
        <p>WELCOME</p>
        <p>Login to continue your focus journey</p>
      </div>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value.trim())}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

    <p style={{ marginTop: "10px", fontSize: "14px", textAlign: "center" }}>
  Don’t have an account?{" "}
  <span
    style={{ color: "#6366f1", cursor: "pointer" }}
    onClick={() => navigate("/signup")}
  >
    Sign up
  </span>
</p>

<button
  style={{ marginTop: "10px", background: "#22c55e" }}
  onClick={handleGuestLogin}
>
  Continue as Guest
</button>

    </div>
  </div>
);
//   <div className="authPage">
//     <div className="authCard">

//       <h2>FOCUSSED MILES</h2>

// <p>WELCOME</p>
//       <input
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value.trim())}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button onClick={handleLogin}>Login</button>

//       <button onClick={handleGuestLogin}>
//         Continue as Guest
//       </button>

//       <p className="link" onClick={() => navigate("/signup")}>
//         Create an account
//       </p>

//     </div>
//   </div>

}

export default Login;