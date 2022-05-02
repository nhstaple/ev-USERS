import React from 'react'

import { IVocab } from "../../../api/entities/vocab";

import style from './BasicView.module.scss';

interface VocabViewProps {
    data: IVocab
}

// TODO set color on API
const BasicVocabView = ({ data }: VocabViewProps) => {
    return (
        <div className={style.basicVocabView}>
            <div className={style.basicVocabMeta}>
                <div className={style.vocabValue}>
                    <h1>Value:</h1>
                    <h2>{data.value}</h2>
                </div>
                <div className={style.vocabTranslation}>
                    <h1>Translation:</h1>
                    <h2>{data.translation}</h2>
                </div>
                <div className={style.vocabLanguage}>
                    <h1>Language: </h1>
                    <h2>{data.lang}</h2>
                </div>
                <div className={style.vocabCreator}>
                    <h1>Creator:</h1>
                    <h2>{data.creator.name}</h2>
                </div>
            </div>
            <div className={style.vocabMedia}>
                <div className={style.vocabBasicImage}>
                    <h1>Image:</h1>
                    <img about='TODO'></img>
                </div>
            </div>
        </div>
    );
}

export default BasicVocabView
