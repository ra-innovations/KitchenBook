//------------------------------------------------------------
//.. Globals ??
//------------------------------------------------------------
var contextStack = [];
contextStack.push('Home');  //.. Initialize
var bSubCommand = false;
var commandRule = [];
var timerStack = [];  //... Do we need time + comment?
//------------------------------------------------------------

//------------------------------------------------------------
function getCommandRule(command, context = '-1')
{
    //.. First reset the commandRule array
    commandRule = [];  //.. or commandRule.length=0;

    if (context == '-1')  //.. If step number is default, get session step number
        context = sessionStorage["context"];
    if (context == undefined)
        context = '';

    $.each(JSONCommandFunctionObj.CommandRules.CommandRule, function (i, item)
    {
        /** Note: If specific context AND 'no-context' nodes exist, the first item pushed is the specific context node.
            So, always access the [0]th item from the commandRule array **/
        if (((item.Context == context) || (item.Context == "")) && (item.Command == command))
        {
            commandRule.push(item);
            return;
        }
    }
    );

    //.. Ensure that the 'unknown' object is pushed at the end, just in case there was no match
    if (commandRule.length == 0)
    {
        //... Needs to be fixed
        commandRule.push(JSONCommandFunctionObj.CommandRules.CommandRule[911]);  //... JR: Hard coded. Fix it
    }
}

//------------------------------------------------------------
/** Function that will go into a sub loop, where specific responses are required before any 
    other command can function.
    input - array of allowed commands
**/

function execSubCommand(strCommand = 'help', prompt = "Say Yes or NO", commands = ['yes', 'no', 'exit'])
{
    commands.forEach
        (
            function (item)
            {
                if (strCommand.includes(item))
                {
                    bSubCommand = false;
                    //.. do action;
                }
            }
        );
}

//------------------------------------------------------------
//..   Call backs for commands
//------------------------------------------------------------

function onRecipeHelp(stepNumber = -1)
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onStartRecipe()
{
    sessionStorage["context"] = "Home";

    say(commandRule[0].Prompt);

    onAnnounceTitle();
    onAnnounceDescription();
    onListIngredients();
    onListToolsNeeded();

    sessionStorage["stepNumber"] = 1;
    onStartStep();
}

//------------------------------------------------------------
function onAnnounceTitle(prompt = '', stepNumber = -1)
{
    var strTitle = JSONRecipeObj.Title;
    say(strTitle);
}

//------------------------------------------------------------
function onAnnounceDescription(prompt = '', stepNumber = -1)
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onListIngredients(bPrompt = true, stepNumber = -1)
{

    if (JSONRecipeObj.Ingredients.length > 0)
    {
        //..ToDo: Because we need verbal response for each ingredient,
        //..   we need to change the myRecognition.onResult callback
        //..   Then, restore the original callback
        //var origCallback = myRecognition.onresult;
        //myRecognition.onresult = processPromptedInteraction;

        //.. Push ingredients into an array
        var myIngredientsList = [];
        for (i = 0; i < JSONRecipeObj.Ingredients.length; i++)
        {
            var strIngredient = '';
            strIngredient = JSONRecipeObj.Ingredients[i].Ingredient.Ingredient;
            myIngredientsList.push(strIngredient);
        }

        if (bPrompt)
        {
            myIngredientsObj.setIngredients(myIngredientsList);
            myIngredientsObj.start().onComplete = function (result)
            {
                //..console.log(this.answers);
                say("End of Ingredients")
                postStatus("Ingredients Done!")
            };
        }
        else
        {
            myIngredientsList.forEach(function (item) { say(item); });
        }
    }
}

//------------------------------------------------------------
function onListToolsNeeded(prompt = '', stepNumber = -1)
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onListAllSteps(prompt = '', )
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onReadComments(prompt = '', stepNumber = -1)
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onAddComment(stepNumber = -1)
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onStepHelp(stepNumber = -1)
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onStartStep(stepNumber = -1)
{
    if (stepNumber == -1)
    {  //.. If step number is default, get session step number
        stepNumber = sessionStorage["stepNumber"];
    }

    if ((stepNumber == undefined) || (parseInt(stepNumber) < 0))
    {
        say("Sorry. Step is undefined")
    }
    else
    {
        say("Step " + stepNumber);

        //.. Set context
        sessionStorage["context"] = "RecipeStep";
        if (!contextStack.find("RecipeStep"))
            contextStack.push("RecipeStep");

        //.. Launch checklists

        //.. Launch step
    }
}

