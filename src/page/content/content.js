export { createContent as default };

function createContent() {
    const content = document.createElement("div");
    content.id = "content";
    return content;
}