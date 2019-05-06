import {Resizer} from "./resizer";

let fileResizer: Resizer;
const addBtn: HTMLElement = document.getElementById('button-add');
const startBtn: HTMLElement = document.getElementById('button-clear');
const inputField: HTMLElement = document.getElementById('input-addon');
const showTraceBtn: HTMLElement = document.getElementById('show-trace');
const loadTraceBtn: HTMLElement = document.getElementById('load-trace');
const loadTrace: HTMLElement = document.getElementById('load-trace-json');

let isJsonString = (str: string): boolean => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

fileResizer = new Resizer({
    layoutWidth: 1280,
    layoutHeight: 720,
    container: 'container'
});

startBtn.addEventListener("click", (e: MouseEvent) => {
    fileResizer.clear();
});

addBtn.addEventListener("click", (e: MouseEvent) => {
    fileResizer.addFile({
        link: (<HTMLInputElement>inputField).value
    })
});

showTraceBtn.addEventListener("click", (e: MouseEvent) => {
    let collapseWindow: HTMLElement = document.getElementById('collapseTrace'),
        spanWithText: NodeList = showTraceBtn.querySelectorAll('span');

    collapseWindow.classList.toggle("show");
    spanWithText.forEach((span: HTMLElement) => {
        span.classList.toggle("d-none");
    });

    collapseWindow.querySelector("#json").innerHTML = fileResizer.getJSONData()
});

loadTraceBtn.addEventListener("click", (e: MouseEvent) => {
    let collapseWindow: HTMLElement = document.getElementById('collapseLoadTrace'),
        spanWithText: NodeList = loadTraceBtn.querySelectorAll('span');

    collapseWindow.classList.toggle("show");
    spanWithText.forEach((span: HTMLElement) => {
        span.classList.toggle("d-none");
    });
});

loadTrace.addEventListener("click", (e: MouseEvent) => {
    let collapseWindow: HTMLElement = document.getElementById('collapseLoadTrace');
    let json = collapseWindow.querySelector('textarea').value;
    if (isJsonString(json)) {
        fileResizer.loadJSONData(json);
    } else {
        console.log('обработать ошибки');
    }
});