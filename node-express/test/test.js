const test = require('node:test');
const axios = require('axios');
const assert = require('assert');
const af = require('../src/utils/asyncronous_functions')//af=>asyncronous_functions




/*
        ***Batería de TEST para comprobar las funciones***

          -Se ejecuta con
            npm run test

          -Principlamente comprobaremos las peticiones a la NVD y los cpes

*/

//Test de prueba
test('asyncronous functions', async (t) => {

  var lista = [
    { version: '7.4.0', so: 'FortiOS' },
    { version: '15.8', so: 'IOS' },
    { version: '10.2(6)', so: 'NX-OS' },
    { version: '16.10.0024', so: 'ArubaOS-Switch' },
    { version: '10.06.0170', so: 'ArubaCX' },
    { version: '32.5.1.5', so: 'EXOS' },
    { version: '9', so: 'Comware' },
    { version: '8.9', so: 'AlliedWare-Plus' },
  ]



  //Test para el cpe de Forti
  await t.test('subset async function cpeNameget Fortinet', async (t) => {

    var cpe_forti = af.cpenameGet(lista[0].so, lista[0].version)

    if (cpe_forti == "cpe:2.3:o:fortinet:fortios:7.4.0:*:*:*:*:*:*:*") {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la cpe de fortinet")
    }

  })

  //Test para la peticion a la NVD de fortinet
  await t.test('subset async function NVD petition Fortinet', async (t) => {

    var cpe_forti = af.cpenameGet(lista[0].so, lista[0].version)

    var nvd_petition = await af.petition(cpe_forti)

    if (nvd_petition != null) {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la peticion a la nvd de Fortinet")
    }



  })


  //Test para el cpe de Cisco IOS 
  await t.test('subset async function cpeNameget Cisco IOS', async (t) => {

    var cpe_cisco = af.cpenameGet(lista[1].so, lista[1].version)

    if (cpe_cisco == "cpe:2.3:o:cisco:ios:15.8:*:*:*:*:*:*:*") {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la cpe de Cisco IOS")
    }

  })

  //Test para la peticion a la NVD de cisco IOS
  await t.test('subset async function NVD petition Cisco IOS', async (t) => {

    var cpe_cisco = af.cpenameGet(lista[1].so, lista[1].version)

    var nvd_petition = await af.petition(cpe_cisco)

    if (nvd_petition != null) {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la peticion a la nvd de Cisco IOS")
    }



  })

  //Test para el cpe de Cisco NX-OS 
  await t.test('subset async function cpeNameget Cisco NX-OS', async (t) => {

    var cpe_cisco = af.cpenameGet(lista[2].so, lista[2].version)

    //Las versines con carácteres especiales se deben codifificar para que no haya errores

    if (cpe_cisco == "cpe:2.3:o:cisco:nx-os:10.2%5C(6%5C):*:*:*:*:*:*:*") {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la cpe de Cisco NX-OS")
    }

  })

  //Test para la peticion a la NVD de cisco NX-OS
  await t.test('subset async function NVD petition Cisco NX-OS', async (t) => {

    var cpe_cisco = af.cpenameGet(lista[2].so, lista[2].version)

    var nvd_petition = await af.petition(cpe_cisco)

    if (nvd_petition != null) {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la peticion a la nvd de Cisco NX-OS")
    }



  })

  //Test para el cpe de ArubaOS 
  await t.test('subset async function cpeNameget ArubaOS-Switch', async (t) => {

    var cpe_arubaos_switch = af.cpenameGet(lista[3].so, lista[3].version)

    //Las versines con carácteres especiales se deben codifificar para que no haya errores

    if (cpe_arubaos_switch == "cpe:2.3:o:hpe:arubaos-switch:16.10.0024:*:*:*:*:*:*:*") {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la cpe de ArubaOS-Switch")
    }

  })

  //Test para la peticion a la NVD de ArubaOS-Switch
  await t.test('subset async function NVD petition ArubaOS-Switch', async (t) => {

    var cpe_arubaos_switch = af.cpenameGet(lista[3].so, lista[3].version)

    var nvd_petition = await af.petition(cpe_arubaos_switch)

    if (nvd_petition != null) {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la peticion a la nvd de ArubaOS-Switch")
    }



  })

  //Test para el cpe de ArubaCX 
  await t.test('subset async function cpeNameget ArubaCX', async (t) => {

    var cpe_arubacx = af.cpenameGet(lista[4].so, lista[4].version)

    //Las versines con carácteres especiales se deben codifificar para que no haya errores

    if (cpe_arubacx == "cpe:2.3:o:hpe:arubaos-cx:10.06.0170:*:*:*:*:*:*:*") {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la cpe de ArubaCX")
    }

  })

  //Test para la peticion a la NVD de ArubaCX
  await t.test('subset async function NVD petition ArubaCX', async (t) => {

    var cpe_arubacx = af.cpenameGet(lista[4].so, lista[4].version)

    var nvd_petition = await af.petition(cpe_arubacx)

    if (nvd_petition != null) {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la peticion a la nvd de ArubaCX")
    }

  })

  //Test para el cpe de EXOS 
  await t.test('subset async function cpeNameget EXOS', async (t) => {

    var cpe_exos = af.cpenameGet(lista[5].so, lista[5].version)

    //Las versines con carácteres especiales se deben codifificar para que no haya errores

    if (cpe_exos == "cpe:2.3:o:extremenetworks:exos:32.5.1.5:*:*:*:*:*:*:*") {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la cpe de EXOS")
    }

  })

  //Test para la peticion a la NVD de EXOS
  await t.test('subset async function NVD petition EXOS', async (t) => {

    var cpe_exos = af.cpenameGet(lista[5].so, lista[5].version)

    var nvd_petition = await af.petition(cpe_exos)

    if (nvd_petition != null) {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la peticion a la nvd de EXOS")
    }

  })

  /*

  Ahora comware y allied, tecnicamente no devolvería ninguna lista y el cpe sería nulo ya que estas versiones no estas soportadas en la NVD.
  
  La función main esta programada de tal forma que nunca se llega hacer una petición a la NVD sobre allied o comware


  */


  //Test del main para comware
  await t.test('subset async function main Comware', async (t) => {

    var main_comware = await af.main([lista[6]])

    if ((main_comware[0].status == 400) && (main_comware[0].info == "Las versiones de Allied y de Comware no estan soportadas")) {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la comprobación Comware")
    }

  })

  //Test del main para allied
  await t.test('subset async function main Allied', async (t) => {

    var main_comware = await af.main([lista[7]])

    if ((main_comware[0].status == 400) && (main_comware[0].info == "Las versiones de Allied y de Comware no estan soportadas")) {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en la comprobación Allied")
    }

  })

  /*
  Los siguientes test deberan comprobar que efectivamente se produce un error al realizar una peticion a la NVD con un cpe incorrecto


  */

  //Test para la peticion a la NVD de EXOS
  await t.test('subset async function NVD petition error', async (t) => {

    var cpe_error = "cpe:error:o:extremenetworks:exos:32.5.1.5:*:*:*:*:*:*:*"

    var nvd_petition = await af.petition(cpe_error)

    if (nvd_petition == null) {
      assert.strictEqual(1, 1)
    } else {
      assert.strictEqual(1, 2, "Error en el resultado de una petición incorrecta")
    }

  })


});










