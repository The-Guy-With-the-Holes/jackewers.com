
function debug(type,word,action){ 
    if(Debug[type]==true){
        console.log(word+' Has been '+action+'ed');  
    }
}

function getval(start,end){let v = [];
    for(let i =start; i<end+1; i++){
        let arr= i+'%{background:linear-gradient('+i*3.65+'deg,salmon,lightpink);}';
        v.push(arr);
    }
console.log(v.join(' '))
}

const PageState = {
    page:'default',
    header:{text1:'',superText:['','','',''],img:''},

}

let setPagestate = function (page,text1,Stext,img) { if(!page){page=Get.DT;}
    if(!text1 || !img){throw new SyntaxError('Need args');}
    PageState.page = page;
    PageState.header.text1=text1;
    PageState.header.img=img;
    if(Stext.length == 4){
    for(e in Stext){PageState.header.superText[e]=Stext[e];     console.log(PageState.header.superText[e])
    }}
}

function appendHeader(){
    // The main Element//
    let header = createElement("header",{className:'box-main ColorShifter'});
    
    let mainImg = createElement('span',{id:'Mainimg'}); mainImg.append((createElement('img',{src:PageState.header.img,id:'locko',className:'mainx Crazy_Hat',onmouseenter:'mainimgRotate()'})));
  
    let j = createElement('u'); j.append((tNode('J')));
    let Ewers = createElement('strong'); Ewers.append((tNode('ack Ewers')));
    let ST1 = createElement('strong'); ST1.append(tNode(" "+PageState.header.superText[1]));
   
    let b = createElement('b'); b.append(tNode(PageState.header.superText[3]+" ")) 
    let ST2 = createElement('span',{className:'Together'});  ST2.append(b);
  
    let h1 = createElement('h1',{name:'h1'}); h1.append(j,Ewers,tNode(','),createElement('br'),tNode(PageState.header.text1)); 
    let h2 = createElement('h2',{name:'h2'}); h2.append(tNode(PageState.header.superText[0]," "),ST1,createElement('br'),tNode(PageState.header.superText[2]+" "),ST2);
    
    header.append(mainImg,h1,h2);
    document.body.prepend(header);
}

if(document.title.includes('jackewers.com')){
setPagestate('home','Digital Business-Card',['Everybody has a',' Vision,','Lets work on ours ','Together'],'i/Personal/Profile.png');
appendHeader();
}
/*########################
 Main Image/img Slider
//########################*/

let radio = document.querySelectorAll('.radio-main');   

let slider = document.querySelectorAll('.slider-main');

class MainImageSlider{
    constructor(position, max){
        this.position = position;
        this.max = max;
        this.img = document.getElementById('image-main');
    }
    init(){
        
    }

    setPosition(inc){
        for(let i=0; i<radio.length; i++){radio[(i)].checked=false};
        
        if(inc){
            if (inc==">"){this.position++; }
            if (inc=="<"){this.position--; }
          
            if (!isNaN(inc)){ this.position=inc;}
        }
        if(this.position > this.max){ this.position=0;}
        else if (this.position<0){this.position=this.max;}
        
        radio[(this.position)].checked=true;
        this.img.src='i/Personal/mainimg'+this.position+'.png';
    }
    
}

let mainimg = new MainImageSlider(0,2);
mainimg.setPosition();

for (let i=0; i<slider.length; i++){ 
    let arrow= slider[(i)].innerText;
    slider[(i)].setAttribute('onclick','mainimg.setPosition(\''+arrow+'\'); unlockQOTD();');
} 

radio.forEach(el => el.addEventListener('click', event => {
    mainimg.setPosition(event.target.getAttribute("value"));
    
}));

/*###################################################################
  h3 and quote of the day
*/

let QuoteoftheDay = getQOTD();

//Quote of the day
function getQOTD(day) {
  if(!day){ day = new Date().getDay(); }
  return QOTD[(day)];  
  //createQOTDbox(Quote, day);
}

function unlockQOTD(){ // runs on right image scroll
  let flipbtn = document.getElementById('main-desc-flip');
  if(flipbtn.style.opacity==0){flipbtn.style.opacity=0.8; flipmainText();}
}

