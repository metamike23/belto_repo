var https = require("https");
var path = require("path");
var fs = require("fs");
var request = require("request");
var natural = require('natural');
const T = require('tesseract.js');


// adding learningModel.json to the Natural Learning BayesClassifier
var classifier = new natural.BayesClassifier();
const data = require('./learningModel.json')
// forEach add then one by one from json to classifier
data.forEach(item=>{
    classifier.addDocument(item.text,item.category);
})

// Train the model with JSON data
classifier.train();







// Now we convert the Image to Text
var tokenizer = new natural.WordTokenizer(); // Check out natural.js api to see how to use Word Tokenizer

// Use Tesseract,js API to process text from img
// page1.png is a png file in my root folder of the project
T.recognize('./page1.png', 'eng').then(out => {
    let str = out.data.text;
    console.log('\n\n' + 'Printing Text from PDF/IMG'+ '\n\n');
    

    // Split the string by line break
    let tempArray = str.split('\n');

    console.log( '\nTrying to classify text\n');

    // For each String in tempArray
    tempArray.forEach( txt => {
        let line = txt.replace(/[:]/g, '');
        if(line.length >= 1) {
            console.log(line.trim() + ' ->  ML class -> ' + classifier.classify(line.trim()) + '\n');   
        }
    })

    // Save and Retrain
    classifier.save('formLabelClassify.json',function(err,classifier){});

    // Train
    classifier.train();

    console.log('\n2nd Attempt\n')

    tempArray.forEach( txt => {

        let line = txt.replace(/,/g, '');
        line = line.replace(/[:]/g, '');
        if(line.length > 1) {
            // Print the text and its classification (from learningModel.json data)
            console.log(line.trim() + ' ->  ML class -> ' + classifier.classify(line.trim()) + '\n');
        }
    })
});
