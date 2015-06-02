/*
    TODO serialize
    TODO time
    TODO districts
 */

/*
@: Christoph with pattern from Simon
How to use:

 */

/*
    class AbstractFilterFunction
 */

// The abstract filter function
function AbstractFilterFunction () {
}

// Has function includeLine
AbstractFilterFunction.prototype.includeLine= function( line ){};

/*
    class ComposedFilterFunction
 */
function ComposedFilterFunction( filters ) {
    AbstractFilterFunction.call(this);
    this.filters = [];
}

//ComposedFilterFunction is now a "child" of AbstractFilterFunction
ComposedFilterFunction.prototype = new AbstractFilterFunction();
//ComposedFilterFunction uses its constructor and not of AbstractFilterFunction
ComposedFilterFunction.prototype.constructor = ComposedFilterFunction;
//method includeLine is overwritten and therefore deleted from the prototyp
delete ComposedFilterFunction.prototype.includeLine();

//JSON notation, non privileged public
ComposedFilterFunction.prototype = {
    //add a filter
    addFilter: function( filter ) {
        this.filters.push(filter)
    },

    //remove a filter
    removeFilter : function( filter ) {
        var i = this.filters.indexOf( filter );
        if(i != -1) {
            this.filters.splice(i, 1);
        } else {
            throw "Couldn't remove filter from ComposedFilterFunction";
        }
    },

    //check if the line of data is included with the current filter settings
    includeLine : function( line ){
        var length = this.filters.length;

        for( var i = 0; i < length ; i++) {
            if( !this.filters[i].includeLine( line )) return false;
        }
        return true;
    },

    getGraph : function () {
        var length = this.filters.length;

        for( var i = 0; i < length ; i++) {
            if( this.filters[i].type == "FilterTime") {
                return this.filters[i].getGraph();
            }
        }
    }
};

/*
 class FilterTime
 @startTime: String
 @endTIme: String
 Note: Date () Object http://wiki.selfhtml.org/wiki/JavaScript/Objekte/Date
 */
function FilterTime( /*timeForFilter, timeFrame*/ ) {
    AbstractFilterFunction.call(this);

    this.timeForFilter = null;
    this.timeFrame = null;
    this.graph = [];
    this.numbersInPeriod = 0;
    this.timePeriodToCheck = 1;
    //this.daysInMonth = 0;
    //this.changeTime( timeForFilter, timeFrame);
}

//FilterTime is now a "child" of AbstractFilterFunction
FilterTime.prototype = new AbstractFilterFunction();
//FilterTime uses its constructor and not of AbstractFilterFunction
FilterTime.prototype.constructor = FilterTime;
//method includeLine is overwritten and therefore deleted from the prototyp
delete FilterTime.prototype.includeLine();

