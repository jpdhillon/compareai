import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'
import { useSession, signOut, getSession } from 'next-auth/react'

function Account() {
  const { data: session, status } = useSession()
  const [APIResponse, setAPIResponse] = useState(null)

  const readDB = async () => {
    try {
      const response = await fetch('/api/display', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      setAPIResponse(await response.json())
      if (response.status !== 200) {
        console.log('something went wrong')
      }
    } catch (error) {
      console.log('There was an error reading from the database', error)
    }
  }

  if (status === 'authenticated') {
    readDB()

    return (
      <div className='flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
        <Head>
          <title>compareAI</title>
          <link rel='icon' href='/scale.png' />
        </Head>
        <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20'>
          <h1 className='sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900'>
            These are your saved comparisons
          </h1>
          <p className='text-slate-500 mt-5'>
            To generate more comparisons, please return to the{' '}
            <Link href='/'>
              <span className='text-blue-500'>home page</span>
            </Link>
            .
          </p>
          <div className='space-y-10 my-10'>
            <div className='space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto'>
              {APIResponse?.filter(
                (comparison) => comparison.saverName === session.user.name
              ).map((comparison) => (
                <div
                  className='bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border'
                  onClick={() => {
                    navigator.clipboard.writeText(generatedComparison)
                    toast('Comparison copied to clipboard', {
                      icon: '✂️',
                    })
                  }}
                  key={comparison.id}
                >
                  <h2 className='font-bold'>{comparison.prompt}</h2>
                  <p>{comparison.result}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default Account
