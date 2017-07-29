var fileTypes = [
    'application/pdf',
]

$(document).ready(function () {
    uploadAjax();
});

function uploadWithSubmit() {
    var input = document.querySelector('input');
    $('#uploadForm').submit(function () {

        if (validFileType(input.files[0])) {
            $("#status").empty().text("File is uploading...");
            $(this).ajaxSubmit({
                error: function (xhr) {
                    $("#status").empty().text('Error: ' + xhr.status);
                },
                success: function (response) {
                    $("#status").empty().text(response.message);
                    $('.content').html(response.content.join('<br/>'));
                }
            });
        } else {
            $("#status").empty().text('Error: invalid type');
        }

        return false;
    });
}

function uploadAjax() {
    var fileUploader = $('#upload');

    fileUploader.on('change', function (e) {
        files = e.target.files;

        if (validFileType(files[0])) {
            var myForm = document.getElementById('uploadForm');
            var formData = new FormData(myForm);

            $.ajax({
                url: '/api/file',
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                type: 'post',
                error: function (xhr) {
                    $("#status").empty().text('Error: ' + xhr.status);
                },
                success: function (data) {
                    $("#status").empty().text(data.message);
                    $('.content').html(data.content.join('<br/>'));
                }
            });
        } else {
            $("#status").empty().text('Error: invalid type');
        }
    });
}


function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }
    return false;
}