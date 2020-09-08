// var image_file = document.getElementById('fileToUpload');
// // var upload = document.getElementsById('upload');
// var canvas = document.getElementById('canvas');
// var pseudoCanvas = document.getElementById('pseudo-canvas');
// // var previewElement = document.getElementById('preview');
// var context = canvas.getContext("2d");
// image_file.addEventListener("change", () => {
// 	var piece = null;
// 	for (var i=0; i < image_file.files.length; i++)
// 	{
// 		var file = image_file.files[i];
// 		if (file.type.match(/image\/*/))
// 		piece = file;
// 	}
// 	if (piece != null)
// 	{
// 		var pic = new Image();
// 		pic.onload = () => {
// 			canvas.style.display = "flex";
// 			pseudoCanvas.style.display = "initial";
			
// 			canvas.height = pic.height;
// 			canvas.width = pic.width;
// 			pseudoCanvas.width = pic.width;
// 			pseudoCanvas.height = pic.height;
// 			console.log(canvas.offsetWidth);
// 			context.drawImage(pic, 0, 0);
// 			canvas.style.position = 'absolute';
// 			// addSticker.disabled = false;
// 			// save.disabled=false;
// 			// reset.disabled = false;
// 		}
// 		pic.src = URL.createObjectURL(piece);
// 		console.log("pic.src=> ");
// 		console.log(pic.src);
		
// 	}
// });
			
// function upload() {
// 	var pic_data = canvas.toDataURL('image/png');
// 	const data = { pic_data };
// 	console.log(data);
// 	const options = {
// 		method: 'POST',
// 		body: JSON.stringify(data)
// 	};
// 	console.log("here");
// 	fetch('/setting/upload', options);
// };

const handleImageUpload = event => {
	const files = event.target.files
	const formData = new FormData()
	formData.append('myFile', files[0])
  
	fetch('/setting/upload', {
	  method: 'POST',
	  body: formData
	})
	.then(response => response.json())
	.then(data => {
	  console.log(data.path)
	})
	.catch(error => {
	  console.error(error)
	})
  }
  
  document.querySelector('#fileToUpload').addEventListener('change', event => {
	handleImageUpload(event)
  })