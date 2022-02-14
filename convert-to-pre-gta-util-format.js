const fs = require('fs')

// iterate through all .ydds and .ytds in our input file
    // place in appropriate output folder
        // up to the first "^" character is the mp_* folder it belongs in
        // for ydds:
            // then up to the first "_" character is the "components" sub folder it belongs in
            // then up to the next "_" is the number it is
        // for ytds:
            // then up to the first "_" character is the "components" sub folder it belongs in
            // then from the 2nd "_" char to the 3rd "_" char is the ydd model number it corresponds to
            // then from the 3rd to 4th "_" chars is the texture letter

// props follow the same format except:
    // the major folder is suffixed with "_p"
    // the minor folder is prefixed with "p_"

let inputFolder = process.argv[2];
let outputDestination = process.argv[3];

let count = {}
let modelNumberToFolderNumber = {}

// COMPONENT MODELS:
fs.readdirSync(inputFolder).forEach(fileName => {
    if (fileName.includes(".ydd")) {
        let fileNameSplit = fileName.split("^")
        let majorFolder = fileNameSplit[0]
        if (!fs.existsSync(majorFolder)) {
            fs.mkdirSync(majorFolder, {recursive: true})
        }
        let minorFolderAndModelNumber = fileNameSplit[1].split("_")
        let minorFolder = minorFolderAndModelNumber[0]
        if (!fs.existsSync(`${majorFolder}/components/${minorFolder}`)) {
            fs.mkdirSync(`${majorFolder}/components/${minorFolder}`, {recursive: true})
        }
        if (!count[majorFolder]) {
            count[majorFolder] = {
                components: {}
            }
        }
        count[majorFolder].components[minorFolder] = count[majorFolder].components[minorFolder] ? count[majorFolder].components[minorFolder] + 1 : 1
        fs.copyFileSync(`${inputFolder}/${fileName}`, `${majorFolder}/components/${minorFolder}/${count[majorFolder].components[minorFolder] - 1}.ydd`)
        if (!fs.existsSync(`${majorFolder}/components/${minorFolder}/${count[majorFolder].components[minorFolder] - 1}`)) {
            fs.mkdirSync(`${majorFolder}/components/${minorFolder}/${count[majorFolder].components[minorFolder] - 1}`, {recursive: true})
        }
        let modelNumber = minorFolderAndModelNumber[1]
        modelNumberToFolderNumber[modelNumber] = count[majorFolder].components[minorFolder] - 1
    }
});

// COMPONENT TEXTURES
fs.readdirSync(inputFolder).forEach(fileName => {
    if (fileName.includes(".ytd")) {
        let fileNameSplit = fileName.split("^")
        let majorFolder = fileNameSplit[0]
        let minorFolder = fileNameSplit[1].split("_")[0]
        let modelNum = fileNameSplit[1].split("_")[2]
        let targetFolderNum = modelNumberToFolderNumber[modelNum]
        if (!count[majorFolder][minorFolder]) {
            count[majorFolder][minorFolder] = {
                componentTextures: {}
            }
        }
        // todo: add minor folder to below count, as currently .ytds are not being named properly
        count[majorFolder][minorFolder].componentTextures[targetFolderNum] = count[majorFolder][minorFolder].componentTextures[targetFolderNum] ? count[majorFolder][minorFolder].componentTextures[targetFolderNum] + 1 : 1
        fs.copyFileSync(`${inputFolder}/${fileName}`, `${majorFolder}/components/${minorFolder}/${targetFolderNum}/${count[majorFolder][minorFolder].componentTextures[targetFolderNum] - 1}.ytd`)
    }
})