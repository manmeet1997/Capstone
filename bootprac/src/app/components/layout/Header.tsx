"use client"

import Search from "@/app/components/layout/Search";
import Link from "next/link";
import AuthContext, { AuthContextType } from '@/context/AuthContext';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const handleSearchChange = (searchTerm: string) => {
    console.log("Search term:", searchTerm);
    // Implement search functionality here
  };

  const pathname = usePathname();
  const auth = useContext(AuthContext) as AuthContextType;
  const router = useRouter();

  const logout = async () => {
    try {
     
    auth.logout();
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
    }
  };


  const handleFilter = (searchTerm: string) => {
    // Implement your filtering logic here
    console.log("Filtering with search term:", searchTerm);
  };
  return (
    <nav className="flex items-center flex-wrap bg-teal-500 p-6 justify-between">
      <div className="flex items-center flex-shrink-0 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="fill-none w-6 h-6 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
        </svg>

        <Link href={'/'} className="font-semibold text-xl tracking-tight">Canadian News APP</Link>
      </div>

        {/* <Search onFilter={handleSearchChange} /> */}


        {auth.isLoggedIn ? (
        
            <button onClick={logout} 
            className='px-4 py-2 rounded-full bg-green-500 text-white font-semibold border border-green-600 hover:bg-green-600 focus:outline-none focus:bg-green-600 flex items-center'            
            >Logout</button>
          
        ) : (
            <>
            {/* <li className="user-section-item">
                <Link href='/login' className={pathname == '/login' ? 'active' : ''}>Login</Link>
            </li> */}
             <Link href={'/login'} className='px-4 py-2 rounded-full bg-green-500 text-white font-semibold border border-green-600 hover:bg-green-600 focus:outline-none focus:bg-green-600 flex items-center'>Login</Link>
  
       
        </>
         
        )}




      
       </nav>


  )
};

export default Header;

{/* <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="lg:text-lg text-sm lg:flex-grow">
          <a href="/" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-8">
            Home
          </a>
          <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-8">

            Login
          </a>
          <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-8">
            Signup
          </a>
          <a href="/ContactForm" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-8">
            Contact Us
          </a>
          <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
            About
          </a>
        </div>
       
      </div> */}
// import Link from "next/link";
// import Image from "next/image";

// export default function Header() {
//     return(
//     <header className="flex items-center justify-between">
//       <Link href={''} className="text-red-500 font-semibold text-2xl">Canadian News Snippets</Link>
//       <nav className="flex items-center gap-8 text-gray-500 font-semibold">
//       {/* <div className="relative w-24 h-24">
//                 <Image src={'/logo-black.png'} layout={'fill'} objectFit={'contain'} alt={'cns'} />
//             </div> */}
//         <Link href={''}>Home</Link>
//         {/* <Link href={''}>Menu</Link> */}
//         <Link href={''}>About</Link>
//         {/* <Link href={''}>Contact</Link> */}
//         <Link href={''} className="bg-red-500 rounded-full text-white px-8 py-2">Login</Link>
//       </nav>
//     </header>
//     );
// }