function setDefaultmainText(){
let a = document.getElementById('main-desc');
a.innerText = Get.Main.main_desc;
a.style.fontSize="2.6vw";
}


function flipmainText(){ let m = document.getElementById('main-desc');
    if(m.innerText.includes(QuoteoftheDay)){setDefaultmainText();}
    else{replaceMainDesc();}
    m.classList.add('Lister');
    setTimeout(() => {
        m.classList="";
    },1000 );
}


function replaceMainDesc(Quote){
    let desc = document.getElementById('main-desc');
    let quoteFont;
    let x = getQOTD(); 
    if(Quote){ let x=Quote; }
    
    if (x.length<=50){ quoteFont="2.8w";}
    else if(x.length>50 && x.length<=99){ quoteFont='2.6vw';}
    else if(x.length>=100){ quoteFont='2.3vw';}
    
    desc.style.fontSize=quoteFont;
    desc.innerText= x+'\n\n-- Quote of the day';
}

const ShowIconBox = function(show){ let IconBoxMaster = document.getElementById('IconBox');
show===true?IconBoxMaster.style.display="block":IconBoxMaster.style.display="none";
}
function switchIconBox(show){
    ShowIconBox(show);
    /*
let IconSwitch = document.getElementById('Home-Icon-Button');    
    switch (show) {
        case true:
            IconSwitch.innerText="⇪"; 
            IconSwitch.setAttribute('onclick',"switchIconBox(false)");
            break;
        case false:
            IconSwitch.innerText="⇩";
            IconSwitch.setAttribute('onclick',"switchIconBox(true)");
            break;
    }*/
}





/* Home Specific Functions*/
//IDLE TIMER
function idleclass(clss){ 
let targ = document.getElementById('locko');
    if(targ.classList.contains('idle')&&clss==false){
        targ.classList="mainx Crazy_Hat";iconidle(false);
    }
    if(!targ.classList.contains('idle')&&clss==true){
    targ.classList="mainx Crazy_Hat idle"; iconidle(true);
    } return;
}

function iconidle(remove){
    let targ =document.querySelectorAll('.balls');
for(let i =0; i<targ.length; i++){ let key = targ[i];
    if(remove ==true){ 
        if(i%2==0){key.setAttribute('class','balls iconidleF');
        continue;}
    key.setAttribute('class','balls iconidleR');
    }
    if(remove==false){key.setAttribute('class','balls');}
    }
}

let MainRotations=0;
function mainimgRotate(){
    MainRotations++;
    document.documentElement.style.setProperty('--Main-Img-Rotation', (180+(MainRotations*90)+'deg')); 
}

//Suprisingly Simple Ball-Event Handler
document.querySelectorAll('.Rotern').forEach(item => {
item.addEventListener('mouseenter', e => {
let Child = e.target.querySelector('.balls').id;    
    IconHovered(e,Child);
    }) 
})

// Sets New rotation & Background for .Balls
function IconHovered(e,callfrom){
    if (!e || !callfrom) return console.error('%cICON Hover ERROR',"color:Green; font-size:4vw;");
    let H1=(randomHex()); let H2 =randomHex();
    let colorarray=  ('#'+H1+',')+('#'+H2+','); 
    let Background= (((randomNum(0,255))+'deg,')+colorarray+colorarray+('#'+H1+',')+('#'+H2));
  
    if(document.documentElement.style.getPropertyValue('--rotation-direction')=="360deg"){  document.documentElement.style.setProperty('--rotation-direction', (-360+'deg'));}
    else{ document.documentElement.style.setProperty('--rotation-direction', (360+'deg')); }
    document.documentElement.style.setProperty('--icon-background', Background ); 
    
    if(Debug.Hex==false) return;    
    console.log(callfrom+': Caller Created >> Hex :'+(Background));   
}


/* About Specific functions  */

document.querySelectorAll('ul>li').forEach(item => {
    item.addEventListener('click', e => { 
        let ListText = e.target.innerText.split(' ');      
        test(e); CreatePage2(ListText);               
        debug('List',ListText[0],'Click');    
    }) 
    item.addEventListener('mouseenter', e => {
        let ListText = e.target.innerText.split(' '); 
        debug('List',ListText[0],'Hover'); 
    })
})
