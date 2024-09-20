/* Products */

import Link from "next/link";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import {ReactSortable} from "react-sortablejs";    /* yarn add react-sortablejs */



//  ti des price >> send data >> '/api/products'

export default function ProductFrom({ 
    _id,
    title:existingTitle, 
    description:existingDescription, 
    price:existingPrice, 
    imges: existingImges,
    category:assignedCategory,
    properties:assignedProperties, }) 
{
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');

    const [imges, setImges] = useState(existingImges || []);
    const [isUploading, setIsUploading] = useState(false);

    const [goToProducts,setGoToProducts] = useState(false);

    const [categories,setCategories] = useState([]);
    const [category,setCategory] = useState(assignedCategory || '');

    const [productProperties,setProductProperties] = useState(assignedProperties || {});

    const router = useRouter();
    
    

    useEffect(() => {
        axios.get('/api/categories').then(result => {
          setCategories(result.data);
        })
      }, []);


    async function saveProduct(ev) {
        ev.preventDefault();
        const data = 
            { title, description, price, imges, category, 
            properties:productProperties };

        /* เพิ่มสินค้าใหม่หรืออัพเดตสินค้าที่มีอยู่ <> /api/products */
        if (_id) { /* have id = PUT */
            //update
            await axios.put('/api/products', { ...data,_id });  //axios.put || post => API Route
        } 
        else { /* Non id = POST */
            //create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }
    

    if(goToProducts) {
        router.push('/products');
    }


    
    async function uploadImage(ev){
        /* console.log(ev); */
        const files = ev.target?.files;

        if(files?.length > 0){
            setIsUploading(true);
            const data = new FormData();
            for(const file of files) {
                data.append('file',file);
            }
            
            /* const res = await axios.post('/api/upload', data, {
                headers: {'Content-Type':'multipart/form-data'},
            });  */

            const res = await axios.post('/api/upload', data);  //up only photo
            /* console.log(res.data); */


            setImges(oldImages => {
                return [...oldImages, ...res.data.links];
            });

            setIsUploading(false);
        }
    }


    function updateImagesOrder(imges) {
        setImges(imges);
    }


    function setProductProp(propName,value) {
        setProductProperties(prev => {
          const newProductProps = {...prev};
          newProductProps[propName] = value;
          return newProductProps;
        });
      }



    const propertiesToFill = [];
    if (categories.length > 0 && category) 
    {
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);

        while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }





    return (
       
            <form onSubmit={saveProduct}>
                <label>Product Name</label>
                <input 
                    type="text" 
                    placeholder="product name" 
                    value={title} 
                    onChange={ev => setTitle(ev.target.value)}
                />

                <label>Category</label>
                <select value={category}
                    onChange={ev => setCategory(ev.target.value)}>
                    <option value="">Uncategorized</option>
                        {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                </select>


                {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div key={p.name} className="">
                    <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                <div>
                    <select value={productProperties[p.name]}
                      onChange={ev =>
                        setProductProp(p.name,ev.target.value)
                        }>
                        {p.values.map(v => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                    </select>
                </div>
                </div>
                ))}




                <label>
                    Photos
                </label>


                {/* upload IMG */}
                <div className="mb-2 flex flex-wrap gap-1">


                <ReactSortable
                    list={imges}
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}>
                    {!!imges?.length && imges.map(link => (
                        <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                            <img src={link} alt="" className="rounded-lg"/>
                        </div>
                    ))}
                </ReactSortable>


                    {/* @ https://yarnpkg.com/package?q=react-spinne&name=react-spinners */}  
                    {isUploading && (
                        <div className="h-24 flex items-center">
                            <Spinner/>
                        </div>
                    )}

                   

                    <label 
                    className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-400 rounded-lg bg-gray-300">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <div> Upload </div>
                        <input type="file" onChange={uploadImage} className="hidden"/>

                    </label>

                    {/* {!imges?.length && (
                        <div>
                            No Photos in this product
                        </div>
                    )} */}
                </div>



                <label>Description</label>
                <textarea 
                    placeholder="description" 
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}
                />

                <label>Price (THB)</label>
                <input 
                    type="number" 
                    placeholder="price" 
                    value={price} 
                    onChange={ev => setPrice(ev.target.value)}
                />

                <button 
                    type="submit" 
                    className="btn-primary"
                >
                    Save
                </button>
            </form>
        
    );
}