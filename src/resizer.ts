import * as Konva from 'konva';
import {Group, Layer, Shape, Stage, Vector2d} from "konva";

interface ResizerConfig {
    layoutWidth?: number,
    layoutHeight?: number,
    container: string
}

export class Resizer {
    readonly layoutWidth: number;
    readonly layoutHeight: number;
    readonly container: string;

    private stage: Stage;
    private layer: Layer;

    constructor(config: ResizerConfig) {
        this.layoutWidth = config['layoutWidth'] || 1280;
        this.layoutHeight = config['layoutHeight'] || 720;
        this.container = config['container'];

        this.create();
    }

    private create(): void {
        this.stage = new Konva.Stage({
            container: this.container,
            width: this.layoutWidth,
            height: this.layoutHeight
        });
        this.layer = new Konva.Layer();

        let rect = new Konva.Rect({
            width: this.layoutWidth,
            height: this.layoutHeight,
            stroke: 'black',
            strokeWidth: 1,
        });
        this.layer.add(rect);

        this.stage.add(this.layer);
    }

    private addAnchor(group: Group, x: number, y: number, name: string): void {
        let anchor = new Konva.Circle({
            x: x,
            y: y,
            stroke: '#000',
            strokeWidth: 1,
            radius: 5,
            name: name,
            draggable: true
        });

        anchor.on('dragmove', (e) => {
            let target: Shape = e.target;
            Resizer.update(target);
            this.layer.draw();
        });
        anchor.on('mousedown touchstart', (e) => {
            let target = e.target;
            group.draggable(false);
            target.moveToTop();
        });
        anchor.on('dragend', () => {
            group.draggable(true);
            this.layer.draw();
        });

        group.add(anchor);
    }

    public addImage(link: string): void {
        let file = new Konva.Image({
            image: new Image(),
        });
        let fileGroup = new Konva.Group({
            x: 0,
            y: 0,
            name: link,
            draggable: true,
            dragBoundFunc: (pos: Vector2d): Vector2d => {
                let newX: number, newY: number;
                if (pos.x < 0) {
                    newX = 0;
                } else if (pos.x > (this.layoutWidth - file.width())) {
                    newX = (this.layoutWidth - file.width());
                } else {
                    newX = pos.x;
                }

                if (pos.y < 0) {
                    newY = 0;
                } else if (pos.y > (this.layoutHeight - file.height())) {
                    newY = (this.layoutHeight - file.height());
                } else {
                    newY = pos.y;
                }

                return {
                    x: newX,
                    y: newY
                };
            }
        });
        this.layer.add(fileGroup);
        fileGroup.add(file);

        let imageObj: HTMLImageElement = new Image();
        imageObj.onload = () => {
            file.image(imageObj).width(imageObj.width).height(imageObj.height);

            this.addAnchor(fileGroup, 0, 0, 'topLeft');
            this.addAnchor(fileGroup, file.width(), 0, 'topRight');
            this.addAnchor(fileGroup, file.width(), file.height(), 'bottomRight');
            this.addAnchor(fileGroup, 0, file.height(), 'bottomLeft');

            this.layer.draw();
        };
        imageObj.src = link;

        file.on('mouseenter', () => {
            this.stage.container().style.cursor = 'move';
        });
        file.on('mouseleave', () => {
            this.stage.container().style.cursor = 'default';
        });
    }

    public addVideo(link: string): void {
        let video = document.createElement('video');
        video.src = link;

        let image = new Konva.Image({
            image: <any>video,
        });
        let fileGroup = new Konva.Group({
            x: 0,
            y: 0,
            name: link,
            draggable: true,
            dragBoundFunc: (pos: Vector2d): Vector2d => {
                let newX: number, newY: number;
                if (pos.x < 0) {
                    newX = 0;
                } else if (pos.x > (this.layoutWidth - image.width())) {
                    newX = (this.layoutWidth - image.width());
                } else {
                    newX = pos.x;
                }

                if (pos.y < 0) {
                    newY = 0;
                } else if (pos.y > (this.layoutHeight - image.height())) {
                    newY = (this.layoutHeight - image.height());
                } else {
                    newY = pos.y;
                }

                return {
                    x: newX,
                    y: newY
                };
            }
        });
        this.layer.add(fileGroup);
        fileGroup.add(image);

        let anim = new Konva.Animation(function () {
            // do nothing, animation just need to update the layer
        }, this.layer);

        video.addEventListener('loadedmetadata', () => {
            image.width(video.videoWidth);
            image.height(video.videoHeight);

            this.addAnchor(fileGroup, 0, 0, 'topLeft');
            this.addAnchor(fileGroup, video.videoWidth, 0, 'topRight');
            this.addAnchor(fileGroup, video.videoWidth, video.videoHeight, 'bottomRight');
            this.addAnchor(fileGroup, 0, video.videoHeight, 'bottomLeft');

            video.play();
            anim.start();
        });
    }

    public addFile(link: string): void {
        let fileExtension = link.match(/\.([^\.]+)$/)[1];
        if (fileExtension === 'mp4') {
            this.addVideo(link);
        } else {
            this.addImage(link);
        }
    }

    static update(activeAnchor: Shape): void {
        let group: Group = activeAnchor.getParent();

        let topLeft = group.find('.topLeft')[0],
            topRight = group.find('.topRight')[0],
            bottomRight = group.find('.bottomRight')[0],
            bottomLeft = group.find('.bottomLeft')[0],
            image = group.find('Image')[0];

        let anchorX = activeAnchor.x(),
            anchorY = activeAnchor.y();

        switch (activeAnchor.name()) {
            case 'topLeft':
                topRight.y(anchorY);
                bottomLeft.x(anchorX);
                break;
            case 'topRight':
                topLeft.y(anchorY);
                bottomRight.x(anchorX);
                break;
            case 'bottomRight':
                bottomLeft.y(anchorY);
                topRight.x(anchorX);
                break;
            case 'bottomLeft':
                bottomRight.y(anchorY);
                topLeft.x(anchorX);
                break;
        }

        image.position(topLeft.position());

        let width = topRight.x() - topLeft.x(),
            height = bottomLeft.y() - topLeft.y();
        if (width && height) {
            image.width(width);
            image.height(height);
        }
    }
}