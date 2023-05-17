import { useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && router.pathname !== '/account') {
      router.push('/account');
    }
    if (status === 'unauthenticated' && router.pathname !== '/') {
      router.push('/');
    }
  }, [status, router]);

  const handleLogin = () => signIn();

  const handleLogout = () => signOut();

  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" passHref>
        <div className="flex space-x-3">
          <Image
            alt="header text"
            src="/scale.png"
            className="sm:w-12 sm:h-12 w-8 h-8"
            width={32}
            height={28}
          />
          <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
            compareAI
          </h1>
        </div>
      </Link>      
      {session ? (
        <button onClick={handleLogout} className='bg-black rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80'>
          Logout
        </button>
      ) : (
        <button onClick={handleLogin} className='bg-black rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80'>
          Login 
        </button>
      )}
    </header>
  );
}

