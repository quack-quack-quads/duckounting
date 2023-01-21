// takes a base64 string of tokenURI and returns a json object
// with name, description, image, and rating
const parseBase64 = (base64String) => {
    let jsonString = Buffer.from(base64String.split(",")[1], 'base64').toString();
    jsonData = JSON.parse(jsonString);
    // console.log(token);
    const obj = {
        name: jsonData.name,
        description: jsonData.description,
        image: jsonData.image,
        rating: (jsonData.attributes.at(0)).value
    }
    return obj;
}
module.exports = parseBase64;