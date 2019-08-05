const express = require('express');
let mysql = require('mysql');
let session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'weather_app_bd'
});
const apiKey ="be1cdb3dd70ebf47f6dbb733ff8778f5";
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    if(req.session.users!== undefined)
    {
        res.render('index', {weather: null, error: null, users: req.session.users});
    }else {
        res.redirect('/authentification');
    }
})
app.get('/inscription', function (req, res) {
    if(req.session.users!==undefined)
    {
        res.redirect('/');
    }else {
        res.render('auths/inscription',{error: null});
    }
})

app.get('/authentification', function (req, res) {
    if(req.session.users!== undefined)
    {
        res.redirect('/');
    }else {
        res.render('auths/authentification',{error: null});
    }
})
app.get('/deconnexion', function (req, res) {
    if(req.session.users!== undefined)
    {
        req.session.users=undefined;
        res.redirect('/');
    }
})


app.post('/inscription',function (req,res) {
    let pseudo = req.body.pseudo;
    let email = req.body.email;
    let password = req.body.password;
    if(pseudo && email && password)
    {
        var sql = `SELECT * FROM users  WHERE (email_users = '${email}')`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            if(result.length>0)
            {
                let message= `erreur Compte avec la meme adresse email existe deja`;
                    res.render('auths/inscription', {error: message});

            }else {
                    console.log("Connected!");
                    var sql = `INSERT INTO users (pseudo_users,email_users,password_users) VALUES ('${pseudo}', '${email}','${password}')`;
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted");
                        res.redirect('/authentification');
                    });
            }
        });


    }else {
        res.render('auths/inscription', {error: `tout les champs doivent etre renseigner`});
    }
})

//authentification
app.post('/authentification',function (req,res) {
    let email = req.body.email;
    let password = req.body.password;
    if(email && password)
    {
            console.log("Connected!");
            var sql = `SELECT * FROM users  WHERE (email_users = '${email}')`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                if(result.length>0)
                {
                    console.log(result[0]);
                    if(result[0].password_users === password)
                    {
                        req.session.users=result[0];
                        res.redirect('/');
                    }else{
                        res.render('auths/authentification', {error: `mot de passe incorrect veuillez renseigner le bon mot de passe`});
                    }
                    console.log("ok");
                }
            });

    }else {
        res.render('auths/inscription', {error: `tout les champs doivent etre renseigner`});
    }
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
            res.render('index', {weather: null, error: 'Error, please try again', users: req.session.users});
        } else {
            //si nous avons unner reponse 200
            //on formate la reponse sous format json
            let weather = JSON.parse(body)
            //on test si le main de la reponse n'existe
            if(weather.main == undefined){
                //retourner la page index avec le message d'erreur
                res.render('index', {weather: null, error: 'Error,svp reesayer !', users: req.session.users});
            } else {
                //si non
                //j'affiche l'objet de la reponse
                console.log(weather);
                //je dormate le message de success a afficher
                let weatherText = `il fait ${weather.main.temp} degrees a ${weather.name}! pays ${weather.sys.country}`;
                //je retourne la vue index avec le message formater
                res.render('index', {weather: weatherText, error: null, users: req.session.users});
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