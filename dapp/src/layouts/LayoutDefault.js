import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PageNav from "../components/layout/PageNav";

const LayoutDefault = ({ children }) => (

    <>
        <Header authenticated />
        <PageNav />
        <main>{children}</main>
        <Footer />
    </>
);

export default LayoutDefault;
