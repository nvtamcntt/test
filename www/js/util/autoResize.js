module
.controller('ResizeController', function($scope) {
	var ta = document.getElementById("ta");
	ta.style.lineHeight = "20px";//init
	ta.style.height = "120px";//init
	
	 $('#comment').bind('keyup',function(){
        var thisValueLength = $(this).val().length;
        $('.count').html(thisValueLength);
    });
    
	ta.addEventListener("input",function(evt){
	    if(evt.target.scrollHeight > evt.target.offsetHeight){   
	        evt.target.style.height = evt.target.scrollHeight + "px";
	    }else{
	        var height,lineHeight;
	        while (true){
	            height = Number(evt.target.style.height.split("px")[0]);
	            lineHeight = Number(evt.target.style.lineHeight.split("px")[0]);
	            evt.target.style.height = height - lineHeight + "px"; 
	            if(evt.target.scrollHeight > evt.target.offsetHeight){
	                evt.target.style.height = evt.target.scrollHeight + "px";
	                break;
	            }
	        }
	    }
	});
});
