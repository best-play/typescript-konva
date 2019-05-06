import {Resizer} from "./resizer";

let fileResizer: Resizer,
    timer: number;
const addBtn: HTMLElement = document.getElementById('button-add');
const startBtn: HTMLElement = document.getElementById('button-clear');
const inputField: HTMLElement = document.getElementById('input-addon');
const showTraceBtn: HTMLElement = document.getElementById('show-trace');

fileResizer = new Resizer({
    layoutWidth: 1280,
    layoutHeight: 720,
    container: 'container'
});

startBtn.addEventListener("click", (e: MouseEvent) => {
    fileResizer.clear();
});

addBtn.addEventListener("click", (e: MouseEvent) => {
    fileResizer.addFile((<HTMLInputElement>inputField).value);
    // fileResizer.addImage('https://pbs.twimg.com/profile_images/665505233859174400/kA0u43JI_400x400.jpg')
    // fileResizer.addVideo('http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4')
});

showTraceBtn.addEventListener("click", (e: MouseEvent) => {
    let collapseWindow: HTMLElement = document.getElementById('collapseTrace'),
        spanWithText: NodeList = showTraceBtn.querySelectorAll('span');

    collapseWindow.classList.toggle("show");
    spanWithText.forEach((span: HTMLElement) => {
        span.classList.toggle("d-none");
    });

    collapseWindow.querySelector("#json").innerHTML = fileResizer.getJSONData()

    /*if (collapseWindow.classList.contains('show')) {
        timer = setInterval(() =>
            collapseWindow.querySelector("#json").innerHTML = fileResizer.getJSONData(), 500);
    } else {
        clearTimeout(timer);
    }*/
});