var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
	showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}

function showSlides(n) {
	console.log('Hello');
	console.log(n);
	var i;
	var slides = document.getElementsByClassName("card");
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}
	slides[slideIndex-1].style.display = "block";

	var modal = document.getElementById("myModal");
	modal.onclick = function() {
		modal.style.display = "block";
	}
	if (n === slides.length) {
		console.log('no more');
	}
}
