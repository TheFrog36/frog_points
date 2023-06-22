const canvas = document.getElementById("canvas")

const maxHeight = canvas.clientHeight
const maxWidht = canvas.clientWidth
canvas.width = maxWidht
canvas.height = maxHeight
const ctx = canvas.getContext('2d')
const maxAxisSpeed = 3
const minDistance = 100; 
const approximation = 1;
const slowAnchorDistance = 30

ctx.fillStyle = "cyan";
ctx.clientWidth = 5;

const frogPoints = [
    [124, 120],
    [156, 102],
    [192, 120],
    [214, 162],
    [91, 175],
    [180, 175],
    [221, 175],
    [124, 230],
    [156, 230],
    [192, 230],
    [273, 230],
    [264, 245],
    [65, 278],
    [65, 337],
    [90, 390],
    [136, 433],
    [180, 463],
    [230, 481],
    [280, 481]
]
const anchorIndex = 13
const mainAnchor = {
    x: frogPoints[anchorIndex][0],
    y: frogPoints[anchorIndex][1],
}
const length = frogPoints.length
for(let i = 0; i < length; i++){
    const updatedPoint = []
    updatedPoint[0] = frogPoints[i][0]
    updatedPoint[1] = frogPoints[i][1]
    updatedPoint[0] = 600 - updatedPoint[0]
    frogPoints.push(updatedPoint)
}

console.log(frogPoints)


const pointsArray = [];
for(let i = 0; i < frogPoints.length; i++){
    const point = {}
    let xDir = Math.round(Math.random()) == 0 ? -1 : 1
    let yDir = Math.round(Math.random()) == 0 ? -1 : 1
    point.x = frogPoints[i][0]
    point.y = frogPoints[i][1]
    // point.vy = (Math.random() * maxAxisSpeed) * yDir
    // point.vx = (Math.random() * maxAxisSpeed) * xDir 
    point.vy = maxAxisSpeed * yDir
    point.vx = maxAxisSpeed * xDir 
    // point.vx = 0
    // point.vy = 0
    pointsArray.push(point)
}
pointsArray[anchorIndex].vx = maxAxisSpeed
pointsArray[anchorIndex].vy = maxAxisSpeed

console.log(pointsArray)

// for(let i = 0; i < numberPoints; i++){
//     const point = pointsArray[i]
//     ctx.fillRect(point.x, point.y, 1, 1);
// }    

function updatePoints(points, maxHeight, maxWidht){
    const distanceFromMainAnchor = getDistanceBetween2Points(points[anchorIndex], mainAnchor) 
    let newSpeed;
    if(distanceFromMainAnchor < slowAnchorDistance){
        newSpeed = 0.5 + distanceFromMainAnchor / slowAnchorDistance * maxAxisSpeed
    } else {
        newSpeed = maxAxisSpeed
    }
    for(let i = 0; i < points.length; i++){
        const point = points[i]
        point.vx = point.vx > 0 ? newSpeed : -newSpeed
        point.vy = point.vy > 0 ? newSpeed : -newSpeed
        point.x = point.x + point.vx
        point.y = point.y + point.vy
        if(point.x > maxWidht) {
            point.x = maxWidht - point.x + maxWidht
            point.vx = -point.vx
        }
        if(point.x < 0) {
            point.x = 0 - point.x
            point.vx = -point.vx
        }
        if(point.y > maxHeight) {
            point.y = maxHeight - point.y + maxHeight
            point.vy = -point.vy
        }
        if(point.y < 0) {
            point.y = 0 - point.y
            point.vy = -point.vy
        }
    }    
}

function drawPoints(points){
    for(let i = 0; i < points.length; i++){
        const point = points[i]
        ctx.fillRect(point.x, point.y, 1, 1);
    }    
}


setInterval(() =>{
    ctx.clearRect(0,0, maxWidht, maxHeight)
    updatePoints(pointsArray, maxHeight, maxWidht)
    drawPoints(pointsArray)
    calculateLines(pointsArray)
}, 17)

function getDistanceBetween2Points(a, b){
    const square = (a.x - b.x)**2  + (a.y - b.y)**2
    // return Math.floor(fastSquareRoot(square, 1))
    return Math.floor(Math.sqrt(square))
}

function calculateLines(points){
    for(let i = 0; i < points.length - 1; i++){
        const p1 = points[i]
        for(let j = 0; j < points.length; j++){
            const p2 = points[j]
            if(Math.abs(p1.x-p2.x) > minDistance) continue
            if(Math.abs(p1.y-p2.y) > minDistance) continue
            
            const pointsDistance = getDistanceBetween2Points(p1, p2)
            if(pointsDistance < minDistance){
                const dum = pointsDistance / minDistance
                const width = 3 - dum * 3
                const green = 255 - Math.floor(dum * 255)
                const color = `rgba(${green},${green},255, ${dum})`
                // const color = `rgba(255, 255, 255, ${dum})`
                drawLine(ctx, [p1.x, p1.y], [p2.x, p2.y], color, width);
            }
        }
    }
}

function fastSquareRoot(square, approximation){
    let x = square
    let root
    while(1){
        root = 0.5 * (x + (square / x))
        if (Math.abs(root - x) < approximation)
            break;
        x = root;
    }
    return root;
}


function drawLine(ctx, begin, end, stroke = 'black', width = 1) {
    if (stroke) {
        ctx.strokeStyle = stroke;
    }
    if (width) {
        ctx.lineWidth = width;
    }
    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.stroke();
}


// if (canvas.getContext) {
//     const ctx = canvas.getContext('2d');
//     drawLine(ctx, [100, 100], [100, 300], 'cyan');
// }