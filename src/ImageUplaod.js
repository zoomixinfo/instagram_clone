import { Button } from '@material-ui/core'
import React, {useState} from 'react'
import firebase from 'firebase'
import {db, storage} from './firebase'
import './ImageUplaod.css'

function ImageUplaod(username) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState('')
    const [progress, setProgress] = useState(0)
    
    const handleChange = (e) =>{
        if(e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes*100)
                )
                setProgress(progress)
            },
            (error) => {
                console.log(error);
                alert(error.message)
            },
            ()=>{
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection("postes").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl:url,
                        username: username
                    })
                setProgress(0)
                setCaption("")
                setImage(null)
                })
            }
        )
    }
    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption"
            onChange={
                event => setCaption(event.target.value)
            }
        />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUplaod
