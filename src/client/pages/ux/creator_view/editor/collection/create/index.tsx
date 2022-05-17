// https://docs.nestjs.com/techniques/file-upload#multiple-files

import React, { useState } from 'react';
import { useRouter } from 'next/router';

import styles from './CollectionCreationEditor.module.scss'
import { VocabPut } from '../../../../../../../server/db/vocab/vocab.put';
import { IVocabMedia } from '../../../../../../../api/entities/vocab';
import { TLanguage, TPartOfSpeech, TVocabSubject } from '../../../../../../../api/entities/vocab';
import { CollectionPut } from '../../../../../../../server/db/collection/collection.put';
import { CollectionGet } from '../../../../../../../server/db/collection/collection.get';
import Axios, { AxiosResponse } from 'axios';
import { IEntity } from '../../../../../../../api';

const ENABLE_ALERTS = true;

interface ICollectionValidation {
    valid: boolean;
    payload: CollectionPut;
}

async function SubmitHandler(e: React.FormEvent<HTMLFormElement>, collection: CollectionPut, vocabs: VocabPut[]): Promise<ICollectionValidation> {
    e.preventDefault();
    // verify / transform data
    if(vocabs.length == 0) {
        const HINTS = 'Press the green button to add a vocab item.';
        if(ENABLE_ALERTS) alert(`Error: the collection's items list cannot be empty. Hints: ${HINTS}`);
        return {valid: false, payload: null};
    }

    if(collection.name == '') {
        if(ENABLE_ALERTS) alert(`Error: the collection's name cannot be empty.`);
        return {valid: false, payload: null};
    }

    // update the vocab's info
    let newID = '';
    for(let i = 0; i < vocabs.length; i++) {
        vocabs[i].lang = collection.lang;
        vocabs[i].id = `${collection.name}-${i}`;
        newID += `-${vocabs[i].value}`;
    }
    console.log(vocabs);
    // set the collection package
    collection.items = vocabs;
    collection.id = newID;
    console.log(collection);
    
    // end collection submit handler
    return {
        valid: true,
        payload: collection
    };
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

async function CreateVocabHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = e.target[0].value as string;
    const translation = e.target[1].value as string;

    // validate vocab input form data
    if(value.length == 0 || translation.length == 0) {
        const HINTS = `The value and/or translation fields are empty.`
        alert(`Please enter a valid vocabulary item. Hints: ${HINTS}`);
        return false;
    }

    //
    console.log(`vocab.value       =\t ${value}`);
    console.log(`vocab.translation =\t ${translation}`);
    return true;
}

interface ICollectionEditorViewProp {
    userID: string,
    userEmail: string
}

// used to set / reset the collection being edited
const INITIAL_COLLECTION = {
    id:'',
    name:'',
    lang: 'english',
    description: '',
    creator: {id: ''}
} as CollectionPut;

// used to set / reset the vocab item(s) being edited
const INITIAL_NEW_VOCAB = {
    id:'',
    value:'',
    translation:'',
    pos: 'noun' as TPartOfSpeech,
    subject: 'neutral' as TVocabSubject,
    media: {image: null, sound: null},
    description: ''
} as VocabPut;

const HOST = 'localhost'; // TODO docker deploy (see parent pages)
const PORT = `3000`;
const END_POINT = `http://${HOST}:${PORT}/api/db/`

async function SendCollectionToServer(payload: CollectionPut) {
    console.log('sending the collection to the server!');
    console.log(payload);
    console.log(`${payload.items.length} vocab items to insert in th DB`);
    let formData = new FormData();
    let collectionData: CollectionPut = {...payload};
    for(let i = 0; i < collectionData.items.length; i++) {
        const data = collectionData.items[i].media;
        collectionData.items[i].media = {id: null, image: null, sound: null};

        const fn = `${collectionData.id}-${collectionData.items[i].id}`.split(' ').join();
        const image = data.image;
        const sound = data.sound;
        formData.append('image', image, fn);
        formData.append('sound', sound, fn);
        collectionData.items[i].storagekey = fn;
    }

    // send the collection and vocabs to the server 
    await Axios.put(`${END_POINT}/collection`, collectionData);
    
    // send the images to the server     
    await Axios.put(`${END_POINT}/collection/media`, formData, {
        headers: { "content-type": "multipart/form-data" }
    })

    return;
}

function isFileImage(file: File) {
    // SUPPORT IMAGE FORMATS
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type'])
}

function isFileSound(file: File) {
    // SUPPORTED AUDIO FORMATS
    const acceptedImageTypes = ['audio/mpeg'];
    return file && acceptedImageTypes.includes(file['type'])
}

