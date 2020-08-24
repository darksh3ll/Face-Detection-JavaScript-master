// 001 - Access to DOM for video and face icon
const video = document.getElementById('cam')
const face = document.getElementById('face')

Promise.all(
  [
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ]
).then(startvideo)

async function startvideo () {
  console.info('Models loaded, now I will access to WebCam')
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  })
  video.srcObject = stream
}

// 004 - Define the array with emoji
const statusIcons = {
  default: '😎',
  neutral: '🙂',
  happy: '😀',
  sad: '😥',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😳'
}

function detectExpression () {
  face.innerHTML = statusIcons.default
  const milliseconds = 500
  setInterval(async () => {
    // 007 - Wait to detect face with Expression
    const detection = await
    faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions()
    // 008 - detectAllFaces retruns an array of faces with some interesting attributes
    if (detection.length > 0) {
      // 009 - walk through all faces detected
      detection.forEach(element => {
        /**
         * for example:
         * neutral: 0.33032259345054626
         * happy: 0.0004914478631690145
         * sad: 0.6230283975601196
         * angry: 0.042668383568525314
         * fearful: 0.000010881130037887488
         * disgusted: 0.003466457361355424
         * surprised: 0.000011861078746733256
         */
        let status = ''

        let valueStatus = 0.0
        for (const [key, value] of Object.entries(element.expressions)) {
          if (value > valueStatus) {
            status = key
            valueStatus = value
          }
        }
        face.innerHTML = statusIcons[status]
      })
    } else {
      console.log('No Faces')
    }
  }, milliseconds)
}

video.addEventListener('playing', () => {
  detectExpression()
})
