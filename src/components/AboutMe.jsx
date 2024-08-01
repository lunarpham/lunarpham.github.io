function AboutMe() {
    return (
        <div className="md:flex-col bg-white p-8 border">
            <div className="md:px-8">
                <img className="rounded-full" src="../../public/avatar.jpg"/>
            </div>
            <div className="font-bold text-lg mt-6">Truong Pham</div>
            <div className="flex flex-row items-center gap-2 mt-3">
                <div className="md:basis-1/12">
                    <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="md:basis-11/12">
                    <div className="font-medium">Lives in <span className="font-semibold">Da Nang, Vietnam</span></div>
                </div>

            </div>
            <div className="flex flex-row items-top gap-2 mt-2">
                <div className="md:basis-1/12">
                    <i className="fa-solid fa-book-open"></i>
                </div>
                <div className="md:basis-11/12">
                    <div className="font-medium">Studies <span className="font-semibold">CSE</span> at <a
                        href="https://www.facebook.com/vnuk.edu.vn" target="blank" className="font-semibold">VN-UK
                        Institute for Research and Executive Education</a></div>
                </div>
            </div>
        </div>
    )
}

export default AboutMe;