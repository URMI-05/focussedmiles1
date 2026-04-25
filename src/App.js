import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Timer from "./Timer";

function App() {
  return (
<BrowserRouter>
 <Routes>
<Route path="/" element={<Login />} />
<Route path="/signup" element={<Signup />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/timer" element={<Timer />} />
 </Routes>
</BrowserRouter>
  );
}

export default App;