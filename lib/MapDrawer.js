const Canvas = require("canvas");

const Logger = require("./Logger");

const imgRobot = new Canvas.Image();
imgRobot.src = "data:image/png;base64,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";

const imgCharger = new Canvas.Image();
imgCharger.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA3lBMVEVHcEwzMzMzMzMzMzMzMzMzMzMzMzMzMzMvLy81NTUzMzMzMzMyMjIzMzMwMDAzMzMyMjIzMzM0NDQxMTF/f38zMzP///90dHRlZWV+fn44ODg+Pj5CQkIDd/5vb28Nevl6f4RzfowqgeVRUVFHe7h6enpZfKZra2s7fckYgfpqamotftw6Ojqs0v9jfZ1dfKFTfa0bffC82/8VfPRofZaQxP9QUFAffel1tP3x9//H4f8ujPljqv09lPn7/f+cyv8OfPtrfZNPnvpGmvokh/tbfKPZ6//n8v/k8P8zftXx8ykfAAAAFHRSTlMA6vn08eNGyAYYlpSDfxotmJUsL9z/XeQAAAG5SURBVDjLbVNpY4IwDEVFTs+tKYcionhfk3nO+5jb/v8fWlFoK1u+0JA2eUneEwRqiqTJqXQ6JZclRfhrhZII1ERNTYSVXAZg2DRrhlEzmzZAJveURZUBqh0L3e1tbHWqADKX5DULthmFkef6CFmmDdkifZ+FioFiGzif4ceoQLYQ1Zeh0qLxds/x7odWBeQHjhzY7H39fe5GR8OG/L2/DJg0jrrnUSM+m5AJgZagatH47Pi96saOVQWNIBChwxIs5/jyRr0+iIoggc0S+Js97s2oaw1BEjRo0h/e8QOvnTpLuABdkBlEa7DCOJiyOIEpCymosRGsMZ67DWLtx58apIQ0GHQEI4zxLQiC7TQqY0Cau9C94Id9HceIXaAlZs5mt9sdyIUznURYgoI8TYgtSZXRe50HWebaRMi94XWv/dSmBEMW95w93v4w3yaDehr1ZIMD13seNRklW5a/3V/ZKsiy9JBP3LoHh9WAn6OoJggzPXAFYsJwlKs7V5/GGeUYacfOkr0npKXEL0a0951TjC+k/UtCOH1rHHfQTwiH4Mhz0luE0ssnBaxqvHh19R99K5L+kL/Oy/8XPUNO3QXBtp4AAAAASUVORK5CYII=";

class MapDrawer {
    constructor(options) {
        this.settings = Object.assign({
            drawPath: true,
            drawCharger: true,
            drawRobot: true,
            scale: 4,
            rotate: 0
        }, options.settings);

        const defaultColors = {
            floor: "#0076ff",
            obstacle: "#333333",
            path: "#ffffff",
            segments: ["#19A1A1", "#7AC037", "#DF5618", "#F7C841"]
        };
        this.colors = Object.assign(defaultColors,
            options.settings.colors);

        this.fixedCharger = Object.assign({
            enabled: false,
            chargerMapPos: null,
            chargerCroppedPos: null,
            croppedSize: null
        }, options.settings.fixedCharger);

        this.colors.floor = this.hexToRgba(this.colors.floor);
        this.colors.obstacle = this.hexToRgba(this.colors.obstacle);
        this.colors.segments = this.colors.segments.map(this.hexToRgba);
    }

    translatePoints(pixels) {
        const arr = [];
        for (let i = 0; i < pixels.length; i += 2) {
            const x = pixels[i];
            const y = pixels[i + 1];

            if (x >= this.bounds.x1 && x <= this.bounds.x2 && y >= this.bounds.y1 && y <= this.bounds.y2) {
                arr.push(x - this.bounds.x1, y - this.bounds.y1);
            }
        }
        return arr;
    }

