const { all } = require('axios');
const mongoose = require('mongoose')

const CVE_ListSchema = mongoose.Schema({
    SO: String,
    Version: Array,
    CVE_id: String,
    cvssVersion: String, 
    cvssbaseScore: Number,
    cvssbaseSeverity: String,
    url: String,
    description_ES: String,

},{
    versionKey: false //Podemos en un futuro necesitar la version del documento por ahora no
});

//Definimos los modelos de todas nuestras colecciones, Comware y Allied no estan incluido porque como el NVD no asocia CVEs con sus respectivas versiones para que tener una colección vacía

const ios= mongoose.model("CVE_List_IOS",CVE_ListSchema,"CVE_List_IOS")
const nx_os= mongoose.model("CVE_List_NX-OS",CVE_ListSchema,"CVE_List_NX-OS")
const exos= mongoose.model("CVE_List_EXOS",CVE_ListSchema,"CVE_List_EXOS")
const arubacx= mongoose.model("CVE_List_ArubaCX",CVE_ListSchema,"CVE_List_ArubaCX")
const arubaos_switch= mongoose.model("CVE_List_ArubaOS-Switch",CVE_ListSchema,"CVE_List_ArubaOS-Switch")
const fortios= mongoose.model("CVE_List_FortiOS",CVE_ListSchema,"CVE_List_FortiOS")


module.exports = {ios,nx_os,exos,arubacx,arubaos_switch,fortios,CVE_ListSchema}