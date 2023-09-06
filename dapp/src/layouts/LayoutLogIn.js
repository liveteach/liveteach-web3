import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const LayoutDefault = ({ children }) => (
  <>
    <Header  />
    <main className="site-content mt-12">{children}</main>
    <Footer />
  </>
);

export default LayoutDefault;
