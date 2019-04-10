//------------------------------------------------------------
//.. JSON data....
var strCommandFunctionJSON =
    `{
        "CommandRules":
            {
            "CommandRule":
            [
                {
                    "CommandTableId": 0,
                    "Context": "Home",
                    "Command": "help",
                    "Function": "onRecipeHelp",
                    "Prompt": "Recipe Help. You can say. Start. Stop. Name. OR. Description"
                }, {
                    "CommandTableId": 1,
                    "Context": "Home",
                    "Command": "start",
                    "Function": "onStartRecipe",
                    "Prompt": "Shall we start cooking?"
                }, {
                    "CommandTableId": 2,
                    "Context": "Home",
                    "Command": "name",
                    "Function": "onAnnounceTitle"
                    ,"Prompt":"Recipe Title"
                }, {
                    "CommandTableId": 3,
                    "Context": "Home",
                    "Command": "title",
                    "Function": "onAnnounceTitle"
                    ,"Prompt":"Recipe Title"
                }, {
                    "CommandTableId": 4,
                    "Context": "Home",
                    "Command": "description",
                    "Function": "onAnnounceDescription"
                    ,"Prompt":"Recipe Description"
                }, {
                    "CommandTableId": 5,
                    "Context": "Home",
                    "Command": "ingredients",
                    "Function": "onListIngredients"
                    ,"Prompt":"Lets go over the ingredients needed."
                }, {
                    "CommandTableId": 6,
                    "Context": "Home",
                    "Command": "tools",
                    "Function": "onListToolsNeeded"
                    ,"Prompt":"Let's go over the tools needed"
                }, {
                    "CommandTableId": 7,
                    "Context": "Home",
                    "Command": "list steps",
                    "Function": "onListAllSteps"
                    ,"Prompt":"Here are the steps involved"
                }, {
                    "CommandTableId": 8,
                    "Context": "Home",
                    "Command": "add comment",
                    "Function": "onAddComment"
                    ,"Prompt": "Please state your comment to add..."
                }, {
                    "CommandTableId": 9,
                    "Context": "Home",
                    "Command": "read comments",
                    "Function": "onReadComments"
                    ,"Prompt":"I will read user comments now"
                }, {
                    "CommandTableId": 110,
                    "Context": "RecipeStep",
                    "Command": "help",
                    "Function": "onStepHelp",
                    "Prompt": "Step Help. You can say. Start. Stop. Name. OR. Description"
                }, {
                    "CommandTableId": 10,
                    "Context": "RecipeStep",
                    "Command": "start",
                    "Function": "onStartRecipe"
                    ,"Prompt": "Starting Step " 
                }, {
                    "CommandTableId": 11,
                    "Context": "RecipeStep",
                    "Command": "name",
                    "Function": "onAnnounceTitle"
                    ,"Prompt": "step name"
                }, {
                    "CommandTableId": 12,
                    "Context": "RecipeStep",
                    "Command": "title",
                    "Function": "onAnnounceTitle"
                    ,"Prompt": "step name"
                }, {
                    "CommandTableId": 13,
                    "Context": "RecipeStep",
                    "Command": "description",
                    "Function": "onAnnounceDescription"
                    ,"Prompt": "Step description"
                }, {
                    "CommandTableId": 14,
                    "Context": "RecipeStep",
                    "Command": "pause",
                    "Function": "onPauseStep"
                    ,"Prompt":"Paused!Say RESUME when ready to continue"
                }, {
                    "CommandTableId": 15,
                    "Context": "RecipeStep",
                    "Command": "continue",
                    "Function": "onContinueStep"
                    ,"Prompt":"Resuming Step "  
                }, {
                    "CommandTableId": 16,
                    "Context": "RecipeStep",
                    "Command": "stop",
                    "Function": "onStopStep"
                    ,"Prompt": "stopping step " 
                }, {
                    "CommandTableId": 17,
                    "Context": "RecipeStep",
                    "Command": "skip step",
                    "Function": "onSkipStep"
                    ,"Prompt":"skipping to the next step, step " 
                }, {
                    "CommandTableId": 18,
                    "Context": "RecipeStep",
                    "Command": "ingredients",
                    "Function": "onListIngredients"
                    ,"Prompt":""
                }, {
                    "CommandTableId": 19,
                    "Context": "RecipeStep",
                    "Command": "tools",
                    "Function": "onListTools"
                    ,"Prompt":""
                }, {
                    "CommandTableId": 20,
                    "Context": "RecipeStep",
                    "Command": "add comment",
                    "Function": "onAddComment"
                    ,"Prompt": "State your step comment"
                }, {
                    "CommandTableId": 21,
                    "Context": "RecipeStep",
                    "Command": "read comments",
                    "Function": "onReadComments"
                    ,"Prompt": "Read step comments"
                }, {
                    "CommandTableId": 22,
                    "Context": "RecipeStep",
                    "Command": "restart step",
                    "Function": "onStartStep"
                    ,"Prompt": "Restarting step "
                }, {
                    "CommandTableId": 23,
                    "Context": "",
                    "Command": "substitute",
                    "Function": "onIngredientSubstitute"
                    ,"Prompt":"What ingredient would you like to substitute?"
                }, {
                    "CommandTableId": 24,
                    "Context": "",
                    "Command": "convert",
                    "Function": "onUnitConverstion"
                    ,"Prompt":""
                }, {
                    "CommandTableId": 25,
                    "Context": "",
                    "Command": "start timer",
                    "Function": "onStartTimer"
                    ,"Prompt":""
                }, {
                    "CommandTableId": 26,
                    "Context": "",
                    "Command": "cancel timer",
                    "Function": "onCancelTimer"
                    ,"Prompt":""
                }, {
                    "CommandTableId": 27,
                    "Context": "",
                    "Command": "end timer",
                    "Function": "onEndTimer"
                    ,"Prompt":""
                }, {
                    "CommandTableId": 28,
                    "Context": "",
                    "Command": "list timers",
                    "Function": "onListTimers"
                    ,"Prompt":""
                }, {
                    "CommandTableId": 29,
                    "Context": "",
                    "Command": "unknown",
                    "Function": "onUnknown"
                    ,"Prompt":"sorry! I did not understand your request! Please say it again! Or say help for commands"
                }, {
                    "CommandTableId": 911,
                    "Context": "",
                    "Command": "exit",
                    "Function": "onExitRecipe"
                    ,"Prompt":"Do you want to quit cooking this recipe?"
                }
            ]
        }
    }`;
