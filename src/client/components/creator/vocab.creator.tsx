
import { FormEvent, useState } from 'react';
import { ICreatorUIProps } from '../../pages/ux/creator/creator.ui';
import { TLanguage, TPartOfSpeech, TVocabSubject } from '../../../api/entities/vocab/vocab.interface';
import styles from './Creator.module.scss';
import { IEntity, Vocab } from '../../../api/entities/';
import Axios from 'axios';

// TODO dot env file
const HOST = 'http://localhost';
const PORT = '3000';
const END_POINT = `${HOST}:${PORT}/api/db/vocab`

const SupportedLanguages = [
    'english',
    'spanish',
    'punjabi'
]

const SupportedPOS = [
    "noun", "verb", "participle", "article", "pronoun", "preposition",  "adverb",  "conjunction"
]

const SupportedSubjects = [
    "neutral", "masculine", "feminine", "neutral_plural",  "masculine_plural", "feminine_plural"
]

// https://www.iana.org/assignments/media-types/media-types.xhtml#image
const SupportedImageTypes = 'image/png, image/jpeg, image/gif';

// https://www.iana.org/assignments/media-types/media-types.xhtml#audio
const SupportedSoundTypes = 'sound/mpeg';

function imgToURL(file:any) {
    if(file == null) return '';
    return URL.createObjectURL(file);
}

function soundToAudio(file:any) {
    const url = URL.createObjectURL(file);
    if(url == '') return null;
    return new Audio(url);
}

const VocabCreator = ({stateManager, creatorManager}: ICreatorUIProps) => {

    const [imageDescription, setImageDescription] = useState<string>('');
    const [vocabNote, setVocabNote] = useState<string>('');
    const [image, setImage] = useState(null);
    const [sound, setSound] = useState(null);

    const submitVocabPutRequest = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // retrieve put data
        const creator: IEntity = {id: stateManager.user.read.id };
        const lang = e.target['Lang'].value as TLanguage;
        const value = e.target['Root'].value;
        const translation = e.target['Trans'].value;
        const example = e.target['Example'].value;
        const pos = e.target['POS'].value as TPartOfSpeech;
        const subject = e.target['Subject'].value as TVocabSubject; 
        const note = vocabNote;
        const description = imageDescription;
        const id = `${creator.id}-${value.id}-${translation}`;
        const storagekey = `${id}-media`;

        // TODO validate data
        if(image == null || sound == null) return;
        if(value == '' || translation == '') return;

        // create payloads
        const vocabPayload: Vocab.Put = {
            id: id,
            value: value,
            translation: translation,
            example: example,
            pos: pos,
            note: note,
            lang: lang,
            subject: subject,
            storagekey: storagekey,
            creator: creator
        }

        const mediaPayload: Vocab.IVocabMedia = {
            image: image,
            sound: sound,
            description: description,
            id: storagekey
        }

        // sanity check
        console.log('PUT REQUEST ON CLIENT\n', vocabPayload, mediaPayload);
    
        // submit vocab data
        try {
            const result = await Axios.put(`${END_POINT}/new`, { body: vocabPayload });
            console.log(result);
        } catch(err) {
            console.log(err);
        }
        // TODO submit media data

        // refresh the client state
        console.log(stateManager.creator.data.vocab);
        return;
        await stateManager.creator.data.vocab.refresh();
        await stateManager.creator.data.vocab.media.refresh();

        // reset the creator on success
        creatorManager.reset.create();
    }

    return (
    <div id={styles.VocabCreator}>
        <div id={styles.VocabMenu}>
            <form id={styles.Form} onSubmit={async (e) => {await submitVocabPutRequest(e)}}>
                {/* vocab language */}
                <div>
                    <p>Language</p>
                    <select name='Lang'>
                        {SupportedLanguages.map((lang) =>  <option key={lang}>{lang}</option>)}
                    </select>
                </div>

                {/* root vocab value */}
                <div>
                    <p>Root Value</p>
                    <input name='Root' placeholder='Root'/>
                </div>

                {/* the word in english */}
                <div>
                    <p>Translation</p>
                    <input name='Trans' placeholder='Translation'/>
                </div>

                {/* the word in english */}
                <div>
                    <p>Example Phrase</p>
                    <input name='Example' placeholder='Example Usage'/>
                </div>

                {/* part of speach */}
                <div>
                    <p>Part of Speach</p>
                    <select name='POS'>
                        {SupportedPOS.map((pos) => <option key={pos}>{pos}</option>)}
                    </select>
                </div>

                {/* subject */}
                <div>
                    <p>Subject</p>
                    <select name='Subject'>
                        {SupportedSubjects.map((sub) => <option key={sub}>{sub}</option>)}
                    </select>
                </div>

                {/* notes on the vocab item */}
                <div>
                    <textarea placeholder='vocab note' onChange={(e)=>{setVocabNote(e.target.value)}}></textarea>
                </div>

                {/* image uploading */}
                <div>
                    <input type='file' placeholder='Image' onChange={(e)=>{setImage(e.target.files[0])}} className={styles.ImageInput} accept={SupportedImageTypes}/>
                </div>

                {/* sound uploading */}
                <div>
                    <input type='file' placeholder='Sound' onChange={(e)=> {
                        console.log(e.target.files)
                        setSound(e.target.files[0])}
                    } className={styles.SoundInput} accept={SupportedSoundTypes}/>
                </div>

                {/* form submission */}
                <div>
                    <input type='Submit' placeholder='Create Vocab'/>
                </div>

            </form>
        </div>

        <div id={styles.VocabMedia}>
            {/* previews the image */}
            {image &&
            <div id={styles.ImageWrapper}>
                <img src={imgToURL(image)}></img>
                <textarea placeholder='Image Description' onChange={(e)=>{setImageDescription(e.target.value)}}></textarea>
            </div>}

            {/* previews the sound */}
            {sound &&
            <div id={styles.SoundWrapper}>
                <audio controls={true}>
                    <source src={imgToURL(sound)} type='audio/mpeg'/>
                    HELP
                </audio>
            </div>}
        </div>
    </div>);
}

export default VocabCreator;
