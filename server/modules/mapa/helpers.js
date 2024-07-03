



//GET DISTANCE BETWEEN NODES

function getDistanceBetweenPoints(id1, id2, nodosPlanta) {
    const point1 = nodosPlanta.find(point => point.id === id1);
    const point2 = nodosPlanta.find(point => point.id === id2);
    
    if (!point1 || !point2) {
        console.error('One or both IDs are not found in the array', point1, point2);
        return null;
    }
    
    const [x1, y1] = point1.latlng;
    const [x2, y2] = point2.latlng;
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    // console.log(`Distance: ${distance}`);
    return distance;
}

module.exports = {getDistanceBetweenPoints}