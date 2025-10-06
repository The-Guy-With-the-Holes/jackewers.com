//Certificates
var BlockIndex = 0 ;
var MainTitle = document.querySelector('#MainTitle');
var CertField = document.getElementById('CertField');

function incBlock(Direction){
    const Max = Object.keys(Blocks).length - 1;
    if(!Direction) return alert('Inc Block needs a direction to run');

    if (Direction=='Fowards'){BlockIndex+=1;}
    else if(Direction=='Reverse'){BlockIndex-=1;}

    if(BlockIndex>Max){BlockIndex=0;}
    if(BlockIndex<0){BlockIndex=Max;}
    createCertTable(true);
}

function createCertTable(neu){
   let certwrap = document.getElementById('Certificates'); 
   if(certwrap.style.display=="none"){certwrap.style.display="";}
   if(neu){console.log('BlockIndex has a new value, creating new Certifcates'); CertField.innerHTML='';}


    var Block = Object.entries(Blocks)[BlockIndex];
    let name = Block[0];
    let Classname = name.split(" ")[0];
    MainTitle.innerText =  name;
    CertField.setAttribute('class',Classname+'Certfield');
    MainTitle.setAttribute('class',Classname);

    for (let i = 0; i <Block[1].length; i++){
        // Generate Elements
        let BlockName = Block[1][i];
        let Div = createElement('div',{id: 'Div'+i, name: BlockName,
        className: 'Certificate_Block '+Classname+'certfield', style: ''});
        let Img = createElement('img',{src: BlockIndex+name+'/'+BlockName+'.jpg', className: 'BlockImg'});
        let text = createElement('p',{innerText: BlockName});

        Div.append(text,Img);
        CertField.appendChild(Div);

        // Toggle expansion
        Div.addEventListener('click', () => {
            const Target = Div.closest('.Certificate_Block');
            Target.style.height = !Target.classList.contains('expanded') ?
                document.body.clientHeight+'px' : 'auto';
            Target.classList.toggle('expanded');
        });
    }

}


function clearCerts(){
    Get.Page.Cert.style.display="none";
}

   
//  Certificate Variables
const Blocks = {

    'Program Hub':
    ['Fundamentals','DevOps','HTML','HTML Advanced','CSS','JavaScript','TypeScript',
    'JavaScript Advanced','Node-JS','Meteor-JS','jQuery','React Native', 'WordPress',
    'Growth Hacking','Google Display Ads','GitHub','Python','SQL','SEO','Ethical Hacking',
    'Linux','Docker','BootStrap','PHP','NLP', 
    'CryptoCurrency','BlockChain','Solidity', 'NFTS'
    ],

    'Solo Learn':
    ['HTML','CSS','JavaScript','Web-Dev Fundamentals','Responsive Web-Design',
    'React+Redux',
    'JS Game Development','Coding for Marketers','JQUERY', 'Python for Beginners',
     'Python Core','SQL','C'
    ],

    'Grasshopper': //Completed
    ['Coding Fundamentals-I','Coding Fundamentals-II', 'Intro to Interviewing',
     'Array Methods','Debugging', 'Animations', 'Animations II'
    ],

    'Ethical Hacker': //Completed
    ['Certified Ethical Hacker',
    'Intro','Threats & Attack-Vectors', 'Concepts, Types & Phases',
    'FootPrinting & Recon', 'Scanning-Networks & Enumerations',
    'System Hacking', 'Malware, Trojans, Worms','Network Sniffing',
    'Social Engineering', 'Denial of Service', 'Session Hijacking',
    'WebServer Hacking'
    ],

    'HackerX': //Completed 
    ['HackerX Master',
    'Know the OS', 'Hack the MAC', 'Gathering Information', 'Anonymous Surfing',
    'Hiding Messages', 'Social-Media Hacking', 'Credit,Debit-Card Fraud',
    'Keyboard Spying', 'WEP-Cracking', 'WPA,WPA2-Cracking', 'Network Spying', 
    'Database Hacking', 'Android Hacking', 'Bringing Down a Website',
    'XSS,Cross-Site-Scripting', 'Making data safe', 'Hacking Passwords', 
    'WordPress Scanning', 'Vunerability Scanning & Reporting' ]
}



createCertTable(true);