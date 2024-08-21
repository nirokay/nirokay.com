"use strict";
const menuId = "id-menu-bar";
function getMenu() {
    return document.getElementById(menuId);
}
function changeToSelectedPage() {
    let element = getMenu();
    if (element == null) {
        console.error("Could not find navigation menu by id " + menuId);
        return;
    }
    if (element.selectedIndex == 0) {
        return;
    }
    window.location.href = "/" + element.value;
}
