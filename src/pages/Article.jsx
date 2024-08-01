import {useParams} from "react-router-dom";


function Article() {

    let { ArticleId } = useParams();
    const paragraph = { __html:
            '<p><strong><em>This post is written by ChatGPT for displaying purpose.</em></strong></p><br><img src="https://i.imgur.com/aPRyJOE.jpeg" alt="image"/><p><strong><span class="ql-cursor">﻿</span></strong></p><p><br></p><p>I\'m a third-year student majoring in Computer and Science Engineering, and I am thrilled to share my journey and interests with you through this blog. My academic pursuits revolve around web development, front-end design, API analysis, and PyTorch model modifications, particularly focused on restoring image quality. These technical interests keep me engaged and continuously learning.</p><p><br></p><p>Beyond my studies, I have a deep passion for Japanese anime, manga, and novels. I find immense joy in exploring the rich and diverse world of ACGN (Anime, Comic, Game, and Novel) culture. Additionally, I\'m an avid fan of ACGN games from China, which offer unique storytelling and gameplay experiences.</p><p><br></p><p>Through this blog, I hope to share my experiences, projects, and the fun side of my hobbies. Whether it\'s discussing the latest web development trends, diving into a fascinating anime series, or reviewing a captivating game, I aim to create a space where fellow enthusiasts can connect and share their passions.</p><p>Thank you for joining me on this adventure, and I look forward to engaging with you all!</p><p>Stay tuned and happy reading!</p>'
    };

    return (
        <>
            <div className="text-lg uppercase font-semibold mb-2 opacity-50"><a href="/" className="hover:underline">Home</a> / Article / {ArticleId} </div>
            <div className="md:flex-col bg-white p-8 border">
                <div className="text-gray-700"><span className="font-semibold">Lunar Pham </span>Posted on July 30th, 2024</div>
                <div className="font-bold text-4xl mt-6">Welcome to my blog</div>
                <div dangerouslySetInnerHTML={paragraph} className="font-medium mt-4 break-words" />
            </div>
        </>
    )
}

export default Article;