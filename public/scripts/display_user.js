var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
	showSlides(slideIndex += n);
	document.getElementById("rateForm").submit();
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("card");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  console.log(n);
  slides[slideIndex-1].style.display = "block";
  var modal = document.getElementById("myModal");
	modal.onclick = function() {
		modal.style.display = "block";
	}
	var span = document.getElementsByClassName("close")[0];
	
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() { 
		// Get the <span> element that closes the modal
	  modal.style.display = "none";
	}
}
