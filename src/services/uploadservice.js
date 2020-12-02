



export default async function UploadService(auth, filedata, name) {


    const uploadData = new FormData();

    uploadData.append('file', filedata);


    var loggedIn = await auth.isLoggedIn();
    console.log(loggedIn);



    return new Promise(async function (resolve, reject) {

        if (loggedIn) {

            var token = await auth.get_api_token();
            console.log(token);

            fetch('https://gpblobloader.azurewebsites.net/api/HttpTrigger1?code=dfC14fs1bWe3Ltg1IRCWhMIktpBM7jPJf8brTpKAGBQGBsf33fvgBQ==&blob=' + name, {
                method: 'GET',
                headers: {
                'Authorization': 'Bearer ' + token
                },
                mode: 'cors',
//                credentials: 'include',
                redirect: 'follow'
            })
                .then((resp) => 
                    resp.json())
                .then ((data) => {

                    console.log('uri: ', data);

                    fetch(data.uri, {
                        method: 'PUT',
                        headers: {
                            'x-ms-blob-type': 'BlockBlob'
                        },
                        body: uploadData,
                        mode: 'cors',
                        credentials: 'include',
                        redirect: 'follow'
                    })
                        .then((resp) => {

                            console.log(resp.status);
                            resolve(resp.status);

                        });

                });


        } else {
            reject("Not logged in");
        }

    });


}

