var Firebase = require("firebase");
var buttons  = new Firebase('https://marsoasis.firebaseio.com/buttons');

// folders
var system_control         = buttons.child("system_control");
var water_flow             = buttons.child("water_flow");
var water_conditioning     = buttons.child("water_conditioning");
var atmospheric_management = buttons.child("atmospheric_management");
var system_maintenance     = buttons.child("system_maintenance");

// system control buttons
var BeagleBone = document.getElementById('BeagleBone-switch');
var Autopilot  = document.getElementById('Autopilot-switch');

// water flow buttons
var MainTankPump       = document.getElementById('MainTankPump-switch');
var CondensateTankPump = document.getElementById('CondensateTankPump-switch');
var LeachateTankPump   = document.getElementById('LeachateTankPump-switch');

// water conditioning buttons
var WaterHeater     = document.getElementById('WaterHeater-switch');
var WaterChiller    = document.getElementById('WaterChiller-switch');
var Nutrient1Dosing = document.getElementById('Nutrient1Dosing-switch');
var Nutrient2Dosing = document.getElementById('Nutrient2Dosing-switch');
var phDosing        = document.getElementById('phDosing-switch');

// atmospheric management buttons
var HumidifierMisterPump = document.getElementById('HumidifierMisterPump-switch');
var DehumidifierAirPump  = document.getElementById('DehumidifierAirPump-switch');
var O2Concentrator       = document.getElementById('O2Concentrator-switch');
var CO2GasSolenoid       = document.getElementById('CO2GasSolenoid-switch');
var N2GasSolenoid        = document.getElementById('N2GasSolenoid-switch');

// system maintenance buttons
var MainTankCirculation      = document.getElementById('MainTankCirculation-switch');
var MainTankAirBubbler       = document.getElementById('MainTankAirBubbler-switch');
var NutrientTank1Circulation = document.getElementById('NutrientTank1Circulation-switch');
var NutrientTank2Circulation = document.getElementById('NutrientTank2Circulation-switch');
var UVFilter                 = document.getElementById('UVFilter-switch');

// beaglebone switch asynchronous callback
var beaglebone_switch = system_control.child("BeagleBone");
beaglebone_switch.on("value", function(snapshot) {
  if (snapshot.val() == true) {
    //$('#BeagleBone-switch').attr("checked", true);
    BeagleBone.click();
    //$('#BeagleBone-switch').checked = true
  } else {
    //$('#BeagleBone-switch').removeAttr("checked");
    BeagleBone.click();
    //$('#BeagleBone-switch').checked = false
  }
  console.log(BeagleBone)
});

// system control handlers
BeagleBone.onchange = function() {
  system_control.set({
    "BeagleBone": BeagleBone.checked,
    "Autopilot":  Autopilot.checked
  });
}
Autopilot.onchange = function() {
  system_control.set({
    "BeagleBone": BeagleBone.checked,
    "Autopilot":  Autopilot.checked
  });
}

// water flow button handlers
MainTankPump.onchange = function() {
  water_flow.set({
    "MainTankPump":       MainTankPump.checked,
    "CondensateTankPump": CondensateTankPump.checked,
    "LeachateTankPump":   LeachateTankPump.checked
  });
}
CondensateTankPump.onchange = function() {
  water_flow.set({
    "MainTankPump":       MainTankPump.checked,
    "CondensateTankPump": CondensateTankPump.checked,
    "LeachateTankPump":   LeachateTankPump.checked
  });
}
LeachateTankPump.onchange = function() {
  water_flow.set({
    "MainTankPump":       MainTankPump.checked,
    "CondensateTankPump": CondensateTankPump.checked,
    "LeachateTankPump":   LeachateTankPump.checked
  });
}

// water conditioning button handlers
WaterHeater.onchange = function() {
  water_conditioning.set({
    "WaterHeater":     WaterHeater.checked,
    "WaterChiller":    WaterChiller.checked,
    "Nutrient1Dosing": Nutrient1Dosing.checked,
    "Nutrient2Dosing": Nutrient2Dosing.checked,
    "phDosing":        phDosing.checked
  });
}
WaterChiller.onchange = function() {
  water_conditioning.set({
    "WaterHeater":     WaterHeater.checked,
    "WaterChiller":    WaterChiller.checked,
    "Nutrient1Dosing": Nutrient1Dosing.checked,
    "Nutrient2Dosing": Nutrient2Dosing.checked,
    "phDosing":        phDosing.checked
  });
}
Nutrient1Dosing.onchange = function() {
  water_conditioning.set({
    "WaterHeater":     WaterHeater.checked,
    "WaterChiller":    WaterChiller.checked,
    "Nutrient1Dosing": Nutrient1Dosing.checked,
    "Nutrient2Dosing": Nutrient2Dosing.checked,
    "phDosing":        phDosing.checked
  });
}
Nutrient2Dosing.onchange = function() {
  water_conditioning.set({
    "WaterHeater":     WaterHeater.checked,
    "WaterChiller":    WaterChiller.checked,
    "Nutrient1Dosing": Nutrient1Dosing.checked,
    "Nutrient2Dosing": Nutrient2Dosing.checked,
    "phDosing":        phDosing.checked
  });
}
phDosing.onchange = function() {
  water_conditioning.set({
    "WaterHeater":     WaterHeater.checked,
    "WaterChiller":    WaterChiller.checked,
    "Nutrient1Dosing": Nutrient1Dosing.checked,
    "Nutrient2Dosing": Nutrient2Dosing.checked,
    "phDosing":        phDosing.checked
  });
}

