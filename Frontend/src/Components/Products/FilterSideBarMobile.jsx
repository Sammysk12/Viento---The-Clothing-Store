import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FilterSideBarMobile = () => {
  
  const [searchParmas, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
        category: "",
        gender: "", 
        color:"",
        size: [],
        material : [], 
        brand:[],
        minPrice:"",
        maxPrice:""
  })
  
  const [priceRange, setPriceRange] = useState([0,100]);

  const categories = ["Top Wear", "Bottom Wear"];

  const colors = ["Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige", "Navy"]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const materials = ["Cotton", "Wool", "Denim", "Polyster", "Silk", "Linen", "Viscose", "Fleece"];

  const brands = ["Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "Fasionista", "Chicstyle"]

  const genders = ["Men" , "Women"]



  const navigate = useNavigate();


  useEffect(() =>{
    const params = Object.fromEntries([...searchParmas])
    //The params will save in key and value form of type by using the Object.fromEntries we can convert it into JSON
    //like this {catgory : "Top Wear", color: "Red"} => params.category = we get category
    
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size? params.size.split(",") : [],
      material: params.material? params.material.split(",") : [],
      brand: params.brand? params.brand.split(",") : [],
      minPrice : params.minPrice || "",
      maxPrice : params.maxPrice || "",
    })

    setPriceRange([0, params.maxPrice || 100]);
  },[searchParmas])



  const handleFilterChange = (e) =>{
    const {name, value, checked, type} = e.target;
    console.log({name, value, checked, type});

    const newFilters = {...filters};

    if(type === "checkbox"){
      if(checked){
        newFilters[name] = [...(newFilters[name] || []), value]; // IT will append multiple filters for sizes like  ["XS", "S", "M"]
      }else{
        newFilters[name] = newFilters[name].filter((item) => item!==value )
      }
    }else{
      newFilters[name] = value;

    }

    setFilters(newFilters);

    console.log(newFilters)
   
    updateUrlParams(newFilters);


  }


  //It will update the parameters in query search
  const updateUrlParams = (newFilters) =>{
      const params = new URLSearchParams();
      //It will contain JSON object like this
      Object.keys(newFilters).forEach((key) => {
        if(Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
          params.append(key, newFilters[key].join(",")); //It will look like this XS, S
        }else if(newFilters[key]){
          params.append(key, newFilters[key])
        }
      })
      setSearchParams(params);
      navigate(`?${params.toString()}`) //It will look like this => ?category=Bottom+Wear&size=XS%2CS
  }


    const handlePriceChange = (e) =>{
        const newPrice  = e.target.value;
        setPriceRange([0, newPrice]);
        const newFilters = {...filters, minPrice: 0, maxPrice :newPrice};
        setFilters(filters);
        updateUrlParams(newFilters);
      
    }





  return (
    <div className='p-4'>
      <h3 className='text-xl font-medium text-gray-800 mb-4'>Filters</h3>

      {/* Category filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Category</label>
        {categories.map((category) =>{
          return(
            <div key={category} className='flex items-center mb-1'>
              <input type="radio" name='category' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'  value={category} onChange={handleFilterChange} checked={filters.category == category}/>
              <span className='text-gray-700'>{category}</span>
            </div>
          )
        })}
      </div>
      
      
      
      {/* Gender Section */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Gender</label>
        {genders.map((gender) =>{
          return(
            <div key={gender} className='flex items-center mb-1'>
              <input type="radio" name='gender' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' value={gender} onChange={handleFilterChange} checked={filters.gender == gender}/>
              <span className='text-gray-700'>{gender}</span>
            </div>
          )
        })}
      </div>

      {/* Colors section */}
      <div className='mb-6'>
        
          <label className='block text-gray-600 font-medium mb-2'>Gender</label>
          <div className='flex flex-wrap gap-2'>
            {colors.map((color) =>{
              return(
                <button key={color} name='color' className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer trasition hover:scale-105 ${filters.color == color ? "ring-2 ring-blue-500" :""}`} style={{backgroundColor: color.toLowerCase()}} value={color} onClick={handleFilterChange}></button>
              )
              })}
            </div>
        </div>


        {/* Size Filter */}
        <div className='mb-6'>
          <label className='block text-gray-600 font-medium mb-2'>Size</label>
          {sizes.map((size) =>{
            return (
              <div key={size} className='flex items-center mb-1'> 
              <input type="checkbox" name='size' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'  value={size} onChange={handleFilterChange} checked={filters.size.includes(size)} />
              <span className='text-gray-700'>{size}</span>
              </div>
            )
          })}
        </div>



        {/* Materials Section */}
        <div className='mb-6'>
          <label className='block text-gray-600 font-medium mb-2'>Material</label>
          {materials.map((material) =>{
            return (
              <div key={material} className='flex items-center mb-1'> 
              <input type="checkbox" name='material' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' value={material} onChange={handleFilterChange} checked={filters.material.includes(material)}/>              <span className='text-gray-700'>{material}</span>
              </div>
            )
          })}
        </div>



         {/* Brands Filter  */}
        <div className='mb-6'>
          <label className='block text-gray-600 font-medium mb-2'>Brands</label>
          {brands.map((brand) =>{
            return (
              <div key={brand} className='flex items-center mb-1'> 
              <input type="checkbox" name='brand' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' value={brand} onChange={handleFilterChange} checked={filters.brand.includes(brand)} />
              <span className='text-gray-700'>{brand}</span>
              </div>
            )
          })}
        </div>

        

        {/* Price Range Filter */}
        <div className='mb-8'>
          <label className='block text-gray-600 font-medium mb-2'>Price Range</label>
          <input type="range" name="priceRange" min={0} max={100}  className='w-full h-2 bg bg-gray-300 rounded-lg appearance-none cursor-pointer' value={priceRange[1]}  onChange={handlePriceChange}/>

          <div className='flex justify-between text-gray-600 mt-2'>
            <span>$0</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
        
    </div>
  )
}

export default FilterSideBarMobile