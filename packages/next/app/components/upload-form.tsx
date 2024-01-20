'use client';

import { IVtuber } from "@/lib/vtubers";
import { useSearchParams } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
import { UppyContext } from 'app/uppy';
import { LoginButton, useAuth } from '@/components/auth';
import { Dashboard } from '@uppy/react';
import styles from '@/assets/styles/fp.module.css'
import { projektMelodyEpoch } from "@/lib/constants";
import add from "date-fns/add";
import sub from "date-fns/sub";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useForm, useFieldArray, ValidationMode } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


interface IUploadFormProps {
    vtubers: IVtuber[];
}

interface IValidationResults {
    valid: boolean;
    issues: string[] | null;
}

interface IFormSchema extends Yup.InferType<typeof validationSchema> { };


const validationSchema = Yup.object().shape({
    vtuber: Yup.number()
        .required('VTuber is required'),
    date: Yup.date()
        .typeError('Invalid date') // https://stackoverflow.com/a/72985532/1004931
        .min(sub(projektMelodyEpoch, { days: 1 }), 'Date must be after February 7 2020')
        .max(add(new Date(), { days: 1 }), 'Date cannot be in the future')
        .required('Date is required'),
    notes: Yup.string().optional(),
    attribution: Yup.boolean().optional(),
    files: Yup.array()
        .of(
            Yup.object().shape({
                key: Yup.string().required('key is required'),
                uploadId: Yup.string().required('uploadId is required')
            }),
        )
        .min(1, 'At least one file is required'),
});



