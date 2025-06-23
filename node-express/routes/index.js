var express = require('express');
var router = express.Router();

//Este require nos permitirá cargar las variables de entorno 
require('dotenv').config()

//Controladores

const updateController = require('../src/controllers/update');
const manufacturersController = require('../src/controllers/manufacturers');
const versionsController = require('../src/controllers/versions');
const vulnerabilitiesController = require('../src/controllers/vulnerabilities');
const cve_listController = require('../src/controllers/cve_list');
const deleteController = require('../src/controllers/delete');
const add_versionController= require('../src/controllers/add_version'); 
const update_versionController= require('../src/controllers/update_version'); 


                                      

/* Ruta /update */


router.put('/update-db', updateController.index);

/* Ruta /manufacturers */

router.get('/manufacturers', manufacturersController.index);

/* Ruta /manufacturers/:manufacturerId(\\d+) */

router.get('/manufacturers/:manufacturerId', manufacturersController.details_Manufacturer);

/* Ruta /manufacturers/:manufacturerId(\\d+)/:soId(\\d+)/versions */

router.get('/manufacturers/:manufacturerId/:soId/versions', versionsController.index);

/* Ruta /manufacturers/:manufacturerId(\\d+)/:soId(\\d+)/versions/:versionId(\\d+) */

router.get('/manufacturers/:manufacturerId/:soId/versions/:versionId', versionsController.details_versions);

/* Ruta /manufacturers/:manufacturerId(\\d+)/:soId(\\d+)/versions/:versionId(\\d+)/vulnerabilities */

router.get('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities', vulnerabilitiesController.index);

/*Ruta /manufacturers/:manufacturerId(\\d+)/:soId(\\d+)/versions/:versionId(\\d+)/vulnerabilities/cvelist */

router.get('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist', cve_listController.list_vulnerabilities);


/*Ruta /manufacturers/:manufacturerId(\\d+)/:soId(\\d+)/versions/:versionId(\\d+)/vulnerabilities/cvelist/:vulnerabilityId(\\d+) */

router.get('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId', cve_listController.details_vulnerabilities);

/*Ruta /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk?severity=:severityId */

router.get('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk', cve_listController.level_vulnerabilities);

/*Ruta /delete/:soId/:versionId/ */

router.delete('/delete/:soId/:versionId',deleteController.index)

/*Ruta /add-version/:soId/:versionId/:eoes/:eos */

router.post('/add-version/:soId/:versionId/:eoes/:eos',add_versionController.index)

/*Ruta /update-version/:soId/:versionId/:eoes/:eos */

router.put('/update-version/:soId/:versionId/:eoes/:eos',update_versionController.index)

/*Ruta /update-cves-one-version */

router.put('/update-cves-one-version/:manufacturerId/:soId/:versionId',updateController.update_one)



module.exports = router;

