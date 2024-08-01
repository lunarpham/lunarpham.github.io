import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Layout from "./layout.jsx";
import Article from "./pages/Article.jsx";
import './index.css'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        errorElement: <ErrorPage />
    },
    {
        path: "/contact",
        element: <Contact />
    },
    {
        path: "/article/:ArticleId",
        element: <Article />
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Layout>
            <RouterProvider router={router}/>
        </Layout>
    </React.StrictMode>,
)
