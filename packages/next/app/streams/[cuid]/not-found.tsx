import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='section'>
      <h2 className='title is-2'>404 Not Found</h2>
      <p>Could not find that stream.</p>

      <Link href="/s">Return to streams list</Link>
    </div>
  )
}