
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

function fileToURL(file:any) {
    if(file == null) return '';
    return URL.createObjectURL(file);
}

function bufferToString(buff: Buffer, fileType: string) {
    if(buff == null) return '';
    const encoding = Buffer.from(buff).toString('base64');
    return `data:${fileType};base64,${encoding}`;
}

const VocabViewer = ({stateManager, set, creatorManager, setCreator}: ICreatorUIProps) => {
    const [targetVocab, setTargetVocab] = useState<Vocab.Get>(null);
    const [targetMedia, setTargetMedia] = useState<Vocab.GetMedia>(null);
    console.log('VOCAB DATA CHECK\n', stateManager.creator.data.vocab.read);

    return (
    <div id={styles.VocabViewer}>
        <div id={styles.VocabList}>
            {Object.entries(stateManager.creator.data.vocab.read).map(([i, v]) => { return (
            <div key={v.id} className={styles.VocabListWrapper} >
                <button onClick={(e) => {
                    e.preventDefault();
                    setCreator({...creatorManager, viewVocab:
                        {...creatorManager.viewVocab, target: {
                            ...creatorManager.viewVocab.target,
                            read: v,
                            media: stateManager.creator.data.vocab.media.read[i]
                        }}});
                    // TODO set the targetMedia through a get request
                    console.log('VIEW TARGET\n', v.value, v.translation);
                    console.log(stateManager.creator.data.vocab.media.read[i]);
                    setTargetVocab(v);
                    setTargetMedia(stateManager.creator.data.vocab.media.read[i]);
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
                {targetMedia && targetMedia.image != null &&
                <div id={styles.ImageWrapper}>
                    <img src={bufferToString(targetMedia.image, 'image/png')}></img>
                    <p>{targetMedia.description}</p>
                </div>}
                {(!targetMedia || targetMedia.image == null) &&
                <div id={styles.ImageWrapper}>
                    Image not found
                </div>}

                {/* previews the sound */}
                {targetMedia && targetMedia.sound &&
                <div id={styles.SoundWrapper}>
                    <audio controls={true}>
                        <source src={bufferToString(targetMedia.sound, 'audio/mpeg')} type='audio/mpeg'/>
                        AUDIO PLAYBACK NOT SUPPORTED BY YOUR BROWSER
                    </audio>
                </div>}
                {(!targetMedia || targetMedia.sound == null) &&
                <div id={styles.ImageWrapper}>
                    Sound not found
                </div>}
            </div>
        </div>
    </div>);
}

export default VocabViewer;
