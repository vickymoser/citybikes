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

  var checkBoxes = document.getElementsByName('checkStation');
  for(var i=0, n=checkBoxes.length;i<n;i++) {
    checkBoxes[i].checked = source.checked;
    console.log(source);
  }
	allChecked();

}

function allChecked() {
   
	var ganzWien = document.getElementById("WIEN").checked;

		sumCheckedBoxes++;
		if (sumCheckedBoxes==23)
	   		ganzWien = true;
		else ganzWien = false;
}
