import React, { useState, useEffect, useRef } from 'react'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({

    droparea: {
        margin:0,
        padding:0,
        height: 100,
        width: 400,
        borderStyle: 'dashed',
        borderColor: 'aliceblue',
        backgroundColor: 'lightgray'
    },
    dragging: {
        height: 100,
        width: 400,
        borderStyle: 'dashed grey 2px',
        backgroundColor: 'cornflowerblue',
        position: 'absolute',
        padding: 2,
        margin: 0,
        zIndex: 10

    },
    prompt: {
        position: 'absolute',
        top: '50%',
        right:0,
        left:0,
        textAlign: 'center',
        color: 'grey',
        fontSize: 10
    }
    
}));


export default function CaptureDrop(props) {

    const [drag, setDrag] = useState(false);

    let dropRef = useRef(null);
    let dragCounter = 0;
    const classes = useStyles();

    function handleDrag(e) {
        setDrag(true);
        e.preventDefault();
        e.stopPropagation();
        
        
    }

    function handleDragIn(e) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDrag(true);
        }
    }
    function handleDragOut(e) {
        e.preventDefault()
        e.stopPropagation()
        dragCounter--
        if (dragCounter === 0) {
            setDrag(false);
        }
    }
    function handleDrop(e) {
        console.log('dropping..');
        e.preventDefault()
        e.stopPropagation()
        setDrag(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            props.handleDrop(e.dataTransfer.files)
            e.dataTransfer.clearData()
            dragCounter = 0
        }
    }

    useEffect(() => {
      
        let div = dropRef.current;
        div.addEventListener('dragenter', handleDragIn)
        div.addEventListener('dragleave', handleDragOut)
        div.addEventListener('dragover', handleDrag)
        div.addEventListener('drop', handleDrop)

        return function cleanup() {

            div.removeEventListener('dragenter', handleDragIn)
            div.removeEventListener('dragleave', handleDragOut)
            div.removeEventListener('dragover', handleDrag)
            div.removeEventListener('drop', handleDrop)
        }
    });






    return (
        <div ref={dropRef} className = {classes.droparea}>
            {drag &&
                <div className = {classes.dragging} >
                    
                </div>
            }

        </div>
    );
}

