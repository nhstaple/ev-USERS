
import { FormEvent, useState, useRef } from 'react';
import { ICreatorUIProps } from '../../pages/ux/creator/creator.ui';
import { TLanguage, TPartOfSpeech, TVocabSubject } from '../../../api/entities/vocab/vocab.interface';
import styles from './Creator.module.scss';
import { IEntity, Vocab } from '../../../api/entities/';
import Axios from 'axios';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";

// TODO dot env file
const HOST = 'http://localhost';
const PORT = '3000';
const END_POINT = `${HOST}:${PORT}/api/db/vocab`

const SupportedLanguages = [
    'english',
    'spanish',
    'punjabi',
    'arabic',
    'german',
    'japanese'
]

const SupportedPOS = [
    "noun", "verb", "participle", "article", "pronoun", "preposition",  "adverb",  "conjunction"
]

const SupportedSubjects = [
    "neutral", "masculine", "feminine", "neutral_plural",  "masculine_plural", "feminine_plural"
]

import * as KeyboardSupport from '../../../api/keyboard'
const SupportedKeyboardLanguages = {
    'spanish': KeyboardSupport.layout_span,
    'punjabi': KeyboardSupport.layout_punj,
    'arabic': KeyboardSupport.layout_arab,
    'german': KeyboardSupport.layout_germ,
    'japanese': KeyboardSupport.layout_japa
}

// https://www.iana.org/assignments/media-types/media-types.xhtml#image
const SupportedImageTypes = 'image/png, image/jpeg, image/gif';

// https://www.iana.org/assignments/media-types/media-types.xhtml#audio
const SupportedSoundTypes = 'audio/mpeg';

function fileToURL(file:any) {
    if(file == null) return '';
    return URL.createObjectURL(file);
}

// TEST
// https:www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
let boundCheckKeyboard: (x, y) => void;
function dragElement(grabbable, grabHeader) {
    if(grabbable == null || grabHeader == null) return false;

    console.log('adding event listeners to', grabbable, grabHeader);
    boundCheckKeyboard = checkBounds;

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(grabHeader.id)) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(grabHeader.id).onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      grabbable.onmousedown = dragMouseDown;
    }

    return true;
    
    function checkBounds(leftOffset, topOffset) {
        if(topOffset < 0) topOffset = 0;
        //f(topOffset > grabbable.offsetHeigth * 0.90) topOffset = grabbable.offsetHeigth * 0.90;
        if(leftOffset < 0) leftOffset = 0;
        if(leftOffset > grabbable.offsetWidth * 0.80) leftOffset = grabbable.offsetWidth * 0.80;

        grabbable.style.top = topOffset + "px";
        grabbable.style.left = leftOffset + "px";
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        const x = grabbable.offsetLeft - pos1;
        const y = grabbable.offsetTop - pos2;
        // bound check and set new position
        checkBounds(x, y);
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
}

