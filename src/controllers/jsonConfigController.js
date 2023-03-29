class JsonConfigController{
        
    constructor(){
        console.log("jsonConfigController constructor called...")
        this.jsonConfig = {};
        this.maxAntCount = 8;
        this.loadSettingsFromLocalStorage();
        //get from localStorage or generate
    }


    enableLocalStorage(){
        this.jsonConfig.localStorageEnabled = true;
    }

    disableLocalStorage(){
        this.jsonConfig.localStorageEnabled = false; 
        localStorage.clear();
    }

    loadSettingsFromLocalStorage(){
        if (typeof(Storage) !== "undefined") {
            console.log("Loading local storage...")
            if (localStorage.getItem('jsonConfigText') == null ){
                this.jsonConfig = this.getDefaultJsonConfig();
                console.log("Default json generated.")
            }
            else{
                this.jsonConfig = JSON.parse(localStorage.getItem('jsonConfigText'));
                console.log("Json loaded from local storage")
            }
        } else {
            console.log("local storage not supported.")
        }
        console.log("Json config loaded:\n" + JSON.stringify(this.jsonConfig,null,2));
    }


    saveSettingsOnLocalStorage(){
        if(this.jsonConfig.localStorageEnabled == true){
            localStorage.setItem('jsonConfigText',JSON.stringify(this.jsonConfig,null,2))
            console.log('saving data on local storage...');
        }
        else{
            console.log('local storage disabled. Not saving.')
        }
    }

    getDefaultJsonConfig(){
        var defaultJsonConfig = {
            deviceIP : "192.168.2.100",
            localStorageEnabled : false,
            singleAntenna : true,
            autoUpdate : false,
            antennaCount : this.maxAntCount,
            antenna : []
        }
        for(var i = 0;i<defaultJsonConfig["antennaCount"];i++){
            defaultJsonConfig.antenna[i] = {
                name : "Ant " + (i+1),
                state : "off",
                remoteState : "??"
            }
        }
        return defaultJsonConfig;
    }

    setIP(ip){
        this.jsonConfig.deviceIP = ip;
    }

    getIP(){
        return this.jsonConfig.deviceIP;
    }
    
    setAntName(antNo,antName){
        if (this.jsonConfig.antenna[antNo] != null){
            this.jsonConfig.antenna[antNo].name = antName
        }
        else{
            console.log("antenna no. " + antNo + "doesn't exist!")
        }
    }

    setAntVal(antNo, antVal){
        if(this.jsonConfig.singleAntenna == true){
            this.setAntennasOff()
        }
        if(antNo<0||antNo>this.jsonConfig.antennaCount){
            this.setAntennasOff()
            return false
        }
        this.jsonConfig.antenna[antNo].state = antVal
        return true
    }

    getAntVal(antNo){
        if(antNo<0||antNo>this.jsonConfig.antennaCount){
            return "Error"
        }
        return this.jsonConfig.antenna[antNo].state;
    }

    setAntennasOff(){
        for (var i in this.jsonConfig.antenna){
            this.jsonConfig.antenna[i].state = "off";
        }
    }

    setSingleAntennaMode(mode){
        this.jsonConfig.singleAntenna = mode;
    }

    setAntennaCount(antCount){
        if (antCount>0||antCount<this.maxAntCount){
            this.jsonConfig.antennaCount=antCount;
        }
        else{
            console.log("invalid amount of antennas.")
        }
    }
}//end of jsonConfigStorage class definition