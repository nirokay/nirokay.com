/*

    Logic for Index page
    ====================

    This script basically only handles the drop-down menu.

*/


const menuId = "id-menu-bar";

function getMenu() {
    return document.getElementById(menuId);
}

function changeToLocationPage() {
    let element = getMenu();
    if(element.selectedIndex == 0) {
        return;
    }
    window.location.href = element.value;
}
