// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var { app, dialog } = require('electron').remote; 
var fs = require('fs-extra'); 
var cp = require('child_process');
var path = require('path');

function initFolderSelectionButton(buttonId, textInputId) {
    document.getElementById(buttonId).addEventListener("click", function() {
        linkToInputBox(textInputId);
    });
};

function linkToInputBox(textInputId) {
    dialog.showOpenDialog({
        title:"Select a folder",
        properties: ["openDirectory"]
    }, function(folderNames) {

        console.log(folderNames[0]);
        var inputBox = document.getElementById(textInputId)
        console.log(inputBox.innerText);
        inputBox.value = folderNames[0];
    });
};

initFolderSelectionButton("inputSelectButton", "inputFolder");
initFolderSelectionButton("outputSelectButton", "outputFolder");

document.getElementById("goButton").addEventListener("click", function() {
    // console.log("Go Button Clicked.");
    var goButton = document.getElementById("goButton")
    goButton.disabled = true;
    goButton.innerText = "Running...";

    var copy = document.getElementById("copyCheckBox").checked;
    var outputFolder = document.getElementById("outputFolder").value;
    var inputFolder = document.getElementById("inputFolder").value;
    var sortPhotosPath = path.join(app.getAppPath(), "./sortphotos/src/sortphotos.py");
    var args = [inputFolder, outputFolder, "-r"];
    // console.log(command);
    if (copy) {
        args.push("-c");
    }
    cp.execFile(sortPhotosPath, args, function(error, stdout, stderr) {
        goButton.disabled = false;
        goButton.innerText = "Go!";
        
        if (error) {
            dialog.showMessageBox({type: "error", message: stderr});
        }
    });
});