async function getFileName(file: IVocabMedia) {
    const image = file.image != null ? URL.createObjectURL(file.image) : null;
    const sound = file.sound != null ? URL.createObjectURL(file.sound) : null;
    return {'image': image, 'sound': sound}
}

interface IAudioPreview {
    sound: HTMLAudioElement
    isPlaying: boolean
    parent: IEntity
}

function newAudioPreview(sound: File, parent: IEntity): IAudioPreview {
    const encoding = URL.createObjectURL(sound);
    const data: HTMLAudioElement = new Audio(encoding);

    return { sound: data, isPlaying: false, parent: parent }
}

const CollectionCreationEditor = ({userID, userEmail}: ICollectionEditorViewProp) => {
    // this flag contrals the pop-up to create a new vocab item
    let [ showVocabCreator, SetShowVocabCreator] = useState<boolean>(false);

    // this acache holds all the data for vocab cards for the current collection
    let [ itemsCache, SetItemsCache ] = useState<VocabPut[]>([]);
    // this cache variable keeps track of the vocab item currently being created / edited by the user
    let [ newVocab, SetNewVocab ] = useState<VocabPut>(INITIAL_NEW_VOCAB);
    // this cache variable
    let [ newCollection, SetNewCollection ] = useState<CollectionPut>(INITIAL_COLLECTION);

    let [ editingVocab, SetEditingVocab ] = useState<boolean>(false);
    let [ editIndex, SetEditIndex ] = useState<number>(-1);

    // the audio file being played
    let [ currentSound, SetCurrentSound ] = useState<IAudioPreview>(null);

    const router = useRouter();

    return (
    {/* the root of the collection creation editor */} &&
    <div id={styles.CollectionCreationEditor}>
        {/* the creation editor headers */}
        {!showVocabCreator &&
        <div id={styles.CollectionCreationEditorHeader}>
            <h2>Collection Creator</h2>
        </div>}

        {showVocabCreator &&
        <div id={styles.CollectionCreationEditorHeader}>
            <h2>Vocab Creator</h2>
        </div>}
        
        {/* contains all the meta information for a new collection */}
        <div id={styles.CollectionMenu}>
            {/* show the collection information if the user is not editing a vocab item */}
            {!showVocabCreator && 
            {/* this form defines the meta information of a collection
                on submit, this form executes an HTTP.PUT request to the server
            */} &&
            <form encType='multipart/form-data' method='POST' onSubmit={ async (e) => {
                // e.preventDefault();
                // tag user
                newCollection.creator = {id: userID };
                // validate the collection and items
                const {valid, payload} = await SubmitHandler(e, newCollection, itemsCache);
                if(!valid) { return; }
                // send the payload to the server
                await SendCollectionToServer(payload);

                // cleanup and reset the client
                SetNewCollection(INITIAL_COLLECTION); // reset collection
                SetNewVocab(INITIAL_NEW_VOCAB); // reset cache for vocab item
                SetItemsCache([]); // reset vocab data
                router.replace(router.asPath);
                // window.location.reload();
            }}>
                <div className={styles.formInputContainer}>
                    <p>Name</p>
                    <input name="name" type="text" value={newCollection.name} onChange={(e) => {
                        SetNewCollection(prev => {return {...prev, name: e.target.value}});
                    }}/>
                </div>
                
                <div className={styles.formInputContainer}>
                    <p>Language</p>
                    <select name="lang" onChange={(e) => {
                        let val: TLanguage = e.target.value.toLowerCase() as TLanguage;
                        newCollection.lang = val;
                        itemsCache.forEach((vocab) => {
                            return {...vocab, lan: val}
                        });
                        SetItemsCache(itemsCache);
                        SetNewCollection(newCollection);
                        console.log(newCollection);
                    }}>
                        <option>Spanish</option>
                        <option>Punjabi</option>
                        <option>English</option>
                        {/* TODO add more language support, see TLanguages */}
                    </select>
                </div>
                
                <div className={styles.formInputContainer}>
                    <p>Description</p>
                    <textarea value={newCollection.description} onChange={(e) => {
                        SetNewCollection(prev => {return {...prev, description: e.target.value}})
                    }} />
                </div>
                
                {itemsCache.length != 0 &&
                <div className={styles.formInputContainer}>
                    <input type="submit" value="Create Collection" />
                </div>}
            </form>}

            {/* this holds the button that shows the vocab creation editor */}
            <div id={styles.AddVocabContainer}>
                {!showVocabCreator &&
                // this button opens the vocab creator
                <button onClick={(e) => {
                    // tag the vocab with the current language
                    SetNewVocab({... INITIAL_NEW_VOCAB, lang: newCollection.lang});
                    SetShowVocabCreator(!showVocabCreator);}
                }>
                    <p>Add Vocab</p>
                </button>}
            </div>
        </div>

        {/* contains all the meta information for a new vocab item */}
        {showVocabCreator && 
        <div id={styles.VocabMenu}>
            {/* this forms holds all the information for a vocab item */}
            {/* TODO add ALL required items, including images, sounds, description, etc. */}
            <form onSubmit={ async (e) => {
                // process and validate the form data
                const valid = await CreateVocabHandler(e); 
                if(!valid ) { return; }
                if(newVocab.media.image == null || newVocab.media.sound == null) {
                    alert('please upload an image and sound!');
                    return;
                }

                // set a temporary ID
                newVocab.id = makeid(8);

                if(!editingVocab) {
                    // update the array on the client 
                    SetItemsCache( prev => [...prev, newVocab ]);
                } else {
                    if(editIndex == -1) {
                        alert('VOCAB EDIT ERROR!');
                    }
                    // update the items cache with the value
                    itemsCache[editIndex] = newVocab;
                }
                // reset the cache for new vocab items
                SetNewVocab(INITIAL_NEW_VOCAB);
                // hide the UI
                SetShowVocabCreator(!showVocabCreator);
                SetEditingVocab(false);
                SetEditIndex(-1);
                SetCurrentSound(null);
            }}>
                <div className={styles.formInputContainer}>
                    <p>Value</p>
                    <input name="value" type="text" value={newVocab.value} onChange={(e) => {SetNewVocab(prev => { return {...prev, value: e.target.value }})}}/>
                </div>

                <div className={styles.formInputContainer}>
                    <p>Translation</p>
                    <input name="translation" type="text" value={newVocab.translation} onChange={(e) => {SetNewVocab(prev => { return {...prev, translation: e.target.value }})}}/>
                </div>

                <div className={styles.formInputContainer}>
                    <p>Part of Speech</p>
                    <select name="lang" value={newVocab.pos} onChange={(e) => {
                        // "noun" | "verb" | "participle" | "article" | "pronoun" | "preposition" | "adverb" | "conjunction"
                        let val: TPartOfSpeech = e.target.value as TPartOfSpeech;
                        SetNewVocab(prev => {return {...prev, pos: val}});
                    }}>
                        <option>noun</option>
                        <option>verb</option>
                        <option>adjective</option>
                        <option>particple</option>
                        <option>article</option>
                        <option>pronoun</option>
                        <option>preposition</option>
                        <option>adverb</option>
                        <option>conjuction</option>
                    </select>
                </div>

                <div className={styles.formInputContainer}>
                    <p>Subject</p>
                    <select name="lang" value={newVocab.subject.split('_').join(' ')} onChange={(e) => {
                        // "neutral" | "masculine" | "feminine" | "neutral_plural" | "masculine_plural" | "feminine_plural"
                        let val: TVocabSubject = e.target.value as TVocabSubject;
                        SetNewVocab(prev => {return {...prev, subject: val}});
                    }}>
                        <option>neutral</option>
                        <option>masculine</option>
                        <option>feminine</option>
                        <option>neutral (plural)</option>
                        <option>masculine (plural)</option>
                        <option>feminine (plural)</option>
                    </select>
                </div>

                <div className={styles.formInputContainer}>
                    <p>Image</p>
                    <input type="file" src={getFileName(newVocab.media)['image']} onChange={(e) => {
                        const newImage = e.target.files[0];
                        if(!isFileImage(newImage)) {
                            alert(`${newImage.type} is not a support image format.`);
                            return;
                        }
                        SetNewVocab({...newVocab, media:
                            {...newVocab.media, image: newImage
                        }});
                    }} />
                    <textarea defaultValue={'Image Description'} onChange={(e) => {
                        SetNewVocab({...newVocab, description: e.target.value
                        });
                    }} />
                </div>

                <div className={styles.formInputContainer}>
                    <p>Sound</p>
                    <input type="file" src={getFileName(newVocab.media)['sound']} onChange={(e) => {
                        const newSound = e.target.files[0];
                        if(!isFileSound(newSound)) {
                            alert(`${newSound.type} is not a supported sound format.`);
                            return;
                        }

                        SetCurrentSound(newAudioPreview(newSound, newVocab));

                        SetNewVocab({...newVocab, media:
                            {...newVocab.media, sound: e.target.files[0]
                        }});
                    }} />
                </div>

                <div className={styles.formInputContainer}>
                    <input type="submit" value="Submit" />
                </div>

                {/* this button cancels creating a new item (reset the cache, close vocab editor) */}
                <div className={styles.formInputContainer}>
                    <button id={styles.CancelNewVocabButton} onClick={(e) => {
                        e.preventDefault();
                        SetNewVocab(INITIAL_NEW_VOCAB);
                        SetShowVocabCreator(!showVocabCreator);
                        SetEditingVocab(false);
                        SetCurrentSound(null);
                    }} >
                        <p>Cancel</p>
                    </button>
                </div>
                
                {/* displays the image the user wants to upload */}
                {newVocab.media.image != null &&
                <div className={styles.VocabImagePreview}>
                    <img style={{width: '10vw'}} src={URL.createObjectURL(newVocab.media.image)} />
                </div>}
            </form>
            {currentSound != null &&
            <button onClick={(e) => {
                if(!currentSound.isPlaying) {
                    SetCurrentSound((prev) => {return {...prev, isPlaying: !prev.isPlaying}});
                    const dt = currentSound.sound.duration * 1000;
                    currentSound.sound.play();
                    setTimeout(()=>{
                        SetCurrentSound((prev) => {return {...prev, isPlaying: !prev.isPlaying}});
                    }, dt);
                }
            }} >
                {currentSound.isPlaying && 'Playing...'}
                {!currentSound.isPlaying && 'Play'}
            </button>
            }
        </div>}

        {/* this holds the vocab items that are being created */}
        {!showVocabCreator &&
        <div id={styles.VocabsViewContainer}>
            {/* show this message if the user has not created any items */}
            {/* TODO add helpful information */}
            {itemsCache.length == 0 &&
            <p>No vocab items. Click the green button above to populate the collection.</p>
            }

            {/* if the user has added items show them the items */}
            {itemsCache.length > 0 &&
            itemsCache.map((vocab: VocabPut, i: number) => {
                // the preview of items
                // TODO set the div background to the image the user uploaded
                return <div className={styles.VocabMetaContainer} key={vocab.value}>
                    <div className={styles.VocabMetaView}>
                        <p>{vocab.value}</p>

                        {/* this button opens the creator seeded with this vocab's data converting it into an editor */}
                        <button className={styles.EditVocabButton} onClick={(e) => {
                            e.preventDefault();
                            // seed the cache with the select item
                            SetNewVocab(vocab);
                            // open the creation editor
                            SetShowVocabCreator(true);
                            // set the flag to turn the creation editor into an editor
                            SetEditingVocab(true);
                            // set the index in the items cache to update
                            SetEditIndex(i);
                            // set the current sound
                            SetCurrentSound(newAudioPreview(vocab.media.sound, vocab));
                        }}>
                            Edit
                        </button>

                        {/* this button deletes an item from the items cache */}
                        <button className={styles.DeleteVocabButton} onClick={(e) => {
                            e.preventDefault();
                            itemsCache.splice(i, 1);
                            SetItemsCache(itemsCache);
                            router.replace(router.asPath);
                        }} >
                            Delete
                        </button>
                    </div>
                    {/* shows the image and sound */}
                    {vocab.media.image != null && vocab.media.sound != null &&
                    <div>
                        <img style={{width: '10vw', height: '10vw'}} src={URL.createObjectURL(vocab.media.image)} />
                        <p>{vocab.description}</p>

                        {currentSound == null &&
                        <button onClick={(e) => {
                            e.preventDefault();
                            if(currentSound == null) {
                                const preview = newAudioPreview(vocab.media.sound, vocab);
                                SetCurrentSound(preview);
                            }
                        }}>
                            {currentSound == null && `Load`}
                        </button>}

                        {currentSound != null && currentSound.parent.id == vocab.id &&
                        <button onClick={(e) => {
                            e.preventDefault();
                            console.log(currentSound.parent.id);
                            console.log(vocab.id);
                            if(currentSound != null && !currentSound.isPlaying) {
                                const dt = currentSound.sound.duration * 1000;
                                SetCurrentSound((prev) => {return {...prev, isPlaying: true}});
                                currentSound.sound.play();
                                setTimeout(() => {
                                    SetCurrentSound(null);
                                }, dt);
                            }
                        }}>
                            {!currentSound.isPlaying && `Play`}
                            {currentSound.isPlaying && `Playing`}
                        </button>}
                    </div>
                    }
                </div>
            })}
        </div>}

    </div>
    );
}
 
export default CollectionCreationEditor
