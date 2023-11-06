export function logicalCentreCoord(coords){
    let sumLat = 0;
    let sumLon = 0;

    for (const coord of coords) {
        const [lat, lon] = coord.split(',').map(parseFloat);

        if (!isNaN(lat) && !isNaN(lon)) {
            sumLat += lat;
            sumLon += lon;
        }
    }

    const averageLatitude = sumLat / coords.length;
    const averageLongitude = sumLon / coords.length;

    const logicalCenter = [Math.round(averageLatitude), Math.round(averageLongitude)];

    console.log("Logical Center Coordinate:", logicalCenter);
    return logicalCenter;
}