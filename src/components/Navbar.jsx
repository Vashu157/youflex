import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">

            <div className="flex items-center gap-8">
                <div className="text-2xl font-extrabold text-orange-600 tracking-tight">
                    <Link href='/'>youflex</Link>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                    <Link href='/' className="hover:text-orange-600 transition-colors">explore</Link>
                    <Link href='/discuss' className="hover:text-orange-600 transition-colors">community</Link>
                    <Link href='/' className="hover:text-orange-600 transition-colors">reach out</Link>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center">
                <Link 
                    href='/profile' 
                    className="px-4 py-2 bg-blue-50 text-orange-600 text-sm font-semibold rounded-full hover:bg-blue-100 transition-colors"
                >
                    profile
                </Link>
            </div>
            
        </nav>
    );
}