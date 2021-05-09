const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)


// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Rahul Krishna'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Rahul Krishna'
    })
})

app.get('/weather', (req,res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (geoError, {longitude, latitude, location} = {} ) => {
        if (geoError) {
            return res.send({error: geoError})
        }  
        forecast(latitude, longitude, (forecastError, {weatherDesc, temp, feelslike, humidity} = {}) => {
            if (forecastError) {
                return res.send({error: forecastError})
            }
            res.send({
                forecast: "Its " + weatherDesc + ". It is currently " + temp + " degrees out there and it feels like " + feelslike + " degrees." +" The humidity is " + humidity+"%.",
                location,
                weatherDesc,
                temp,
                feelslike,
                humidity
            })
          })
    })
})

app.get('/products', (req, res) =>  {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Rahul Krishna'
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: 'Help',
        name: 'Rahul Krishna',
        errorMessage: 'Help article not found.'
    })
})

app.get('*',(req,res) => {
    res.render('404', {
        title: 'Help',
        name: 'Rahul Krishna',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log("Server is up on port 3000")
})