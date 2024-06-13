const menuId = "id-menu-bar";

function getMenu() {
    return document.getElementById(menuId);
}

function changeToSelectedPage() {
    let element = getMenu();
    window.location.href = "/" + element.value;
}
