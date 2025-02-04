"use strict";
const idLanguageVar = "page-language-variable";
const idDiagnosisName = "diagnosis-name";
const idLoadingText = "loading-text";
const idDiagnosisResultText = "diagnosis-result-text";
const idPrefixQuestionNumber = "quiz-question-nr-";
const idSuffixQuestionYouTrustEverythingOnTheInternet = "nah-scratch-that-this-stays-on";
const idPageLanguage = "page-language-variable";
var Section;
(function (Section) {
    Section["idSectionStartQuiz"] = "section-start-quiz";
    Section["idSectionQuiz"] = "section-doing-quiz";
    Section["idSectionComputing"] = "section-computing-results";
    Section["idSectionShowingResults"] = "section-showing-results";
})(Section || (Section = {}));
const soundTada = new Audio("../../resources/sounds/games/ai-doctor-diagnosis/tada.mp3");
soundTada.volume = 0.8;
let language = "enGB";
/**
 * Sets the `language` variable, used for retrieving illness names
 */
function getLanguage() {
    let element = document.getElementById(idLanguageVar);
    if (element == null) {
        // Default to english
        console.warn("Could not find language, using default value.");
        return;
    }
    language = element.innerHTML;
}
function ill(enGB, deDE) {
    let result = {
        "enGB": enGB,
        "deDE": deDE
    };
    return result;
}
const illnesses = [
    ill("Kidney Failure", "Nierenversagen"),
    ill("Meningitis", "Hirnhautentzündung"),
    ill("Heart Failure", "Herzversagen"),
    ill("Tollwut", "Rabies"),
    ill("Tuberculosis", "Tuberkulose"),
    ill("Lung Cancer", "Lungenkrebs"),
    ill("Paper Cut :( ouch ;-;", "Papierschnittwunde :( aua ;-;"),
    ill("Heart attack", "Herzinfarkt"),
    ill("Dementia", "Demenz"),
    ill("Brain Bleeding", "Hirnblutung"),
    ill("Liver Cirrhosis", "Leberzirrhose"),
    ill("Pneumonia", "Lungenentzündung"),
    ill("Ebola", "Ebola"),
    ill("Breast Cancer", "Brustkrebs"),
    ill("HIV", "HIV"),
    ill("Swine Flu", "Schweinegrippe"),
    ill("Parkinson's Disease", "Parkinson-Krankheit"),
    ill("Malaria", "Malaria"),
    ill("Leprosy", "Lepra")
];
const fatalIllnesses = {
    noSymptoms: ill("Death", "Tod"),
    allSymptoms: ill("100% Healthy", "100% Gesund")
};
function everyCheckbox() {
    let result = [];
    for (let i = 0; i < 1024; i++) {
        const id = idPrefixQuestionNumber + i.toString();
        let element = document.getElementById(id);
        if (element == undefined || element == null)
            break;
        result.push(element);
    }
    return result;
}
function getAccurateDiagnosisOneHundredPercentNotACompletelyRandomPickFromAList() {
    let symptomCount = 0;
    let checkboxCount = 0;
    let defaultIllness = ill("Mysterious Disease", "Mysteriöse Krankheit");
    // Count illness symptoms by checking the checkboxes:
    everyCheckbox().forEach((element) => {
        if (element.checked)
            symptomCount++;
        checkboxCount++; // could be done with `.length`, but im freaky
    });
    // Pick ~~a random~~ *the correct* disease:
    let illnessIndex = symptomCount % illnesses.length;
    let totallyAccurateDiagnosis = illnesses[illnessIndex];
    // Override for fatal situations (being healthy is counted as fatal, as it should be):
    switch (symptomCount) {
        case 0:
            totallyAccurateDiagnosis = fatalIllnesses.noSymptoms;
            break;
        case checkboxCount:
            totallyAccurateDiagnosis = fatalIllnesses.allSymptoms;
            break;
        default:
            break;
    }
    return totallyAccurateDiagnosis !== null && totallyAccurateDiagnosis !== void 0 ? totallyAccurateDiagnosis : defaultIllness;
}
/**
 * Hides all sections, except the specified one
 */
function showOnlySection(toShow) {
    Object.values(Section).forEach(section => {
        let visibility = "none";
        if (section === toShow)
            visibility = "initial";
        let element = document.getElementById(section);
        if (element == null) {
            console.warn("Could not find section with ID: '" + section + "'");
            return;
        }
        element.style.display = visibility;
    });
    // Ensure checkbox is always checked:
    checkSillyCheckbox();
}
function setDiagnosisText(text, emojiPrefix = "", emojiSuffix = "") {
    let element = document.getElementById(idDiagnosisResultText);
    if (element == null || element == undefined)
        return;
    // Wonderful stuff:
    if (emojiPrefix != "" || emojiSuffix != "") {
        if (emojiPrefix != "" && emojiSuffix == "")
            emojiSuffix = emojiPrefix;
        if (emojiPrefix == "" && emojiSuffix != "")
            emojiPrefix = emojiSuffix;
    }
    if (emojiPrefix != "")
        emojiPrefix = emojiPrefix + " ";
    if (emojiSuffix != "")
        emojiSuffix = " " + emojiSuffix;
    element.innerText = emojiPrefix + text + emojiSuffix;
}
/**
 * Gets called by `spinLoadingText()` after a short waiting time
 */
function switchToResults() {
    var _a;
    showOnlySection(Section.idSectionShowingResults);
    let result = document.getElementById(idDiagnosisResultText);
    if (result == null || result == undefined)
        return;
    result.classList.add("animated");
    result.classList.add("intensifies");
    const illness = getAccurateDiagnosisOneHundredPercentNotACompletelyRandomPickFromAList();
    const illnessName = (_a = illness[language]) !== null && _a !== void 0 ? _a : "???";
    setDiagnosisText(illnessName, "🎉", "🥳");
    soundTada.play();
}
/**
 * Activates visibility of `Section.idSectionShowingResults`
 */
function spinLoadingText() {
    let element = document.getElementById(idLoadingText);
    if (element != null) {
        element.classList.add("animated");
        element.classList.add("twister");
        setTimeout(switchToResults, 5500);
    }
    else {
        setTimeout(switchToResults, 2000);
    }
}
/**
 * Invoked via button -> Shows question
 */
function startQuiz() {
    // Remove checked boxes:
    everyCheckbox().forEach((element) => {
        element.checked = false;
    });
    showOnlySection(Section.idSectionQuiz);
}
/**
 * Invoked via button -> Shows computing "process"
 */
function submitQuiz() {
    showOnlySection(Section.idSectionComputing);
    spinLoadingText();
}
/**
 * Invoked via button -> Resets stuff and shows questions again
 */
function restartQuiz() {
    // TODO: clean questions
    startQuiz();
}
function getSillyCheckbox() {
    let id = idPrefixQuestionNumber + idSuffixQuestionYouTrustEverythingOnTheInternet;
    let result = document.getElementById(id);
    if (result == null || result == undefined)
        console.warn("Element by id '" + id + "' not found...");
    return result;
}
function checkSillyCheckbox() {
    let element = getSillyCheckbox();
    if (element == null || element == undefined)
        return;
    element.checked = true;
}
function sillyCheckbox() {
    let element = getSillyCheckbox();
    if (element == null || element == undefined)
        return;
    checkSillyCheckbox();
    element.addEventListener("change", () => {
        setTimeout(() => {
            element.checked = true;
        }, 100);
    });
}
window.onload = () => {
    getLanguage();
    sillyCheckbox();
};
