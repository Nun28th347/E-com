//Main Page

import { useSession } from "next-auth/react";
import Layout from "./component/layout";



export default function Home() {
  const {data : session} = useSession();
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        Hello, <b>{session?.user?.email}</b>
      </h2>
      
      <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden shadow-lg">
  <img src={session?.user?.image} alt="" className="w-6 h-6"/>
  <span className="px-2">
    {session?.user?.name}
  </span>
</div>

      
    </div>
  </Layout>
}

//"Padding" คือการเพิ่มพื้นที่ว่างรอบขอบขององค์ประกอบหรือข้อความภายในพื้นที่ที่กำหนดไว้
//yarn add @auth/mongodb-adapter mongodb = @auth/mongodb-adapter