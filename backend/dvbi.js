const sourceTypes = {
    "urn:dvb:metadata:source:dvb-dash": "DVB-DASH",
    "urn:dvb:metadata:source:dvb-t":"DVB-T" ,
    "urn:dvb:metadata:source:dvb-s":"DVB-S" ,
    "urn:dvb:metadata:source:dvb-c":"DVB-C" ,
    "urn:dvb:metadata:source:dvb-iptv":"DVB-IPTV" ,
    "urn:dvb:metadata:source:application":"Application"
};

const polarizationTypes = {
    "horizontal": "Horizontal",
    "vertical":"Vertical" ,
    "left circular":"Left circular",
    "right circular":"Right circular"
};

function createTextInput(inputId, label) {
    var inputDiv = document.createElement('div');
    inputDiv.classList.add("form-group","row","mb-1");
    var inputLabel = document.createElement('label');
    inputLabel.classList.add("col-6","col-form-label","col-form-label-sm","my-auto");  
    inputLabel.htmlFor = inputId;
    inputLabel.appendChild(document.createTextNode(label));
    inputDiv.appendChild(inputLabel);
    var inputElement = document.createElement('input');
    inputElement.classList.add("form-control-sm","col-5","my-auto");
    inputElement.type="text";
    inputElement.name=inputId;
    inputElement.id=inputId;
    inputDiv.appendChild(inputElement);
    return inputDiv;

}

function addServiceInstance(serviceId,instanceElement) {
    var service=document.getElementById('service_'+serviceId);
    var instanceId=parseInt(document.getElementById("service_"+serviceId+"_instances").value);
    document.getElementById("service_"+serviceId+"_instances").value = (instanceId+1);
    var instanceDiv=document.createElement('div');
    instanceDiv.id = "instance_"+serviceId+"_"+instanceId;
    instanceDiv.classList.add("serviceinstance");
    instanceDiv.classList.add("service_"+serviceId+"_instance");
    instanceDiv.appendChild(createTextInput("instance_"+serviceId+"_"+instanceId+"_priority","Priority"));
    instanceDiv.appendChild(createTextInput("instance_"+serviceId+"_"+instanceId+"_displayname","Display Name (r4)"));
    instanceDiv.appendChild(createTextInput("instance_"+serviceId+"_"+instanceId+"_media_presentation_app","Application controlling media presentation"));
    instanceDiv.appendChild(createTextInput("instance_"+serviceId+"_"+instanceId+"_parallel_app","Application with media in parallel"));
    var inputDiv = document.createElement('div');
    inputDiv.classList.add("form-group","mb-1","row"); 
    var inputLabel = document.createElement('label');
    inputLabel.classList.add("col-6","col-form-label","col-form-label-sm","my-auto");
    inputLabel.appendChild(document.createTextNode("Source Type"));  
    inputDiv.appendChild(inputLabel);

    newTextbox = document.createElement('select');
    newTextbox.classList.add("form-control","form-control-sm","col-5","my-auto");
    newTextbox.onchange = function() {changeSourceType(instanceDiv.id);};
    newTextbox.name="instance_"+serviceId+"_"+instanceId+"_source_type";
    newTextbox.id="instance_"+serviceId+"_"+instanceId+"_source_type";
    
    for (var sourceType in sourceTypes) {
        var option = document.createElement("option");
        option.value = sourceType;
        option.text = sourceTypes[sourceType];
        newTextbox.appendChild(option);
    }

    inputDiv.appendChild(newTextbox);
    instanceDiv.appendChild(inputDiv);
    var params =  document.createElement('div');
    params.classList.add("deliveryparameters");
    params.id="instance_"+serviceId+"_"+instanceId+"_deliveryparameters";
    instanceDiv.appendChild(params);

    newTextbox = document.createElement('a');
    newTextbox.href="javascript:removeElement('instance_"+serviceId+"_"+instanceId+"')";
    newTextbox.classList.add("btn","btn-outline-blue","btn-sm","mr-1","mt-2");
    newTextbox.appendChild(document.createTextNode("Remove instance"));
    instanceDiv.appendChild(newTextbox);
    
    service.appendChild(instanceDiv);

    if(instanceElement != null) {
        document.getElementById("instance_"+serviceId+"_"+instanceId+"_priority").value = instanceElement.getAttribute("priority");
        var children = instanceElement.childNodes;
        for (var i = 0; i < children.length ;i++) {
            if(children[i].nodeName === "SourceType") {
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_source_type").value = children[i].childNodes[0].nodeValue;
                changeSourceType(instanceDiv.id);
            }
            else if(children[i].nodeName === "DisplayName") {
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_displayname").value = children[i].childNodes[0].nodeValue;
            }
            else if(children[i].nodeName === "DASHDeliveryParameters") {
                changeSourceType(instanceDiv.id,"urn:dvb:metadata:source:dvb-dash");
                try { document.getElementById("instance_"+serviceId+"_"+instanceId+"_dash_uri").value = children[i].getElementsByTagName("URI")[0].childNodes[0].nodeValue; } catch(e) {}
            }
            else if(children[i].nodeName === "DVBTDeliveryParameters") {
                changeSourceType(instanceDiv.id,"urn:dvb:metadata:source:dvb-t");
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_dvb_triplet").value = parseDvbTriplet(children[i].getElementsByTagName("DVBTriplet")[0]);
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_target_country").value = children[i].getElementsByTagName("TargetCountry")[0].childNodes[0].nodeValue;
            }
            else if(children[i].nodeName === "DVBCDeliveryParameters") {
                changeSourceType(instanceDiv.id,"urn:dvb:metadata:source:dvb-c");
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_dvb_triplet").value = parseDvbTriplet(children[i].getElementsByTagName("DVBTriplet")[0]);
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_target_country").value = children[i].getElementsByTagName("TargetCountry")[0].childNodes[0].nodeValue;
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_network_id").value = children[i].getElementsByTagName("NetworkID")[0].childNodes[0].nodeValue;
            }
            else if(children[i].nodeName === "DVBSDeliveryParameters") {
                hangeSourceType(instanceDiv.id,"urn:dvb:metadata:source:dvb-s");
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_dvb_triplet").value = parseDvbTriplet(children[i].getElementsByTagName("DVBTriplet")[0]);
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_frequency").value = parseFloat(children[i].getElementsByTagName("Frequency")[0].childNodes[0].nodeValue)/100000.0;
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_polarization").value = children[i].getElementsByTagName("Polarization")[0].childNodes[0].nodeValue;
                document.getElementById("instance_"+serviceId+"_"+instanceId+"_orbital_position").value = children[i].getElementsByTagName("OrbitalPosition")[0].childNodes[0].nodeValue;
            }
            else if(children[i].nodeName === "RelatedMaterial") {
                var howRelated = children[i].getElementsByTagName("tva:HowRelated");
                if(howRelated.length > 0) {
                    if(howRelated[0].getAttribute("href") == "urn:dvb:metadata:cs:LinkedApplicationCS:2019:1.2") {
                        document.getElementById("instance_"+serviceId+"_"+instanceId+"_media_presentation_app").value =  children[i].getElementsByTagName("tva:MediaLocator")[0].getElementsByTagName("tva:MediaUri")[0].childNodes[0].nodeValue;
                    }
                    if(howRelated[0].getAttribute("href") == "urn:dvb:metadata:cs:LinkedApplicationCS:2019:1.1") {
                        document.getElementById("instance_"+serviceId+"_"+instanceId+"_parallel_app").value =  children[i].getElementsByTagName("tva:MediaLocator")[0].getElementsByTagName("tva:MediaUri")[0].childNodes[0].nodeValue;
                    }
                }
            }
        }
    }
    else {
        changeSourceType(instanceDiv.id);
    }
}

