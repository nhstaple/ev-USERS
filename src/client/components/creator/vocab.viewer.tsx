
import { useState } from 'react';
import { ICreatorUIProps } from '../../pages/ux/creator/creator.ui';
import { TLanguage, TPartOfSpeech } from '../../../api/entities/vocab/vocab.interface';
import styles from './Creator.module.scss';
import { Vocab } from '../../../api';

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
                <p>{v.lang.slice(0, 3).toUpperCase()}</p>
                <button onClick={(e) => {
                    e.preventDefault();
                    // setCreator({...creatorManager, viewVocab:
                    //     {...creatorManager.viewVocab, target: {
                    //         ...creatorManager.viewVocab.target,
                    //         read: v,
                    //         media: stateManager.creator.data.vocab.media.read[i]
                    //     }}});
                    setCreator((prev) => {
                        prev.viewVocab.target = {
                            read: v,
                            media: {
                                read: stateManager.creator.data.vocab.media.read[i]
                            }
                        }
                        return prev;
                    })
                    // TODO set the targetMedia through a get request
                    console.log('VIEW TARGET\n', v.value, v.translation);
                    console.log(stateManager.creator.data.vocab.media.read[i]);
                    setTargetVocab(v);
                    setTargetMedia(stateManager.creator.data.vocab.media.read[i]);   
                }}>
                    <h1>{v.value}</h1>
                </button>
            </div>
            )})}
        </div>

        <div id={styles.VocabDataView}>
            {/* the text of the vocab */}
            {targetVocab != null &&
            <div style={{paddingBottom: '5vh', fontSize: '2em'}}>
                <h1>{targetVocab.value}</h1>
            </div>}
                
            {targetVocab!= null &&
            <div id={styles.VocabText}>
                <div>
                    <p>ID</p>
                    <p>{targetVocab.id}</p>
                </div>
                
                <div>
                    <p>language</p>
                    <p>{targetVocab.lang}</p>
                </div>

                <div>
                    <p>root</p>
                    <h1>{targetVocab.value}</h1>
                </div>
                
                <div>
                    <p>example</p>
                    <p>{targetVocab.example}</p>
                </div>

                <div>
                    <p>subject</p>
                    <p>{targetVocab.subject}</p>
                </div>
                
                <div>
                    <p>part of speech</p>
                    <p>{targetVocab.pos}</p>
                </div>

                <div>
                    <p>creator</p>
                    <p>{targetVocab.creator.id}</p>
                </div>

                {targetVocab.note != '' &&
                <div>
                    <p>note</p>
                    <p>{targetVocab.note}</p>
                </div>}
            </div>}

            {targetVocab &&
            <div id={styles.VocabMedia}>
                {/* previews the image */}
                {targetMedia && targetMedia.image != null &&
                <div id={styles.VocabImageView}>
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
            </div>}

            {targetVocab == null &&
            <div id={styles.NoTargetVocab}>
                Please select a vocab item
            </div>}
        </div>
    </div>);
}

export default VocabViewer;
