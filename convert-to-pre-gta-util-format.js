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

const DEBUG_MODE = false

let inputFolder = process.argv[2];
let outputDestination = process.argv[3];

let count = {}
let modelNumberToFolderNumber = {}

console.log("starting!")

// COMPONENT MODELS:
fs.readdirSync(inputFolder).forEach(fileName => {
    if (fileName.includes(".ydd")) {
        let fileNameSplit = fileName.split("^")
        let majorFolder = fileNameSplit[0]
        if (majorFolder.includes("_p")) { // skip props in this loop
            return
        }
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
        if (!modelNumberToFolderNumber[majorFolder]) {
            modelNumberToFolderNumber[majorFolder] = {}
        }
        if (!modelNumberToFolderNumber[majorFolder][minorFolder]) {
            modelNumberToFolderNumber[majorFolder][minorFolder] = {}
        }
        modelNumberToFolderNumber[majorFolder][minorFolder][modelNumber] = count[majorFolder].components[minorFolder] - 1
        if (DEBUG_MODE)
            console.log(`(${fileName}) added model number ${modelNumber} target folder: ${modelNumberToFolderNumber[majorFolder][minorFolder][modelNumber]}`)
    }
});

// COMPONENT TEXTURES
fs.readdirSync(inputFolder).forEach(fileName => {
    if (fileName.includes(".ytd")) {
        let fileNameSplit = fileName.split("^")
        let majorFolder = fileNameSplit[0]
        if (majorFolder.includes("_p")) { // skip props in this loop
            return
        }
        let minorFolder = fileNameSplit[1].split("_")[0]
        let modelNum = fileNameSplit[1].split("_")[2]
        let targetFolderNum = modelNumberToFolderNumber[majorFolder][minorFolder][modelNum]
        if (!count[majorFolder][minorFolder]) {
            count[majorFolder][minorFolder] = {
                componentTextures: {}
            }
        }
        count[majorFolder][minorFolder].componentTextures[targetFolderNum] = count[majorFolder][minorFolder].componentTextures[targetFolderNum] ? count[majorFolder][minorFolder].componentTextures[targetFolderNum] + 1 : 1
        fs.copyFileSync(`${inputFolder}/${fileName}`, `${majorFolder}/components/${minorFolder}/${targetFolderNum}/${count[majorFolder][minorFolder].componentTextures[targetFolderNum] - 1}.ytd`)
        
        // temp for debugging:
        if (DEBUG_MODE) {
            if (fileName.includes("berd"))
                console.log(`copied ${inputFolder}/${fileName} -> ${majorFolder}/components/${minorFolder}/${targetFolderNum}/${count[majorFolder][minorFolder].componentTextures[targetFolderNum] - 1}.ytd`)
        }
    }
})

modelNumberToFolderNumber = {} // reset for prop models

// PROPS
fs.readdirSync(inputFolder).forEach(fileName => {
    if (fileName.includes(".ydd")) {
        let fileNameSplit = fileName.split("^")
        let majorFolder = fileNameSplit[0]
        if (!majorFolder.includes("_p")) { // only props in this loop
            return
        }
        if (!fs.existsSync(majorFolder)) {
            fs.mkdirSync(majorFolder, {recursive: true})
        }
        let minorFolderAndModelNumber = fileNameSplit[1].split("_")
        let minorFolder = minorFolderAndModelNumber[1]
        if (!fs.existsSync(`${majorFolder}/props/${minorFolder}`)) {
            fs.mkdirSync(`${majorFolder}/props/${minorFolder}`, {recursive: true})
        }
        if (!count[majorFolder]) {
            count[majorFolder] = {
                components: {}
            }
        }
        count[majorFolder].components[minorFolder] = count[majorFolder].components[minorFolder] ? count[majorFolder].components[minorFolder] + 1 : 1
        fs.copyFileSync(`${inputFolder}/${fileName}`, `${majorFolder}/props/${minorFolder}/${count[majorFolder].components[minorFolder] - 1}.ydd`)
        if (!fs.existsSync(`${majorFolder}/props/${minorFolder}/${count[majorFolder].components[minorFolder] - 1}`)) {
            fs.mkdirSync(`${majorFolder}/props/${minorFolder}/${count[majorFolder].components[minorFolder] - 1}`, {recursive: true})
        }
        if (!modelNumberToFolderNumber[majorFolder]) {
            modelNumberToFolderNumber[majorFolder] = {}
        }
        if (!modelNumberToFolderNumber[majorFolder][minorFolder]) {
            modelNumberToFolderNumber[majorFolder][minorFolder] = {}
        }
        let modelNumber = minorFolderAndModelNumber[2].split(".")[0]
        modelNumberToFolderNumber[majorFolder][minorFolder][modelNumber] = count[majorFolder].components[minorFolder] - 1
    }
})

// PROP TEXTURES
fs.readdirSync(inputFolder).forEach(fileName => {
    if (fileName.includes(".ytd")) {
        let fileNameSplit = fileName.split("^")
        let majorFolder = fileNameSplit[0]
        if (!majorFolder.includes("_p")) { // only props in this loop
            return
        }
        let minorFolder = fileNameSplit[1].split("_")[1]
        let modelNum = fileNameSplit[1].split("_")[3]
        let targetFolderNum = modelNumberToFolderNumber[majorFolder][minorFolder][modelNum]
        if (!count[majorFolder][minorFolder]) {
            count[majorFolder][minorFolder] = {
                componentTextures: {}
            }
        }
        count[majorFolder][minorFolder].componentTextures[targetFolderNum] = count[majorFolder][minorFolder].componentTextures[targetFolderNum] ? count[majorFolder][minorFolder].componentTextures[targetFolderNum] + 1 : 1
        fs.copyFileSync(`${inputFolder}/${fileName}`, `${majorFolder}/props/${minorFolder}/${targetFolderNum}/${count[majorFolder][minorFolder].componentTextures[targetFolderNum] - 1}.ytd`)
    }
})

console.log("done!")