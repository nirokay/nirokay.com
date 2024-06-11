const menuId = "id-menu-bar";

function getMenu() {
    return document.getElementById(menuId);
}

function changeToSelectedPage() {
    let element = getMenu();
    // if(element.selectedIndex == 0) { return; }
    window.location.href = element.value;
}
