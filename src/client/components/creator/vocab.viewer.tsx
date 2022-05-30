
import { useState } from 'react';
import { ICreatorUIProps } from '../../pages/ux/creator/creator.ui';
import { TLanguage, TPartOfSpeech } from '../../../api/entities/vocab/vocab.interface';
import styles from './Creator.module.scss';
import { Vocab } from '../../../api';

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

const VocabViewer = ({stateManager, creatorManager}: ICreatorUIProps) => {
    const [targetMedia, setTargetMedia] = useState<Vocab.GetMedia>(null);

    console.log('VOCAB DATA CHECK\n', stateManager.creator.data.vocab.read);

    return (
    <div id={styles.VocabViewer}>
        <div id={styles.VocabList}>
            {Object.entries(stateManager.creator.data.vocab.read).map(([i, v]) => { return (
            <div key={v.id} className={styles.VocabListWrapper} >
                <button onClick={(e) => {
                    e.preventDefault();
                    creatorManager.viewVocab.target.set(v);
                    // TODO set the targetMedia through a get request
                    console.log('VIEW TARGET\n', v.value, v.translation);
                }}>
                    <h1>{v.value}</h1>
                    {/* <p>{v.lang}</p>
                    <p>{v.pos}</p> */}
                </button>
            </div>
            )})}
        </div>

        <div id={styles.VocabDataView}>
            {/* the text of the vocab */}
            {creatorManager.viewVocab.target.read != null &&
            <div id={styles.VocabText}>
                <h1>{creatorManager.viewVocab.target.read.value}</h1>
                <p>{creatorManager.viewVocab.target.read.translation}</p>
                <p>{creatorManager.viewVocab.target.read.lang}</p>
                <p>{creatorManager.viewVocab.target.read.pos}</p>
            </div>}

            <div id={styles.VocabMedia}>
                {/* previews the image */}
                {targetMedia && targetMedia.image &&
                <div id={styles.ImageWrapper}>
                    <img src={imgToURL(targetMedia.image)}></img>
                    <p>{targetMedia.description}</p>
                </div>}

                {/* previews the sound */}
                {targetMedia && targetMedia.sound &&
                <div id={styles.SoundWrapper}>
                    <audio controls={true}>
                        <source src={imgToURL(targetMedia.sound)} type='audio/mpeg'/>
                        AUDIO PLAYBACK NOT SUPPORTED BY YOUR BROWSER
                    </audio>
                </div>}
            </div>
        </div>
    </div>);
}

export default VocabViewer;
