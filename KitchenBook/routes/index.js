const express = require('express')
const router = express.Router()

router.get('/', (req, res) =>
{
    console.log('Request for home recieved')
    res.render('index')
})

router.get('/index', (req, res) =>
{
    console.log('Request for home recieved')
    res.render('index')
})

router.get('/about', (req, res) =>
{
    console.log('Request for about page recieved')
    res.render('about')
})

router.get('/contact', (req, res) =>
{
    console.log('Request for contact page recieved')
    res.render('contact')
})

router.get('/blog-post', (req, res) =>
{
    console.log('Request for blog-post page recieved')
    res.render('blog-post')
})

router.get('/elements', (req, res) =>
{
    console.log('Request for blog-post page recieved')
    res.render('elements')
})

router.get('/recipe-post', (req, res) =>
{
    console.log('Request for blog-post page recieved')
    //this is where we process the data coming into the recipe-post page
    res.render('recipe-post')
})

module.exports = router