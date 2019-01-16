var express = require('express');
var logger = require('morgan');
var path = require('path');
var app = express();
const https = require('https')
var recipesData = ''

var foodData =''

const API_KEY = 'f6326c9834a61c4d87941849c3afd879' //<== INSERT YOUR KEY HERE
// const API_KEY = 'xxxxxxxxxxxxxxxxxxhxhxhxxhxhxxxx';

const ROOT_DIR = '/html';

app.use(logger('dev'));

function sendResponse(foodData, res) {

    //res.end(foodData);
    let responseObj = {
        message: "Received!Request!",
        data:foodData
    }

    let responseJSON = JSON.stringify(responseObj);
    res.send(responseJSON)
}

function parseData(foodResponse, res) {
    recipesData = ''
    console.log('parseData')
    foodResponse.on('data', function(chunk) {
        recipesData += chunk
        //console.log(chunk)
    })
    foodResponse.on('end', function() {
        console.log(recipesData)
        sendResponse(recipesData, res)
    })
}

function getRecipes(ingredient, res){

//You need to provide an appid with your request.
//Many API services now require that clients register for an app id.
    console.log("getReceipts")
    const options = {
        host: 'www.food2fork.com',
        path: `/api/search?q=${ingredient}&key=${API_KEY}`
    }
    https.request(options, function(apiResponse){
        parseData(apiResponse, res)
    }).end()
}

app.use(function (req, res, next) {
    let URL = req.originalUrl.split('?')[0];
    console.log("URL: " + URL);
    if(URL === "/" || URL === "/recipes" || URL == "/recipes.html"){
        console.log('serving /index.html instead of ' + URL);
        res.sendFile(path.join(__dirname + ROOT_DIR + '/index.html'));
    }else{
        next();
    }
})

app.use(express.static(__dirname + ROOT_DIR))

app.post('/searchRequest', function(req,res){
    console.log('request received:')
    var requestData = '';
    //receiving data
    req.on("data", function (chunk) {
        requestData += chunk;
    })

    //received data
    req.on("end", function () {
        console.log(requestData)

        let requestObj = JSON.parse(requestData);
        let foodRecipes = requestObj.food
        getRecipes(foodRecipes, res);
        /*
        let responseObj = {
            message: "Received!Request!",
            operation: requestObj.operation,
            data:foodData
        }

        let responseJSON = JSON.stringify(responseObj);

        res.send(responseJSON)
        */

    })
})

app.listen(3000)

