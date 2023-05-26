function capabilitiesModule() {
    var conformancePointsMapping = {
        "urn:dvb:broadcast:ird:video:HEVC_UHDTV_IRD": ["urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.9"],
        "urn:dvb:broadcast:ird:video:HEVC_HDR_UHDTV_IRD_using_HLG10": ["urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.9", "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.10"],
        "urn:dvb:broadcast:ird:video:HEVC_HDR_UHDTV_IRD_using_PQ10" : ["urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.9", "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.11"],
        "urn:dvb:broadcast:ird:video:HEVC_HDR_HFR_UHDTV_IRD_using_HLG10": ["urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.9", "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.10", "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.12"],
        "urn:dvb:broadcast:ird:video:HEVC_HDR_HFR_UHDTV_IRD_using_PQ10" : ["urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.9", "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.11", "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.13"],
        "urn:dvb:broadcast:ird:audio:AC-4_channel_based" : ["urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.1.5"],
        "urn:dvb:broadcast:ird:audio:AC-4_channel_based_immersive_personalized" : ["urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.1.5", "urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.1.6"],
        "urn:dvb:broadcast:bitstream:audio:MPEG-H" : ["urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.2.7"],
    };

    var xmlSerializer = new XMLSerializer();

    var getConformancePoints = function(capabilitiesId) {

        var oipfCapabilities = $("#" + capabilitiesId);
        var conformancePoints = [];
        var oipfCapabilitiesElem = oipfCapabilities[0];
        if (!oipfCapabilitiesElem || !oipfCapabilitiesElem.xmlCapabilities) {
            console.log("No capabilities found.");
            return conformancePoints;
        }

        var capabilities = oipfCapabilitiesElem.xmlCapabilities;
        $.ajax("/backend/capabilities", {
            method: "POST",
            headers: {
                'Content-Type': 'text/plain'
            },
            data: xmlSerializer.serializeToString(capabilities),
            success: function() { console.log("Capabilities sent") },
            error: function() { console.log("Capabilities cannot be sent") }
        });

        try {
            $(capabilities).find("broadcast").each(function(_i, b) {
                if (!b) {
                    return;
                }
                var conformancePointList = conformancePointsMapping[b.textContent];
                if (!conformancePointList) {
                    return;
                }
                for (var i in conformancePointList) {
                    var conformancePoint = conformancePointList[i];
                    if (!!conformancePoint && conformancePoints.indexOf(conformancePoint) < 0) {
                        conformancePoints.push(conformancePoint);
                    }
                }
            });
        } catch (e) {
            console.log(e.message);
        }
        console.log(JSON.stringify(conformancePoints));
        return conformancePoints;
    };

    return {
        getConformancePoints: getConformancePoints
    };
}

var capabilities = capabilitiesModule();