import { BlockBlobClient, newPipeline, AnonymousCredential } from "@azure/storage-blob";



export default async function UploadService(auth, filedata, name) {


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
                .then((data) => {

                    console.log('uri: ', data);


                    const pipeline = newPipeline(new AnonymousCredential());
                    
                    var blockBlobClient = new BlockBlobClient(data.uri, pipeline);
                    blockBlobClient.uploadData(filedata, {
                        maxSingleShotSize: 4 * 1024 * 1024
                      })
                        .then((resp) => {
                            console.log(resp);
                            resolve(resp._response.status);

                        });




                });


        } else {
            reject("Not logged in");
        }

    });


}