//------------------------------------------------------------

strRecipeJSON = 
`{
    "RecipeID": 1,
    "Title": "Basic 1-2-3-4 Cake",
    "Description": "A delicious simple vanilla cake.",
    "Cuisine": "cake",
    "Tags": "vanilla, cake, simple, dessert",
    "Source": "bakefromscratch.com",
    "Author": "anonymous",
    "DateAdded": "03\/18\/2019",
    "CookTime": 75,
    "PrepTime": 15,
    "Yield": 12,
    "SkillLevel": "Newborn Cook",

    "Ingredients": [{
        "Ingredient": {
            "IngredientId": 1,
            "Ingredient": "1 cup unsalted butter, softened"
        }
    }, {
        "Ingredient": {
            "IngredientId": 2,
            "Ingredient": "2 cups (370 grams) granulated sugar"
        }
    }, {
        "Ingredient": {
            "IngredientId": 3,
            "Ingredient": "4 large eggs"
        }
    }, {
        "Ingredient": {
            "IngredientId": 4,
            "Ingredient": "3 cups (300 grams) cake flour"
        }
    }, {
        "Ingredient": {
            "IngredientId": 5,
            "Ingredient": "1 tablespoon (12 grams) baking powder"
        }
    }, {
        "Ingredient": {
            "IngredientId": 6,
            "Ingredient": "1 cup milk"
        }
    }, {
        "Ingredient": {
            "IngredientId": 7,
            "Ingredient": "2 teaspoons vanilla extract"
        }
    }],

        "Steps": [{
            "Step": {
                "StepId": 1,
                "StepNumber": 1,
                "Info": "Preheat oven to 350°. Grease and flour 2 (9-inch) round cake pans. "
            }
        }, {
            "Step": {
                "StepId": 2,
                "StepNumber": 2,
                "Info": "In a large bowl, beat butter and sugar with a mixer at medium speed until fluffy, 3 to 4 minutes. Add eggs, one at a time, beating well after each addition."
            }
        }, {
            "Step": {
                "StepId": 3,
                "StepNumber": 3,
                "Info": "In a medium bowl, stir together dry ingredients. Gradually add flour mixture to butter mixture alternately with milk, beginning and ending with flour mixture, beating just until combined after each addition. Stir in vanilla."
            }
        }, {
            "Step": {
                "StepId": 4,
                "StepNumber": 4,
                "Info": "Pour batter into prepared pans (smoothing tops if necessary). Bake until a wooden pick inserted in center comes out clean, 28 to 30 minutes. Let cool in pans for 10 minutes. Remove from pans, and let cool completely on wire racks."
            }
        }]
}`;

//------------------------------------------------------------

var JSONCommandFunctionObj = JSON.parse(strCommandFunctionJSON);
var JSONRecipeObj = JSON.parse(strRecipeJSON);

//var commandArray = [];

//for (item in JSONObj.CommandRules.CommandRule)
//{
//    commandArray.push(JSONObj.CommandRules.CommandRule[item].Function)
//}
//------------------------------------------------------------