function parseDvbTriplet(tripletElement) {
    var orgid = parseInt(tripletElement.getAttribute("origNetId")).toString(16);
    var tsid = parseInt(tripletElement.getAttribute("tsId")).toString(16);
    var sid = parseInt(tripletElement.getAttribute("serviceId")).toString(16);
    return orgid+"."+tsid+"."+sid;
}

function changeSourceType(serviceInstanceId,type) {
    if(!type) {
        type = document.getElementById(serviceInstanceId+"_source_type").value;
    }
    else {
        document.getElementById(serviceInstanceId+"_source_type").value = type;
    }
    var params = document.getElementById(serviceInstanceId+"_deliveryparameters");
    //Remove previous content
    while (params.firstChild) {
        params.firstChild.remove();
    }
    if(type == "urn:dvb:metadata:source:dvb-dash") {
        params.appendChild(createTextInput(serviceInstanceId+"_dash_uri","DASH manifest URI"));
    }
    else if(type == "urn:dvb:metadata:source:dvb-iptv") {
        //TODO
    }
    else if(type == "urn:dvb:metadata:source:application") {
        //TODO
    }
    else { //DVB-T, DVB-C or DVB-S
        params.appendChild(createTextInput(serviceInstanceId+"_dvb_triplet","DVB Triplet (onid.tsid.sid) using hex values"));
        if(type == "urn:dvb:metadata:source:dvb-s") {
            params.appendChild(createTextInput(serviceInstanceId+"_orbital_position","Orbital Position"));
            params.appendChild(createTextInput(serviceInstanceId+"_frequency","Frequency in GHz"));
            var inputDiv = document.createElement('div');
            inputDiv.classList.add("form-group","mb-1","row"); 
            var inputLabel = document.createElement('label');
            inputLabel.classList.add("col-6","col-form-label","col-form-label-sm","my-auto");
            inputLabel.appendChild(document.createTextNode("Polarization"));  
            inputDiv.appendChild(inputLabel);
            newTextbox = document.createElement('select');
            newTextbox.classList.add("form-control","form-control-sm","col-5","my-auto");
            newTextbox.name=serviceInstanceId+"_polarization";
            newTextbox.id=serviceInstanceId+"_polarization";
    
            for (var polarization in polarizationTypes) {
                var option = document.createElement("option");
                option.value = polarization;
                option.text = polarizationTypes[polarization];
                newTextbox.appendChild(option);
            }

            inputDiv.appendChild(newTextbox);
            params.appendChild(inputDiv);
        }
        else { //DVB-T or DVB-C, both have target country 
            params.appendChild(createTextInput(serviceInstanceId+"_target_country","Target Country"));
            if(type == "urn:dvb:metadata:source:dvb-c") {
                params.appendChild(createTextInput(serviceInstanceId+"_network_id","Network ID"));
            }
        } 
    }
 
}   

