/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+                          Calendar JS  v2.2                           +
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+ Copyright (C) 2005-06 by Michael Loesler, http://derletztekick.de    +
+                                                                      +
+                                                                      +
+ This program is free software; you can redistribute it and/or modify +
+ it under the terms of the GNU General Public License as published by +
+ the Free Software Foundation; either version 2 of the License, or    +
+ (at your option) any later version.                                  +
+                                                                      +
+ This program is distributed in the hope that it will be useful,      +
+ but WITHOUT ANY WARRANTY; without even the implied warranty of       +
+ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        +
+ GNU General Public License for more details.                         +
+                                                                      +
+ You should have received a copy of the GNU General Public License    +
+ along with this program; if not, write to the                        +
+ Free Software Foundation, Inc.,                                      +
+ 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.            +
+                                                                      +
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

var now = new Date(); 
var date = now.getDate();
var month = now.getMonth();
var year = now.getFullYear();

function prevMonth(pm, py){
	if (pm == 0){
		pm = 11;
		py -= 1;
	} 
	else{
		pm -= 1;
	}
	getCalendar(pm, py);
}

function nextMonth(nm, ny){
	if (nm == 11){
		nm = 0;
		ny += 1;
	} 
	else{
		nm += 1;
	}
	getCalendar(nm, ny);
}

function getCalendar(mm, yy){
	var sevendaysaweek = 0;
	var begin = new Date(yy,mm,1);
	var firstday = begin.getDay()-1;
	if (firstday < 0){
		firstday = 6;
	}
	dayname = new Array("Mo","Di","Mi","Do","Fr","Sa","So");
	monthname = new Array("Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember");
	dayspermonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	if ((yy%4==0) && ((yy%100!=0) || (yy%400==0))){
		dayspermonth[1] = 29;
	}
	if ((mm != month) || (yy != year)){
		var today = '';
	}
	else {
		var today = date+'.';
	}
	var showcalendar = document.getElementById("calendar");
	for (var i=0; i<showcalendar.childNodes.length; i++){
		showcalendar.removeChild(showcalendar.childNodes[i]);
	}
	var newCalTable = document.createElement('table');
	newCalTable.id = "caltable";
	
	var newCalTHead = document.createElement('thead');
	var newCalTBody = document.createElement('tbody');

	var newCalRow = document.createElement('tr');
	
	var newCalHead = document.createElement('th');
	newCalHead.className = "select";
	newCalHead.title = "vorheriger";
	newCalHead.appendChild(document.createTextNode("«"));
	try { newCalHead.style.cursor = "pointer"; }
	catch(e){ newCalHead.style.cursor = "hand"; }
	newCalHead.onclick=function () { prevMonth(mm, yy); };
	newCalRow.appendChild(newCalHead);
		
	var newCalHead = document.createElement('th');
	newCalHead.colSpan = 5;
	newCalHead.appendChild(document.createTextNode(today+" "+monthname[mm]+" "+yy));
	newCalRow.appendChild(newCalHead);
	
	var newCalHead = document.createElement('th');
	newCalHead.className = "select";
	newCalHead.title = "nächster";	
	newCalHead.appendChild(document.createTextNode("»"));
	try { newCalHead.style.cursor = "pointer"; }
	catch(e){ newCalHead.style.cursor = "hand"; }
	newCalHead.onclick=function () { nextMonth(mm, yy); };
	
	newCalRow.appendChild(newCalHead);
	newCalTHead.appendChild(newCalRow);
	
	var newCalRow = document.createElement('tr');
	for (var i=0; i<dayname.length; i++){
		var newCalDayname = document.createElement('td');
		newCalDayname.className = "days";
		newCalDayname.appendChild(document.createTextNode(dayname[i]));
		newCalRow.appendChild(newCalDayname);
	}
	newCalTBody.appendChild(newCalRow);
	
	var newCalRow = document.createElement('tr');
	for (var i=0; i<firstday; i++){
		var newCalDays = document.createElement('td');
		newCalDays.appendChild(document.createTextNode(String.fromCharCode(160)));
		newCalRow.appendChild(newCalDays);
		sevendaysaweek++;
	}
	
	for (var i=1; i<=dayspermonth[mm]; i++){
		if (dayname.length == sevendaysaweek){
			newCalTBody.appendChild(newCalRow);
			var newCalRow = document.createElement('tr');
			var newCalDays = document.createElement('td');
			newCalDays.appendChild(document.createTextNode(i));
			newCalRow.appendChild(newCalDays);
			sevendaysaweek = 0;
		}
		else {
			var newCalDays = document.createElement('td');
			newCalDays.appendChild(document.createTextNode(i));
			newCalRow.appendChild(newCalDays);
		}
		sevendaysaweek++;
	}
	
	for (var i=sevendaysaweek; i<dayname.length; i++){
		var newCalDays = document.createElement('td');
		newCalDays.appendChild(document.createTextNode(String.fromCharCode(160)));
		newCalRow.appendChild(newCalDays);
	}
	
	newCalTBody.appendChild(newCalRow);
	
	newCalTable.appendChild(newCalTHead);
	newCalTable.appendChild(newCalTBody);
	showcalendar.appendChild(newCalTable);
}	

var oldonload=null;
if (typeof(window.onload) != "undefined" ){
	oldonload=window.onload;
}
window.onload = function() { if(oldonload != null) {oldonload();} getCalendar(month, year); };