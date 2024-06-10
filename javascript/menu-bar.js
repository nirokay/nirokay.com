/*

    Logic for Index page
    ====================

    This script basically only handles the drop-down menu.

*/


const menuId = "";

function getMenu() {
    return document.getElementById(locationDropDownId);
}

function changeToLocationPage() {
    let element = getMenu();
    if(element.selectedIndex == 0) {
        return;
    }
    window.location.href = element.value;
}
