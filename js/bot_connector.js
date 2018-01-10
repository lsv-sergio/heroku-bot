var builder = require("botbuilder");
var nameValidatorBuilder = require("./validators/namevalidator");
var ageValidatorBuilder = require("./validators/agevalidator");
var connector = new builder.ChatConnector();

var inMemory = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector, [
    function(session) {
        if (session.userData.profile) {
            session.send("%s said: %s", session.userData.profile.name, session.message.text);
            return; 
        }
        session.beginDialog("ensureProfile", session.userData.profile);
    },
    function(session, result) {
        var message = result.errorMessage;
        if (result.success) {
            var profile = session.userData.profile = result.response;
            message = `Hello ${profile.name} from ${profile.company}`;
        }
        session.send(message);
    }
]).set("storage", inMemory);


bot.dialog("ensureProfile", [
    function(session, args, next){
        session.dialogData.profile = args || {};
        if (session.dialogData.profile.name) {
            next();
            return;
        }
        session.send("Hello!");
        session.send("Please, answer on a few questsions");
        builder.Prompts.text(session, "What is your name?");
    },
    function(session, result, next) {
        var validateResult = validateResponse(nameValidatorBuilder.build(/^[a-z]+$/g), result.response);
        if (!validateResult.isValid) {
            session.endDialogWithResult({"success": false, "errorMessage": validateResult.errorMessage});
            return;
        }
        if (result.response) {
            updateProfileFromAnswer(session.dialogData.profile, "name", result.response);
        }
        if (session.dialogData.profile.age) {
            next();
            return;
        }
        builder.Prompts.number(session, "How old are you");
    },
    function(session, result, next) {
        var validateResult = validateResponse(ageValidatorBuilder.build(), result.response);
        if (!validateResult.isValid) {
            session.endDialogWithResult({"success": false, "errorMessage": validateResult.errorMessage});
            return;
        }
        if (result.response) {
            updateProfileFromAnswer(session.dialogData.profile, "age", result.response);
        }
        if (session.dialogData.profile.company) {
            next();
            return;
        }
        builder.Prompts.text(session, "What company do you work for?");
    },
    function(session, result, next) {
        if (result.response) {
            updateProfileFromAnswer(session.dialogData.profile, "company", result.response);
        }
        session.endDialogWithResult({"response": session.dialogData.profile, "success": true});
    }
]);

function updateProfileFromAnswer(profile, result, fieldName) {
    if (result && result.response)
    {
        if (validator && !validator.isValid(result.response))
        {
            return false;
        }
        profile[fieldName] = result.response;
    }
}

function validateResponse(validator, value) {
    return value && validator.validate(value);
}

exports.connector = connector;