function addService(serviceElement) {
    var services=document.getElementById('services');
    var serviceId=parseInt(document.getElementById('service_count').value);
    document.getElementById('service_count').value = (serviceId+1);
    var serviceDiv=document.createElement('div');
    serviceDiv.id = "service_"+serviceId;
    serviceDiv.classList.add("service");
    
    var newTextbox = document.createElement('input');
    newTextbox.type="hidden";
    newTextbox.name="service_"+serviceId+"_instances";
    newTextbox.id="service_"+serviceId+"_instances";
    newTextbox.value = "0";
    serviceDiv.appendChild(newTextbox);
    
    serviceDiv.appendChild(createTextInput("service_"+serviceId+"_name","Service name"));
    serviceDiv.appendChild(createTextInput("service_"+serviceId+"_unique_id","Service Unique Identifier"));
    serviceDiv.appendChild(createTextInput("service_"+serviceId+"_version","Service version"));
    serviceDiv.appendChild(createTextInput("service_"+serviceId+"_provider","Service provider"));
    serviceDiv.appendChild(createTextInput("service_"+serviceId+"_lcn","LCN"));
    serviceDiv.appendChild(createTextInput("service_"+serviceId+"_content_guide_service_reference","Content Guide Service Reference"));
    serviceDiv.appendChild(createTextInput("service_"+serviceId+"_service_logo","Service logo URI"));
    serviceDiv.appendChild(createTextInput("service_"+serviceId+"_media_presentation_app","Application controlling media presentation"));
    serviceDiv.appendChild(createTextInput("service_"+serviceId+"_parallel_app","Application with media in parallel"));


    var newTextbox1 = document.createElement('a');
    newTextbox1.href="javascript:addServiceInstance('"+serviceId+"')";
    newTextbox1.classList.add("btn","btn-outline-blue","btn-sm","mr-1","mt-2");
    newTextbox1.appendChild(document.createTextNode("Add service instance"));
    serviceDiv.appendChild(newTextbox1);

    var newTextbox2 = document.createElement('a');
    newTextbox2.href="javascript:removeElement('service_"+serviceId+"')";
    newTextbox2.appendChild(document.createTextNode("Remove service"));
    newTextbox2.classList.add("btn","btn-outline-blue","btn-sm","float-right","mt-2");
    serviceDiv.appendChild(newTextbox2);

    services.appendChild(serviceDiv);

    if(serviceElement != null) {
        document.getElementById("service_"+serviceId+"_version").value = serviceElement.getAttribute("version");
        var children = serviceElement.childNodes;
        for (var i = 0; i < children.length ;i++) {
            if(children[i].nodeName === "ServiceName") {
                try {document.getElementById("service_"+serviceId+"_name").value = children[i].childNodes[0].nodeValue;} catch(e) {}
            }
            else if(children[i].nodeName === "ProviderName") {
                try {document.getElementById("service_"+serviceId+"_provider").value = children[i].childNodes[0].nodeValue; } catch(e) {}
            }
            else if(children[i].nodeName === "UniqueIdentifier") {
                try {document.getElementById("service_"+serviceId+"_unique_id").value = children[i].childNodes[0].nodeValue; } catch(e) {}
            }
            else if(children[i].nodeName === "ContentGuideServiceRef") {
                try {document.getElementById("service_"+serviceId+"_content_guide_service_reference").value = children[i].childNodes[0].nodeValue; } catch(e) {}
            }
            else if(children[i].nodeName === "RelatedMaterial") {
                var howRelated = children[i].getElementsByTagName("tva:HowRelated");
                if(howRelated.length > 0) {
                    if(howRelated[0].getAttribute("href") == "urn:dvb:metadata:cs:HowRelatedCS:2019:1001.2") {
                        document.getElementById("service_"+serviceId+"_service_logo").value =  children[i].getElementsByTagName("tva:MediaLocator")[0].getElementsByTagName("tva:MediaUri")[0].childNodes[0].nodeValue;
                    }
                    else if(howRelated[0].getAttribute("href") == "urn:dvb:metadata:cs:LinkedApplicationCS:2019:1.1") {
                        document.getElementById("service_"+serviceId+"_parallel_app").value =  children[i].getElementsByTagName("tva:MediaLocator")[0].getElementsByTagName("tva:MediaUri")[0].childNodes[0].nodeValue;
                    }
                    else if(howRelated[0].getAttribute("href") == "urn:dvb:metadata:cs:LinkedApplicationCS:2019:1.2") {
                        document.getElementById("service_"+serviceId+"_media_presentation_app").value =  children[i].getElementsByTagName("tva:MediaLocator")[0].getElementsByTagName("tva:MediaUri")[0].childNodes[0].nodeValue;
                    }
                }
            }
            else if(children[i].nodeName === "ServiceInstance") {
                try {
                    addServiceInstance(serviceId,children[i]);
                }
                catch(e) {
                    console.log( "Error reading service instance",e );
                }
            }
        }
    }
}

