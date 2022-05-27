
import { useState } from 'react';
import { ICreatorUIProps } from '../../pages/ux/creator/creator.ui';
import { TLanguage, TPartOfSpeech } from '../../../api/entities/vocab/vocab.interface';
import styles from './Creator.module.scss';

const SupportedLanguages = [
    'english',
    'spanish',
    'punjabi'
]

const SupportedPOS = [
    "noun", "verb", "participle", "article", "pronoun", "preposition",  "adverb",  "conjunction"
]

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

    return (
    <div id={styles.VocabCreator}>
        <div id={styles.VocabMenu}>
            <form id={styles.Form}>
                {/* vocab language */}
                <div>
                    <p>Language</p>
                    <select>
                        {SupportedLanguages.map((lang) =>  <option key={lang}>{lang}</option>)}
                    </select>
                </div>

                {/* root vocab value */}
                <div>
                    <p>Root Value</p>
                    <input placeholder='Root'/>
                </div>

                {/* the word in english */}
                <div>
                    <p>Translation</p>
                    <input placeholder='Translation'/>
                </div>

                {/* part of speach */}
                <div>
                    <p>Part of Speach</p>
                    <select>
                        {SupportedPOS.map((pos) => <option key={pos}>{pos}</option>)}
                    </select>
                </div>

                {/* notes on the vocab item */}
                <div>
                    <textarea placeholder='vocab note' onChange={(e)=>{setVocabNote(e.target.value)}}></textarea>
                </div>

                {/* image uploading */}
                <div>
                    <input type='file' placeholder='Image' onChange={(e)=>{setImage(e.target.files[0])}} className={styles.ImageInput}/>
                </div>

                {/* sound uploading */}
                <div>
                    <input type='file' placeholder='Sound' onChange={(e)=> {
                        console.log(e.target.files)
                        setSound(e.target.files[0])}
                    } className={styles.SoundInput} />
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
