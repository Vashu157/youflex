import { getCurrentUser } from "@/lib/auth";
import { redirect } from 'next/navigation';
import Image from "next/image";
export default async function Home() {
      // const user = await getCurrentUser()
      // if(user){
      //   redirect('/share')
      // }
      redirect('/dashboard')
      return(
        <div></div>
      );
}
