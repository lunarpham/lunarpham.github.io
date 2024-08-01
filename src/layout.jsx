import Navbar from "./components/Navbar.jsx";
import AboutMe from "./components/AboutMe.jsx";
import React from "react";

const Layout = ({children}) => {
    return(
        <>
            <Navbar/>
            <div
                className="max-w-screen-xl mx-auto px-4 pt-10 text-start grid grid-rows-2 md:grid-cols-12 md:gap-4 align-middle">
                <div className="col-span-9 flex-col">

                    <main>{children}</main>

                </div>
                <div className="col-span-3 flex-col mt-8 md:mt-0">

                    <div className="text-lg uppercase font-semibold mb-2 opacity-50">About me</div>
                    <AboutMe/>

                </div>
            </div>
        </>
    )
}

export default Layout;