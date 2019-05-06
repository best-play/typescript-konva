import {Resizer} from "./resizer";

let fileResizer: Resizer;
const startBtn: HTMLElement = document.getElementById('button-addon');
const inputField: HTMLElement = document.getElementById('input-addon');

startBtn.addEventListener("click", (e: MouseEvent) => {
    fileResizer = new Resizer({
        layoutWidth: 1280,
        layoutHeight: 720,
        container: 'container'
    });
    fileResizer.addFile((<HTMLInputElement>inputField).value);
    // fileResizer.addImage('https://pbs.twimg.com/profile_images/665505233859174400/kA0u43JI_400x400.jpg')
    // fileResizer.addVideo('http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4')
});