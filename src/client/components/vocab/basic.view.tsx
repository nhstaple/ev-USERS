import React from 'react'

import { IVocab } from "../../../api/entities/vocab";

import { ELanguage } from '../../../api/entities/vocab';

export default function BasicVocabView(data: IVocab) {
    return (
        <div>
            <div>
                <div> Value: </div>
                <div> ${data.value} </div>
            </div>
            <div>
                <div> Translation: </div>
                <div> ${data.translation} </div>
            </div>
            <div>
                <div> Language: </div>
                <div> ${ELanguage[data.lang]}</div>
            </div>
            <div>
                <div> Image: </div>
                <div> TODO </div>
            </div>
            <div>
                <div> Sound: </div>
                <div> TODO </div>
            </div>
            <div>
                <div> Creator: </div>
                <div> ${data.creator.name}</div>
            </div>
        </div>
    );
}