// atmospheric management button handlers
HumidifierMisterPump.onchange = function() {
  atmospheric_management.set({
    "HumidifierMisterPump": HumidifierMisterPump.checked,
    "DehumidifierAirPump":  DehumidifierAirPump.checked,
    "O2Concentrator":       O2Concentrator.checked,
    "CO2GasSolenoid":       CO2GasSolenoid.checked,
    "N2GasSolenoid":        N2GasSolenoid.checked
  });
}
DehumidifierAirPump.onchange = function() {
  atmospheric_management.set({
    "HumidifierMisterPump": HumidifierMisterPump.checked,
    "DehumidifierAirPump":  DehumidifierAirPump.checked,
    "O2Concentrator":       O2Concentrator.checked,
    "CO2GasSolenoid":       CO2GasSolenoid.checked,
    "N2GasSolenoid":        N2GasSolenoid.checked
  });
}
O2Concentrator.onchange = function() {
  atmospheric_management.set({
    "HumidifierMisterPump": HumidifierMisterPump.checked,
    "DehumidifierAirPump":  DehumidifierAirPump.checked,
    "O2Concentrator":       O2Concentrator.checked,
    "CO2GasSolenoid":       CO2GasSolenoid.checked,
    "N2GasSolenoid":        N2GasSolenoid.checked
  });
}
CO2GasSolenoid.onchange = function() {
  atmospheric_management.set({
    "HumidifierMisterPump": HumidifierMisterPump.checked,
    "DehumidifierAirPump":  DehumidifierAirPump.checked,
    "O2Concentrator":       O2Concentrator.checked,
    "CO2GasSolenoid":       CO2GasSolenoid.checked,
    "N2GasSolenoid":        N2GasSolenoid.checked
  });
}
N2GasSolenoid.onchange = function() {
  atmospheric_management.set({
    "HumidifierMisterPump": HumidifierMisterPump.checked,
    "DehumidifierAirPump":  DehumidifierAirPump.checked,
    "O2Concentrator":       O2Concentrator.checked,
    "CO2GasSolenoid":       CO2GasSolenoid.checked,
    "N2GasSolenoid":        N2GasSolenoid.checked
  });
}

// system maintenance button handlers
MainTankCirculation.onchange = function() {
  system_maintenance.set({
    "MainTankCirculation":      MainTankCirculation.checked,
    "MainTankAirBubbler":       MainTankAirBubbler.checked,
    "NutrientTank1Circulation": NutrientTank1Circulation.checked,
    "NutrientTank2Circulation": NutrientTank2Circulation.checked,
    "UVFilter":                 UVFilter.checked
  });
}
MainTankAirBubbler.onchange = function() {
  system_maintenance.set({
    "MainTankCirculation":      MainTankCirculation.checked,
    "MainTankAirBubbler":       MainTankAirBubbler.checked,
    "NutrientTank1Circulation": NutrientTank1Circulation.checked,
    "NutrientTank2Circulation": NutrientTank2Circulation.checked,
    "UVFilter":                 UVFilter.checked
  });
}
NutrientTank1Circulation.onchange = function() {
  system_maintenance.set({
    "MainTankCirculation":      MainTankCirculation.checked,
    "MainTankAirBubbler":       MainTankAirBubbler.checked,
    "NutrientTank1Circulation": NutrientTank1Circulation.checked,
    "NutrientTank2Circulation": NutrientTank2Circulation.checked,
    "UVFilter":                 UVFilter.checked
  });
}
NutrientTank2Circulation.onchange = function() {
  system_maintenance.set({
    "MainTankCirculation":      MainTankCirculation.checked,
    "MainTankAirBubbler":       MainTankAirBubbler.checked,
    "NutrientTank1Circulation": NutrientTank1Circulation.checked,
    "NutrientTank2Circulation": NutrientTank2Circulation.checked,
    "UVFilter":                 UVFilter.checked
  });
}
UVFilter.onchange = function() {
  system_maintenance.set({
    "MainTankCirculation":      MainTankCirculation.checked,
    "MainTankAirBubbler":       MainTankAirBubbler.checked,
    "NutrientTank1Circulation": NutrientTank1Circulation.checked,
    "NutrientTank2Circulation": NutrientTank2Circulation.checked,
    "UVFilter":                 UVFilter.checked
  });
}
