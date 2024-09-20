import Layout from "@/pages/component/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo,setProductInfo] = useState(); 
    const {id} = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id='+id).then(response => {
            setProductInfo(response.data);
        })
    }, [id]);

    function goback(){
        router.push('/products');
    }

    async function DeleteProduct() {
        await axios.delete('/api/products?id='+id);
        goback();
    }


    return(
        <Layout>
            <h1 className="text-center"> Do you want to delete 
                &nbsp;"{productInfo?.title} "? {/* whitespace */}
            </h1> {/* ? Optional chaining operator don't care null,undefined */}

            <div className="flex gap-2 justify-center">

                <button onClick={DeleteProduct} className="btn-red"> {/* 1:55 */}
                    Yes
                </button>

                <button className="btn-default" 
                    onClick={goback}>
                        No
                </button>

            </div>
            

        </Layout>
        
    );
}