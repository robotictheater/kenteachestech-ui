function showMobileNav() {
  var x = document.getElementById("mobileNav");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else { 
    x.className = x.className.replace(" w3-show", "");
  }
}

window.modal={
    set:function(content, config){

        let html='<div id="w3Modal" class="w3-modal" style="display:none;"><div class="w3-modal-content" style="'+((config && config.width) ? "width:"+config.width : "")+'"><div class="w3-container"><span onclick="modal.hide();" class="w3-button w3-display-topright">&times;</span>';
        html+='<div class="_p-2">'+content+'</div>'
        html+='</div></div></div>';
        document.body.insertAdjacentHTML("beforeend", html);

    },
    show:function(content){
        if(content && !document.getElementById('w3Modal')){
            this.set(content);
            document.getElementById('w3Modal').style.display='block';
        }else{
            document.getElementById('w3Modal').style.display='block';
        }
    },
    hide:function(){
        document.getElementById('w3Modal').style.display='none'
        document.getElementById("w3Modal").parentNode.removeChild(document.getElementById("w3Modal"));   
    }
};