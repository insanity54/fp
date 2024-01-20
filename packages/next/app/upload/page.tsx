
import { getAllVtubers } from '@/lib/vtubers';
import UploadForm from '@/components/upload-form';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { getStreamByCuid } from '@/lib/streams';


export default async function Page() {

  const vtubers = await getAllVtubers();
  

  return (
    <>

      {!vtubers 
        ? <aside className='notification is-danger'>Failed to fetch vtubers list. Please try again later.</aside>
        : <UploadForm vtubers={vtubers}></UploadForm>
      }


    </>
  )
}