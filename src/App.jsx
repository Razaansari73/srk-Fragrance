import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";

function LegacyRedirect() {
  const { pathname, search, hash } = useLocation();
  return (
    <Navigate
      replace
      to={`${pathname.replace(/\.html$/, "").replace("/index", "/")}${search}${hash}`}
    />
  );
}

function CatalogRoute() {
  const [params] = useSearchParams();
  return <CatalogPage key={params.toString()} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<AuthPage />} />
      <Route path="register" element={<AuthPage />} />
      <Route path="verify" element={<AuthPage />} />
      <Route path="auth/callback" element={<AuthPage />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="arrival" element={<CatalogRoute />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*.html" element={<LegacyRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