export default function UploadForm({ vtubers }: IUploadFormProps) {
    const searchParams = useSearchParams();
    const cuid = searchParams.get('cuid');
    const uppy = useContext(UppyContext);
    const { authData } = useAuth();

    const formOptions = {
        resolver: yupResolver(validationSchema),
        mode: 'onChange' as keyof ValidationMode,
    };
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid
        },
        setValue,
        watch,
    } = useForm(formOptions);


    const files = watch('files');



    async function createUSC(data: IFormSchema) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/user-submitted-contents/createFromUppy`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${authData?.accessToken}`,
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    files: data.files,
                    attribution: data.attribution,
                    notes: data.notes,
                    vtuber: data.vtuber,
                    date: data.date
                }
            })
        });

        if (!res.ok) {
            console.error('failed to fetch /api/user-submitted-contents/createFromUppy');
        }
    }


    uppy.on('complete', async (result: any) => {
        let files = result.successful.map((f: any) => ({ key: f.s3Multipart.key, uploadId: f.s3Multipart.uploadId }));
        setValue('files', files);
    });

    return (
        <>

            <div className='section'>
                <h2 className='title is-2'>Upload VOD</h2>

                <p className="mb-5"><i>Together we can archive all lewdtuber livestreams!</i></p>

                {(!authData?.accessToken)
                    ?
                    <>
                        <aside className='notification is-danger'><p>Please log in to upload VODs</p></aside>
                        <LoginButton />
                    </>
                    : (



                        <div className='columns is-multiline'>
                            <form id="vod-details" onSubmit={handleSubmit((data) => createUSC(data))}>


                                <div className='column is-full'>
                                    <section className="hero is-info mb-3">
                                        <div className="hero-body">
                                            <p className="title">
                                                Step 1
                                            </p>
                                            <p className="subtitle">
                                                Upload the file
                                            </p>
                                        </div>
                                    </section>
                                    <section className="section mb-5">
                                        <Dashboard
                                            uppy={uppy}
                                            theme='dark'
                                            proudlyDisplayPoweredByUppy={false}
                                        />
                                        <input
                                            required
                                            hidden={true}
                                            style={{ display: 'none' }}
                                            className="input" type="text"
                                            {...register('files')}
                                        ></input>

                                        {errors.files && <p className="help is-danger">{errors.files.message?.toString()}</p>}

                                    </section>
                                </div>

                                <div className='column is-full '>
                                    {/* {(!cuid) && <aside className='notification is-info'>Hint: Some of these fields are filled out automatically when uploading from a <Link href="/streams">stream</Link> page.</aside>} */}

                                    <section className="hero is-info mb-3">
                                        <div className="hero-body">
                                            <p className="title">
                                                Step 2
                                            </p>
                                            <p className="subtitle">
                                                Tell us about the VOD
                                            </p>
                                        </div>
                                    </section>

                                    <section className="section">






                                        <div className="field">
                                            <label className="label">VTuber</label>
                                            <div className="select">
                                                <select
                                                    required
                                                    // value={vtuber}
                                                    // onChange={(evt) => setVtuber(parseInt(evt.target.value))}
                                                    {...register('vtuber')}
                                                >
                                                    {vtubers.map((vtuber: IVtuber) => (
                                                        <option value={vtuber.id}>{vtuber.attributes.displayName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <p className="help is-info">Choose the VTuber this VOD belongs to. (More VTubers will be added when storage/bandwidth funding is secured.)</p>
                                            {errors.vtuber && <p className="help is-danger">vtuber error</p>}

                                        </div>

                                        <div className="field">
                                            <label className="label">Stream Date</label>
                                            <input
                                                required
                                                className="input" type="date"
                                                {...register('date')}
                                            // onChange={(evt) => setDate(evt.target.value)}
                                            ></input>
                                            <p className="help is-info">The date when the VOD was originally streamed.</p>
                                            {errors.date && <p className="help is-danger">{errors.date.message?.toString()}</p>}

                                        </div>

                                        <div className="field">
                                            <label className="label">Notes</label>
                                            <textarea
                                                className="textarea"
                                                placeholder="e.g. Missing first 10 minutes of stream"
                                                // onChange={(evt) => setNote(evt.target.value)}
                                                {...register('notes')}
                                            ></textarea>
                                            <p className="help is-info">If there are any issues with the VOD, put a note here. If there are no VOD issues, leave this field blank.</p>
                                        </div>

                                        <div className="field">
                                            <label className="label">Attribution</label>
                                            <label className="checkbox">
                                                <input
                                                    type="checkbox"
                                                    // onChange={(evt) => setAttribution(evt.target.checked)}
                                                    {...register('attribution')}
                                                />
                                                <span className={`ml-2 ${styles.noselect}`}>Credit {authData.user?.username} for the upload.</span>
                                                <p className="help is-info">Check this box if you want your username displayed on the website. Thank you for uploading!</p>
                                            </label>
                                        </div>

                                    </section>

                                </div>


                                <div className="column is-full">
                                    <section className="hero is-info">
                                        <div className="hero-body">
                                            <p className="title">
                                                Step 3
                                            </p>
                                            <p className="subtitle">
                                                Send the form
                                            </p>
                                        </div>
                                    </section>
                                    <section className="section">



                                        <div className="icon-text">
                                            <span className={`icon has-text-${(files) ? 'success' : 'danger'}`}>
                                                <FontAwesomeIcon icon={(files) ? faCheckCircle : faXmark}></FontAwesomeIcon>
                                            </span>
                                            <span>Step 1, File Upload</span>
                                        </div>

                                        <div className="icon-text">
                                            <span className={`icon has-text-${(isValid) ? 'success' : 'danger'}`}>
                                                <FontAwesomeIcon icon={(isValid) ? faCheckCircle : faXmark}></FontAwesomeIcon>
                                            </span>
                                            <span>Step 2, Metadata</span>
                                        </div>



                                        {/* <ErrorMessage
                                            errors={errors}
                                            name="date"
                                            render={({ message }) => <p>{message}</p>}
                                        /> */}

                                        {/* {fields.map((field, index) => (
                                            <div key={field.id}>
                                                <input
                                                    {...register(
                                                        // @ts-expect-error incorrect schema resolution in library types
                                                        `guests.${index}.name`
                                                    )}
                                                />{' '}
                                                <button onClick={() => remove(index)}>Remove</button>
                                            </div>
                                        ))} */}

                                        {/* { 
                                            JSON.stringify({ 
                                                touchedFields: Object.keys(touchedFields),
                                                errors: Object.keys(errors)
                                            }, null, 2)
                                        }  */}

                                        {/* setError('date', { type: 'custom', message: 'custom message' }); */}

                                        

                                        <button disabled={!isValid} className="button is-primary is-large mt-5">
                                            <span className="icon is-small">
                                                <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                                            </span>
                                            <span>Send</span>
                                        </button>


                                    </section>
                                </div>

                            </form>
                        </div>


                    )
                }

            </div>

        </>
    )

}
