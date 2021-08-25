let video = null

function loadCamera(){
	//Captura elemento de vídeo
	video = document.querySelector("#webCamera");
		//As opções abaixo são necessárias para o funcionamento correto no iOS
		video.setAttribute('autoplay', '');
	    video.setAttribute('muted', '');
	    video.setAttribute('playsinline', '');
	    //--
	
	//Verifica se o navegador pode capturar mídia
	if (navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: 'user'}})
		.then( function(stream) {
			//Definir o elemento vídeo a carregar o capturado pela webcam
			video.srcObject = stream;
		})
		.catch(function(error) {
			alert("Oooopps... Falhou :'(");
		});
	}

	video.videoWidth = 224
	video.videoHeight = 224
}

function loadModel(){
const uploadJSONInput = document.getElementById('upload-json');
const uploadWeightsInput = document.getElementsByClassName('upload-weights');
tf.loadGraphModel(tf.io.browserFiles(
     [uploadJSONInput.files[0], uploadWeightsInput[0].files[0], uploadWeightsInput[1].files[0],uploadWeightsInput[2].files[0]]
     )
).then( (mod) => {
     model = mod
})
}

document.getElementById('loadModel').addEventListener('click', loadModel)

let model = null


loadCamera()




const labels = ['Down', 'Left', 'None', 'Right', 'Up']




function predict(){

	const reading = tf.image.resizeBilinear(tf.browser.fromPixels(video), [224,224])

	const theTENSOR = imageToFloat(reading)
	const t4d = tf.tensor4d(Array.from(theTENSOR.dataSync()),[1,224,224,3])

	const pred = model.predict(theTENSOR).arraySync()

	let indexOfMaxValue = pred.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)

	document.getElementsByTagName('h1')[0].innerText = "Predict: " + labels[indexOfMaxVlaue] + "\n" + Math.max.apply(null, pred)
}

function imageToFloat(img){
    const imgArr = img.arraySync()
    const floatArr = imgArr.map( (line) => {
        return line.map( (elm) => {
            return Float32Array.from(elm)
        })
    })
    return tf.tensor(floatArr)
}














