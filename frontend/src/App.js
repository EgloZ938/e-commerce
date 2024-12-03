import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Components et pages
import LoginAdmin from './pages/LoginAdmin';
import AdminDashboard from './pages/AdminDashboard';
import EditProduct from './pages/EditProduct';
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AdminUsers from './pages/AdminUsers';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';

// Contexts
import { CartProvider } from './components/Contexts/CartContext';
import { AuthProvider } from './components/Contexts/AuthContext';
import { useAuth } from './components/Contexts/AuthContext';

// Initialiser Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Composant PrivateRoute pour les routes utilisateur
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Composant pour gérer l'affichage conditionnel des navigations
const NavigationWrapper = ({ children }) => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  // Liste des routes admin
  const adminRoutes = ['/admin', '/admin/product', '/admin/users', '/loginAdmin'];
  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {/* Afficher Navigation sur toutes les pages sauf les pages admin */}
      {!isAdminRoute && <Navigation />}
      {/* Afficher Navbar uniquement sur les pages admin quand l'utilisateur est connecté */}
      {isAdminRoute && userInfo && <Navbar />}
      {/* Wrapper pour le contenu principal avec padding sauf pour les pages admin */}
      <div className={!isAdminRoute ? "max-w-6xl mx-auto px-4 py-8" : ""}>
        {children}
      </div>
    </>
  );
};

function App() {
  const auth = useSelector((state) => state.auth);
  const userInfo = auth?.userInfo;

  return (
    <AuthProvider>
      <CartProvider>
        <Elements stripe={stripePromise}>
          <Router>
            <div className="min-h-screen bg-gray-100">
              <NavigationWrapper>
                <Routes>
                  {/* Routes publiques */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Routes protégées utilisateur */}
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />

                  {/* Routes admin */}
                  <Route
                    path="/loginAdmin"
                    element={!userInfo ? <LoginAdmin /> : <Navigate to="/admin" />}
                  />
                  <Route
                    path="/admin"
                    element={userInfo?.isAdmin ? <AdminDashboard /> : <Navigate to="/loginAdmin" />}
                  />
                  <Route
                    path="/admin/product/:id"
                    element={userInfo?.isAdmin ? <EditProduct /> : <Navigate to="/loginAdmin" />}
                  />
                  <Route
                    path="/admin/users"
                    element={userInfo?.isAdmin ? <AdminUsers /> : <Navigate to="/loginAdmin" />}
                  />
                </Routes>
              </NavigationWrapper>
            </div>
          </Router>
        </Elements>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;


/* J'ai un soucis tout fonctionne, sauf les routes admin J'ai une erreur :

Uncaught runtime errors:
ERROR
The operation is insecure.
push@http://127.0.0.1:3000/main.61ad0f20e262d1081026.hot-update.js:8890:23
./node_modules/react-router/dist/index.js/useNavigateUnstable/navigate<@http://127.0.0.1:3000/main.61ad0f20e262d1081026.hot-update.js:19230:61
./node_modules/react-router/dist/index.js/Navigate/<@http://127.0.0.1:3000/main.61ad0f20e262d1081026.hot-update.js:20137:62
commitHookEffectListMount@http://127.0.0.1:3000/static/js/bundle.js:41843:30
commitPassiveMountOnFiber@http://127.0.0.1:3000/static/js/bundle.js:43336:42
commitPassiveMountEffects_complete@http://127.0.0.1:3000/static/js/bundle.js:43308:38
commitPassiveMountEffects_begin@http://127.0.0.1:3000/static/js/bundle.js:43298:45
commitPassiveMountEffects@http://127.0.0.1:3000/static/js/bundle.js:43288:38
flushPassiveEffectsImpl@http://127.0.0.1:3000/static/js/bundle.js:45171:32
flushPassiveEffects@http://127.0.0.1:3000/static/js/bundle.js:45124:18
./node_modules/react-dom/cjs/react-dom.development.js/commitRootImpl/<@http://127.0.0.1:3000/static/js/bundle.js:44939:13
workLoop@http://127.0.0.1:3000/static/js/bundle.js:56660:46
flushWork@http://127.0.0.1:3000/static/js/bundle.js:56638:18
performWorkUntilDeadline@http://127.0.0.1:3000/static/js/bundle.js:56875:25


J'ai essayé de changer les routes, mais rien n'y fait. Règle mon problème stp
*/
