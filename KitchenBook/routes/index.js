const express = require('express');
const router = express.Router();
var title = "KitchenBook";

// set up tedious variables
var sqlNode = require('tedious');
var Connection = sqlNode.Connection;
var Request = sqlNode.Request;
title = "Recipe";

// define configurations for tedious
var config = {
    server: process.env.DB_SERVER,
    //If you're on Windows Azure, you will need this:
    options: {
        encrypt: true,
        rowCollectionOnDone: true,
        rowCollectionOnRequestCompletion: true,
        database: process.env.DB_DATABASENAME,
        // parseJSON: true //NOT using this because the results suck, placed json formatting in stored proc
        // port: "1433",
        // encrypt: true,
        // driver: "SQL Server Native Client 11.0"

        // If you're on Azure Data Warehouse, you will need this:
        //encrypt: true,
        //enableArithAbort: true,
        //connectionIsolationLevel: ISOLATION_LEVEL.READ_UNCOMMITTED
    },
    authentication: {
        type: "default",
        options: {
            userName: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        }
    },
    debug:
    {
        packet: true,
        data: true,
        payload: true,
        token: true,
        log: true
    }
}

router.get('/', function (req, res)
{
    title = "KitchenBook";
    res.render('index', { title });
})

router.get('/index', function (req, res)
{
    title = "KitchenBook";
    res.render('index', { title })
})

router.get('/elements', function (req, res)
{
    title = "KitchenBook";
    res.render('elements', { title })
})

router.get('/about', function (req, res)
{
    title = "About Us";
    res.render('about', { title })
})

router.get('/contact', function (req, res)
{
    title = "Contact Us";
    res.render('contact', { title })
})

router.get('/blog-post', function (req, res)
{
    title = "Blog";
    res.render('blog-post', { title })
})

router.get('/elements', function (req, res)
{
    title = "Elements";
    res.render('elements', { title })
})

// test scenerio for uploading photos
// You can also upload an array of photos instead of a single photo with this library. You will just need to use upload.array() in place of upload.single().
var multer = require('multer');
const path = require('path');
router.post('/upload', function (req, res)
{
    var fileName = "";
    var storage = multer.diskStorage({
        destination: './public/upload/media',
        filename: function (req, file, callback)
        {
            // format for a filename is: USERID_RECIPEID_STEPID_RECIPETITLE.MEDIAFILEEXTENTION (STEPID = 0 for Recipe image/video)
            fileName = "1_1_0_" + file.originalname;
            callback(null, fileName);
        }
    });

    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback)
        {
            var ext = path.extname(file.originalname);
            //accepted types .jpg, .jpeg, .png, .gif, .avi, .mpg, .mpeg, .mp4
            if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif' && ext !== '.avi' && ext !== '.mpg' && ext !== '.mpeg' && ext !== '.mp4')
            {
                return callback(res.end('Only images and videos are allowed'), null);
            }
            callback(null, true);
        }
    }).single('media');

    // an example of the information that is in req.file
    //{
    //    "fieldname": "photo",
    //    "originalname": "Szezhuan Eating.jpg",
    //    "encoding": "7bit",
    //    "mimetype": "image/jpeg",
    //    "destination": "C:\\Users\\USER\\source\\repos\\KitchenBook\\KitchenBook\\routes/uploads/media",
    //    "filename": "80b0ccc19096cfa794e6ecd55436fbe0",
    //    "path": "C:\\Users\\USER\\source\\repos\\KitchenBook\\KitchenBook\\routes\\uploads\\media\\80b0ccc19096cfa794e6ecd55436fbe0",
    //    "size": 355793
    //}

    // If another file with the same name is uploaded, then the originally file is replaced with the newest file.
    upload(req, res, function (err)
    {
        if (!err)
        {
            //res.end('File is uploaded')

            res.json(req.file);
            //console.log('file received');

            //const fileName = req.file.path;
            // ...save filename to database

            //return res.send({
              //  success: true
            //})
        }
        else
        {
            res.json(err);
            //const error = new Error('Please upload a file')
            //error.httpStatusCode = 400
            //return error;
        }
    });
});

router.get('/recipe-post', function (req, res)
{

    // create a connection to the server using the configuration options we defined above
    var connection = new Connection(config);

    // Keep incase debug is needed
    //connection.on('error', function (err)
    //{
    //    console.log(err);
    //});

    //connection.on('debug', function (debugMessage)
    //{
    //    console.log(debugMessage);
    //});

    connection.on('connect', function (err)
    {
        if (err)
        {
            console.log(err);
            next(err);
        } else
        {
            executeStatement();
        }
    });

    function executeStatement()
    {
        var TYPES = require('tedious').TYPES;
        var sqlStatement = 'sp_getRecipeById';

        var request = new Request(sqlStatement, function (err, rowCount, oneRecipe)
        {
            if (err)
            {
                console.log(err);
                next(err);
            } else
            {
                // the Request returns a 2D array. The JSon is located in recipe[0][0]
                // doesn't appear that config.options.parseJSON:true formats the way that is very usable.
                // Am having msSQL create the JSON in the stored proc. and then gathering in
                // and parsing it into usable JSON
                // {name that the webpage will use to access the object : value from the Request call
                res.render("recipe-post", { aRecipe: JSON.parse(oneRecipe[0][0].value), title });
            }
            connection.close();
        });
        request.addParameter('RecipeId', TYPES.Int, 1);

        connection.callProcedure(request);
    }
})

// Do we need this since app.js has code (that doesn't work)
//router.get('/error', function (err, req, res, next)
//{
//    title = "ERROR";
//    res.render('error', { title })
//})


module.exports = router