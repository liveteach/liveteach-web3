import {setIpfsUrl} from "../store/teacherState";

require('dotenv').config();

const axios = require('axios');

export const pinJSONToIPFS = async(JSONBody, dispatch,jwt) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios
        .post(url, JSONBody, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        })
        .then(function (response) {
            dispatch(setIpfsUrl("https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash))
            document.getElementById("ipfsPending").style.display = 'none';
            document.getElementById("ipfsUrl").style.display = 'block'
            return {
                success: true,
                pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            };

        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

        });
};