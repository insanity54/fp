'use client';

import { useState, useCallback, useEffect, useContext } from 'react';
import { IVod } from '@/lib/vods';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX, faTags } from "@fortawesome/free-solid-svg-icons";
import { formatTimestamp } from '@/lib/dates';
import { readOrCreateTagVodRelation } from '@/lib/tag-vod-relations';
import { readOrCreateTag } from '@/lib/tags';
import { useAuth } from './auth';
import { debounce } from 'lodash';
import { strapiUrl } from '@/lib/constants';
import { VideoContext } from './video-context';
import { useForm } from "react-hook-form";
import { ITimestamp, createTimestamp } from '@/lib/timestamps';
import { useRouter } from 'next/navigation';
import styles from '@/assets/styles/fp.module.css'
import qs from 'qs';
import { toast } from 'react-toastify';
import slugify from 'slugify';

interface ITaggerProps {
    vod: IVod;
    setTimestamps: Function;
}

export interface ITagSuggestion {
    id: number;
    name: string;
    createdAt: string;
}


type FormData = {
    tagName: string;
    isTimestamp: boolean;
};





export function Tagger({ vod, setTimestamps }: ITaggerProps): React.JSX.Element {

    const { register, setValue, setError, setFocus, handleSubmit, watch, clearErrors, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            tagName: '',
            isTimestamp: true
        }
    });
    const [isEditor, setIsEditor] = useState<boolean>(false);
    const [isAuthed, setIsAuthed] = useState<boolean>(false);
    const [tagSuggestions, setTagSuggestions] = useState<ITagSuggestion[]>([]);
    const { authData } = useAuth();
    const { timeStamp, tvrs, setTvrs } = useContext(VideoContext);
    const router = useRouter();

    const request = debounce((value: string) => {
        search(value);
    }, 300);

    const debounceRequest = useCallback((v: string) => request(v), [request]);


    // Callback version of watch.  It's your responsibility to unsubscribe when done.
    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            const tagNameValue = value.tagName as string;
            if (name === 'tagName' && type === 'change' && value.tagName !== '') debounceRequest(tagNameValue);
        });
        return () => subscription.unsubscribe();
    }, [watch, debounceRequest]);


    useEffect(() => {
        if (isEditor) {
            setFocus('tagName');
            getRandomSuggestions();
        }
    }, [isEditor, setFocus]);

    useEffect(() => {
        if (authData?.accessToken) {
            setIsAuthed(true);
        }
    }, [isAuthed]);


    async function getRandomSuggestions() {
        const res = await fetch(`${strapiUrl}/api/tag/random`);
        const tags = await res.json();
        setTagSuggestions(tags)
    }

    async function search(value: string) {
        const query = qs.stringify(
            {
                filters: {
                    tags: {
                        publishedAt: {
                            $notNull: true
                        }
                    }
                },
                query: value
            }
        )
        if (!value) return;
        const res = await fetch(`${strapiUrl}/api/fuzzy-search/search?${query}`, {
            headers: {
                'Authorization': `Bearer ${authData?.accessToken}`
            }
        })
        const json = await res.json()
        if (!res.ok) {
            toast('failed to get recomended tags', { type: 'error', theme: 'dark' });
        } else {
            setTagSuggestions(json.tags)
        }
    }


    async function onError(errors: any) {
        console.error('submit handler encoutnered an error');
        console.error(errors);
        toast('there was an error');
    }

    async function onSubmit(values: { tagName: string, isTimestamp: boolean }) {
        if (!authData?.accessToken) {
            toast('must be logged in', { type: 'error', theme: 'dark' });
            return 
        }
        try {

            const tag = await readOrCreateTag(authData.accessToken, slugify(values.tagName));
            if (!tag) throw new Error(`readOrCreateTag failed`);

            
            const tvr = await readOrCreateTagVodRelation(authData.accessToken, tag.id, vod.id);
            console.log(`now we check to see if we have a TVR`);
            console.log(tvr)

            if (values.isTimestamp) {
                console.log(`user specified that we must create a timestamp`);
                const timestamp = await createTimestamp(authData, tag.id, vod.id, timeStamp);
                console.log(timestamp)
                if (!timestamp) throw new Error(`failed to create timestamp`)
                setTimestamps((prevTimestamps: ITimestamp[]) => [...prevTimestamps, timestamp]);
            }

            setValue('tagName', '');
            router.refresh();
        } catch (e) {
            toast(`${e}`, { type: 'error', theme: 'dark' });
        }
    }

    if (!isAuthed) {
        return <></>
    } else {
        if (isEditor) {
            return (
                <div className='card mt-2' style={{ width: '100%' }}>
                    

                    <header className='card-header'>
                        <p className='card-header-title'><FontAwesomeIcon className='mr-2' icon={faTags}></FontAwesomeIcon>Tagger</p>
                        <button onClick={() => {
                            setIsEditor(false);
                            setValue('tagName', '');
                            setTagSuggestions([]);
                            clearErrors();
                        }} className='card-header-icon'>
                            <span className='icon'>
                                <FontAwesomeIcon
                                    icon={faX}
                                    className="fas fa-x"
                                ></FontAwesomeIcon>
                            </span>
                        </button>
                    </header>
                    <div className='card-content'>
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            <div className='mb-2'>
                                <label htmlFor="name" className='heading'>Add a tag</label>
                                <input
                                    required
                                    className="input"
                                    placeholder="cum"
                                    autoComplete='off'
                                    maxLength={256}
                                    minLength={3}
                                    type="text"
                                    {...register('tagName')}
                                ></input>
                            </div>
                            <div className='mb-2'>
                                <span className='heading'>Suggestions</span>
                                {tagSuggestions.length > 0 && tagSuggestions.map((tag: ITagSuggestion) => (<button type="button" key={tag.id} className='button is-small is-rounded mr-1 is-success mb-1' onClick={() => setValue('tagName', tag.name)}>{tag.name}</button>))}
                            </div>
                            <div className={`mb-2 bulma-unselectable-mixin`}>
                                <label className={`checkbox ${styles.noselect}`}>
                                    <input
                                        className="mr-1"
                                        type="checkbox"
                                        {...register('isTimestamp')}
                                    ></input>
                                    Timestamp {formatTimestamp(timeStamp)}
                                </label>
                            </div>

                            <div>
                                {(!!errors?.root?.serverError) && <div className="notification is-danger">{errors.root.serverError.message}</div>}
                                <input
                                    className='button is-primary'
                                    type="submit"
                                    value={`Create Tag${(watch('isTimestamp')) ? ' & Timestamp': ''}`}
                                >
                                </input>
                            </div>
                        </form>
                    </div>
                </div>
            )
        } else {
            return (
                <button className={`button is-small is-success ${styles.tagButton}`} onClick={() => setIsEditor(true)}>
                    <FontAwesomeIcon
                        icon={faPlus}
                        className="fab fa-plus mr-1"
                    ></FontAwesomeIcon>
                    <span>Add a Tag</span>
                </button>
            );
        }
    }
    

}
