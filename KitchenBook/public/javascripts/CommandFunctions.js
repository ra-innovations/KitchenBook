//------------------------------------------------------------
//.. JSON data....
var strFunctionJSON =
    '{ "CommandFunctions" : ' +
    '[' +
    '{ "context":"0", "command":"start", "function":"onStartRecipe()"},' +
    '{ "context":"0", "command":"name", "function":"onAnnounceTitle()"},' +
    '{ "context":"0", "command":"title", "function":"onAnnounceTitle()"},' +
    '{ "context":"0", "command":"description", "function":"onAnnounceDescription()"},' +
    '{ "context":"0", "command":"ingredients", "function":"onListIngredients()"},' +
    '{ "context":"0", "command":"tools", "function":"onListToolsNeeded()"},' +
    '{ "context":"0", "command":"list steps", "function":"onListSteps()"},' +
    '{ "context":"0", "command":"add comment", "function":"onAddComment()"},' +
    '{ "context":"0", "command":"read comments", "function":"onReadComments()"},' +

    '{ "context":"1", "command":"start", "function":"onStartStep()"},' +
    '{ "context":"1", "command":"name", "function":"onAnnounceTitle()"},' +
    '{ "context":"1", "command":"title", "function":"onAnnounceTitle()"},' +
    '{ "context":"1", "command":"description", "function":"onAnnounceDescription()"},' +
    '{ "context":"1", "command":"pause", "function":"onPauseStep()"},' +
    '{ "context":"1", "command":"continue", "function":"onContinueStep()"},' +
    '{ "context":"1", "command":"stop", "function":"onStopStep()"},' +
    '{ "context":"1", "command":"skip step", "function":"onSkipStep()"},' +
    '{ "context":"1", "command":"ingredients", "function":"onListIngredients()"},' +
    '{ "context":"1", "command":"tools", "function":"onListTools()"},' +
    '{ "context":"1", "command":"add comment", "function":"onAddComment()"},' +
    '{ "context":"1", "command":"read comments", "function":"onReadComments()"},' +
    '{ "context":"1", "command":"restart step", "function":"onStartStep()"},' +

    '{ "context":"", "command":"substitute", "function":"onIngredientSubstitute()"},' +
    '{ "context":"", "command":"convert", "function":"onUnitConverstion()"},' +
    '{ "context":"", "command":"start timer", "function":"onStartTimer()"},' +
    '{ "context":"", "command":"cancel timer", "function":"onCancelTimer()"},' +
    '{ "context":"", "command":"end timer", "function":"onEndTimer()"},' +
    '{ "context":"", "command":"list timers", "function":"onListTimers()"},' +
    '{ "context":"", "command":"unknown", "function":"onUnknown()"},' +
    '{ "context":"", "command":"exit", "function":"onExitRecipe()"}' +
    ']' +
    '}';
//------------------------------------------------------------

function say(m) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[1];
    msg.voiceURI = "native";
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 1.0;
    msg.text = m;
    msg.lang = 'en-US';
    speechSynthesis.speak(msg);
}


//------------------------------------------------------------
function onStartRecipe()
{
    stopListening = false;

    say("lets start cooking! ");
    onAnnounceTitle();
    onAnnounceDescription();
    onListIngredients();
    onListToolsNeeded();

    onStartStep();
}

function onAnnounceTitle()
{
    say("Announcing Recipe Title");
}

function onAnnounceDescription()
{
    say("Announcing Recipe Description");
}

function onListIngredients()
{
    say("Lets go over the ingredients needed.");
}

function onListToolsNeeded()
{
    say("Let's go over the tools needed");
}

function onListSteps()
{
    say("Here are the steps involved");
}

function onReadComments()
{
    say("I will read user comments now");
}

function onAddComment()
{
    say("What are your comments?");
}

function onStartStep()
{
    stopListening = false;
    say("Step 1");

    //.. Launch checklists
    onListIngredients();
    onListToolsNeeded();

    //.. Launch step
}

function onStopStep()
{
    //.. Note where you were.  Just in case user decides to continue...

    //.. Confirm 

    //.. Turn off times

    say("Stopping the step. Do you want to end cooking this recipe?");
}

function onPauseStep()
{
    say("Paused!Say RESUME when ready to continue");
}

function onContinueStep()
{
    say("Resuming step 1");
}

function onSkipStep()
{
    say("skipping to next step");
}

function onIngredientSubstitute() {
    say("What ingredient would you like to substitute?");
}

function onExitRecipe()
{
    stopListening = true;
    say("Do you want to quit cooking this recipe?");
}


function onUnknown()
{
    say("Sorry! I did not understand your request!");
}
//------------------------------------------------------------
