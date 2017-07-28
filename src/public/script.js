var fileTypes = [
    'application/pdf',
]

var input = document.querySelector('input');
var preview = document.querySelector('.content');

input.style.opacity = 0;

input.addEventListener('change', parseFile);

function parseFile() {
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    var curFiles = input.files;
    if (curFiles.length === 0) {
        var para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        var list = document.createElement('ol');
        preview.appendChild(list);
        for (var i = 0; i < curFiles.length; i++) {
            var listItem = document.createElement('li');
            var para = document.createElement('p');
            if (validFileType(curFiles[i])) {
                para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';

                // FileReader function for read the file.
                var fileReader = new FileReader();
                var base64;
                // Onload of file read the file content
                fileReader.onload = function (fileLoadedEvent) {
                    base64 = fileLoadedEvent.target.result;
                    // Print data in console
                    //console.log(base64);

                     var update = { 'blob': base64 };

                    var oReq = new XMLHttpRequest();
                    oReq.open("POST", './upload', true);
                    oReq.onload = function (oEvent) {
                        // Uploaded.
                    };

                    oReq.send(update);
                };
                // Convert data to base64
                fileReader.readAsDataURL(curFiles[i]);

                listItem.appendChild(para);

            } else {
                para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                listItem.appendChild(para);
            }

            list.appendChild(listItem);
        }
    }
}

function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;
}

function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number > 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number > 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
    }
}