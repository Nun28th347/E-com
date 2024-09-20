import Layout from "@/pages/component/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductFrom from "@/pages/component/ProductForm";


//product >> edit
export default function EditProductPage() {
    const [productInfo,setProductInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id='+id).then(response => {
            setProductInfo(response.data);
        })
    }, [id]);

    return(
        <Layout>
            <h1>Edit product</h1>


            {productInfo && (
                <ProductFrom {...productInfo}/>  //show datd in From to edit
            )}
            
        </Layout>
    )
}