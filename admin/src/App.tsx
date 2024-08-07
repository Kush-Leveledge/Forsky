import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Dashboard } from './components/component/dashboard';
import { Orders } from './components/component/orders';
import { Users } from './components/component/users';
import { Products } from './components/component/products';
import { Categories } from './components/component/categories';
import { Payments } from './components/component/payment';
import { Shipping } from './components/component/shipping';
import { Filter2 } from './components/component/filter2';
import { Login } from './components/component/login';
import { Signup } from './components/component/signup';
 // Assume you have a Home component
// kush
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={"Hello"} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/filter" element={<Filter2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
      </Routes>
    </Router>
  );
}

export default App;
