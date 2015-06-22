var checkedBoxes = [];
var sumCheckedBoxes;

function addCheck() {

	sumCheckedBoxes++;
	allChecked();
	
} 

function removeCheck() {

	sumCheckedBoxes--;
	allChecked();

} 

function checkAllWien(source) {

  var checkBoxes = document.getElementsByName('checkWien');
  for(var i=0, n=checkBoxes.length;i<n;i++) {
    checkBoxes[i].checked = source.checked;
    console.log(source);
  }
	allChecked();

}

function checkAllStations(source) {

var id=source.id; 
console.log(id);
var stationID;

if ( id.indexOf("w") > -1 ) {
	stationID = + id.replace("w","");
} else {
	stationID = + id.replace("s","");
}
console.log(stationID);

  var checkBoxes = document.getElementsByName('station'+stationID);
  for(var i=0, n=checkBoxes.length;i<n;i++) {
    checkBoxes[i].checked = source.checked;
    console.log("CHECK"+id);
  }
	//allChecked();    
	console.log("CHECK"+id);

}

function allChecked() {
   
	var ganzWien = document.getElementById("WIEN").checked;

		sumCheckedBoxes++;
		if (sumCheckedBoxes==23)
	   		ganzWien = true;
		else ganzWien = false;
}

function checkStationsOfDistrict(id, check) {

if (check) 
	document.getElementById('s'+id).style.opacity="1";
else document.getElementById('s'+id).style.opacity="0.5";

    console.log(check);
  var checkBoxes = document.getElementsByName('station'+id);
  for(var i=0, n=checkBoxes.length;i<n;i++) {
    checkBoxes[i].checked = check;
    console.log(i);

  }
  

	//allChecked();

}