//JSON notation, non privileged public
FilterTime.prototype = {
    /*
        changes the time frame
     */
    type : "FilterTime",
    timeFrameEnum : {
        DAY : 0,
        WEEK : 1,
        MONTH : 2
    },
    changeTime : function(timeForFilter, timeFrame ) {
        this.timeForFilter = this.parseTimeShort(timeForFilter);
        if(timeFrame == this.timeFrameEnum.DAY || timeFrame == this.timeFrameEnum.WEEK || timeFrame == this.timeFrameEnum.MONTH) {
            this.timeFrame = timeFrame;
        } else {
            throw "timeFrame false: " + timeFrame;
        }
        //this.daysInMonth = new Date(this.timeForFilter.getYear(),this.timeForFilter.getMonth(),0).getDate();
        console.log("Day= " + this.timeForFilter.getDate() + "Month= " + this.timeForFilter.getMonth() );
        this.numbersInPeriod = 0;
        this.timePeriodToCheck = 1;
        this.graph = [];
    },

    /*
        pareses the time to an Date() object
        Format: 2012-01-01 00:12:42.000
        @timeForFilter: String
        @return Date()
     */
    parseTimeLong : function(timeForFilter) {
        var bufferString = timeForFilter.split(" ");

        var bufferString1 = bufferString[0].split("-");
        var year = parseInt( bufferString1[0] );
        var month = parseInt( bufferString1[1] ) - 1 ; //offset
        var day = parseInt( bufferString1[2] );

        var bufferString2 = bufferString[1].split(":");
        var hour = parseInt( bufferString2[0] );
        var minute = parseInt( bufferString2[1] );
        var second = parseInt( bufferString2[2].split(".")[0] );

        return new Date( year, month, day, hour, minute, second);
    },
    /*
     pareses the time to an Date() object
     Format: dd.mm.yyyy
     @timeForFilter: String
     @return Date()
     */
    parseTimeShort : function(timeForFilter) {
        var bufferString = timeForFilter.split(".");
        var day = parseInt( bufferString[0] );
        var month = parseInt( bufferString[1] ) - 1; //offset
        var year = parseInt( bufferString[2] );

        return new Date( year, month, day, 0, 0, 0);
    },
    /*
        checks if the data line includes

        @return true
                false
     */
    includeLine: function( line ) {
        if( this.timePeriodToCheck > 31) {
            return false;
        }
        var timeName = "entlehnzeitpunkt";
        var timeToCheck = line[timeName];
        if( this.timeFrame == this.timeFrameEnum.MONTH ) { //if time under the month
            if(timeToCheck.getMonth() < this.timeForFilter.getMonth()){ //if filter is set for Month
                return false;
            } else {
                if( this.timePeriodToCheck == timeToCheck.getDate() ) { //if the day you are looking at
                    this.numbersInPeriod ++;
                    return true;
                } else {
                    if( this.timePeriodToCheck > timeToCheck.getDate() ) { //if you passed the month
                        this.graph.push( this.numbersInPeriod );
                        this.timePeriodToCheck = 32; // now returns always false
                        return false;
                    } else {
                        this.timePeriodToCheck++;
                        this.graph.push( this.numbersInPeriod );
                        this.numbersInPeriod = 1;
                        return true;
                    }
                }
            }
        } else if(this.timeFrame == this.timeFrameEnum.WEEK){

        } else if(this.timeFrame == this.timeFrameEnum.DAY){

        }
    },
    getGraph : function() {
        this.numbersInPeriod = 0;
        this.timePeriodToCheck = 1;
        return this.graph;
    }

};


/*
 class FilterLocation
 @locationFilt: String the location (all = alle, one number = district, many numbers = districts
 @pathToLoxationFile: String path to file CITYBIKEOGD.csv
 */
function FilterLocation( locationFilt, pathToLocationFile ) {
    AbstractFilterFunction.call(this);
    this.pathToLocationFile = pathToLocationFile;
    this.locationFilt = locationFilt;
}

//FilterTime is now a "child" of AbstractFilterFunction
FilterLocation.prototype = new AbstractFilterFunction();
//FilterTime uses its constructor and not of AbstractFilterFunction
FilterLocation.prototype.constructor = FilterLocation;
//method includeLine is overwritten and therefore deleted from the prototyp
delete FilterLocation.prototype.includeLine();

//JSON notation, non privileged public
FilterLocation.prototype = {
    /*
     changes the time frame
     */
    type: "FilterLocation",
    includeLine: function( line ) {

    },
    /*

     */
    setLocationFilt : function ( locationFilt ) {

    },
    /*
        all = get all stations
     */
    getStationsFromDistrict : function( district ) {
        var cssv = d3.dsv(";", "text/plain");

        cssv(this.pathToLocationFile, function(d){
            return{

            }
        }, function (error, data) {
            if (error != null) {
                console.log(error);
            }

            if (data == null) {
                throw "data is null";
            } else {
                var length = data.length;
                for (var i = 0; i < length; i++) {
                    if( district == "all" ) {

                    } else if (district === parseInt(district, 10)){

                    } else {

                    }
                }
            }
        });

    }
}