    updateMap(mapData) {
        const chargerLocation = mapData.entities.find(e => e.type === "charger_location")?.points.map(d => Math.floor(d / mapData.pixelSize));
        if (this.fixedCharger.enabled && this.fixedCharger.croppedSize !== null && this.fixedCharger.chargerMapPos !== null && this.fixedCharger.chargerCroppedPos !== null) {
            this.bounds = {
                x1: this.fixedCharger.chargerMapPos[0] - this.fixedCharger.chargerCroppedPos[0],
                x2: this.fixedCharger.chargerMapPos[0] - this.fixedCharger.chargerCroppedPos[0] + this.fixedCharger.croppedSize[0],
                y1: this.fixedCharger.chargerMapPos[1] - this.fixedCharger.chargerCroppedPos[1],
                y2: this.fixedCharger.chargerMapPos[1] - this.fixedCharger.chargerCroppedPos[1] + this.fixedCharger.croppedSize[1],
            };
        } else {
            this.bounds = {
                x1: Math.min(...mapData.layers.flatMap(layer => layer.dimensions.x.min)),
                x2: Math.max(...mapData.layers.flatMap(layer => layer.dimensions.x.max)),
                y1: Math.min(...mapData.layers.flatMap(layer => layer.dimensions.y.min)),
                y2: Math.max(...mapData.layers.flatMap(layer => layer.dimensions.y.max))
            };
        }

        this.mapData = {
            ...mapData,
            layers: mapData.layers.map(layer => ({...layer, pixels: this.translatePoints(layer.pixels)}))
        };

        // Compute initial fixed charger location and map size
        if (this.fixedCharger.enabled && (this.fixedCharger.croppedSize === null || this.fixedCharger.chargerMapPos === null || this.fixedCharger.chargerCroppedPos === null)) {
            this.fixedCharger.croppedSize = [this.bounds.x2 - this.bounds.x1, this.bounds.y2 - this.bounds.y1];
            this.fixedCharger.chargerMapPos = chargerLocation;
            this.fixedCharger.chargerCroppedPos = this.translatePoints(chargerLocation);
            Logger.info("Calculated parameters for fixedCharger, adjust as needed:");
            Logger.info("- chargerMapPos:", this.fixedCharger.chargerMapPos);
            Logger.info("- chargerCroppedPos:", this.fixedCharger.chargerCroppedPos);
            Logger.info("- croppedSize:", this.fixedCharger.croppedSize);
        }
    }

    hexToRgba(hex) {
        try {
            return {
                r: parseInt(hex.slice(1, 3), 16),
                g: parseInt(hex.slice(3, 5), 16),
                b: parseInt(hex.slice(5, 7), 16),
                a: hex.length >= 9 ? parseInt(hex.slice(7, 9), 16) : 255
            };
        } catch {
            Logger.error("Unable to parse hex color " + hex + "!");
            return {r: 0, g: 0, b: 0, a: 255};
        }
    }

