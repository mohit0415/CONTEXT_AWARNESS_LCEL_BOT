const postWithoutHeaders = async(url,requestBody) => {
    try {
        const response = await fetch(url,{
            method : 'POST',
            body : JSON.stringify(requestBody),
            headers:{
                'Content-Type':'application/json'
            }
        });
        const responseData = await response.json()
        return {
            ok: response.ok,
            status: response.status,
            data: responseData,
            };

    }catch(err){
        console.log('Error in networkPost:',err)
    }
}

const getWithoutHeaders = async(url) => {
    try {
        const response = await fetch(url,{
            method : 'GET',
            headers:{
                'Content-Type':'application/json'
            }
        });
        const responseData = await response.json()
            return {
            ok: response.ok,
            status: response.status,
            data: responseData,
            };

    }catch(err){
        console.log('Error in networkPost:',err)
    }
}


export {postWithoutHeaders,getWithoutHeaders}