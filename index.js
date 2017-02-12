var _ = require('lodash/fp');
const IMAGE_RADIUS = 20
const IMAGE_SIDE_LENGTH = IMAGE_RADIUS*2
const N_POINTS = IMAGE_RADIUS

const TOTAL_DURATION_MS = 1500
const FRAME_DELAY = 3 // In hundreths of seconds. That is the gif standard
const MAX_PARTICLE_VELOCITY = IMAGE_RADIUS // In pixels per second
const MIN_PARTICLE_VELOCITY = IMAGE_RADIUS/2 // In pixels per second

const pointInfos = _.range(0,N_POINTS).map(()=>({
	theta: Math.random()*2*Math.PI,
	velocity: MIN_PARTICLE_VELOCITY + (MAX_PARTICLE_VELOCITY - MIN_PARTICLE_VELOCITY) * Math.random(),
	decayTime: Math.random()*(TOTAL_DURATION_MS-1)/1000
}))

const N_FRAMES = Math.floor(TOTAL_DURATION_MS / FRAME_DELAY / 10) // 1 frame per ten milliseocnds. GIF minimum frame rate is 100fps
const frameFileNames = _.map(frameNumber => {
	const time = frameNumber * FRAME_DELAY / 100
	const pointLocations = _.flow([
		_.filter(pointInfo => pointInfo.velocity * time < IMAGE_RADIUS && pointInfo.decayTime > time),
		_.map(pointInfo => [Math.sin(pointInfo.theta)*pointInfo.velocity*time, Math.cos(pointInfo.theta)*pointInfo.velocity*time])
		])(pointInfos)
	process.stderr.write(time+'\n')
	const frameFileName = "frame" + frameNumber+ ".miff"
	console.log("convert -size " + IMAGE_SIDE_LENGTH + "x" + IMAGE_SIDE_LENGTH + " xc:black -fill white -draw '"
		+ _.map(p=>'point '+(p[0]+IMAGE_RADIUS)+','+(p[1]+IMAGE_RADIUS),pointLocations).join(' ')
		+ "' " + frameFileName)
	return frameFileName
}, _.range(0,N_FRAMES))
console.log("convert -dispose None -delay " + FRAME_DELAY + " " + frameFileNames.join(' ') + " -loop 1 test.gif")