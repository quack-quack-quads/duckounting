const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_SECRET_API_KEY;
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);

const storeImages = async (imagesFilePath) => {
    const fullImagesPath = path.resolve(imagesFilePath)

    // filter the files in case they are not a png
    const files = fs.readdirSync(fullImagesPath).filter(file => file.endsWith('.png'))

    let responses = [];
    console.log("Uploading images to Pinata...")

    for(const fileIndex in files)
    {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`);
        const options = {
            pinataMetadata: {
                name: files[fileIndex]
            }
        }
        try {
            await pinata.pinFileToIPFS(readableStreamForFile, options)
            .then((result) => {
                responses.push(result)
            })
            .catch(err => {
                console.log(err);
            })
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files };
}
module.exports = {
    storeImages 
}