const VocabCreator = ({stateManager, set, creatorManager, setCreator}: ICreatorUIProps) => {

    const [imageDescription, setImageDescription] = useState<string>('');
    const [vocabNote, setVocabNote] = useState<string>('');
    const [image, setImage] = useState(null);
    const [sound, setSound] = useState(null);
    const [language, setLanguage] = useState<TLanguage>('english');
    const [showKeyboard, setShowKeyboard] = useState(false);
    
    
    const draggableKeyboardMenu = useRef(null);
    const draggableHeader = useRef(null);
    const keyboard = useRef(null);
    const keyboardInput = useRef(null);
    const rootInput = useRef(null);
    const exampleInput = useRef(null);
    const noteInput = useRef(null);
    const descriptionInput = useRef(null);
    const [layoutName, setLayoutName] = useState("default"); // for shift, caps lock, etc

    const handleShift = () => {
        const newLayoutName = layoutName === "default" ? "shift" : "default";
        setLayoutName(newLayoutName);  
    };

    const onKeyboardPress = button => {
        console.log("Button pressed", button);
        if (button === "{shift}" || button === "{lock}") handleShift();
    };

    const submitVocabPutRequest = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('state check\n', stateManager);

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
        const id = `${creator.id}-${value}-${translation}`;
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

        // create the multer formdata for the media upload
        let formData = new FormData();
        formData.append('image', image, `vocabID.${id}.storagekey.${storagekey}`);
        formData.append('sound', sound, `creatorID.${creator.id}.description.${description}`);
        // formData.append('id', id);
        // formData.append('description', description);
        // formData.append('creatorID', creator.id);

        // sanity check
        console.log('PUT REQUEST ON CLIENT\n', vocabPayload, formData);
    
        // submit vocab data
        try {
            console.log('sending vocab...');
            const result = await Axios.put(`${END_POINT}/new`, { body: vocabPayload });
            console.log(result);
        } catch(err) {
            alert('error! could not create vocab');
            console.log(err);
        }
        // TODO submit media data
        try {
            console.log('sending vocab media...');
            const result = await Axios.put(`${END_POINT}/new/media`, formData, {
                headers: { "content-type": "multipart/form-data" }
            });
            console.log(result);
        } catch(err) {
            alert('error! could not create vocab media');
            console.log(err);
        }

        // TODO fix the refresh bug
        // potential solution: make the stateManger a state and pass the set function with it to the user interfaces
        // refresh the client state
        // console.log(stateManager.creator.data.vocab);
        console.log(stateManager);
        await stateManager.creator.data.vocab.refresh();
        await stateManager.creator.data.vocab.media.refresh();
        await stateManager.creator.refresh();

        // reset the creator on success
        // creatorManager.reset.create(); // TODO doesnt work .-.
        setCreator((prev) => {
            prev.createVocab.read = false;
            creatorManager.createVocab.read = false;
            return prev;
        });
        set((prev) => {
            prev.user.isActive = false;
            return prev;
        })
    }

    const processKeyboardInput = buffer => {
        if(keyboardInput.current == null) return
        console.log('BOOP', buffer);
        keyboardInput.current.value = buffer;
    }

    const focusKeyboardOn = r => {
        if(r == null) return;
        keyboardInput.current = r;
        keyboard.current.setInput(r.value);
    }

    return (
    <div id={styles.VocabCreator}>
        <div id={styles.VocabMenu}>
            {language != 'english' &&
            <div id={styles.KeyboardMenu} ref={draggableKeyboardMenu} >
                {showKeyboard &&
                <Keyboard
                    keyboardRef={r => {keyboard.current = r}}
                    layout={SupportedKeyboardLanguages[language]}
                    layoutName={layoutName}
                    onKeyPress={onKeyboardPress}
                    onChange={processKeyboardInput}
                />}
                <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                    <div className={styles.UserButtonWrapper} style={{width: '50%'}}>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setShowKeyboard((prev) => !prev);
                            if(!dragElement(draggableKeyboardMenu.current, draggableHeader.current)) {
                                alert('oof!');
                            }
                            // TODO fix this to prevent keyboard from opening off the screen
                            // boundCheckKeyboard(draggableKeyboardMenu.current.leftOffset, draggableKeyboardMenu.current.topOffset);
                        }}>
                            {`toggle ${language} keyboard`}
                        </button>
                    </div>
                    
                    <div id={styles.KeyboardMoveGrabbableArea} style={{width: '50%'}}>
                        <div id={styles.GrabbableHeader} ref={draggableHeader}>
                            {showKeyboard && <p>Click & Drag to move</p>}
                        </div>
                    </div>
                </div>
            </div>}

            <form id={styles.Form} onSubmit={async (e) => {await submitVocabPutRequest(e)}}>
                {/* vocab language */}
                <div>
                    <p>Language</p>
                    <select name='Lang' onChange={async (e)=> {
                        e.preventDefault();
                        keyboardInput.current = null;
                        setLanguage(e.target.value as TLanguage);
                    }}>
                        {SupportedLanguages.map((lang) =>  <option key={lang}>{lang}</option>)}
                    </select>
                </div>

                {/* root vocab value */}
                <div>
                    <p>Root Value</p>
                    <input ref={rootInput} name='Root' placeholder='Root' onFocus={(e) => {
                        e.preventDefault();
                        focusKeyboardOn(rootInput.current);
                    }}/>
                </div>

                {/* the word in english */}
                <div>
                    <p>Translation</p>
                    <input name='Trans' placeholder='Translation' onFocus={(e)=>{
                        e.preventDefault();
                        keyboardInput.current = null;
                    }}/>
                </div>

                {/* example phrase */}
                <div>
                    <p>Example Phrase</p>
                    <input ref={exampleInput} name='Example' placeholder='Example Usage' onFocus={(e) => {
                        e.preventDefault();
                        focusKeyboardOn(exampleInput.current);
                    }}/>
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
                    <textarea ref={noteInput} placeholder='vocab note' onFocus={(e)=>{
                        e.preventDefault();
                        focusKeyboardOn(noteInput.current);
                    }} onChange={(e)=>{setVocabNote(e.target.value)}}></textarea>
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
                <img src={fileToURL(image)}></img>
                <textarea ref={descriptionInput} placeholder='Image Description' onFocus={(e)=>{
                    e.preventDefault();
                    focusKeyboardOn(descriptionInput.current);
                }} onChange={(e)=>{setImageDescription(e.target.value)}}></textarea>
            </div>}

            {/* previews the sound */}
            {sound &&
            <div id={styles.SoundWrapper}>
                <audio controls={true}>
                    <source src={fileToURL(sound)} type='audio/mpeg'/>
                    HELP
                </audio>
            </div>}
        </div>
    </div>);
}

export default VocabCreator;
