/* คำขอ HTTP ในรูปแบบ API โดยใช้ Next.js API routes ร่วมกับ Mongoose เพื่อเชื่อมต่อและจัดการข้อมูลใน MongoDB สำหรับการสร้างเอกสาร */

/* buile เอกสาร = add data mongo */

import { mongooseConnect } from "@/lib/mongoose";  // นำเข้าฟังก์ชันการเชื่อมต่อ MongoDB
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req, res){
    const {method} = req; // ดึง method จาก request object เพื่อตรวจสอบประเภทของคำขอ HTTP
    await mongooseConnect();
    await isAdminRequest(req,res);
    await mongooseConnect(); // เรียกใช้ฟังก์ชันเชื่อมต่อ MongoDB


    if (method === 'GET') 
    {
        if (req.query?.id) {
            res.json(await Product.findOne({_id:req.query.id}));           
        }
        else{
            res.json(await Product.find());
        }
    
    }


    
    if (method==='POST')
    {
        const {title,description,price,imges,category,properties} = req.body;  // ดึงข้อมูล title, description, และ price จาก body ของคำขอ
        const productDoc = await Product.create({  // สร้างเอกสารใหม่ในคอลเลกชัน Product ด้วยข้อมูลที่ได้รับ
            title,description,price,imges,category,properties,
        })
        res.json(productDoc);  // ส่งคำตอบกลับไปยังคำขอด้วยเอกสารที่ถูกสร้างขึ้นใหม่ในรูปแบบ JSON
    }



    /* 
        updateOne() ของ MongoDB/Mongoose 
        req body = title, description, price , _id 
    */
    if (method === 'PUT') 
    {
        const { title,description,price,imges,category,properties,_id} = req.body;
        await Product.updateOne({_id}, { title,description,price,imges,category,properties}); //obj
        res.json(true);
    }



    if (method === 'DELETE') 
    {
        if (req.query?.id) {
            await Product.deleteOne({_id:req.query?.id}) //mongo use _
            res.json(true);
        }    
    }


}