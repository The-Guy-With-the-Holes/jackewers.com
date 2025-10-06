//#%#%#%#%#%#%#%#%#%#%##%%#%#%#%#%#%#%
//              Tools
//#%#%#%#%#%#%#%#%#%#%#%#%##%%#%#%#%#


// Required
let appendTool = function(name,img,func){ if ( !img || !name){ console.error('cannot append tool');}
  let E = document.getElementById('Tools-Extended');
  
  let ele = document.createElement('img');
  setAttributes(ele,{'name':name,'alt':name,'src':img,'class':'tool-icons','onclick':func});
 document.getElementById('Tools-Extended').append(ele);
}

function appendToolbar(){
      let ToolBar = createElement('div',{id:'Tools'}); 
      let span = createElement('span',{id:'Tools-Extended',className:'HiddenTools'});
      
      let i = createElement('img',{src:requestRoot('BusinessCard')+'i/Templates/Tools.png',id:'Tools-Switch',className:'tool-icons'});
      i.setAttribute('onclick',"switchTools('open')");
      
      ToolBar.append(i,span);
      document.body.append(ToolBar);
      for(ele in Tools){appendTool(Tools[(ele)][0],Tools[(ele)][1],Tools[(ele)][2],);}
}

function switchTools(arg){
  let M = document.getElementById('Tools-Switch');
  let E = document.getElementById('Tools-Extended');
  
  switch (arg) {    
      case 'open':
          M.src=requestRoot('BusinessCard')+"i/Templates/X.png";
          M.setAttribute('onclick',"switchTools('close')");
          E.setAttribute('class','VisibileTools'); break;
      case 'close':
          M.src=requestRoot('BusinessCard')+'i/Templates/Tools.png';
          M.setAttribute('onclick',"switchTools('open')");
          E.setAttribute('class','HiddenTools'); break;
  }
}

document.body.addEventListener('click', function(e) {
  if(e.target.classList.contains('tool-icons')){
    console.warn("Tools interaction "+e.target.name+'/'+e.target);
    switch (e.target.name) {
      case 'OpenFinance': break;
      case 'CallTaskList': break;
    }  
    return window[(e.target.name)]();
  }
})


// ### Load In Functions ###
function customQuerySelectorAll(...selectors) {
  const combinedSelector = selectors.join(', ');
  return document.querySelectorAll(combinedSelector);
}


// Color Funcs
const Crazy_Hat = {
  on:false,
  target:document.getElementsByClassName('Crazy_Hat'),
};

function replaceCrazyHat (string,type){ 
  if (!string || isNaN(type)){ return console.error('X-CH str:'+string+' type:'+type);}
  let res; 
  if(string.includes('BusinessCard')){string = string.split('BusinessCard/'); string = string[1]; }
  if(type == 0){ res = string.replace('.png','_Crazy_Hat.png');  }
  if(type > 0 ){res = string.replace('_Crazy_Hat.png','.png');}
  console.log('RP Crazy_hat :'+res);
  return res;  
}

let ToggleCrazyHat = function ( ){
    
  console.log("toggling CrazyHat to :"+!Crazy_Hat.on);
  Crazy_Hat.on = Crazy_Hat.on? false : true

  for (e in Crazy_Hat.target){ 
    let i = Crazy_Hat.target[(e)];
    if( i == "[object HTMLImageElement]"){
      if (Crazy_Hat.on==true){ i.src=replaceCrazyHat( i.src , 0); } 
      if (Crazy_Hat.on==false){ i.src=replaceCrazyHat( i.src , 1); }
    }  

  }
  return console.log(Crazy_Hat.on);
}


// function createDialog(){
//   element=createElement('div',{id:"iframeDialog",innerHTML:
// `    <p id="iframeTitle">Sample</p>
//     <button onclick="closeIframeDialog">x</button>
//     <iframe src="" id="dialog_iframe" width="100%" height="70dvh"></iframe>
//     <button> <a href="">Take me there!</a></button> 


//   `});
//   document.body.append(element);
// }
// createDialog();




function call_IframeDialog(title,src){
  let iframeDialog=document.getElementById('iframeDialog');
  var iframeTitle=document.getElementById('iframeTitle');
  var dialog_iframe=document.getElementById('dialog_iframe');
  var iframe_href=document.getElementById('takemetherelink');

  if(!!title && !!src){
    iframeDialog.showModal();
    iframeTitle.innerHTML=title;
    dialog_iframe.src=src;
  }
  else {iframeDialog.close(); }
}


document.body.addEventListener('click', ele => { let e=ele.target;
  
  if (document.querySelector('.Vertical_NavBar') && document.querySelector('.Vertical_NavBar').style.display!='none'){
    // target click came from inside nav and should not close vertical nav
    let click_inside_nav=false 
    // the targets to check for the nav class
    vert_targets=[e,e.parentElement,e.parentElement.parentElement]
  
    vert_targets.forEach(element => {
      if(element && element.classList.contains('Vertical_NavBar')){click_inside_nav=true; return console.log('Click came from inside the vertical_navbar:'+element.classList);} 
    });
    //main body was clicked > close nav
    if(click_inside_nav!==true){null;Toggle_Vertical_Nav('Close')}
    //reset
    click_inside_nav=false;
  }
  
  if (e.parentElement){
    //reset rainbow wave when name is pressed
    if ( e.parentElement.id=='intro-text-profile-name'){ let x=e.parentElement.querySelectorAll('span');
      x.forEach((element) => element.classList=""); //remove class
      setTimeout(() => {x.forEach((element) => element.classList="RT");}, 1); // add class
    }

  if (false && e.parentElement.classList=="refs"){
    // Open a dialog with href,image and text to let users view the page, and decide if they will jump to it
    let title=e.innerText.replace(' ','<br>');
      //title
      let src=e.getAttribute('data-src');
      call_IframeDialog(title,src); console.log(`opnened dialog ${title},${src}`)
      // console.log('e has data of '+a)
    }
}
})

// document.addEventListener('DOMContentLoaded',function(){
//   console.log("Beginning OL");
  
//   ScrollHome(); //Scroll to top (Helps with js created elements)
//   attach_nav_listener(); 
//   colorShifter.ColorShift()
// });