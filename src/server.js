let http = require('http'),
    nStatic = require('node-static'),
    pdf2table = require('pdf2table'),
    formidable = require('formidable'),
    fs = require('fs')
qs = require('querystring');
;

let fileServer = new nStatic.Server('./public'),
    port = 3000;

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
    } else {
        fileServer.serve(req, res);
    }
}).listen(port);


console.log('running at http://localhost:%d', port);