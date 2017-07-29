var express = require("express"),
    multer = require('multer'),
    app = express(),
    pdf2table = require('pdf2table'),
    fs = require('fs'),
    path = require('path');

let dirName = './uploads/';

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage }).single('pdfFile');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/api/file', upload, function (req, res) {
    if (req.file !== undefined) {
        fs.readFile(dirName + req.file.filename, function (err, buffer) {
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