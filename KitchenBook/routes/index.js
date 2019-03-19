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
    // set up tedious variables
    var sqlNode = require('tedious');
    var Connection = sqlNode.Connection;
    var Request = sqlNode.Request;

    // define configurations for tedious
    var config = {
        //: "127.0.0.1",
        server: "ra-innovations.database.windows.net",
        //If you're on Windows Azure, you will need this:
        options: {
            encrypt: true,
            database: "KitchenBook",
            rowCollectionOnDone: true,
            rowCollectionOnRequestCompletion: true
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
                //userName: "kb_dbo",
                //password: "password123"
                userName: "rajanth",
                password: "RA1nnovat1ons"
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
            } else
            {
                // the Request returns a 2D array. The JSon is located in recipe[0][0]
                // doesn't appear that config.options.parseJSON:true formats the way that is very usable.
                // Am having msSQL create the JSON in the stored proc. and then gathering in
                // and parsing it into usable JSON
                // {name that the webpage will use to access the object : value from the Request call
                res.render("recipe-post", { aRecipe: JSON.parse(oneRecipe[0][0].value) });
            }
            connection.close();
        });
        request.addParameter('RecipeId', TYPES.Int, 1);

        connection.callProcedure(request);
    }
})

module.exports = router