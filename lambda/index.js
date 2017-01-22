var http = require('http');
var userid;
var intent;
var session;
var accessToken;
var questions;

exports.handler = (event, context, callback) => {
    // TODO implement
    userid = event.session.user.userId;
    intent = event.request.intent;
    session = event.session;
    accessToken = event.session.user.accessToken;

    if(session.attributes.questions == null){
        http.get("https://trainbrain.me:8080/questions?access_token="+accessToken, function(res){
            body = "";
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                console.log(body);
                questions = JSON.parse(body);
                questionCallback(event, context, callback);
            });
        });
    }else{
        questionCallback(event, context, callback);
    }


};


function questionCallback(event, context, callback){
    if(event.session.user.accessToken == undefined){
        callback(null, {
            "version": "1.0",
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": " Please use the companion app to authenticate on Amazon to start using this skill"
                },
                "card": {
                    "type": "LinkAccount"
                },
                "shouldEndSession": false
            },
            "sessionAttributes": {}
        });
        return;
    }



    if(event.request.type === "LaunchRequest"){
        callback(null, build_res({
            "inQuest": false,
            "questions": null,
            "score": null,
            "numQuestions": null
        },
        "I will ask you "+questions.length+" questions. Answer as best as you can. Are you ready",
        "A Quiz", ""+questions.length+" quastion quiz started.", false));
    }else if(intent.name == "AMAZON.RepeatIntent"){
        callback(null, build_res(session.attributes, session.attributes.questions[0].text, null, null, false));
    }else{
        _continue = true;
        if((!session.attributes.inQuest) && intent_val(intent) === false){
            callback(null, build_res({}, "Bye!", null, null, true));
            _continue = false;
        }else if(!session.attributes.inQuest){
            session.attributes.questions = questions;
            session.attributes.numQuestions = session.attributes.questions.length;
            session.attributes.score = 0;
        }

        if(_continue){
            score = session.attributes.score;
            if(intent_val(intent) == session.attributes.questions[0].correctAnswer){
                score+=1;
            }
            questions = session.attributes.questions;
            oldQ = questions.splice(0, 1);
            if(questions.length>0){
                callback(null, build_res({
                    "inQuest": true,
                    "questions": questions,
                    "score": score,
                    "numQuestions":session.attributes.numQuestions
                }, questions[0].text, null, null, false));
            }else{
                callback(null, build_res({}, "You got "+score+" out of "+session.attributes.numQuestions+" correct!",
                "Quiz Finished", "You got "+score+" out of "+session.attributes.numQuestions+" correct!", true));
            }
        }
    }


}

function intent_val(intent){
    if(intent.name == "AnswerMultichoice"){
        return intent.slots.number.value;
    }else if (intent.name == "AnswerName"){
        return intent.slots.name.value;
    }else if (intent.name == "AnswerCity"){
        return intent.slots.city.value;
    }else if (intent.name == "AMAZON.YesIntent"){
        return true;
    }else if (intent.name == "AMAZON.NoIntent"){
        return false;
    }else if (intent.name == "DontKnow"){
        return null;
    }
}

function build_res(session_attributes, outText, cardTitle, cardContent, endSess){
    ret = {
            "version": "1.0",
            "sessionAttributes": session_attributes,
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": outText

                },
                "card": {
                    "type": "Simple",
                    "title": cardTitle,
                    "content": cardContent
                },
                "shouldEndSession": endSess
            }
        };

    if(cardTitle === null || cardContent === null){
        delete ret.response.card;
    }

    return ret;
}
