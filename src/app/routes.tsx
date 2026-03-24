import React from "react";
import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { Seller } from "./components/Seller";
import { Buyer } from "./components/Buyer";
import { About } from "./components/About";
import { ProductDetails } from "./components/ProductDetails";
import { Checkout } from "./components/Checkout";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Admin } from "./components/Admin";

const protect = (Component: React.ComponentType) => () => (
  <ProtectedRoute><Component /></ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "about", Component: About },
      { path: "dashboard", Component: protect(Dashboard) },
      { path: "seller", Component: protect(Seller) },
      { path: "buyer", Component: Buyer },
      { path: "product/:id", Component: ProductDetails },
      { path: "checkout/:id", Component: Checkout },
      { path: "admin", Component: protect(Admin) },
    ],
  },
]);
