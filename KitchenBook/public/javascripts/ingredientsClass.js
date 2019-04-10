class Ingredients
{
    constructor(bPrompt)
    {
        this.ingredients = [];
        this.currentIndex = 0;
        this.origRecognitionOnresult = null;
        this.bPrompt = bPrompt;
    }

    setIngredients(myIngredientsList)
    {
        this.ingredients = myIngredientsList;
        this.MAX = this.ingredients.length - 1;

        // answers hash
        this.answers = myIngredientsList.reduce((hash, q) =>
        {
            hash[q] = '';
            return hash;
        }, {});

        this.initSpeech();
    }

    addIngredient(strIngredient)
    {
        this.ingredients.push(strIngredient);
        this.MAX = this.ingredients.length - 1;
    }

    initSpeech()
    {
        //const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        this.speechSynthesis = window.speechSynthesis;

        //this.recognition = new webkitSpeechRecognition();

        //this.recognition.continuous = true;
        //this.recognition.interimResults = false;

        //this.recognition.onresult = this.recognize.bind(this);

        //.. ---------------------------------------------------------
        this.origRecognitionOnresult = myRecognition.onresult;
        myRecognition.continuous = true;

        myRecognition.onresult = this.recognize.bind(this);
    }

    recognize(event)
    {
        const last = event.results.length - 1;
        const result = event.results[last][0].transcript;

        if (result.includes('yes') || result.includes('ok') )
        {
            this.setAnswer('Yes');
            this.next();
        }
        else if (result.includes('no'))
        {
            this.setAnswer('No');
            this.next();
        }
        else if (result.includes('skip'))
        {
            this.say('Ingredient skipped');
            this.next();
        }
        else
        {
            // ask same question again
            this.say('Can\'t recognize your answer');
            this.ask();
        }
    }

    setAnswer(answer)
    {
        this.answers[this.ingredients[this.currentIndex]] = answer;
    }

    start()
    {
        //this.recognition.start();

        this.ask();

        return this;
    }

    stop()
    {
        //this.recognition.stop();

        //.. Restore the original onresult() callback
        myRecognition.onresult = this.origRecognitionOnresult;

        this.onComplete && this.onComplete(this.answers);
    }

    ask()
    {
        var questionToAsk = this.ingredients[this.currentIndex];
        this.say(questionToAsk);
        postStatus(questionToAsk + '-  Please say YES / NO?');
    }
    say(msg)
    {
        const synth = new SpeechSynthesisUtterance(msg);
        this.speechSynthesis.speak(synth);
    }

    next()
    {
        if (this.currentIndex < this.MAX)
        {
            this.currentIndex++;
            this.ask();
        } else
        {
            this.stop();
        }
    }

    getAnswers()
    {
        return this.answers;
    }

    static create(questions)
    {
        return new Questions(questions);
    }
}

//.. Initiate a const instance
const myIngredientsObj = new Ingredients();
