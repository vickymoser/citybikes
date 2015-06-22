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
    global vars
 */

var graphCounter;
var graphFilterObject;

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
    1.Filter: time
    2.Filter: location
 */
function ComposedFilterFunction( timeForFilterStart,timeForFilterEnd,stations ) {
    AbstractFilterFunction.call(this);
    graphCounter = 1;
    this.positionTimeFilter = 0;
    this.positionLocationFilter = 1;
    this.numbOfFilters = 2;
    var buffTimeFilter = new FilterTime();
    buffTimeFilter.changeTime(timeForFilterStart,timeForFilterEnd);
    var buffLocationFilter = new FilterLocation(stations);
    this.filters = [];
    this.addFilter(buffTimeFilter);
    this.addFilter(buffLocationFilter);

    graphFilterObject = [];
    graphFilterObject.push(new Array(buffLocationFilter.getNumbOfStations()))
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
        for( var i = 0; i < this.numbOfFilters ; ++i) {
            if( !(this.filters[i].includeLine( line ))) return false;
        }
        return true;
    },

    getGraph : function () {
        var buffGraph = graphFilterObject;
        graphFilterObject = [];
        graphFilterObject.push(new Array(this.filters[this.positionLocationFilter].getNumbOfStations()))
        this.filters[this.positionTimeFilter].resetVars();
        this.filters[this.positionLocationFilter].resetVars();
        return buffGraph;
    },

    getNumbOfStations : function() {
        return this.filters[this.positionLocationFilter].getNumbOfStations();
    }
};

/*
 class FilterTime
 @startTime: String
 @endTIme: String
 Note: Date () Object http://wiki.selfhtml.org/wiki/JavaScript/Objekte/Date
 */
function FilterTime() {
    AbstractFilterFunction.call(this);

    this.timeForFilterStart = null;
    this.timeForFilterEnd = null;
    this.timeFrameCounter = 0;
    this.done = false;
    this.isDay = false;
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
    changeTime : function(timeForFilterStart, timeForFilterEnd ) {
        this.timeForFilterStart = this.parseTimeShort(timeForFilterStart);
        this.timeForFilterEnd = this.parseTimeShort(timeForFilterEnd);

        if( this.timeForFilterStart.getMonth() == this.timeForFilterEnd.getMonth() && this.timeForFilterStart.getDate() == this.timeForFilterEnd.getDate() ){
            this.isDay = true;
            console.log("is Day");
        } else {
            this.isDay = false;
            console.log("isn't Day");
        }
        //this.daysInMonth = new Date(this.timeForFilter.getYear(),this.timeForFilter.getMonth(),0).getDate();
        console.log("Day= " + this.timeForFilterStart.getDate() + " Month= " + this.timeForFilterStart.getMonth() );
        console.log("Day= " + this.timeForFilterEnd.getDate() + " Month= " + this.timeForFilterEnd.getMonth() );
        //console.log("daysInMonth= " + new Date( this.timeForFilterStart.getYear(), this.timeForFilterStart.getMonth(),0).getDate() );

        if( this.isDay ) {
            this.timeFrameCounter = 0;
        } else {
            this.timeFrameCounter = this.timeForFilterStart.getDate();
        }
        graphCounter = 0;
        this.done = false;
    },

    resetVars : function() {
        if( this.isDay ) {
            this.timeFrameCounter = 0;
        } else {
            this.timeFrameCounter = this.timeForFilterStart.getDate();
        }
        this.done = false;
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
        if( this.done ) {
            return false;
        }
        var timeName = "entlehnzeitpunkt";
        var timeToCheck = line[timeName];
        //console.log(timeToCheck);
        if( this.isDay ) { //if time under the month
            if( timeToCheck.getMonth() == this.timeForFilterStart.getMonth() && timeToCheck.getDay() == this.timeForFilterStart.getDay() ) {
                if( this.timeFrameCounter == timeToCheck.getHours() ) { //if the day you are looking at
                    return true;
                } else {
                    ++this.timeFrameCounter;
                    ++graphCounter;
                    return true;
                }
            } else {
                var newTimeToCheck = new Date( timeToCheck.getFullYear(), timeToCheck.getMonth(), timeToCheck.getDate(), 0, 0, 0, 0);
                if ( newTimeToCheck.getTime() > this.timeForFilterEnd.getTime() ) {
                    this.done = true;
                }
                return false;
            }
        } else {
            var newTimeToCheck = new Date( timeToCheck.getFullYear(), timeToCheck.getMonth(), timeToCheck.getDate(), 0, 0, 0, 0);
            //console.log(newTimeToCheck.getTime() + " < " + this.timeForFilterStart.getTime() );
            if( newTimeToCheck.getTime() < this.timeForFilterStart.getTime() ){ //if filter is set for Month
                return false;
            } else {

                if( newTimeToCheck.getTime() > this.timeForFilterEnd.getTime() ) {
                    this.done = true;
                    return false;
                } else {
                    if( this.timeFrameCounter == timeToCheck.getDate() ) { //if the day you are looking at
                        return true;
                    } else {
                        this.timeFrameCounter = timeToCheck.getDate();
                        ++graphCounter;
                        return true;
                    }
                }
            }
        }
    }

};


/*
 class FilterLocation
 @locationFilt: String the location (all = alle, one number = district, many numbers = districts
 @pathToLoxationFile: String path to file CITYBIKEOGD.csv
 */
function FilterLocation( locationFilt ) {
    AbstractFilterFunction.call(this);
    this.locationFilt = locationFilt;
    this.numberOfStations = this.locationFilt.length;
    this.buffGraphCounter = 0;
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
         changes the stations
     */
    type: "FilterLocation",
    includeLine: function( line ) {
        var locationName = "entlehnstation";
        var locationToCheck = line[locationName];
        for(var i = 0; i < this.numberOfStations; ++i ) {
            if( locationToCheck == this.locationFilt[i] ) {
                if( this.buffGraphCounter != graphCounter ) {
                    for(var j = this.buffGraphCounter; j < graphCounter; ++j ) {
                        graphFilterObject.push(new Array(this.numberOfStations));
                    }
                    this.buffGraphCounter = graphCounter;
                }
                if( graphFilterObject[graphCounter][i] == undefined ) {
                    graphFilterObject[graphCounter][i] = 1;
                } else {
                    ++graphFilterObject[graphCounter][i];
                }
                return true;
            }
        }
        return false;
    },
    /*

     */
    setLocationFilt : function ( locationFilt ) {
        this.buffGraphCounter = 0;
        this.locationFilt = locationFilt;
        this.numberOfStations = this.locationFilt.length;
    },
    getNumbOfStations: function() {
        return this.locationFilt.length;
    },
    getSelectedStations: function() {
        return this.locationFilt;
    },
    resetVars: function() {
        this.buffGraphCounter = 0;
    }

}

