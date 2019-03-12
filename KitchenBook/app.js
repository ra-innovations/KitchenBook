'use strict';
// SERVER SIDE CODE

var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//Morgan is a HTTP request logger middleware for node.js
var logger = require('morgan');
/*Multer is a node.js middleware for handling multipart/form-data, 
 * which is primarily used for uploading files. 
 * It is written on top of busboy for maximum efficiency.
 * NOTE: Multer will not process any form which is not multipart(multipart / form - data).
 */
//var multer = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// define routes
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//view engine processes ejs
app.set("view engine", "ejs");

//console.log shows in node terminal window and displays the path to the public folder
//console.log(path.join(__dirname, 'public/javascript'));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//assign a virtual path of '/js' for the 'public/javascript' folder on the server
app.use('/js', express.static(path.join(__dirname, 'public/javascripts')));
//assign a virtual path of '/img' for the 'public/images' folder on the server
app.use('/img', express.static(path.join(__dirname, 'public/images')));
//assign a virtual path of '/css' for the 'public/stylesheets' folder on the server
app.use('/css', express.static(path.join(__dirname, 'public/stylesheets')));

// use the defined routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next)
{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
    app.use(function (err, req, res, next)
    {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next)
{
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function ()
{
    debug('Express server listening on port ' + server.address().port);
});








// DB testing script
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    server: "127.0.0.1",
    //If you're on Windows Azure, you will need this:
    options: {
        encrypt: true,
        database: "KitchenBook",
        rowCollectionOnDone: true
        // port: "1433",
        //encrypt: true,
        // driver: "SQL Server Native Client 11.0"

        // If you're on Azure Data Warehouse, you will need this:
        //encrypt: true,
        //enableArithAbort: true,
        //connectionIsolationLevel: ISOLATION_LEVEL.READ_UNCOMMITTED

    },
    authentication: {
        type: "default",
        options: {
            userName: "kb_dbo",
            password: "password123"
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

var connection = new Connection(config);

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
    var sqlStatement = "SELECT TOP (1000) [RecipeId], [Title], [Description], [Cuisine], [Tags], [Source], [Author], [Comments] FROM [KitchenBook].[dbo].[Recipe]";
    var request = new Request(sqlStatement, function (err, rowCount)
    {
        if (err)
        {
            console.log(err);
        } else
        {
            console.log(rowCount + ' rows');
        }
        connection.close();
    });

    request.on('row', function ()
    {
        console.log('Got row.');
    });

    request.on('done', function (rowCount, more, rows)
    {
        console.log('done rows returned: ', rowCount);
    });

    request.on('doneProc', function (rowCount, more, rows)
    {
        console.log('doneProc rows returned: ', rowCount);
    });

    request.on('doneInProc', function (rowCount, more, rows)
    {
        console.log('doneInProc rows returned: ', rowCount);
    });

    request.on('row', function (columns)
    {
        columns.forEach(function (column)
        {
                if (column.value === null)
            {
                console.log('NULL');
            } else
            {
                console.log(column.value);
            }
        });
    });

    connection.execSql(request);
}