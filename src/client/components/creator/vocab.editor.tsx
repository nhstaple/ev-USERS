
import { useState, useRef, FormEvent } from 'react';
import { ICreatorUIProps } from '../../pages/ux/creator/creator.ui';
import { IVocab, TLanguage, TPartOfSpeech, TVocabSubject } from '../../../api/entities/vocab/vocab.interface';
import Keyboard, { SimpleKeyboard } from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import styles from './Creator.module.scss';
import { IEntity, Vocab } from '../../../api';
import Axios from 'axios';

import * as KeyboardSupport from '../../../api/keyboard';
import { of } from 'rxjs';
import { isUndefined } from 'util';
import { isDefined } from 'class-validator';

// TODO dot env file
const HOST = 'http://localhost';
const PORT = '3000';
const END_POINT = `${HOST}:${PORT}/api/db/vocab`

// https://www.iana.org/assignments/media-types/media-types.xhtml#image
const SupportedImageTypes = 'image/png, image/jpeg, image/gif';

// https://www.iana.org/assignments/media-types/media-types.xhtml#audio
const SupportedSoundTypes = 'audio/mpeg';

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

function bufferToString(buff: Buffer, fileType: string) {
    if(buff == null) return '';
    const encoding = Buffer.from(buff).toString('base64');
    return `data:${fileType};base64,${encoding}`;
}

