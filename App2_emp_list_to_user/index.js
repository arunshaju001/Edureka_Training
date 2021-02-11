const express = require('express');
const app = express();
const request = require('request');
const port = 5400;

const empurl = "http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees";


function getemp(url) {
    var options = {
        url: empurl,
        headers: {
            'User-Agent': 'request'
        }
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}


app.get('/',(req,res) => {
    var dataPromise = getemp();
    dataPromise.then(JSON.parse)
               .then(function(result) {
                    res.send(result)
                })
})


app.listen(port ,(err) => {
    if(err) { console.log('error in api call')}
    else{ console.log ('App is running on port '+port)}
})