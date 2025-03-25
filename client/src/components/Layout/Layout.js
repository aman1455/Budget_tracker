import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
    <div className="h-screen ">
      <Header />
      <div className="content container">{children}</div>
      
      <Footer />
    </div>
    </>
  );
};

export default Layout;
