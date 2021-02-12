const fs = require("fs");
const mqtt = require("mqtt");
const zlib = require("zlib");

const MapDrawer = require("./MapDrawer");

/**
 *
 * @param options {object}
 * @param options.brokerURL {string}
 * @param options.caPath {string}
 * @param options.identifier {string}
 * @param options.topicPrefix {string}
 * @param options.autoconfPrefix {string}
 * @param options.mapSettings {object}
 * @param options.mapDataTopic {string}
 * @param options.minMillisecondsBetweenMapUpdates {number}
 * @param options.publishMapImage {boolean}
 * @param options.events {EventEmitter}
 * @constructor
 */
const MqttClient = function (options) {
    this.brokerURL = options.brokerURL;
    this.caPath = options.caPath || "";
    this.identifier = options.identifier || "rockrobo";
    this.topicPrefix = options.topicPrefix || "valetudo";
    this.autoconfPrefix = options.autoconfPrefix || "homeassistant";
    this.mapSettings = options.mapSettings || {};
    this.mapDataTopic = options.mapDataTopic || "valetudo/rockrobo/map_data";
    this.minMillisecondsBetweenMapUpdates = options.minMillisecondsBetweenMapUpdates || 10000;
    this.publishMapImage = options.publishMapImage !== undefined ? options.publishMapImage : true;

    this.events = options.events;

    this.topics = {
        map: this.topicPrefix + "/" + this.identifier + "/map",
        homeassistant_autoconf_map: this.autoconfPrefix + "/camera/" + this.topicPrefix + "_" + this.identifier + "_map/config"
    };

    this.autoconf_payloads = {
        map: {
            name: this.identifier + " Map",
            unique_id: this.identifier + "_map",
            device: { name: this.identifier, identifiers: [this.identifier] },
            topic: this.topics.map
        }
    };

    this.lastMapDraw = new Date(0);

    this.mapDrawer = new MapDrawer({
        settings: this.mapSettings
    });

    this.parsedMap = {};
    this.lastParsedMapString = "";
    this.drawingMap = false;

    this.connect();

    setInterval(() => {
        if (this.drawingMap) {
            console.warn("Skipping map generation as it would be overrunning.");
            return;
        }
        if (!this.client || !this.client.connected) {
            return;
        }
        if (!this.parsedMap) {
            return;
        }
        if (JSON.stringify(this.parsedMap) == this.lastParsedMapString) {
            console.log("Skipping map generation as it has not changed.");
            return;
        }
        this.lastParsedMapString = JSON.stringify(this.parsedMap);
        this.drawingMap = true;
        console.log("Drawing map...");
        console.time("drawMap");
        this.mapDrawer.drawMap(this.parsedMap)
            .then(img => {
                console.timeEnd("drawMap");
                console.log("Map drawn.");
                if (this.publishMapImage) {
                    this.client.publish(this.topics.map, img, { retain: true });
                    console.log("Map published.");
                }

                this.events.emit("valetudo.rendered_map", {
                    parsedMapData: this.parsedMap,
                    mapImage: img
                })
            })
            .catch(console.error)
            .finally(() => { this.drawingMap = false; });
    }, this.minMillisecondsBetweenMapUpdates);
};

MqttClient.prototype.connect = function () {
    if (!this.client || (this.client && !this.client.connected && !this.client.reconnecting)) {
        const options = {};
        if (this.caPath) {
            options.ca = fs.readFileSync(this.caPath);
        }
        this.client = mqtt.connect(this.brokerURL, options);
        console.log("Connecting to MQTT broker...");

        this.client.on("connect", () => {
            console.log("Connected to MQTT broker.");

            this.client.subscribe([
                this.mapDataTopic
            ], err => {
                if (!err) {
                    this.client.publish(this.topics.homeassistant_autoconf_map, JSON.stringify(this.autoconf_payloads.map), {
                        retain: true
                    });

                } else {
                    console.error(err);
                }
            });
        });

        this.client
            .on("message", (_, message) => {
                try {
                    if (isBase64(message)) {
                        message = base64decode(message);
                    }
                    if (isCompressed(message)) {
                        message = zlib.inflateSync(message);
                    }
                    this.parsedMap = JSON.parse(message);
                } catch (e) {
                    console.error(e);
                }
            })
            .on("error", console.error);
    }
};

function base64decode(data) {
    return Buffer.from(data.toString('ascii'), 'base64');
}

function isBase64(data) {
    return Buffer.from(data.toString('ascii'), 'base64').toString('base64') == data;
}

function isCompressed(data) {
    return data[0x00] === 0x78;
}

module.exports = MqttClient;