const VocabEditor = ({stateManager, set, creatorManager, setCreator}: ICreatorUIProps) => {
    const [targetVocab, setTargetVocab] = useState<Vocab.Get>(null);
    const [targetMedia, setTargetMedia] = useState<Vocab.GetMedia>(null);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [imageFile, setImageFile] = useState<File>(null);
    const [soundFile, setSoundFile] = useState<File>(null);
    const [changed, setChanged] = useState(false);

    const formObject = useRef<HTMLFormElement>(null);
    const draggableKeyboardMenu = useRef(null);
    const draggableHeader = useRef(null);
    const keyboard = useRef<SimpleKeyboard>(null);
    const keyboardInput = useRef(null);
    const rootInput = useRef(null);
    const exampleInput = useRef(null);
    const noteInput = useRef(null);
    const descriptionInput = useRef(null);
    const [layoutName, setLayoutName] = useState("default"); // for shift, caps lock, etc

    const [keyboardShift, setKeyboardShift] = useState(false);
    const [keyboardLock, setKeyboardLock] = useState(false);
    const onKeyboardPress = button => {
        console.log("Button pressed", button);

        if(button == '{lock}') {
            // set caps lock
            if(!keyboardLock) {
                setLayoutName('shift');
                setKeyboardLock(true);
                keyboard.current.addButtonTheme('{lock}', styles.LockActive);
            }
            // turn off caps lock
            else {
                setLayoutName('default');
                setKeyboardLock(false);
                keyboard.current.removeButtonTheme('{lock}', styles.LockActive);
            }

            if(keyboardShift) {
                setKeyboardShift(false);
                keyboard.current.removeButtonTheme('{shift}', styles.ShiftActive);
            }
        } else if (button == '{shift}') {
            // the caps lock is on
            if(keyboardLock) {
                setLayoutName('shift');
            }

            // shift is off (turn on)
            else if(!keyboardShift) {
                setLayoutName('shift');
                setKeyboardShift(true);
                keyboard.current.addButtonTheme('{shift}', styles.ShiftActive);
            }

            // shift is on (turn off)
            else if(keyboardShift) {
                setLayoutName('default');
                setKeyboardShift(false);
                keyboard.current.removeButtonTheme('{shift}', styles.ShiftActive);
            }
        } else {
            // shift was set now clear it for the next input 
            if(keyboardShift) {
                setLayoutName('default');
                setKeyboardShift(false);
                keyboard.current.removeButtonTheme('{shift}', styles.ShiftActive);
            }
        }
    };

    const processKeyboardInput = buffer => {
        if(keyboardInput.current == null) return
        console.log('KEYBOARD BUFFER', buffer);
        keyboardInput.current.value = buffer;
    }

    const focusKeyboardOn = r => {
        if(r == null || keyboard.current == null) return;
        if(keyboardInput.current != null) {
            keyboardInput.current.classList.remove(styles.ActiveInput);
        }
        
        keyboardInput.current = r;
        r.classList.add(styles.ActiveInput);
        keyboard.current.setInput(r.value);
    }

    // console.log('VOCAB DATA CHECK\n', stateManager.creator.data.vocab.read);
    
    const submitVocabPostRequest = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // TODO validate data
        if(targetMedia.image == null || targetMedia.sound == null) return;
        if(targetVocab.value == '' || targetVocab.translation == '') return;

        if(!targetMedia.description) {
            targetMedia.description = ''
        }

        if(!targetVocab.storagekey) {
            targetVocab.storagekey = `${targetVocab.id}-media`;
        }

        // create payloads
        const vocabPayload: Vocab.Post = targetVocab as IVocab;

        // create the multer formdata for the media upload
        let formData = new FormData();
        if(imageFile) formData.append('image', imageFile, `vocabID.${targetVocab.id}.storagekey.${targetVocab.storagekey}`);
        if(soundFile) formData.append('sound', soundFile, `creatorID.${targetMedia.creator.id}.description.${targetMedia.description}`);
        // formData.append('id', id);
        // formData.append('description', description);
        // formData.append('creatorID', creator.id);

        // sanity check
        console.log('VOCAB.POST REQUEST ON CLIENT\n', vocabPayload, formData);
    
        // submit vocab data
        try {
            console.log('sending vocab...');
            const result = await Axios.post(`${END_POINT}/edit`, { body: vocabPayload });
            console.log(result);
        } catch(err) {
            alert('error! could not create vocab');
            console.log(err);
        }

        // TODO submit media data
        if(imageFile && soundFile) {
            try {
                console.log('sending vocab media...');
                const result = await Axios.put(`${END_POINT}/edit/media`, formData, {
                    headers: { "content-type": "multipart/form-data" }
                });
                console.log(result);
            } catch(err) {
                alert('error! could not create vocab media');
                console.log(err);
            }
        }

        await stateManager.creator.data.vocab.refresh();
        await stateManager.creator.data.vocab.media.refresh();

        // reset the creator on success
        // creatorManager.reset.create(); // TODO doesnt work .-.
        setTargetVocab(null);
        setTargetMedia(null);
    }

    return (
    <div id={styles.VocabViewer}>
        <div id={styles.VocabList}>
            {Object.entries(stateManager.creator.data.vocab.read).map(([i, v]) => { return (
            <div key={v.id} className={styles.VocabListWrapper} >
                <p>{v.lang.slice(0, 3).toUpperCase()}</p>
                <button onClick={(e) => {
                    e.preventDefault();
                    if(targetVocab != null && changed) {
                        if(!confirm('Discard changes?')) {
                            return;
                        }
                    }
                    setCreator((prev) => {
                        prev.editVocab.target = {
                            read: v,
                            media: {
                                read: stateManager.creator.data.vocab.media.read[i]
                            }
                        }
                        return prev;
                    })
                    // TODO set the targetMedia through a get request
                    console.log('EDIT TARGET\n', v.value, v.translation);
                    // console.log(stateManager.creator.data.vocab.media.read[i]);
                    if(formObject.current) formObject.current.reset();
                    setTargetVocab({...v});
                    setTargetMedia({...stateManager.creator.data.vocab.media.read[i],
                        creator: stateManager.creator.read
                    });
                    setChanged(false);   
                }}>
                    <h1>{v.value}</h1>
                </button>
            </div>
            )})}
        </div>

        <div id={styles.VocabEditor}>
            <div id={styles.VocabMenu}>
                {targetVocab != null && targetVocab.lang != 'english' &&
                <div id={styles.KeyboardMenu} ref={draggableKeyboardMenu} >
                    {showKeyboard &&
                    <Keyboard
                        keyboardRef={r => {keyboard.current = r}}
                        layout={KeyboardSupport.LanguageLayouts[targetVocab.lang as string]}
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
                                if(keyboardInput.current != null) {
                                    keyboardInput.current.classList.remove(styles.ActiveInput);
                                }
                            }}>
                                {`toggle ${targetVocab.lang} keyboard`}
                            </button>
                        </div>
                        
                        <div id={styles.KeyboardMoveGrabbableArea} style={{width: '50%'}}>
                            <div id={styles.GrabbableHeader} ref={draggableHeader}>
                                {showKeyboard && <p>Click & Drag to move</p>}
                            </div>
                        </div>
                    </div>
                </div>}

                {targetVocab != null &&
                <form ref={f => formObject.current = f} id={styles.Form} onSubmit={async (e) => {
                    submitVocabPostRequest(e);
                }}>
                    {/* vocab language */}
                    <div>
                        <p>Language</p>
                        <select name='Lang' value={targetVocab.lang} onChange={(e) => {
                            e.preventDefault();
                            keyboardInput.current = null;
                            console.log(e.target.value);
                            setTargetVocab({...targetVocab, lang: e.target.value as TLanguage});
                            setChanged(true);
                        }}>
                            {KeyboardSupport.SupportedLanguages.map((lang) =>  <option key={lang}>{lang}</option>)}
                        </select>
                    </div>

                    {/* root vocab value */}
                    <div>
                        <p>Root Value</p>
                        <input ref={rootInput} value={targetVocab.value} name='Root' placeholder='Root' onFocus={(e) => {
                            e.preventDefault();
                            focusKeyboardOn(rootInput.current);
                        }} onChange={(e) => {
                            setTargetVocab({...targetVocab, value: e.target.value});
                            setChanged(true);
                        }}/>
                    </div>

                    {/* the word in english */}
                    <div>
                        <p>Translation</p>
                        <input name='Trans' value={targetVocab.translation} placeholder='Translation' onFocus={(e)=>{
                            e.preventDefault();
                            if(keyboardInput.current != null) {
                                keyboardInput.current.classList.remove(styles.ActiveInput);
                            }
                            keyboardInput.current = null;
                        }} onChange={(e) => {
                            setTargetVocab({...targetVocab, translation: e.target.value});
                            setChanged(true);
                        }}/>
                    </div>

                    {/* example phrase */}
                    <div>
                        <p>Example Phrase</p>
                        <input ref={exampleInput} value={targetVocab.example} name='Example' placeholder='Example Usage' onFocus={(e) => {
                            e.preventDefault();
                            focusKeyboardOn(exampleInput.current);
                        }} onChange={(e) => {
                            setTargetVocab({...targetVocab, example: e.target.value});
                            setChanged(true);
                        }}/>
                    </div>

                    {/* part of speach */}
                    <div>
                        <p>Part of Speach</p>
                        <select name='POS' value={targetVocab.pos} onChange={(e) => {
                            setTargetVocab({...targetVocab, pos: e.target.value as TPartOfSpeech});
                            setChanged(true);
                        }}>
                            {KeyboardSupport.SupportedPOS.map((pos) => <option key={pos}>{pos}</option>)}
                        </select>
                    </div>

                    {/* subject */}
                    <div>
                        <p>Subject</p>
                        <select name='Subject' value={targetVocab.subject} onChange={(e) => {
                            setTargetVocab({...targetVocab, subject: e.target.value as TVocabSubject});
                            setChanged(true);
                        }}>
                            {KeyboardSupport.SupportedSubjects.map((sub) => <option key={sub}>{sub}</option>)}
                        </select>
                    </div>

                    {/* notes on the vocab item */}
                    <div>
                        <textarea ref={noteInput} placeholder='vocab note' onFocus={(e)=>{
                            e.preventDefault();
                            focusKeyboardOn(noteInput.current);
                        }} onChange={(e) => {
                            setTargetVocab({...targetVocab, note: e.target.value});
                            setChanged(true);
                        }} value={targetVocab.note}></textarea>
                    </div>

                    {/* image uploading */}
                    <div>
                        <input type='file' placeholder='Image' onChange={ async (e)=> {
                            const reader = new FileReader();
                            const file = e.target.files[0];
                            reader.addEventListener('load', () => {
                                const buffer: ArrayBuffer = reader.result as ArrayBuffer;
                                setTargetMedia({...targetMedia,
                                    image: Buffer.from(buffer),
                                    creator: stateManager.creator.read
                                });
                                setImageFile(file);
                                setChanged(true);
                            });
                            reader.readAsArrayBuffer(file);
                        }} className={styles.ImageInput} accept={SupportedImageTypes}
                        />
                    </div>

                    {/* sound uploading */}
                    <div>
                        <input type='file' placeholder='Sound' onChange={(e)=> {
                            const reader = new FileReader();
                            const file = e.target.files[0];
                            reader.addEventListener('load', () => {
                                const buffer: ArrayBuffer = reader.result as ArrayBuffer;
                                setTargetMedia({...targetMedia,
                                    sound: Buffer.from(buffer),
                                    creator: stateManager.creator.read
                                });
                                setSoundFile(file);
                                setChanged(true);
                            });
                            reader.readAsArrayBuffer(file);
                        }} className={styles.SoundInput} accept={SupportedSoundTypes}
                        />
                    </div>

                    {/* form submission */}
                    <div>
                        <input type='Submit' value='Edit Vocab' readOnly={true}/>
                    </div>
                </form>}
            </div>

            {targetVocab &&
            <div id={styles.VocabMedia}>
                {/* previews the image */}
                {targetMedia && targetMedia.image != null &&
                <div id={styles.VocabImageView}>
                    <img src={bufferToString(targetMedia.image, 'image/png')}></img>
                    <textarea ref={descriptionInput} placeholder='Image Description' onFocus={(e)=>{
                        e.preventDefault();
                        focusKeyboardOn(descriptionInput.current);
                    }} onChange={(e)=> {
                        setTargetMedia({...targetMedia,
                            description: e.target.value,
                            creator: stateManager.creator.read
                        });
                    }} value={targetMedia.description}></textarea>
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
        </div>
    </div>);
}

export default VocabEditor;
