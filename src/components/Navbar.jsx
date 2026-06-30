import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
    const session = await auth();
    const user = session?.user;

    async function handleLogout() {
        "use server";
        await signOut({ redirectTo: "/login" });
    }

    return (
        <nav className="flex items-center justify-between px-6 py-4 glass border-b border-card-border sticky top-0 z-50 transition-colors duration-300">

            <div className="flex items-center gap-8">
                <div className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent transition-transform duration-300 hover:opacity-90">
                    <Link href='/'>youflex</Link>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href='/' className="relative hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">explore</Link>
                    <Link href='/discuss' className="relative hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">community</Link>
                    <Link href='/' className="relative hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">reach out</Link>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <span className="hidden text-sm font-medium text-muted-foreground md:inline">
                            {user.username || user.name || user.email}
                        </span>
                        <Link 
                            href='/profile' 
                            className="px-5 py-2.5 bg-accent/10 text-accent text-sm font-semibold rounded-full hover:bg-accent/20 transition-all duration-300 shadow-sm hover:shadow"
                        >
                            profile
                        </Link>
                        <form action={handleLogout}>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-[1px]"
                            >
                                logout
                            </button>
                        </form>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-[1px]"
                    >
                        login
                    </Link>
                )}
            </div>
            
        </nav>
    );
}
