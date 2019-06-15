var express = require('express');
var router = express.Router();
var title = "KitchenBook";

// set up tedious variables
var sqlNode = require('tedious');
var Connection = sqlNode.Connection;
var Request = sqlNode.Request;
title = "Recipe";

var multer = require('multer');
const path = require('path');

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
router.post('/upload', function (req, res)
{
    var fileName = "";
    var storage = multer.diskStorage({
        destination: './public/upload/media',
        filename: function (req, file, callback)
        {
            // format for a filename is: USERID_RECIPEID_STEPNUMBER_RECIPETITLE(or file orig name).MEDIAFILEEXTENTION (STEPID = 0 for Recipe image/video)
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

router.post('/deleteMedia', function (req, res)
{
    // DEBUG
    var msg = { "message": "File deleted.", "errorCode": "0", "errorMessage": "" };
    res.json(msg);
    // comment everything else below so it doesn't run
    
    //req.body.media has the filename to delete
    var fileToDelete = req.body.media;
    var userId = req.body.userId;
    var recipeId = req.body.recipeId;
    var stepNumber = req.body.stepNumber;

    fileToDelete = path.join(appRoot, 'public/upload/media/' + fileToDelete);
    const fs = require('fs');

    // Delete file from the file system
    fs.unlink(fileToDelete, (err) =>
    {
        if (err)
        {
            // TODO send the issue back to the user
            console.log("delete issue");//throw err;
        }
        else
        {
            console.log('successfully deleted: ' + fileToDelete);

            // create a connection to the server using the configuration options we defined above
            var connection = new Connection(config);
            connection.on('connect', function (err)
            {
                if (err)
                {
                    console.log(err);
                    // TODO, send a pretty error back to the user.
                    //next(err);
                }
                else
                {
                    // Remove filename DB entries
                    //sp_deleteMediaFiles
                    //@fileName nvarchar(100), 
                    //@userId int,
                    //@recipeId int,
                    //@stepNumber int = 0
                    var TYPES = require('tedious').TYPES;
                    var sqlStatement = 'sp_deleteMediaFiles';
                    var msg = "";

                    var request = new Request(sqlStatement, function (err, rowCount, rows)
                    {
                        if (err)
                        {
                            console.log(err);
                            msg = err.message;
                        } else
                        {
                            if (req.xhr)
                            {
                                var msg = { "message": "File deleted.", "errorCode": "0", "errorMessage": "" };
                                res.json(msg);
                                console.log("ajax");
                            }
                            else
                            {
                                res.render("recipe-post", { msg: msg, title });
                                console.log("no ajax");
                            }
                        }
                        connection.close();
                    });

                    request.addParameter('fileName', TYPES.NVarChar, path.basename(fileToDelete));
                    request.addParameter('userId', TYPES.Int, userId);
                    request.addParameter('recipeId', TYPES.Int, recipeId);
                    request.addParameter('stepNumber', TYPES.Int, stepNumber);

                    connection.callProcedure(request);
                }
            });
        }
    });
});

router.post('/recipe-save', function (req, res)
{
    // create a connection to the server using the configuration options we defined above
    var connection = new Connection(config);

    // LOOK AT THE REQUEST BODY FIRST
    console.log(req.body);
    //res.send(req.body);
    // and even though we send something to the response,  the code below still gets processed.

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
            // TODO, send a pretty error back to the user.
            //next(err);
        } else
        {
            executeStatement();
        }
    });

    function executeStatement()
    {
        var TYPES = require('tedious').TYPES;
        var sqlStatement = 'sp_putRecipe';
        var msg = "";

        var request = new Request(sqlStatement, function (err, rowCount, RecipeId)
        {
            if (err)
            {
                console.log(err);
                // TODO, send a pretty error back to the user.
            } else
            {
                // {name that the webpage will use to access the object : a success statement if the 
                // returned RecipeId is not null and greater than 0
                if (RecipeId && RecipeId > 0)
                {
                    msg = { "message": "Your recipe has been posted.", "errorCode": "0", "errorMessage": "" };
                }
                else
                {
                    msg = { "message": "There was a problem posting your recipe.", "errorCode": "1", "errorMessage": err };
                }

                res.render("recipe-post", { msg: msg, title });
            }
            connection.close();
        });

        // build the arrays for Ingredients and Steps
        // The IngredientTableType needs this:
        //[RecipeId][int] NULL,
        //[Ingredient][nvarchar](1000) NULL
        // We'll insert a 0 for both IngredientId and RecipeId bc the entry in the DB hasn't been created yet
        // This is what a new recipe post ingredient list might look like.
        //"txtIngredient": [
        //    "1 cup unsalted butter, softened",
        //    "2 cups (370 grams) granulated sugar",
        //    "4 large eggs",
        //    "3 cups (300 grams) cake flour",
        //    "1 tablespoon (12 grams) baking powder",
        //    "1 cup milk",
        //    "2 teaspoons vanilla extract"
        //]
        // A row for aIngredients will look like this array: [0, 0, 'Brocolli'], and will be created dynamically
        var aIngredients = {
            columns: [
                { name: 'RecipeId', type: TYPES.Int },
                { name: 'Ingredient', type: TYPES.NVarChar, length: 1000 }
            ],
            rows: [
            ]
        };

        var ingredients = req.body.txtIngredient; // array of ingredients from /form-post
        for (var i = 0; i < ingredients.length;i++)
        {
            aIngredients['rows'].push([0, ingredients[i]]);
        }
        console.log("HERE");
        // populate aIngredients with the values from the form
        // loop through the req.body searching for all ids that start with 'txtIngredient' and then a number.
        // store all ingredients by req.body.txtIngredient#

        // The IngredientTableType needs this:
        //[StepNumber][int] NULL,
        //[RecipeId][int] NOT NULL,
        //[Title][nvarchar](50) NULL,
        //[Text][nvarchar](4000) NULL,
        //[VideoSnippetURL][nvarchar](1000) NULL,
        //[AudioSnippetURL][nvarchar](1000) NULL,
        //[ImageURL][nvarchar](1000) NULL,
        //[Duration][time](7) NULL,
        //[Tips][nvarchar](1000) NULL,
        //[DependentOnStepNumber][int] NULL,
        //[Timer][int] NULL
        // We'll insert a 0 for both StepId and RecipeId bc the entry in the DB hasn't been created
        // This is what a new recipe post step list might look like.
        //"txtStep": [
        //    "Preheat oven to 350°. Grease and flour 2 (9-inch) round cake pans. ",
        //    "In a large bowl, beat butter and sugar with a mixer at medium speed until fluffy, 3 to 4 minutes. Add eggs, one at a time, beating well after each addition.",
        //    "In a medium bowl, stir together dry ingredients. Gradually add flour mixture to butter mixture alternately with milk, beginning and ending with flour mixture, beating just until combined after each addition. Stir in vanilla.",
        //    "Pour batter into prepared pans (smoothing tops if necessary). Bake until a wooden pick inserted in center comes out clean, 28 to 30 minutes. Let cool in pans for 10 minutes. Remove from pans, and let cool completely on wire racks."
        //],
        // URLs will look like this: USERID_RECIPEID_STEPNUMBER_RECIPETITLE.MEDIAFILEEXTENTION
        // A row for aSteps will look like this: [0, 1, 0, '1-2-3-4 Cake', 'A delicious and very easy cake to bake', 
        //                                        '1_'], and will be created dynamically
        var aSteps = {
            columns: [
                { name: 'StepNumber', type: TYPES.Int },
                { name: 'RecipeId', type: TYPES.Int },
                { name: 'Title', type: TYPES.NVarChar, length: 50 },
                { name: 'Text', type: TYPES.NVarChar, length: 4000 },
                { name: 'VideoSnippetURL', type: TYPES.NVarChar, length: 1000 },
                { name: 'AudioSnippetURL', type: TYPES.NVarChar, length: 1000 },
                { name: 'ImageURL', type: TYPES.NVarChar, length: 1000 },
                { name: 'Duration', type: TYPES.DateTime2, length: 7 },
                { name: 'Tips', type: TYPES.NVarChar, length: 1000 },
                { name: 'DependentOnStepNumber', type: TYPES.Int },
                { name: 'Timer', type: TYPES.Int }
            ],
            rows: [
            ]
        };
        // TODO not finished.
        var steps = req.body.txtStep; // array of ingredients from /form-post
        for (var i = 0; i < ingredients.length; i++)
        {
            aSteps['rows'].push([i+1, 0, '', steps[i], '', '', '', '', '', 1, 1]);
        }

        request.addParameter('RecipeTitle', TYPES.NVarChar, req.body.txtTitle);
        request.addParameter('RecipeDescription', TYPES.NVarChar, req.body.txtDescription);
        request.addParameter('RecipeCuisine', TYPES.NVarChar, 'unknown');
        request.addParameter('RecipeTags', TYPES.NVarChar, req.body.txtTags);
        request.addParameter('RecipeSource', TYPES.NVarChar, req.body.txtSource);
        request.addParameter('RecipeAuthor', TYPES.NVarChar, req.body.txtAuthor);
        // we'll let the stored proc set the date
        //request.addParameter('RecipeDateAdded', TYPES.DateTime2, Date());
        request.addParameter('RecipeCookTime', TYPES.NVarChar, req.body.txtCookTime);
        request.addParameter('RecipePrepTime', TYPES.NVarChar, req.body.txtPrepTime);
        request.addParameter('RecipeYield', TYPES.TinyInt, req.body.txtYield);
        // TODO need to have this as a drop down on the front end and submits an ID for the LU table here.
        request.addParameter('RecipeSkillLevel', TYPES.TinyInt, 1);
        // TODO this value will be from a cookie bc the user will be logged in
        request.addParameter('UserUserID', TYPES.Int, 1);
        request.addParameter('RecipeYield', TYPES.TinyInt, req.body.txtYield);
        request.addParameter('IngredientType', TYPES.TVP, aIngredients);
        request.addParameter('StepType', TYPES.TVP, aSteps);

        connection.callProcedure(request);
    }
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
            // TODO, send a pretty error back to the user.
            //next(err);
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
                // {name that the webpage will use to access the object : value from the Request call}
                res.render("recipe-post", { aRecipe: JSON.parse(oneRecipe[0][0].value), title });
            }
            connection.close();
        });
        // TODO remove hard coding of 1st recipe
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