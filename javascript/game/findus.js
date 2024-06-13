// const otherCheckbox = document.querySelector("#other");
// const otherText = document.querySelector("#otherValue");
// otherText.style.visibility = "hidden";
//
// otherCheckbox.addEventListener("change", () => {
//     if (otherCheckbox.checked) {
//         otherText.style.visibility = "visible";
//         otherText.value = "";
//     } else {
//         otherText.style.visibility = "hidden";
//     }
// });

function get(id) {
    return document.querySelector("#" + id);
}
const foodCheckbox = get("i-would-give-food-to-findus");
const creditCardCheckbox = get("oh-hell-yeah-lets-go");
const creditCardStealer = get("gimme-gimme-more-gimme-gimme-gimme-more");
const testPassed = get("good-person");
const testFailed = get("bad-person");

creditCardStealer.style.visibility = "hidden";
creditCardCheckbox.checked = false;

creditCardCheckbox.addEventListener("change", () => {
    if(creditCardCheckbox.checked) {
        creditCardStealer.style.visibility = "visible";
        creditCardStealer.value = "";
    } else {
        creditCardStealer.style.visibility = "hidden";
    }
});

function submitForm() {
    testFailed.open = false;
    testPassed.open = false;
    let passed = foodCheckbox.checked;
    let dialog = passed ? testPassed : testFailed;
    dialog.open = true;
}
