import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='section'>
      <h2 className='title is-2'>404 Not Found</h2>
      <p>Could not find a matching vtubler.</p>

      <Link href="/vt">Return to vtuber list</Link>
    </div>
  )
}