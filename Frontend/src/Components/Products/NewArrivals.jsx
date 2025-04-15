import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewArrivals = () => {

    const scrollRef = useRef(null);

    const [isDragging, setIsDragging] = useState(false);

    const [startX, setStartX] = useState(0);

    const [scrollLeft, setScrollLeft] = useState(false);
    
    const [canScrollRight, setCanScrollRight] = useState(true);

    const [canScrollLeft, setCanScrollLeft] = useState(false);


    //for getting data from redux and saving in this
    const [newArrivals, setNewArrivals] = useState([]);



    const updateScrollButtons = () =>{
        const container = scrollRef.current;
        
        if(container){
            const leftScroll = container.scrollLeft;
            const  rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;
            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable)
        }

    }



    const scrollBtn = (direction) =>{
        const scrollAmount = direction === "left" ? -300 : 300;
        scrollRef.current.scrollBy({left: scrollAmount, behaviour: "smooth"})
    }



    const handleMouseDown = (e) =>{
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    const handleMouseMove = (e) =>{
       if(!isDragging) return; 

       const x = e.pageX - scrollRef.current.offsetLeft;
       const walk = x - startX;
       scrollRef.current.scrollLeft = scrollLeft - walk;
    }


    const handleMouseUpOrLeave = () =>{
        setIsDragging(false)
    }


    useEffect(() =>{
        const container = scrollRef.current;
        if(container){
            container.addEventListener("scroll", updateScrollButtons)
            updateScrollButtons()
            return () =>{
                container.removeEventListener("scroll" , updateScrollButtons)
            }
        }


        
    },[newArrivals])

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/api/products/new-arrivals`);
                setNewArrivals(response.data);
            } catch (error) {
                console.error(error);
                
            }
        };

        fetchNewArrivals();
    },[]);

    


    
    { if (Array.isArray(newArrivals)){
  return (
    <section className='py-16 px-4 lg:px-0'>
        <div className="container mx-auto text-center mb-10 relative">
            <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
            <p className='text-lg text-gray-600 mb-8'>
                Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
            </p>


            {/* Scroll buttons */}

            <div  className='absolute right-0 bottom-[-30px] flex space-x-2'>
                <button onClick={() => scrollBtn("left")} disabled={!scrollLeft} className={`p-2 rounded border ${canScrollLeft? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                    <FiChevronLeft className='text-2xl'/>
                </button>
                <button onClick={() => scrollBtn("right")} className={`p-2 rounded border ${canScrollRight? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                    <FiChevronRight className='text-2xl'/>
                </button>
            </div>
        </div>

        <div onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} ref={scrollRef} className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" :"cursor-grab"}`}>
        {

        
            
               newArrivals && newArrivals.map((prod) =>{
                return (
                <div key={prod._id} className='min-w-[100%] sm:min-w-[30%] lg:min-w-[30%] relative'>
                    <img draggable='false' src={prod.images[0]?.url} alt={prod.images[0]?.altText || prod.name}  className='w-full h-[500px] object-cover rounded-lg'/>
                    <div className='absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg'>
                        <Link to={`/products/${prod._id}`} className='block'>
                        <h4 className='font-medium'>{prod.name}</h4>
                        <p className='mt-1'>${prod.price}</p>
                        </Link>
                    </div>
                </div>
                )
            })}
        </div>
    
    </section>
  )
}
}
}

export default NewArrivals;