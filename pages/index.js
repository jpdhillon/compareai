import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Footer from '../components/Footer'
import Header from '../components/Header'
import LoadingDots from '../components/LoadingDots'
import Link from 'next/link'

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [product1, setProduct1] = useState('')
  const [product2, setProduct2] = useState('')
  const [generatedComparison, setGeneratedComparison] = useState('')
  const { data: session, status } = useSession()
  const router = useRouter()

  const compareRef = useRef(null)

  const scrollToComparison = () => {
    if (compareRef.current !== null) {
      compareRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const prompt = `Generate a product comparison between ${product1} and ${product2} in a Consumer Reports style. Make sure the generated comparison is less than 400 characters and the final sentence should highlight the product's differences.`

  const generateComparison = async (e) => {
    e.preventDefault()
    setGeneratedComparison('')
    setLoading(true)
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setGeneratedComparison((prev) => prev + chunkValue)
    }
    scrollToComparison()
    setLoading(false)
  }

  const saveComparison = async () => {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        result: generatedComparison,
        prompt: `${product1} vs ${product2}`,
        saverName: session?.user?.name,
      }),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    toast('Comparison saved', { icon: '✅' })

    setProduct1('')
    setProduct2('')
  }

  return (
    <div className='flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>compareAI</title>
        <link rel='icon' href='/scale.png' />
      </Head>
      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20'>
        <h1 className='sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900'>
          Need to compare two products?
        </h1>
        <p className='text-slate-500 mt-5'>
          Generate your product comparison in seconds.
        </p>
        <div className='max-w-xl w-full'>
          <div className='flex mt-10 items-center space-x-3'>
            <Image
              src='/1-black.png'
              width={30}
              height={30}
              alt='1 icon'
              className='mb-5 sm:mb-0'
            />
            <p className='text-left font-medium'>
              Enter first product{' '}
              <span className='text-slate-500'>(enter brand and/or model)</span>
              .
            </p>
          </div>
          <textarea
            value={product1}
            onChange={(e) => setProduct1(e.target.value)}
            rows={2}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5'
            placeholder={'e.g. Apple iPhone 14 or Honey Nut Cheerios'}
          />
          <div className='flex mb-5 items-center space-x-3'>
            <Image src='/2-black.png' width={30} height={30} alt='1 icon' />
            <p className='text-left font-medium'>
              Enter second product{' '}
              <span className='text-slate-500'>(enter brand and/or model)</span>
              .
            </p>
          </div>
          <textarea
            value={product2}
            onChange={(e) => setProduct2(e.target.value)}
            rows={2}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5'
            placeholder={'e.g. Google Pixel 7 or Wheaties'}
          />
          {!loading && (
            <button
              className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full'
              onClick={(e) => generateComparison(e)}
            >
              Generate comparison &rarr;
            </button>
          )}
          {loading && (
            <button
              className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full'
              disabled
            >
              <LoadingDots color='white' style='large' />
            </button>
          )}
        </div>
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
        <div className='space-y-10 my-10'>
          {generatedComparison && (
            <>
              <div>
                <h2
                  className='sm:text-4xl text-3xl font-bold text-slate-900 mx-auto'
                  ref={compareRef}
                >
                  Generated comparisons
                </h2>
              </div>
              <div className='space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto'>
                <div
                  className='bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border'
                  onClick={() => {
                    navigator.clipboard.writeText(generatedComparison)
                    toast('Comparison copied to clipboard', {
                      icon: '✂️',
                    })
                  }}
                >
                  <p>{generatedComparison}</p>
                </div>
              </div>
              {generatedComparison && (
                <>
                  {!loading && status === 'authenticated' && (
                    <div>
                      <button
                        className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full'
                        onClick={saveComparison}
                      >
                        Save comparison &rarr;
                      </button>
                      <p className='text-slate-500 mt-5'>
                        View your saved comparisons on your{' '}
                        <Link href='/account'>
                          <span className='text-blue-500'>account page</span>
                        </Link>
                        .
                      </p>
                    </div>
                  )}
                  {!loading && status === 'unauthenticated' && (
                    <p>Login to save comparison</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
