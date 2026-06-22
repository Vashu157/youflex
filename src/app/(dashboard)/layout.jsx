import Navbar from "@/components/Navbar";
import '@/app/globals.css';
export default function RootLayout({children}){
    return(
        <>
            <Navbar/>
            <main className="p-4">
                {children}
            </main>
        </>
    );
}
