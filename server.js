const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey ="be1cdb3dd70ebf47f6dbb733ff8778f5";
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
    //recuperatio du nom de la ville sur la vue
    let city = req.body.city;
    //url de l'api formate
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    //requette http get vers l'api
    request(url, function (err, response, body) {
        //si il y'a une erreur lors de la requette
        if(err){
            //retourner la page index avec le message d'erreur
            res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
            //si nous avons unner reponse 200
            //on formate la reponse sous format json
            let weather = JSON.parse(body)
            //on test si le main de la reponse n'existe
            if(weather.main == undefined){
                //retourner la page index avec le message d'erreur
                res.render('index', {weather: null, error: 'Error,svp reesayer !'});
            } else {
                //si non
                //j'affiche l'objet de la reponse
                console.log(weather);
                //je dormate le message de success a afficher
                let weatherText = `il fait ${weather.main.temp} degrees a ${weather.name}! pays ${weather.sys.country}`;
                //je retourne la vue index avec le message formater
                res.render('index', {weather: weatherText, error: null});
            }
        }
    });
})

app.listen(3200, function () {
    console.log(`application en cours a l'adresse 127.0.0.1:3200`)
})

//source du tuto
//https://codeburst.io/build-a-simple-weather-app-with-node-js-in-just-16-lines-of-code-32261690901d
//https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b