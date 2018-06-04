var colors = [];
var mode=6;
var pickedColor;

var squares=document.querySelectorAll('.square');
var colorDisplay=document.getElementById('colorDisplay')
var reset=document.getElementById('reset')
var messageDisplay=document.querySelector('#message');
var h1=document.querySelector('h1');
var easy = document.querySelector('#easy');
var hard = document.querySelector('#hard');

init();

function init(){

	//Event Listenrers for Color Boxes
	for(var i=0;i<squares.length;i++){
		squares[i].addEventListener('click',function(){
			var clickedColor=this.style.backgroundColor;
			if (clickedColor!=pickedColor){
				this.style.backgroundColor="#232323";
				messageDisplay.textContent="Try Again";	
			}
			else{
				for(var j=0;j<squares.length;j++){
					squares[j].style.backgroundColor=pickedColor;
				}
				h1.style.backgroundColor=pickedColor;
				reset.textContent="Play Again?"
				messageDisplay.textContent="Correct!";
			}
			console.log(clickedColor,pickedColor);
		});
	};
	gameReset(mode);
}


easy.addEventListener('click',function(){
	//change the style of buttons
	easy.classList.add("selected");
	hard.classList.remove("selected");
	//genrate new colors
	mode=3;
	gameReset(mode);	
});

hard.addEventListener('click',function(){
	//change the style of buttons
	hard.classList.add("selected");
	easy.classList.remove("selected");
	//genrate new colors
	mode=6;
	gameReset(mode);		
});


reset.addEventListener('click',function(){
	gameReset(mode);
});

function gameReset(num){
	//Create new colors
	colors=colorArray(num);
	pickedColor=randomPick();
	//show new colors
	for(var i=0; i<colors.length;i++){
		squares[i].style.backgroundColor=colors[i];
		if(num==3){
			squares[i+3].style.display='none';
		}else{
			squares[i].style.display="block";
		}
	}
	//change the h1 background
	h1.style.backgroundColor="steelblue";
	//change the button display
	reset.textContent="New Colors";
	//reset the info field
	messageDisplay.textContent="";
	//display the picked color
	colorDisplay.textContent=pickedColor;

}

function randomPick(){
	//picking a random index
	var random = Math.floor(Math.random()*colors.length)
	//return the random color at that index
	return colors[random];
}

function colorArray(num){
	//make an array
	var arr=[];
	//add random collors to it
	for(var i=0;i<num;i++){
		//get random colors
		//push to color
		arr.push(randomColor());
	}
	//return the array
	return arr
}

function randomColor(){
	//pick a red from 0 to 255
	var r = Math.floor(Math.random()*255)
	//pick a green from 0 to 255
	var g = Math.floor(Math.random()*255)
	//pick a blue from 0 to 255
	var b = Math.floor(Math.random()*255)
	return "rgb(" + r +", " + g +", " + b + ")";
}