function removeElement(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function showXML() {
     document.getElementById("xml").value = generateXML();
}

function generateXML() {

    var doc = document.implementation.createDocument(null, "ServiceList", null);
    var version = "r1";
    if(document.getElementById("r4").checked == true) {
        version = "r4";
    }

    var services = document.getElementsByClassName("service");
    var listName = doc.createElement("Name");
    listName.appendChild(doc.createTextNode(document.getElementById("name").value));
    doc.documentElement.appendChild(listName);

    var listProvider = doc.createElement("ProviderName");
    listProvider.appendChild(doc.createTextNode(document.getElementById("provider").value));
    doc.documentElement.appendChild(listProvider);
    var listLogo = document.getElementById("service_list_logo").value;
    if(listLogo && listLogo.length > 0) {
      var relatedElement = doc.createElement("RelatedMaterial");
      var howRelated = doc.createElement("tva:HowRelated");
      howRelated.setAttribute("href","urn:dvb:metadata:cs:HowRelatedCS:2019:1001.1");
      relatedElement.appendChild(howRelated);
      var mediaLocator = doc.createElement("tva:MediaLocator");
      var mediauri = doc.createElement("tva:MediaUri");
      mediauri.setAttribute("contentType",listLogo.endsWith(".jpg") ? "image/jpg": "image/png");
      mediauri.appendChild(doc.createTextNode(listLogo));
      mediaLocator.appendChild(mediauri);
      relatedElement.appendChild(mediaLocator);
      doc.documentElement.appendChild(relatedElement);
    }
    if(version == "r4") {
        doc.documentElement.setAttribute("xmlns","urn:dvb:metadata:servicediscovery:2022b");
        doc.documentElement.setAttribute("xsi:schemaLocation","urn:dvb:metadata:servicediscovery:2022b ../dvbi_v4.0.xsd");
        var lang = document.getElementById("service_list_language").value;
        console.log(lang);
        if(!lang || lang.length != 2) {
            alert("Invalid service list language!")
            document.getElementById("service_list_language").focus();
            return null;
        }
        doc.documentElement.setAttribute("xml:lang",lang);
    }
    else {
        doc.documentElement.setAttribute("xmlns","urn:dvb:metadata:servicediscovery:2020");
        doc.documentElement.setAttribute("xsi:schemaLocation","urn:dvb:metadata:servicediscovery:2020 ../dvbi_v1.0.xsd");
    }
    doc.documentElement.setAttribute("version",document.getElementById("version").value);
    doc.documentElement.setAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");
    doc.documentElement.setAttribute("xmlns:tva","urn:tva:metadata:2019");

    var lcnTableElement = doc.createElement("LCNTableList");
    var lcnTable = doc.createElement("LCNTable");
    lcnTableElement.appendChild(lcnTable);
    var targetRegionValue = document.getElementById("target_region").value;
    if(targetRegionValue && targetRegionValue.length > 0) {
        var targetRegion = doc.createElement("TargetRegion");
        targetRegion.appendChild(doc.createTextNode(targetRegionValue));
        lcnTable.appendChild(targetRegion);
        var regionTable = doc.createElement("RegionList");
        regionTable.setAttribute("version","1"); //TODO add a field or automatic update for version
        var region =  doc.createElement("Region");
        region.setAttribute("regionID",targetRegionValue);
        region.setAttribute("countryCodes",targetRegionValue);
        regionTable.appendChild(region);
        doc.documentElement.appendChild(regionTable);
    }
    doc.documentElement.appendChild(lcnTableElement);
    var scheduleEndpoint = document.getElementById("content_guide_schedule_endpoint").value;
    var contentGuideId = document.getElementById("content_guide_id").value;
    var contentProvider = document.getElementById("content_guide_provider").value;
    if(scheduleEndpoint && scheduleEndpoint.length > 0 && contentGuideId && contentGuideId.length > 0 && contentProvider && contentProvider.length > 0) {
        var contentGuideElement = doc.createElement("ContentGuideSource");
        contentGuideElement.setAttribute("CGSID",contentGuideId);
        var provider = doc.createElement("ProviderName");
        provider.appendChild(doc.createTextNode(contentProvider));
        contentGuideElement.appendChild(provider);
        var endPoint = doc.createElement("ScheduleInfoEndpoint");
        endPoint.setAttribute("contentType","application/xml");
        var uri = doc.createElement("URI");
        uri.appendChild(doc.createTextNode(scheduleEndpoint));
        endPoint.appendChild(uri);
        contentGuideElement.appendChild(endPoint);
        doc.documentElement.appendChild(contentGuideElement);
    }

    for(var i=0; i<services.length;i++) {
        var serviceId = services[i].id;
        var serviceElement = doc.createElement("Service");
        serviceElement.setAttribute("version",document.getElementById(serviceId+"_version").value);
        var propertyElement = doc.createElement("UniqueIdentifier");
        propertyElement.appendChild(doc.createTextNode(document.getElementById(serviceId+"_unique_id").value));
        serviceElement.appendChild(propertyElement);
        
        var instances = document.getElementsByClassName(serviceId+"_instance");
        for(var j=0; j<instances.length;j++) {
            var instanceElement = generateServiceInstance(instances[j],doc,version);
            serviceElement.appendChild(instanceElement);
        }
       
        propertyElement = doc.createElement("ServiceName");
        propertyElement.appendChild(doc.createTextNode(document.getElementById(serviceId+"_name").value));
        serviceElement.appendChild(propertyElement);
        propertyElement = doc.createElement("ProviderName");
        propertyElement.appendChild(doc.createTextNode(document.getElementById(serviceId+"_provider").value));
        serviceElement.appendChild(propertyElement);
        var logo = document.getElementById(serviceId+"_service_logo").value;
        if(logo && logo.length > 0) {
            propertyElement = doc.createElement("RelatedMaterial");
            var howRelated1 = doc.createElement("tva:HowRelated");
            howRelated1.setAttribute("href","urn:dvb:metadata:cs:HowRelatedCS:2019:1001.2");
            propertyElement.appendChild(howRelated1);
            var mediaLocator1 = doc.createElement("tva:MediaLocator");
            var mediauri1 = doc.createElement("tva:MediaUri");
            mediauri1.setAttribute("contentType",logo.endsWith(".jpg") ? "image/jpg": "image/png");
            mediauri1.appendChild(doc.createTextNode(logo));
            mediaLocator1.appendChild(mediauri1);
            propertyElement.appendChild(mediaLocator1);
            serviceElement.appendChild(propertyElement);
        }
        var app = document.getElementById(serviceId+"_media_presentation_app").value;
        if(app && app.length > 0) {
            propertyElement = doc.createElement("RelatedMaterial");
            var howRelated2 = doc.createElement("tva:HowRelated");
            howRelated2.setAttribute("href","urn:dvb:metadata:cs:LinkedApplicationCS:2019:1.2");
            propertyElement.appendChild(howRelated2);
            var mediaLocator2 = doc.createElement("tva:MediaLocator");
            var mediauri2 = doc.createElement("tva:MediaUri");
            mediauri2.setAttribute("contentType","application/vnd.dvb.ait+xml");
            mediauri2.appendChild(doc.createTextNode(app));
            mediaLocator2.appendChild(mediauri2);
            propertyElement.appendChild(mediaLocator2);
            serviceElement.appendChild(propertyElement);
        }
        app = document.getElementById(serviceId+"_parallel_app").value;
        if(app && app.length > 0) {
            propertyElement = doc.createElement("RelatedMaterial");
            var howRelated3 = doc.createElement("tva:HowRelated");
            howRelated3.setAttribute("href","urn:dvb:metadata:cs:LinkedApplicationCS:2019:1.1");
            propertyElement.appendChild(howRelated3);
            var mediaLocator3 = doc.createElement("tva:MediaLocator");
            var mediauri3 = doc.createElement("tva:MediaUri");
            mediauri3.setAttribute("contentType","application/vnd.dvb.ait+xml");
            mediauri3.appendChild(doc.createTextNode(app));
            mediaLocator3.appendChild(mediauri3);
            propertyElement.appendChild(mediaLocator3);
            serviceElement.appendChild(propertyElement);
        }
        var contentGuideServiceRef = document.getElementById(serviceId+"_content_guide_service_reference").value;
        if(contentGuideServiceRef && contentGuideServiceRef.length > 0) {
            propertyElement = doc.createElement("ContentGuideServiceRef");
            propertyElement.appendChild(doc.createTextNode(contentGuideServiceRef));
            serviceElement.appendChild(propertyElement);
        }
        doc.documentElement.appendChild(serviceElement);
        var lcnValue = document.getElementById(serviceId+"_lcn").value;
        if(lcnValue && lcnValue.length > 0) {
            var lcn = doc.createElement("LCN");
            lcn.setAttribute("channelNumber",lcnValue);
            lcn.setAttribute("serviceRef",document.getElementById(serviceId+"_unique_id").value);
            lcnTable.appendChild(lcn);
        }
    }

    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+new XMLSerializer().serializeToString(doc.documentElement);
}


function generateServiceInstance(instance,doc,version) {
    var instanceElement = doc.createElement("ServiceInstance");
    var instanceId = instance.id;
    instanceElement.setAttribute("priority",document.getElementById(instanceId+"_priority").value);
    var displayName = document.getElementById(instanceId+"_displayname").value
    if(displayName && version == "r4") {
        var displayNameElement = doc.createElement("DisplayName");
        displayNameElement.appendChild(doc.createTextNode(displayName));
        instanceElement.appendChild(displayNameElement);
    }
    var app = document.getElementById(instanceId+"_media_presentation_app").value;
    if(app && app.length > 0) {
        propertyElement = doc.createElement("RelatedMaterial");
        var howRelated = doc.createElement("tva:HowRelated");
        howRelated.setAttribute("href","urn:dvb:metadata:cs:LinkedApplicationCS:2019:1.2");
        propertyElement.appendChild(howRelated);
        var mediaLocator = doc.createElement("tva:MediaLocator");
        var mediauri = doc.createElement("tva:MediaUri");
        mediauri.setAttribute("contentType","application/vnd.dvb.ait+xml");
        mediauri.appendChild(doc.createTextNode(app));
        mediaLocator.appendChild(mediauri);
        propertyElement.appendChild(mediaLocator);
        instanceElement.appendChild(propertyElement);
    }
    app = document.getElementById(instanceId+"_parallel_app").value;
    if(app && app.length > 0) {
        propertyElement = doc.createElement("RelatedMaterial");
        var howRelated1 = doc.createElement("tva:HowRelated");
        howRelated1.setAttribute("href","urn:dvb:metadata:cs:LinkedApplicationCS:2019:1.1");
        propertyElement.appendChild(howRelated1);
        var mediaLocator1 = doc.createElement("tva:MediaLocator");
        var mediauri1 = doc.createElement("tva:MediaUri");
        mediauri1.setAttribute("contentType","application/vnd.dvb.ait+xml");
        mediauri1.appendChild(doc.createTextNode(app));
        mediaLocator1.appendChild(mediauri1);
        propertyElement.appendChild(mediaLocator1);
        instanceElement.appendChild(propertyElement);
    }
    var sourceType = document.getElementById(instanceId+"_source_type").value;
    if(sourceType === "urn:dvb:metadata:source:dvb-dash") {
        var deliveryParametersElement = doc.createElement("DASHDeliveryParameters");
        var locationElement = doc.createElement("UriBasedLocation");
        locationElement.setAttribute("contentType","application/dash+xml");
        var uriElement =  doc.createElement("URI");
        uriElement.appendChild(doc.createTextNode(document.getElementById(instanceId+"_dash_uri").value));
        locationElement.appendChild(uriElement);
        deliveryParametersElement.appendChild(locationElement);  
        instanceElement.appendChild(deliveryParametersElement);
    }
    else if(sourceType === "urn:dvb:metadata:source:dvb-t") {
        var deliveryParametersElement1 = doc.createElement("DVBTDeliveryParameters");
        deliveryParametersElement1.appendChild(generateDVBTriplet(document.getElementById(instanceId+"_dvb_triplet").value,doc));
        var targetCountry = doc.createElement("TargetCountry");
        targetCountry.appendChild(doc.createTextNode(document.getElementById(instanceId+"_target_country").value));
        deliveryParametersElement1.appendChild(targetCountry);
        instanceElement.appendChild(deliveryParametersElement1);
    }
    else if(sourceType === "urn:dvb:metadata:source:dvb-c") {
        var deliveryParametersElement2 = doc.createElement("DVBCDeliveryParameters");
        deliveryParametersElement2.appendChild(generateDVBTriplet(document.getElementById(instanceId+"_dvb_triplet").value,doc));
        var targetCountry2 = doc.createElement("TargetCountry");
        targetCountry2.appendChild(doc.createTextNode(document.getElementById(instanceId+"_target_country").value));
        deliveryParametersElement2.appendChild(targetCountry2);
        var networkId = doc.createElement("NetworkID");
        networkId.appendChild(doc.createTextNode(document.getElementById(instanceId+"_network_id").value));
        deliveryParametersElement2.appendChild(networkId);
        instanceElement.appendChild(deliveryParametersElement2);
    }
    else if(sourceType === "urn:dvb:metadata:source:dvb-s") {
        var deliveryParametersElement3 = doc.createElement("DVBSDeliveryParameters");
        deliveryParametersElement3.appendChild(generateDVBTriplet(document.getElementById(instanceId+"_dvb_triplet").value,doc));
        var parameter = doc.createElement("OrbitalPosition");
        parameter.appendChild(doc.createTextNode(document.getElementById(instanceId+"_orbital_position").value));
        deliveryParametersElement3.appendChild(parameter);
        var parameter1 = doc.createElement("Frequency");
        var freq = parseFloat(document.getElementById(instanceId+"_frequency").value)*100000;
        parameter1.appendChild(doc.createTextNode(freq));
        deliveryParametersElement3.appendChild(parameter1);
        var parameter2 = doc.createElement("Polarization");
        parameter2.appendChild(doc.createTextNode(document.getElementById(instanceId+"_polarization").value));
        deliveryParametersElement3.appendChild(parameter2);
        instanceElement.appendChild(deliveryParametersElement3);
    }
    return instanceElement;
}

function generateDVBTriplet(input,doc) {
    var tripletElement = doc.createElement("DVBTriplet");
    var res = input.split(".");
    var onid = parseInt(res[0],16);
    var tsid = parseInt(res[1],16);
    var sid = parseInt(res[2],16);
    tripletElement.setAttribute("origNetId",onid);
    tripletElement.setAttribute("tsId",tsid);
    tripletElement.setAttribute("serviceId",sid);
    return tripletElement;
}

function readLCN(lcnElement) {
    var lcnTables = lcnElement.getElementsByTagName("LCNTable");
    var lcnList = {};
    for (var i = 0; i < lcnTables.length ;i++) {
          var targetRegion ="";
          var targetRegionElements = lcnTables[0].getElementsByTagName("TargetRegion");
          if(targetRegionElements.length > 0) {
		    targetRegion =targetRegionElements[0].childNodes[0].nodeValue;
          }
          var channellList = {};
          var lcnElements = lcnElement.getElementsByTagName("LCN");
          for (var j = 0; j < lcnElements.length ;j++) {
            channellList[lcnElements[j].getAttribute("serviceRef")] = lcnElements[j].getAttribute("channelNumber");
          }
          lcnList[targetRegion] = channellList;
    }
    return lcnList;
}

function listSavedServicelists() {
    $.getJSON( "saved_lists.php", function( data ) {
      var items = [];
      $('#saved_servicelists').empty();
      var listElement = document.getElementById("saved_servicelists");
      $.each( data, function( val ) {
        var targetElement = document.createElement('div');
        targetElement.classList.add("d-flex","bd-highlight","border-bottom");
        var newTextbox = document.createElement('a');
        newTextbox.href="javascript:loadServicelist('"+this+"')";
        newTextbox.classList.add("p-2","flex-grow-1","bd-highlight","overflow-hidden","text-nowrap-sm","mb-1");
        newTextbox.appendChild(document.createTextNode( this.substr("./servicelists/".length)));
        targetElement.appendChild(newTextbox);

        var newTextbox1 = document.createElement('a');
        newTextbox1.href="javascript:loadServicelist('"+this+"')";
        var image = document.createElement('img');
        image.classList.add("icon");
        image.src ="icons/pencil.svg";
        image.alt ="Edit";
        image.title ="Edit";
        newTextbox1.appendChild(image);
        newTextbox1.classList.add("btn","btn-sm","mb-1","mr-0","pr-0","d-flex","align-items-center");
        targetElement.appendChild(newTextbox1);

        var newTextbox2 = document.createElement('a');
        newTextbox2.href=this+"?ts="+Date.now();
        var image2 = document.createElement('img');
        image2.classList.add("icon");
        image2.src ="icons/window.svg";
        image2.alt ="Open";
        image2.title ="Open";
        newTextbox2.appendChild(image2);
        newTextbox2.classList.add("btn","btn-sm","mb-1","mr-0","pr-0","d-flex","align-items-center");
        targetElement.appendChild(newTextbox2);

        var newTextbox3 = document.createElement('a');
        newTextbox3.href="javascript:deleteServicelist('"+this.substr("./servicelists/".length)+"')";
        var image3 = document.createElement('img');
        image3.classList.add("icon");
        image3.src ="icons/trash.svg";
        image3.alt ="Delete";
        image3.title ="Delete";
        newTextbox3.appendChild(image3);
        newTextbox3.classList.add("btn","btn-sm","mb-1","mr-0","pr-0","d-flex","align-items-center");
        targetElement.appendChild(newTextbox3);
        targetElement.appendChild(document.createElement('hr'));
        listElement.appendChild(targetElement);
      });
    });
}

function uploadServicelist() {
    var xml = generateXML();
    if(xml) {
        $.post( "upload_servicelist.php", { servicelist: xml, filename: document.getElementById('filename').value })
        .done(function( data ) {
            alert( "Servicelist saved!" );
            listSavedServicelists();
        })
        .fail(function(data) {
            alert( "Error saving servicelist:"+data.responseText );
        });
    }
}

function loadServicelist(list) {
    $.get( list+"?ts="+Date.now(), function( data ) {
        var parser;
        var doc;

        if (window.DOMParser) {
          parser = new DOMParser();
          doc = parser.parseFromString(data,"text/xml");
        } else {
          doc = new ActiveXObject("Microsoft.XMLDOM");
          doc.async = false;
          doc.loadXML(data); 
        } 
        $('#services').empty();
        document.getElementById("content_guide_id").value = "";
        document.getElementById("content_guide_schedule_endpoint").value = "";
        document.getElementById("content_guide_provider").value = "";
        document.getElementById("target_region").value = "";

        document.getElementById('service_count').value = 0;
        document.getElementById("version").value = doc.documentElement.getAttribute("version");
        if(doc.documentElement.getAttribute("xmlns") == "urn:dvb:metadata:servicediscovery:2022b") {
            document.getElementById("r4").checked = true;
            document.getElementById("service_list_language").value = doc.documentElement.getAttribute("xml:lang")
        }
        else {
            document.getElementById("r1").checked = true;
            document.getElementById("service_list_language").value = "";
        }
        document.getElementById("filename").value = list.replace("./servicelists/","");
        var children = doc.documentElement.childNodes;
        var i, lcnMap = null;

        for (i = 0; i < children.length ;i++) {
            if(children[i].nodeName === "Name") {
                document.getElementById("name").value = children[i].childNodes[0].nodeValue;
            }
            else if(children[i].nodeName === "ProviderName") {
                document.getElementById("provider").value = children[i].childNodes[0].nodeValue;
            }
            else if(children[i].nodeName === "RelatedMaterial") {
                var howRelated = children[i].getElementsByTagNameNS("urn:tva:metadata:2019","HowRelated");
                if(howRelated.length > 0 && howRelated[0].getAttribute("href") == "urn:dvb:metadata:cs:HowRelatedCS:2019:1001.1") {
                  document.getElementById("service_list_logo").value = children[i].getElementsByTagNameNS("urn:tva:metadata:2019","MediaUri")[0].childNodes[0].nodeValue;
                }
            }
            else if(children[i].nodeName === "LCNTableList") {
                lcnMap = readLCN(children[i]);
            }
            else if(children[i].nodeName === "ContentGuideSource") {
                document.getElementById("content_guide_id").value = children[i].getAttribute("CGSID");
                document.getElementById("content_guide_schedule_endpoint").value = children[i].getElementsByTagName("ScheduleInfoEndpoint")[0].getElementsByTagName("URI")[0].childNodes[0].nodeValue;
                document.getElementById("content_guide_provider").value = children[i].getElementsByTagName("ProviderName")[0].childNodes[0].nodeValue;
            }
            else if(children[i].nodeName === "Service") {
                try {
                    addService(children[i]);
                } 
                catch(e) {
                    console.log( "Error reading servicelist:",e );
                }
            }
        }
        if(lcnMap != null) {
            var services = document.getElementsByClassName("service");
            for (var lcnRegion in lcnMap) {
                document.getElementById("target_region").value = lcnRegion;
                var lcnList = lcnMap[lcnRegion];
                for (var channelRef in lcnList) {
                    for(i=0; i<services.length;i++) {
                        var serviceId = services[i].id;
                        if(document.getElementById(serviceId+"_unique_id").value === channelRef) {
                            document.getElementById(serviceId+"_lcn").value = lcnList[channelRef];
                            break;
                        }
                    }
                }
            }
        }
        
    },"text");
}

function deleteServicelist(list) {
    $.post( "delete_servicelist.php", { servicelist: list })
      .done(function( data ) {
        alert( "Servicelist '"+list+"'  deleted!" );
        listSavedServicelists();
      })
      .fail(function(data) {
        alert( "Error deleting servicelist:"+data.responseText );
      });
}

