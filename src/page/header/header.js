import menuImg from "../../img/menu.svg";
import logoImg from "../../img/check.svg";
import { hideNav } from "../nav/nav.js";

export { createHeader as default };

function createHeader() {
    const header = document.createElement("header");
    header.id = "header";

    header.appendChild(createMenuIcon());
    header.appendChild(createLogo());

    return header;
}

function createMenuIcon() {
    const icon = new Image();
    icon.src = menuImg;
    icon.classList.add("menu-icon");

    icon.addEventListener("click", () => hideNav());

    return icon;
}

function createLogo() {
    const logoDiv = document.createElement("div");
    logoDiv.classList.add("logo");

    logoDiv.appendChild(createLogoIcon());
    logoDiv.appendChild(createLogoText());

    return logoDiv;
}

function createLogoIcon() {
    const icon = new Image();
    icon.src = logoImg;
    icon.classList.add("logo-icon");
    icon.classList.add("rotate-360");
    return icon;
}

function createLogoText() {
    const text = document.createElement("p");
    text.classList.add("logo-text");
    text.textContent = "TallyTask";
    return text;
}