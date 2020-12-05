import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


import CaptureDrop from './captureDrop';
import UploadService from '../services/uploadservice';




const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        margin: 30,
    },
    paper: {
        //width: 100,
        minWidth: 0,
        padding: 10,
    },
    radios: {
        alignItems: 'center',
        justifyContent: 'center',
        direction: 'row',
        margin: 10,
        
    },
    timeview: {
        marginTop: 40,
    },
    dropbox: {
        //width: 150,
        minWidth: 400,
        minHeight: 100,
        padding: 10,
        marginTop: 25,
        marginLeft: 50,
        marginRight: 5,
        borderTopWidth: 1,
        borderLeftWidth: 6,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopStyle: 'solid',
        borderLeftStyle: 'inset',
        borderBottomStyle: 'solid',
        borderRightStyle: 'solid',

        borderTopColor: 'lightgrey',
        borderBottomColor: 'lightgrey',
        borderRightColor: 'lightgrey',
        borderLeftColor: 'blue',
        borderRadius: 5
    },
    dropboxarea: {
        //width: 150,
        minWidth: 250,
        minHeight: 120,
        padding: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: 'grey'
    },

}));

// stageList 'home','list','view','edit','new';

export default function Body(props) {

   const auth = props.auth;
   const loggedIn = props.loggedIn;

   const [status,setStatus] = useState("");


    const classes = useStyles();

    async function handleDrop(dropfiles) {

        for (var i = 0; i < dropfiles.length; i++) {
            console.log(dropfiles[i]);

            setStatus("Uploading: "+ dropfiles[i].name);
            var result = await UploadService(auth, dropfiles[i], dropfiles[i].name);
            console.log(result);
            setStatus("Complete");
        }


    }

    
    async function login() {
        //showme("login");
        console.log("About to logon");
        await auth.login()
        console.log("About to get details");
        auth.getLoggedInDetails()
        .then(() => { console.log("About to get details");auth.completeLoggingOnStatus()})
        .catch( function(err){ console.log('suspect logon failed stage '+err)});

    }



    return (


        <div>

            { !loggedIn && 

<Button variant="contained" size="small" color="primary" onClick={() => { login() }}> <AccountCircleIcon /> &nbsp; login</Button>

}

            {loggedIn && 


            <Grid container className={classes.root} >
                <Grid item xs={12}>
                    <Grid container wrap="nowrap">

                        <Grid item xs={6} >
                            <Typography variant="h4" className={classes.title}>GP Simple Blob Lander</Typography>
                            <Typography>
                                See: https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview
                            </Typography>
                            <Typography>
                                Drop files into the drop area to upload processing.
                            </Typography>

                            <Typography>
                                { status }
                            </Typography>

                        </Grid>
                        <Grid item xs={2} zeroMinWidth>



                            <div className={classes.dropbox}>
                                <h5>Drop Files Area</h5>
                                <CaptureDrop handleDrop={handleDrop} >
                                    <div className={classes.dropboxarea} >
                                        <p> Drop files here!</p>

                                    </div>
                                </CaptureDrop>
                            

                            

                            </div>
                        </Grid>





                    </Grid>

                </Grid>

            </Grid>
}

        </div>

    );

}