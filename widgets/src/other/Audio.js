(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../common/HTMLWidget"], factory);
    } else {
        root.Entity = factory(root.HTMLWidget);
    }
}(this, function (HTMLWidget) {
    function Audio() {
        HTMLWidget.call(this);
        this._class = "other_Audio";

        this._tag = "audio";

        this._source = [];
        this._sections = {};
    };
    Audio.prototype = Object.create(HTMLWidget.prototype);

    Audio.prototype.source = function (_) {
        if (!arguments.length) return this._source;
        this._source = _;
        return this;
    };

    Audio.prototype.section = function (label, offset, beatLength, beatCount) {
        if (!arguments.length) return this._sections;
        if (arguments.length === 1) return this._sections[label];
        this._sections[label] = {
            label: label,
            offset: offset,
            beatLength: beatLength,
            beatCount: beatCount,
            endOffset: offset + beatCount * beatLength
        };
        return this;
    };

    Audio.prototype.getType = function (fileExt) {
        switch(fileExt) {
            case "mp3":
                return "audio/mpeg; codecs='mp3'";
            case "ogg":
                return "audio/ogg; codecs='vorbis'";
        }
        return "";
    };


    Audio.prototype.enter = function (domNode, element) {
        var context = this;
        element.on("play", function (d) { context.onPlay(d); })
    };

    Audio.prototype.update = function (domNode, element) {
        var context = this;

        var source = element.selectAll("source").data(this._source, function (d) { return d; });
        source.enter().append("source")
            .attr("src", function (d) { return d; })
        ;
    }

    Audio.prototype.createTimer = function (params, startTime, beat) {
        var context = this;
        d3.timer(function () {
            context.onTick(params.label, beat, params);
            return true;
        }, beat * params.beatLength, startTime + params.offset);
    };

    Audio.prototype.onTick = function (label, beat, params) {
    };

    Audio.prototype.onPlay = function (d) {
        var startTime = Date.now();
        for (var key in this._sections) {
            var section = this._sections[key];
            for (var i = 0; i < section.beatCount; ++i) {
                this.createTimer(section, startTime, i);
            }
        }
    };

    Audio.prototype.play = function (d) {
        var context = this;
        this._element.on("canplaythrough", function (d) {
            context.node().play();
        })
        this.node().load();
    };

    return Audio;
}));
