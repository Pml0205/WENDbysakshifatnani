import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "portfolio", Component: Portfolio },
      { path: "projects", Component: Projects },
      { path: "services", Component: Services },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
    ],
  },
]);