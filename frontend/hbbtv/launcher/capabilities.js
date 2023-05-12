function capabilitiesModule() {
    var conformancePointsMapping = {
        "urn:dvb:broadcast:ird:video:50_Hz_HEVC_HDTV_8-bit_IRD": "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.5",
        "urn:dvb:broadcast:ird:video:60_Hz_HEVC_HDTV_8-bit_IRD": "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.6",
        "urn:dvb:broadcast:ird:video:50_Hz_HEVC_HDTV_10-bit_IRD": "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.7",
        "urn:dvb:broadcast:ird:video:60_Hz_HEVC_HDTV_10-bit_IRD": "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.8",
        "urn:dvb:broadcast:ird:video:HEVC_UHDTV_IRD": "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.9",
        "urn:dvb:broadcast:ird:video:HEVC_HDR_UHDTV_IRD_using_HLG10": "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.10",
        "urn:dvb:broadcast:ird:video:HEVC_HDR_UHDTV_IRD_using_PQ10" : "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.11",
        "urn:dvb:broadcast:ird:video:HEVC_HDR_HFR_UHDTV_IRD_using_HLG10": "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.12",
        "urn:dvb:broadcast:ird:video:HEVC_HDR_HFR_UHDTV_IRD_using_PQ10" : "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.13",
        "urn:dvb:broadcast:ird:audio:AC-4_channel_based" : "urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.2.5",
        "urn:dvb:broadcast:bitstream:audio:AC-4_channel_based_immersive_personalized" : "urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.2.6",
        "urn:dvb:broadcast:bitstream:audio:MPEG-H" : "urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.2.7",
    };

    var defaultConformancePoints = [
        "urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.2.1",
        "urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.2.2",
        "urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.2.3",
        "urn:dvb:metadata:cs:AudioConformancePointsCS:2017:1.2.4",
        "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.1",
        "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.2",
        "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.3",
        "urn:dvb:metadata:cs:VideoConformancePointsCS:2017:1.1.4"
    ];

    var cloneConformancePoints = function() {
        var result = [];
        for (var i = 0; i < defaultConformancePoints.length; i++) {
            result[i] = defaultConformancePoints[i];
        }
        return result;
    };

    var getConformancePoints = function(capabilitiesId) {

        var oipfCapabilities = $("#" + capabilitiesId);
        var conformancePoints = cloneConformancePoints();
        var oipfCapabilitiesElem = oipfCapabilities[0];
        if (!oipfCapabilitiesElem || !oipfCapabilitiesElem.xmlCapabilities) {
            console.log("No capabilities found.");
            return conformancePoints;
        }

        var capabilities = oipfCapabilitiesElem.xmlCapabilities;
        $.ajax("/backend/capabilities", {
            method: "POST",
            headers: {
                'Content-Type': 'application/xml'
            },
            data: xmlSerializer.serializeToString(capabilities),
            success: () => console.info("Capabilities sent"),
            error: (_, status, err) => console.warn(`Capabilities cannot be sent (status=${status}, err=${err})`)
        })

        try {
            $(capabilities).find("broadcast").each(function(_i, b) {
                if (!b) {
                    return;
                }
                var conformancePoint = conformancePointsMapping[b.textContent];
                if (!!conformancePoint && conformancePoints.indexOf(conformancePoint) < 0) {
                    conformancePoints.push(conformancePoint);
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