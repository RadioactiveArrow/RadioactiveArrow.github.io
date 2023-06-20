// Create an array to hold your stations
var stations = [
    new Point(200,0),
    new Point(100,100),
    new Point(100,1000)
];


// First, create the paths (lines between stations)
for (var i = 1; i < stations.length; i++) {
    new Path.Line({
        from: stations[i - 1],
        to: stations[i],
        strokeColor: 'black',
        strokeWidth: 5
    });
}


// Create the station objects and paths (lines between stations)
for (var i = 0; i < stations.length; i++) {
    

    // if (i > 0) {
    //     new Path.Line({
    //         from: stations[i - 1],
    //         to: stations[i],
    //         strokeColor: 'black',
    //         strokeWidth: 5,
    //     });
    // }

    var station = new Path.RegularPolygon(stations[i], 3, 15);
    station.fillColor = '#00ffff';
    // var station = new Path.Square({
    //     center: stations[i],
    //     radius: i % 2 == 0 ? 10 : 0,
    //     fillColor: 'black'
    // });
    station.data = {
        name: 'Station ' + (i + 1)
    };

    // Add an event handler to make the station interactive
    station.onMouseDown = function(event) {
        alert('You clicked on ' + this.data.name);
    };
}
