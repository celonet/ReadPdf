var express = require("express"),
    multer = require('multer'),
    app = express(),
    pdf2table = require('pdf2table'),
    fs = require('fs'),
    path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage }).single('pdfFile');

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/api/file', upload, function (req, res) {
    if (req.file !== undefined) {

        fs.readFile('./uploads/' + req.file.filename, function (err, buffer) {
            if (err) {
                res.json({
                    'message': err
                });
                res.end();
            }

            pdf2table.parse(buffer, function (err, rows, rowsdebug) {
                if (err) {
                    res.json({
                        'message': err
                    });
                    res.end();
                }

                res.json({
                    filename: req.file.filename,
                    message: 'Received upload: ',
                    content: rows
                });
                
                res.end();
            });

        });
    } else {
        res.json({
            'message': 'Unable to Upload file'
        });
    }
});

app.listen(3000, function () {
    console.log("Working on port 3000");
});

/*
http.createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`);

    if (req.url == '/upload' && req.method == 'POST') {

        var form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {
            fs.rename(files.filetoupload.path, './temp.pdf', function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
            fs.readFile('./temp.pdf', function (err, buffer) {
                if (err) return console.log(err);

                pdf2table.parse(buffer, function (err, rows, rowsdebug) {
                    if (err) {
                        return console.log(err);
                        res.writeHead(200, { 'content-type': 'text/html' });
                        res.write('Error as parse pdf');
                        res.end();
                    }
                    res.writeHead(200, { 'content-type': 'text/html' });
                    let rowsOfPdf = '';
                    rows.forEach(row => rowsOfPdf += `<li>${row}</li>`)
                    res.write(`Received upload: <br /> <ul>${rowsOfPdf}</ul>`);
                    res.end();
                });
            });
        });

        return;
    }

    fileServer.serve(req, res);

}).listen(port);
*/