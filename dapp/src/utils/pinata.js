import {setIpfsUrl} from "../store/teacherState";
import {createClassConfig, getTeachers} from "./interact";
import {setPendingClass } from "../store/teacherState";
const FormData = require('form-data')
const fs = require('fs')
require('dotenv').config();

const axios = require('axios');

export const pinJSONToIPFS = async(JSONBody, dispatch,jwt,classroomName, redirectUrl, history) => {
    dispatch(setPendingClass([{name: classroomName, status: "Pending.."}]))
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
            createClassConfig(classroomName,"https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash , redirectUrl, history ).then(result => {
                let status = result.success ? "Success" : "Error"
                dispatch(setPendingClass([{name: classroomName, status:status}]))

                setTimeout(() => {
                    dispatch(setPendingClass([{name: "", status:""}]))
                }, 1000)
            })
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


export const pinFileToIPFS = async (JWT, src) => {
    const formData = new FormData();

    //const file = fs.createReadStream(src)
    formData.append('file', src)

    const pinataMetadata = JSON.stringify({
        name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try{
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${JWT}`
            }
        });
        return "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash
    } catch (error) {
        console.log(error);
    }
}