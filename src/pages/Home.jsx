import { useState } from 'react'
import '../App.css'
import AboutMe from "../components/AboutMe.jsx";

function Home() {

  return (
    <>
        <div className="text-lg uppercase font-semibold mb-2 opacity-50">Articles (1)</div>
        <a href="/article/1">
            <div className="md:flex-col bg-white p-8 border hover:border-amber-600 cursor-pointer">
                <div className="text-gray-700">Posted on July 30th, 2024</div>
                <div className="font-bold text-2xl">Welcome to my blog</div>
                <div className="font-medium mt-4 break-words">
                    This article is written by ChatGPT for displaying purpose. I'm a third-year student majoring in Computer and Science Engineering... Continue reading.
                </div>
            </div>
        </a>


    </>
  )
}

export default Home
