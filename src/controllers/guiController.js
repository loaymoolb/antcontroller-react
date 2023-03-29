class GuiController{

    constructor(){
        console.log("guiController constructor called...")
        this.jsonGuiTree = this.getJsonGuiTree()
        this.defaultResponseHandler = null
    }

    attachResponseHandler(handler){
        this.defaultResponseHandler = handler
    }

    getJsonGuiTree(){
        return {
            queryBox :{
                textInputIpAddr : document.getElementById('ipAddr'),
                textInputParam : document.getElementById('param')
            },
            queryDisplayBox :{
                textAreaQueryDisp : document.getElementById("queryDisp")
            },
            responseBox :{
                textAreaRespDisp : document.getElementById("respDisp")
            },
            antControlBox :{
                tagDeviceStatus : document.getElementById("deviceStatusTag"),
                antennaList : document.getElementById("antennaList"),
                checkBoxSignleAntMode : document.getElementById("singleAntModeBox"),
                buttonToggleSetupMode : document.getElementById("toggleSetupModeBut")
            },
            consentBox : document.getElementById('localStorageConsentWindow')
        }
    }

    killConsentBox(){
        this.jsonGuiTree
            .consentBox
            .style.display = "none";
    }


    //FIX THIS ASAP!!!!!!!
    getAntName(antNo){
        console.error("getAntName contains dirty hack and may throw "
                    + "nasty errors (but may have worked fine).")
        return document.getElementById("antListName"+antNo).value
    }

    getQueryFromQueryBox(){
        return "http://"
                + this.jsonGuiTree
                    .queryBox
                    .textInputIpAddr.value
                + "/?"
                + this.jsonGuiTree
                    .queryBox
                    .textInputParam.value;
    }

    getUrlFromQueryBox(){
        return "http://"
                + this.jsonGuiTree
                    .queryBox
                    .textInputIpAddr.value
    }

    setSetupMode(mode){
        if (mode == true){
            this.jsonGuiTree
                .antControlBox
                .buttonToggleSetupMode
                .innerHTML = "Leave setup mode"
        }
        else{
            this.jsonGuiTree
                .antControlBox
                .buttonToggleSetupMode
                .innerHTML = "Enter setup mode"
        }
    }

    updateIP(text){
        this.jsonGuiTree
            .queryBox
            .textInputIpAddr.value = text
    }

    updateQueryDisp(text){
        this.jsonGuiTree
            .queryDisplayBox
            .textAreaQueryDisp
            .innerHTML = text
        console.log("query:\n " + text);
    }

    updateRespDisp(text){
        this.jsonGuiTree
            .responseBox
            .textAreaRespDisp
            .innerHTML = text
            console.log("response:\n " + text);
    }

    drawDeviceStatus(statusText){
        var statusColor;
        switch (statusText){
            case "Online":
                statusColor = "success";
                break;
            case "Offline":
                statusColor = "dark"
                break;
            case "Error":
                statusColor = "error"
                break;
            default:
                statusText = "Unknown";
                statusColor = "light";
                break;
        }
        this.jsonGuiTree
            .antControlBox
            .tagDeviceStatus
            .innerHTML = statusText;
        this.jsonGuiTree
            .antControlBox
            .tagDeviceStatus
            .className = "siimple-tag siimple-tag--"
                         + statusColor
                         + " siimple-tag--rounded";
    }

    drawAntennaList(jsonConfig,setupMode){
        var htmlText = "";
        if (setupMode) htmlText += "<h3>SETUP MODE</h3>";
        for(var i=0;i<jsonConfig.antennaCount;i++){
            var listItemText = "";
            var statusColor;
            var statusText;

            /** setup tag name and color from jsonConfig **/
            if (jsonConfig.antenna[i].state == 'on'){
                statusColor = "success"
                statusText = "On"
            }
            else if (jsonConfig.antenna[i].state == 'off'){
                statusColor = "primary"
                statusText = "Off"
            }
            else{
                statusColor = "error"
                statusText="??"
            }
            
            var listItemOnClickText = ((setupMode) ? 
                        "" :
                        'onClick="toggleAntenna('+ (i) +')"'
                        );
            
            var listItemTextReadonlyText = ((setupMode) ?
                        "" :
                        'readonly="true"'
                        );

            var listItemTextText = ((setupMode) ? 
                        /** draw input fields **/
                        '<input type="text" class="siimple-input" size="20"' +
                        'id="antListName' + i + '" value="' + jsonConfig.antenna[i].name + '" onchange="setAntName(' + (i) + ')">' :
                        /** draw plain text with names **/
                        '<div class="siimple-p" style="display: inline-block">' +  jsonConfig.antenna[i].name + '</div>'
                        );


            //addd HTML to string variable
            listItemText+= '<div class="siimple-list-item"' + listItemOnClickText + '>';
                //drawind input field/name field
                listItemText += listItemTextText;
                //drawing tag
                listItemText+= '<span class="siimple-tag siimple-tag--' + statusColor + 
                                ' siimple-tag--rounded">' + statusText + "</span>";
            listItemText+= "</div>"
            htmlText += listItemText;
        }
        //end of drawing antennas in for loop


        /** drawing stuff under the antenna list **/
        if(setupMode){
            /** drawing antenna count input field **/
            htmlText += '<br><label class="siimple-label"> Antenna Count</label>' +
            '<input id="antSetupCount" type="number" min=1 max='+ jsonConfigController.maxAntCount +' class="siimple-input"'+
            'onchange="setAntennaCount()" placeholder="' + jsonConfigController.jsonConfig.antennaCount + '">'
        }
        else{
            /** drawing turnAllOff button **/
            htmlText += '<div class="siimple-list-item" onClick="toggleAntenna(-1)"><p> turn all off </p></div>'
        }
        this.jsonGuiTree
                .antControlBox
                .antennaList
                .innerHTML = htmlText;
    }
}