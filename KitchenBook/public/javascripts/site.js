// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

//------------------------------------------------------------
//globals
//------------------------------------------------------------
var triggerWord = 'hello';
sessionStorage["context"] = 'Home';
sessionStorage["stepNumber"] = 0;
sessionStorage["speechString"] = '';
myRecognition = null;
//------------------------------------------------------------
function onPressButton()
{

    say("Hi. Welcome! ");

    var strTextFromSpeech = document.getElementById("textFromSpeech").value;
    //    if (strTextFromSpeech != '')
    {
        strTextFromSpeech = strTextFromSpeech.toLowerCase();
        doCommand(strTextFromSpeech);
    }
}

//.. Execute given command
function doCommand(strSpeech)
{
    sessionStorage["speechString"] = strSpeech;
    var strCommand = "";
    var strContext = sessionStorage["context"];
    var strcont = contextStack[contextStack.length - 1];

    //.. IMPORTANT: strings in the .include call MUST be lowercase
    //..         NOTE: strSpeech is ALWAYS lowercase
    //..         NOTE: process 'start timer' before 'start'; 'stop ***' before 'stop'

    if (strSpeech.includes("start timer") || strSpeech.includes("set timer"))
    {
        strCommand = 'start timer'
    }
    else if (strSpeech.includes("cancel timer") || strSpeech.includes("stop timer"))
    {
        strCommand = 'cancel timer'
    }
    else if (strSpeech.includes("list timer") || strSpeech.includes("list all timer") || strSpeech.includes("timers"))
    {
        strCommand = 'list timers'
    }
    else if ((strSpeech.includes("title")) || (strSpeech.includes("name")))
    {
        strCommand = 'title';
    }
    else if (strSpeech.includes("description"))
    {
        strCommand = 'description';
    }
    else if (strSpeech.includes("start"))
    {
        strCommand = 'start';
    }
    else if (strSpeech.includes("stop"))
    {
        strCommand = 'stop';
    }
    else if (strSpeech.includes("ingredients"))
    {
        strCommand = 'ingredients';
    }
    else if (strSpeech.includes("pause"))
    {
        strCommand = 'pause';
    }
    else if (strSpeech.includes("skip step"))
    {
        strCommand = 'skip step';
    }
    else if (strSpeech.includes("exit"))
    {
    }
    else if (strSpeech.includes("help"))
    {
        strCommand = 'help';
    }
    else
    {
        strCommand = 'unknown';
    }

    //.. Create string of function and parameters
    //.. First, get the command record
    getCommandRule(strCommand);
    var commandFunction = commandRule[0].Function;

    //.. Next, append parameters if any
    commandFunction += '('

    //.. Add parameters here, if any

    //.. Close paranthesis
    commandFunction += ')'

    //.. Now, execute the function
    eval(commandFunction);

}

//.. Speech parser
function parseSpeech(speech)
{
    if (true) //..(_currentcontext = 'Recipe')
    {
        var arr = speech.split(triggerWord);

        if (arr.length = 2)   //Note if less than 2, there was no triggerword. If greater than 2, multiple triggerwords detected
        {
            $('#textFromSpeech').empty();
            $('#textFromSpeech').val(arr[1] + " - Parsed");
        }
        else
        {
            $('#textFromSpeech').empty();
            $('#textFromSpeech').val("You didn't say the keyword!");
        }
    }

    doCommand(arr[1]);
    //..doTestCommand(arr[1]);
}

function processCommand(event)
{
    //.. Retrieve speech string
    var speechToText = event.results[0][0].transcript;

    if (speechToText.includes(triggerWord))
    {
        parseSpeech(speechToText);
    }
    else
    {
        //.. This is speech without keyword invocation
        $('#textFromSpeech').val(speechToText + " - Giberish");
    }
}

function endListening()
{
    //console.log('Speech recognition service disconnected');
    if (!stopListening)
        myRecognition.start();
    else
        $('#textFromSpeech').val('Exited');
}
//..........................................................................
//.. Setup Speech Recognition
//..........................................................................
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
if (('SpeechRecognition' in window))
{
    // speech recognition API supported
    //.. const 
    myRecognition = new window.SpeechRecognition();
    myRecognition.continuous = false;
    myRecognition.interimResults = false;
    var stopListening = false;  //.. Flag recognizes 'exit' request

    myRecognition.onresult = processCommand;

    //.. onend function. determine if needed to start listening again.
    myRecognition.onend = function ()
    {
        //console.log('Speech recognition service disconnected');
        if (!stopListening)
            myRecognition.start();
        else
            $('#textFromSpeech').val('Exited');
    }

    myRecognition.start();
}
else
{
    // speech recognition API not supported
    //alert('not');
    $('#textFromSpeech').val('Aw. Looks like your browser does not support Web Speech API.  Update browser or try a different browser.');
}