//------------------------------------------------------------
function onStopStep(prompt = '', )
{
    //.. Note where you were.  Just in case user decides to continue...

    //.. Confirm 

    //.. Turn off times

    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onPauseStep(prompt = '', )
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onContinueStep(prompt = '', )
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onSkipStep(prompt = '', )
{
    say(commandRule[0].Prompt);
    say();
}

//------------------------------------------------------------
function onIngredientSubstitute(prompt = '', )
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onStartTimer(timeInSeconds = 0) //.. Hard coded timer
{
    //if ( timeInSeconds <=0 && !contextStack.find("Timer"))
    //{
    //    contextStack.push("Timer")
    //    say("How long?")
    //}

    ////.. Push timer details item to a timer stack
    var speech = sessionStorage["speechString"];
    var arr = speech.split(' ');
    if (timeInSeconds <= 0)
    {
        //.. Make sure we check for both 'minute' && 'minutes'
        var iMinute = arr.indexOf('minute');
        var iMinutes = arr.indexOf('minutes');
        if ((iMinutes > 0) || (iMinute > 0))
        {
            var timeInMinutes = 0;

            if (iMinute > 0) //.. 'minute' was used and not 'minutes'
                timeInMinutes = parseFloat(arr[iMinute - 1]);
            else
                timeInMinutes = parseFloat(arr[iMinutes - 1]);

            timeInSeconds = timeInMinutes * 60;

            //.. Now get the timer comment
            var comment = '';
            var speechSplit;
            //.. Note: 'minute' vs 'minutes'
            if (iMinute > 0)
                speechSplit = speech.split('minute');
            else
                speechSplit = speech.split('minutes');
            if (speechSplit.length > 1)
                comment = speechSplit[1];
            timerStack.push([timeInSeconds, comment]);

            //.. Start timer
            var strTimerDetails = timeInMinutes + ' minutes ' + comment;
            window.setTimeout(timerCallback, timeInSeconds * 1000, strTimerDetails);  //.. Needs time in milliseconds && Passing the timerdetails as a parameter

            //.. Notify timer setting
            var strTimerText = 'Timer set for ' + strTimerDetails;
            postStatus(strTimerText);
            say(strTimerText);
        }
        else
        {
            //.. Ask for number of minutes / seconds
        }
    }
}

//------------------------------------------------------------
function onCancelTimer(id)
{
    //if (contextStack[contextStack.length-1] = "Timer")
    //{
    //    contextStack.pop();

    //    //.. Delete timer item from timer stack
    //}
}

function convertSecondsToMinsAndSecs(timeInSeconds)
{
    //.. Returns a text string after converting seconds to minutes & seconds
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = timeInSeconds % 60;
    var timeDetails = '';
    if (minutes > 0)
        timeDetails += minutes + ' minutes';
    if ((minutes > 0) && (seconds > 0))
        timeDetails += ' and '
    if (seconds > 0)
        timeDetails += seconds + 'seconds'

    return timeDetails;
}

//------------------------------------------------------------
function onListTimers()
{
    //.. List all timer items from timer stack
    if (timerStack.length > 1)
        say("There are " + timerStack.length + " timers set.")
    for (i = 0; i < timerStack.length; i++)
    {
        //.. Determine time in minutes and seconds
        var timerDetails = '';
        if (timerStack[i][0] > 0)
        {
            timerDetails = 'Timer ' + (i + 1) + ' set for ';

            timerDetails += convertSecondsToMinsAndSecs(timerStack[i][0]);
        }

        //.. Now attach the comment
        var timerComment = timerStack[i][1];
        if ((timerComment != undefined) && (timerComment != ''))
        {
            timerDetails += timerComment;
        }

        //.. Next, get amount of time remaining
        //... ToDo

        //.. Now, state the details.
        //.. Notify timer setting
        postStatus(timerDetails);
        say(timerDetails);
    }
}

//------------------------------------------------------------
function onExitRecipe(prompt = '', )
{
    //stopListening = true;
    //say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function onUnknown(prompt = '', )
{
    say(commandRule[0].Prompt);
}

//------------------------------------------------------------
function postStatus(msg)
{
    document.getElementById('lblStatus').innerHTML = msg;
}

//------------------------------------------------------------
function say(m)
{
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[0];
    //msg.voiceURI = "native";
    //msg.volume = 1;
    //msg.rate = 1;
    //msg.pitch = 1.0;
    msg.text = m;
    msg.lang = 'en-US';
    speechSynthesis.speak(msg);

    //.. Also display in status
    postStatus(m);
    //.. document.getElementById('lblStatus').innerHTML = m;

}

//------------------------------------------------------------
function timerCallback(strTimerDetails)
{
    //.. Process end of timer
    strTimerCompletedMsg = 'Timer for ' + strTimerDetails + ' Completed!'
    postStatus(strTimerCompletedMsg);
    say(strTimerCompletedMsg);
}
//------------------------------------------------------------