    rotateImage(img, angle) {
        const c = Canvas.createCanvas(img.width, img.height);
        const ctx = c.getContext("2d");
        ctx.clearRect(0, 0, img.width, img.height);
        ctx.translate(img.width / 2, img.width / 2);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-img.width / 2, -img.width / 2);
        ctx.drawImage(img, 0, 0);
        return c;
    }

    draw(skipLayers) {
        if (!this.mapData || this.mapData.__class !== "ValetudoMap" || !this.mapData.metaData) {
            Logger.error("Unable to draw map: no or invalid map data!");
            return;
        }
        if (this.mapData.entities.find(e => e.type === "charger_location") === undefined) {
            Logger.warn("Map has no charger");
            return;
        }

        let drawLayer = (x, y, r, g, b, a) => {
            for (let yi = 0; yi < this.settings.scale; yi++) {
                const yDelta = (y * this.settings.scale + yi) * this.settings.scale * mapCanvas.width;
                for (let xi = 0; xi < this.settings.scale; xi++) {
                    const xDelta = x * this.settings.scale + xi;
                    const imgLayersOffset = (xDelta + yDelta) * 4;

                    imgLayers.data[imgLayersOffset] = r;
                    imgLayers.data[imgLayersOffset + 1] = g;
                    imgLayers.data[imgLayersOffset + 2] = b;
                    imgLayers.data[imgLayersOffset + 3] = a;
                }
            }
        };

        let drawLines = (points) => {
            let first = true;

            for (let i = 0; i < points.length; i += 2) {
                const [x, y] = ([points[i], points[i + 1]]);
                if (first) {
                    ctx.moveTo(x, y);
                    first = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
        };

        let pointsToCanvas = (coords) => coords.map(d => Math.floor(d / this.mapData.pixelSize));

        let canvasWidth, canvasHeight;
        if (!this.fixedCharger.enabled || this.fixedCharger.croppedSize === null) {
            canvasWidth = Math.max.apply(undefined, this.mapData.layers.flatMap(l => l.pixels.filter((_, index) => index % 2 === 0))) + 1;
            canvasHeight = Math.max.apply(undefined, this.mapData.layers.flatMap(l => l.pixels.filter((_, index) => index % 2 === 1))) + 1;
        } else {
            [canvasWidth, canvasHeight] = this.fixedCharger.croppedSize;
        }
        const mapCanvas = Canvas.createCanvas(canvasWidth * this.settings.scale, canvasHeight * this.settings.scale);
        let ctx = mapCanvas.getContext("2d");
        if (this.settings.rotate) {
            ctx.rotate(this.settings.rotate * Math.PI / 180);
        }
        ctx.scale(this.settings.scale, this.settings.scale);

        const imgLayers = ctx.createImageData(mapCanvas.width * this.settings.scale, mapCanvas.height * this.settings.scale);

        if ((!skipLayers || !this.lastLayers) && this.mapData.layers && this.mapData.layers.length) {
            this.mapData.layers.forEach(layer => {
                let color = {r: 0, g: 0, b: 0, a: 255};

                switch (layer.type) {
                    case "floor":
                        color = this.colors.floor;
                        break;
                    case "wall":
                        color = this.colors.obstacle;
                        break;
                    case "segment":
                        color = this.colors.segments[((layer.metaData.segmentId - 1) % this.colors.segments.length)];
                        break;
                }

                for (let i = 0; i < layer.pixels.length; i += 2) {
                    drawLayer(layer.pixels[i], layer.pixels[i + 1], color.r, color.g, color.b, color.a);
                }
            });
            this.lastLayers = imgLayers;
        }
        ctx.putImageData(this.lastLayers, 0, 0);

        const pathEntity = this.mapData.entities.find(e => e.type === "path");
        if (pathEntity) {
            const path = this.translatePoints(pointsToCanvas(pathEntity.points));
            ctx.beginPath();
            ctx.strokeStyle = this.colors.path;
            drawLines(path);
            ctx.stroke();
        }


        const predictedPathEntity = this.mapData.entities.find(e => e.type === "predicted_path");
        if (predictedPathEntity) {
            const predictedPath = this.translatePoints(pointsToCanvas(predictedPathEntity.points));
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            drawLines(predictedPath);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        const chargerLocationEntity = this.mapData.entities.find(e => e.type === "charger_location");
        if (chargerLocationEntity) {
            const chargerLocation = this.translatePoints(pointsToCanvas(chargerLocationEntity.points));
            ctx.drawImage(
                imgCharger,
                chargerLocation[0] - (imgCharger.height / this.settings.scale) / 2,
                chargerLocation[1] - (imgCharger.width / this.settings.scale) / 2,
                imgCharger.width / this.settings.scale,
                imgCharger.height / this.settings.scale
            );
        }


        const robotPositionEntity = this.mapData.entities.find(e => e.type === "robot_position");
        if (robotPositionEntity) {
            const robotPosition = this.translatePoints(pointsToCanvas(robotPositionEntity.points));
            ctx.drawImage(
                this.rotateImage(imgRobot, robotPositionEntity.metaData.angle),
                robotPosition[0] - (imgRobot.width / this.settings.scale) / 2,
                robotPosition[1] - (imgRobot.height / this.settings.scale) / 2,
                imgRobot.width / this.settings.scale,
                imgRobot.height / this.settings.scale
            );
        }


        const virtualWall = this.mapData.entities.find(e => e.type === "virtual_wall");
        if (virtualWall) {
            const virtualWallPath = this.translatePoints(pointsToCanvas(virtualWall.points));
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
            ctx.setLineDash([5, 5]);
            drawLines(virtualWallPath);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        const noGoZone = this.mapData.entities.find(e => e.type === "no_go_area");
        if (noGoZone) {
            const noGoZonePixels = this.translatePoints(pointsToCanvas(noGoZone.points));
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(noGoZonePixels[0], noGoZonePixels[1], noGoZonePixels[2] - noGoZonePixels[0], noGoZonePixels[5] - noGoZonePixels[1]);
        }

        return mapCanvas.toBuffer();
    }
}

module.exports = MapDrawer;
