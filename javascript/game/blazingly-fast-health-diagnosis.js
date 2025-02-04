"use strict";
const idLanguageVar = "page-language-variable";
const idDiagnosisName = "diagnosis-name";
const idLoadingText = "loading-text";
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
    ill("Heart Failure", "Herzversagen"),
    ill("Breast Cancer", "Brustkrebs"),
    ill("Skin Cancer", "Hautkrebs"),
    ill("Lung Cancer", "Lungenkrebs"),
    ill("Paper Cut :( ouch", "Papierschnittwunde :( aua")
];
const fatalIllnesses = {
    noSymptoms: ill("Death", "Tod"),
    allSymptoms: ill("100% Healthy", "100% Gesund")
};
function getAccurateDiagnosisOneHundredPercentNotACompletelyRandomPickFromAList() {
    let symptomCount = 0;
    let checkboxCount = 0;
    let defaultIllness = ill("Mysterious Disease", "Mysteriöse Krankheit");
    // Count illness symptoms by checking the checkboxes:
    for (let i = 0; i < 1024; i++) {
        const id = idPrefixQuestionNumber + i.toString();
        let element = document.getElementById(id);
        if (element == undefined || element == null)
            break;
        if (element.checked)
            symptomCount++;
        checkboxCount++;
    }
    // Pick ~~a random~~ *the correct* disease:
    let illnessIndex = checkboxCount % illnesses.length;
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
        console.log(section, toShow, section === toShow);
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
/**
 * Activates visibility of `Section.idSectionShowingResults`
 */
function spinLoadingText() {
    let element = document.getElementById(idLoadingText);
    /**
     * Gets waited on and displays results
     */
    function switchToResults() {
        showOnlySection(Section.idSectionShowingResults);
    }
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
        }, 200);
    });
}
window.onload = () => {
    getLanguage();
    sillyCheckbox();
};
