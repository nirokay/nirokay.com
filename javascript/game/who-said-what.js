"use strict";
// Questions:
const idThesisDivPrefix = "id-thesis-div-";
const idThesisButtonsDiv = "id-thesis-buttons-";
const idThesisQuotePrefix = "id-thesis-quote-";
const idThesisAuthorPrefix = "id-thesis-author-";
const idThesisButtonAfdPrefix = "id-thesis-button-afd-";
const idThesisButtonOtherPrefix = "id-thesis-button-other-";
// Score:
const idScoreAbsoluteLeft = "id-score-absolute-left";
const idScoreAbsoluteRight = "id-score-absolute-right";
const idScoreUniqueLeft = "id-score-unique-left";
const idScoreUniqueMiddle = "id-score-unique-middle";
const idScoreUniqueRight = "id-score-unique-right";
// Buttons:
const idButtonStartQuestions = "id-button-start";
const idButtonSkipQuestion = "id-button-skip";
const idButtonNextQuestion = "id-button-next";
const buttonIds = [idButtonStartQuestions, idButtonSkipQuestion, idButtonNextQuestion];
function displayOnlyButton(id) {
    buttonIds.forEach((id) => {
        let button = document.getElementById(id);
        if (button != null && button != undefined)
            button.style.display = "none";
    });
    let button = document.getElementById(id);
    if (button != null && button != undefined)
        button.style.display = "block";
}
let allQuestionsBuffer = [];
function isUnique(id) {
    return !allQuestionsBuffer.includes(id);
}
function addToQuestionBuffer(id) {
    if (isUnique(id))
        allQuestionsBuffer.push(id);
}
function increaseScore(id, correct) {
    function readAndIncrement(element) {
        if (element == null || element == undefined) {
            console.warn("Passed invalid element");
            return;
        }
        try {
            let rawOldValue = element.innerHTML;
            let newValue = parseInt(rawOldValue) + 1;
            element.innerHTML = newValue.toString();
        }
        catch (e) {
            console.error("Could not increment score for element", element, e);
            try {
                element.innerHTML = "0";
            }
            catch (e) {
                console.error("Could not reset score to 0", e);
            }
        }
    }
    let absoluteLeft = document.getElementById(idScoreAbsoluteLeft);
    let absoluteRight = document.getElementById(idScoreAbsoluteRight);
    if (correct)
        readAndIncrement(absoluteLeft);
    readAndIncrement(absoluteRight);
    let uniqueLeft = document.getElementById(idScoreUniqueLeft);
    let uniqueMiddle = document.getElementById(idScoreUniqueMiddle);
    let uniqueRight = document.getElementById(idScoreUniqueRight);
    if (isUnique(id)) {
        if (correct)
            readAndIncrement(uniqueLeft);
        readAndIncrement(uniqueMiddle);
    }
    if (uniqueRight != null && uniqueRight != undefined)
        uniqueRight.innerHTML = everyGameQuestionId().length.toString();
    addToQuestionBuffer(id);
}
let lastQuestionsBuffer = [];
function addToLastQuestionBuffer(id) {
    lastQuestionsBuffer.push(id);
    if (lastQuestionsBuffer.length > 5)
        lastQuestionsBuffer.shift();
}
function getQuestion(id) {
    return document.getElementById(idThesisDivPrefix + id.toString());
}
function getQuestionButtons(id) {
    return document.getElementById(idThesisButtonsDiv + id.toString());
}
function getQuestionAuthor(id) {
    return document.getElementById(idThesisAuthorPrefix + id.toString());
}
function everyGameQuestionId() {
    let result = [];
    for (let id = 0; id < 1024; id++) {
        let element = getQuestion(id);
        if (element == null || element == undefined)
            break;
        result.push(id);
    }
    return result;
}
function hideAllQuestions() {
    everyGameQuestionId().forEach(id => {
        let question = getQuestion(id);
        let author = getQuestionAuthor(id);
        let buttons = getQuestionButtons(id);
        if (question != null && question != undefined)
            question.style.display = "none";
        if (author != null && author != undefined)
            author.style.display = "none";
        if (buttons != null && buttons != undefined)
            buttons.style.display = "block";
        try {
            question === null || question === void 0 ? void 0 : question.classList.remove("thesis-wrong-answer");
            question === null || question === void 0 ? void 0 : question.classList.remove("thesis-correct-answer");
        }
        catch (e) {
            console.warn("Caught error whilst removing class", e);
        }
    });
}
function viewQuestionWithId(id) {
    hideAllQuestions();
    let element = getQuestion(id);
    if (element != null && element != undefined)
        element.style.display = "block";
}
function viewRandomQuestion() {
    let ids = everyGameQuestionId();
    let randomIndex = -1;
    let tries = 0;
    while (lastQuestionsBuffer.includes(randomIndex) || randomIndex == -1) {
        // Give up after 1024 tries without recent picks:
        if (tries >= 1024) {
            alert("Please refresh the website, something seems to be broken... ran function 'viewRandomQuestion()' over 1024 times...");
            break;
        }
        tries++;
        let random = Math.random();
        if (random === 1)
            random = 0.99999;
        randomIndex = Math.floor(random * ids.length) % ids.length;
    }
    let id = ids[randomIndex];
    viewQuestionWithId(id);
    addToLastQuestionBuffer(id);
}
function submitQuestion(id, correct) {
    let question = getQuestion(id);
    console.log(correct);
    if (question != null && question != undefined) {
        if (correct) {
            question.classList.remove("thesis-wrong-answer");
            question.classList.add("thesis-correct-answer");
        }
        else {
            question.classList.remove("thesis-correct-answer");
            question.classList.add("thesis-wrong-answer");
        }
    }
    else {
        alert("Fuck");
    }
    let buttons = getQuestionButtons(id);
    if (buttons != null && buttons != undefined)
        buttons.style.display = "none";
    let author = getQuestionAuthor(id);
    if (author != null && author != undefined) {
        author.style.display = "block";
    }
    else {
        console.warn("Could not display author", author);
    }
    increaseScore(id, correct);
    displayOnlyButton(idButtonNextQuestion);
}
function whoSaidWhatStart() {
    viewRandomQuestion();
    displayOnlyButton(idButtonSkipQuestion);
    let uniqueRight = document.getElementById(idScoreUniqueRight);
    if (uniqueRight != null && uniqueRight != undefined)
        uniqueRight.innerHTML = everyGameQuestionId().length.toString();
}
function whoSaidWhatSkip() {
    viewRandomQuestion();
    displayOnlyButton(idButtonSkipQuestion);
}
function whoSaidWhatNext() {
    viewRandomQuestion();
    displayOnlyButton(idButtonSkipQuestion);
}
document.onload = () => {
    displayOnlyButton(idButtonStartQuestions);
    hideAllQuestions();
};
