let Root = '';
if (document.title=="Working directory"){Root = 'WD'};
if (document.title.includes("jackewers.com")){Root = 'BusinessCard'};
if (document.title.includes("project:")){Root="Projects";}

const debugging = true

let requestRoot = function (targ) {
  if (Root == targ){return '';}
  else if(Root.includes('Projects')){return "../../"+targ+"/";}
  else if(Root.includes('WD')){return targ;}
  else if(!window.location.href.includes(targ)) return '../'+targ+'/';
  else {return '../'; }
}

let setBasevari = function(t,v){ Get.Main[t] = v;}

const Nav =  { 
    e:['Home','About','Certificates'],
    Home:'index',
    About:['About','Contact','Recommendations'],
    Certificates:'Certificates',
}

const CurrentProject='Image_slider';

// Variables
const Get = {
    Body: document.body,
    DT: document.title,

    Nav:{
        Switch:document.querySelector('.Nav_Switch'),
    },

    Title:document.querySelector('title'),
    Extndbtn : document.getElementById('ExtendButton'),
    Pages:['Home' ,'About','Contact','Recommendations','Certificates'],
    AboutPages:['About','Recommendations','Contact',],
    Page:{
    Home: document.getElementById('Home'), 
     
    Page2 : document.getElementById('secondBox'),
    About :document.getElementById('About'),
    Recommends:document.getElementById('Recommendations'),
    Contact:document.getElementById('Contact'),
    Projects: document.getElementById('Projects'),
    Cert: document.getElementById('Certificates') ,},
    
    Main : {
        main_desc:'I\'m a dad, software developer and body-mod ethuisiast from Perth, Western Australia',
        main_Img:requestRoot('BusinessCard')+'i/Personal/Profile.png',
   
    }   ,

   
    Footer:['Powered by ', '₿loodWeb' , 'favicon.ico',
        'This page and its contents are licensed for free use under the creative commons, it is distrubuted without warranty']   
}
const About = { lists:['Hobbies','Passions'], 
                MainTXT:[' Hi there! my name is Jack,',
                'I was born & live in australia, my interests include coding, business management, investing and traveling'],
// To be made into links
              Hobbies:['Body-Modification',
                       'Coding','Philosophy'],
              Passions:['Advocating equal rights',
                        'Reducing carbon footprint',
                        'Fighting for Data Protection'],
              Goals:[''],
              Projects:['CryptoKorns','Gardner Family Farms',
                        'The Rand Dumb'],
    ContactIntro:'Thanks for visiting my site!'+
    ' You can find my contact deets and more on this page.',
    Contact:{
    Outro:'--Y\'all are Awesome!',
        Methods:['Email','Phone'],
        Address:['Webmaster@JackEwers.com','+(61) 479 000 429']
    },
}

const Recommendations={
    intro:'Welcome to the Recommendation section, A list of the businesess and services that are best in class!',
    Types:['All','Consumables','Bling','Artists','Tradies','Finance'],
}

const sponsors = [
    test=['Name','Link','About','ImageURL','Tags(Types)[F/C/B/A/T]'],
    GF=['Gardener FamilyFarms','https://gardnerfamilyfarm.com.au','Award Winning, Pesticide Free Olive Oil, Farm to table','../i/Sponsors/GFicon.ico','C'],
    KL=['Kilns Cafe','https://www.kilnscafe.com.au','A heart warming Cafe, Run by a kind soul','../i/Sponsors/Kilns.jpg','CA'],
    JT=['Opal Heart','https://www.OpalHeart.com.au','Profesional Piercing, with talented staff and a world renowned Owner','https://www.opalheart.com.au/wp-content/uploads/2021/09/logo.png','B'],
    JT=['Stone Heart','https://www.stoneheart.com.au', 'Professional Piercing, Tattooing and Laser', 'https://www.stoneheart.com.au/wp-content/uploads/2021/10/cropped-header-768x616.png', 'B'],
    SC=['Spectrum Ceilings','https://hipages.com.au/connect/spectrumceilings','Specialists in the installation of commercial interior wall and ceiling finishes','https://mediacache.homeimprovementpages.com.au/creative/sites/2585001_2590000/2585637/thumbnail.gif','T'],
    DJ=['DJ Bronia','http://www.djbronia.com.au','Dj & Mood Enhancement Technician, brings the beats and wonderful atmosphere','http://www.djbronia.com.au/wp-content/themes/r2d2-modified/images/DJBronia_logo_610px.png','A'],
    HH=['Hellish Hair','https://www.facebook.com/hellishhaird', 'Professional Hair styling'],
    CC=['Crypto.com','https://www.crypto.com/app/hv5zfaygn9','Crypto Currency and NFT platforms','../i/Sponsors/cryptocom.jfif', 'F/A']
]

let Create = {
    Div : document.createElement('div'),
    Img : document.createElement('img'),
    Btn : document.createElement('button'),  
    H5 : document.createElement('h5'),

    Carousel : {
        Leftbtn:document.createElement('button'),
        Rightbtn:document.createElement('button'),
    },
}

const Social={
Names:['Github','Linkedin','Twitter','Facebook','Instagram'],

Address:[
'https://github.com/the-guy-with-the-holes/BusinessCard',
'https://www.linkedin.com/in/jack-ewers-14a155212/',
'https://www.twitter.com/Jack_S_Ewers',
'https://www.facebook.com/BloodWorks.Jack/',
'https://instagram.com/the_guy_with_the_holes'],

Links:{
    Github: { href:"https://www.github.com/the-guy-with-the-holes/BusinessCard", img:requestRoot('BusinessCard')+'i/Icons/64-BIT/Github.png' },
    Twitter: { href:"https://www.twitter.com/Jack_S_Ewers", img:requestRoot('BusinessCard')+'i/Icons/64-BIT/Twitter.png' },
    LinkedIn: { href:"https://www.linkedin.com/in/the-guy-with-the-holes/", img:requestRoot('BusinessCard')+'i/Icons/64-BIT/Linkedin.png' },
    Instagram: { href:"https://www.instagram.com/the_guy_with_the_holes", img:requestRoot('BusinessCard')+'i/Icons/64-BIT/Instagram.png' },
    Facebook: { href:"https://www.facebook.com/BloodWorks.Jack/", img:requestRoot('BusinessCard')+'i/Icons/64-BIT/Facebook.png' },

}

}

//Quotes of the day
const QOTD = [
    'The one who plants a tree, knowing they wil never sit in it\'s shade has at least come close to understanding the meaning of life',
    'Think like an Investor, Buying something doesn\'t just cost you, it costs you the potential profit you would of made investing it',
    'You need to believe that you can Achieve anything that you dream',
    'Never lose sight of your mission, be driven, this life is a prison if you don\'t have vision. You\'re in it to win it. so.. GO GET IT!',
    'They are all looking for someone to save them, instead of looking inside to see what they gave them, A strong Will, strong Mind, causes mayhem',
    'Sometimes, when you are in a dark place, you think you have been buried, but actually, You have been planted.', 
    'The best views come after the hardests climbs',
    'The man who loves walking will walk farther than a man who loves the destination'
]

