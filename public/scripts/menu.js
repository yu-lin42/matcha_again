function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
    x.className += " responsive";
    } else {
    x.className = "topnav";
	}

	var header = document.getElementById("myDiv");
	var tabs = header.getElementsByClassName("tab");
	for (var i = 0; i < tabs.length; i++) {
	  tabs[i].addEventListener("click", function() {
	  var current = document.getElementsByClassName("active");
	  current[0].className = current[0].className.replace(" active", "");
	  // If there's no active class
	  if (current.length > 0) {
		current[0].className = current[0].className.replace(" active", "");
	  }
  
	  // Add the active class to the current/clicked button
	  this.className += " active";
	  });
	}
}