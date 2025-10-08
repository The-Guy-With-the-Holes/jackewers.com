/*
 * KeyFunctions.js
 * 
 * Index:
 * 0. Debugging
 *    0.1 Create Debugging Area
 * 1. Date Functions
 *    1.1 calculateDaysLeft
 * 2. Page Manipulation Functions
 *    2.0 dQ (document query selector)  
 *    2.1 ToggleElementDisplay (C=toggle_array)
 *    2.2 loadHTML
 *    2.3 smoothScroll
 *    2.4 ScrollHome
 *    2.5 toggleFullScreen
 *    2.6 reloadPage
 *    2.7 importURL
 *    2.8 isLocalhost
 *    2.9 checkVisibility
 *    2.10 fetchAndDisplayFile
 * 3. Image Functions
 *    3.1 getKeywordsForImage
 *    3.2 addKeywordOverlay
 *    3.3 Tag_Images
 *    3.3 isValidImage
 *    3.4 replace_img_src
 * 4. HTML Escape Functions
 *    4.1 escapeHtml
 * 5. Cookie Functions
 *    5.1 setCookie
 *    5.2 getCookie
 * 6. HTML Loading Function
 *    6.1 loadHTML
 * 7. Numerical Functions
 *   7.1 randomNum
 *  7.2 isNeg
 * 7.3 isEven
 * 7.4 setRange
 * 7.5 inRange
 * 7.6 randomHex
 * 7.7 createHexchain
 */

/* ================================
 * 0. Debugging Functions
 * ================================ */

/* 0.1 Debugging
    Debugging Categories

Priority	Description	When to Use
  1	Verbose (Low Priority)	Use for detailed debug information, such as variable states, function entry/exit points, or general program flow.
  2	Debug (Medium-Low Priority)	Use for debugging non-critical operations or confirming expected behaviors (e.g., "function X executed successfully").
  3	Info (Medium Priority)	Use for important informational messages that show significant actions or milestones (e.g., "User successfully authenticated").
  4	Warning (High Priority)	Use for unexpected but non-breaking issues (e.g., "API response delay detected"). These help identify areas that need attention but do not stop the system.
  5	Critical (Highest Priority)	Use for critical errors or issues that require immediate attention (e.g., "Database connection failed", "Unhandled exception occurred").

*/
function dQ(selector) { return document.querySelector(selector); }
function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  for (const key in attributes) {
      if (key === 'innerHTML' || key === 'innerText' || key === 'className') {
          element[key] = attributes[key];
      } else {
          element.setAttribute(key, attributes[key]);
      }
  }
  return element;
}
function debug(message, level, category) {
  // Global debugging variables
  const debuggingPriority = 3; // Example priority threshold
  const debuggingCategory = 'ui'; // UI,Data,API,Network

  // Check if the message passes the debugging filters
  if (level >= debuggingPriority && (!debuggingCategory || debuggingCategory === category)) {
    console.log(`[${category.toUpperCase()}][PRIORITY ${level}] ${message}`);
  }
}

if (typeof debugging !== 'undefined' && debugging  === true 
  && (!window.location.href.includes('jackewers.com') || !window.location.href.includes('bloodweb.net')
  )) {
  debugging_section = `
  <div id="debugging_area" style="font-size:min(.8rem,6vw); padding:1%; background-color:#ffaffa55; display:flex; justify-content:flex-end; overflow:hidden; height:1.5em;">
      <p style="white-space: nowrap;"></p>
      <button onclick="window.location.reload()" style="margin-left:auto;"><p>RELOAD</p></button>
  </div>`;
  document.body.innerHTML = debugging_section + document.body.innerHTML;
}

function log(x) {
  console.log(x);
  let z = document.getElementById('debugging_area');
  if (!!z) {
      let p = z.querySelector('p');
      p.innerText = x + "\n" + p.innerText; // Prepend new log
  } else {
      console.log("'log' called, but the logging area is unavailable.. caller:", x);
  }
}

log("Debugging area initialised.")

/* ================================
 * 1. Date Functions
 * ================================ */

/**
 * 1.1 calculateDaysLeft
 * Function to calculate the days left to complete a task.
 */
function calculateDaysLeft(dateAdded, daysToComplete) {
  const currentDate = new Date();
  const dateAddedObj = new Date(dateAdded);                              // Parse the dateAdded string to a Date object
  const timeDifference = currentDate - dateAddedObj;                     // Calculate the difference in time (in milliseconds)
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert time difference from milliseconds to days
  const daysLeft = daysToComplete - daysPassed;                          // Calculate the days left to complete the task                         
  return daysLeft < 0 ? 0 : daysLeft;
}
//Date 

function getDatearr() {
  let today = new Date();
  let currentDay = new Date(today.getFullYear() + "," + (today.getMonth() + 1) + ',' + today.getDate());
  return currentDay;
}



function DateDif(date) {
  date.split('/'); let time = date[0] + date[1];
  let d1 = date.slice(9);
  let month = d1[3] + d1[4]; let day = d1[0] + d1[1];
  let year = 20 + d1[6] + d1[7];

  const date1 = new Date(year + ',' + month + ',' + day);
  const date2 = new Date();

  let DIfference = [(date1.getFullYear() - date2.getFullYear()), (date1.getMonth() - date2.getMonth()), (date1.getDay() - date2.getDay())];
  return "Y/M/D:" + DIfference;
}



function dateCountdown(dateAdded, daysToComplete) {
  const currentDate = new Date();
  const dateAddedObj = new Date(dateAdded);                              // Parse the dateAdded string to a Date object
  const timeDifference = currentDate - dateAddedObj;                     // Calculate the difference in time (in milliseconds)
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert time difference from milliseconds to days
  const daysLeft = daysToComplete - daysPassed;                          // Calculate the days left to complete the task                         
  return daysLeft < 0 ? 0 : daysLeft;
}
/* ================================
 * 2. Page Manipulation Functions
 * ================================ */
//Select elements

//Edit Element display
const ToggleElementDisplay = function (element, DisplayType, enforce) { let x = element||document.querySelector(element); if (enforce === true || x.style.display == "none") { x.style.display = DisplayType; } else x.style.display = "none"; }

function setAttributes(el, attrs) {
  for (var key in attrs) { el.setAttribute(key, attrs[key]); }
}
/**
 * 2.1 createStyleRule
* Function to create a style rule.
*/
function createStyleRule(name, rules) { var style = createElement('style',{type:'text/css'});
  document.getElementsByTagName('head')[0].appendChild(style);
  if (!(style.sheet || {}).insertRule)
      (style.styleSheet || style.sheet).addRule(name, rules);
  else
      style.sheet.insertRule(name + "{" + rules + "}", 0);
}


/**
 * 2.2 smoothScroll
 * Function to smoothly scroll to an element.
 */
function smoothScroll(element) {
  document.querySelector(element)?.scrollIntoView({
      behavior: 'smooth'
  });
}

/**
 * 2.3 ScrollHome
 * Function to smoothly scroll to the top of the page.
 */
function ScrollHome() {
  let WindowFrame = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY; // Catch all devices
  if (WindowFrame > 0){
      window.requestAnimationFrame(ScrollHome);
      window.scrollTo(0, WindowFrame - (WindowFrame / 5));
  }
}

/**
 * 2.4 toggleFullScreen
 * Function to toggle full screen mode.
 */
function toggleFullScreen() {
  if (!document.fullscreenElement) { document.documentElement.requestFullscreen();} 
  else {
      if (document.exitFullscreen) {document.exitFullscreen();}
  }
}


/**
 * 2.7 isLocalhost
 * Function to check if the URL contains "localhost".
 */
function isLocalhost() {
  return window.location.hostname === 'localhost';
}

/**
 * 2.8 checkVisibility
 * Function to check the visibility of an element.
 */
function checkVisibility(elem) {
  // Implementation here...
}

async function fetchAndDisplayFile(filePath, elementId) {
  try {
      const response = await fetch(filePath);
      const text = await response.text();
      document.getElementById(elementId).textContent = text;
  } catch (error) {
      console.error('Error fetching the JS file:', error);
  }
}

/* ================================
 * 3. Keyword Overlay Functions
 * ================================ */

/**
 * 3.1 getKeywordsForImage
 * Function to get keywords for an image.
 */
function getKeywordsForImage(image) {
  // Implementation here...
}

/**
 * 3.2 addKeywordOverlay
 * Function to add keyword overlay to an image.
 */
function addKeywordOverlay(image) {
  var keywords = getKeywordsForImage(image);

  // Create a container element for the keywords
  var keywordContainer = document.createElement('div');
  keywordContainer.classList.add('keyword-overlay');
  keywordContainer.innerHTML = keywords.join(', '); // Set the keywords as the container's text content

  // Position the container element over the image
  keywordContainer.style.top = image.offsetTop + 'px';
  keywordContainer.style.left = image.offsetLeft + 'px';
  keywordContainer.style.width = image.width + 'px';
  keywordContainer.style.height = image.height + 'px';

  // Append the container element to the image's parent element
  image.parentNode.appendChild(keywordContainer);
  console.log('Images have been Tagged');
}
/**
 * 3.3 Tag_Images
 * Function to tag images with keywords.
 */
function Tag_Images(words){
  function getKeywordsForImage(image) {    // This function returns a static array of keywords
      return words||KeyWord_Array; //[keywords];
  }
  var images = document.getElementsByTagName('img'); // Get all the <img> elements

  for (var i = 0; i < images.length; i++) {
    var image = images[i];

    // Get or generate the keywords for the image 
    var keywords = getKeywordsForImage(image);

    // Create a container element for the keywords
    var keywordContainer = document.createElement('div');
    keywordContainer.classList.add('keyword-overlay');
    keywordContainer.innerHTML = keywords.join(', '); // Set the keywords as the container's text content

    // Position the container element over the image
    keywordContainer.style.top = image.offsetTop + 'px';
    keywordContainer.style.left = image.offsetLeft + 'px';
    keywordContainer.style.width = image.width + 'px';
    keywordContainer.style.height = image.height + 'px';

    // Append the container element to the image's parent element
    image.parentNode.appendChild(keywordContainer);
  } console.log('Images have been Tagged');
}

/**
 * 3.3 isValidImage
 * Function to check if an image URL is valid.
 */


function isValidImage(url) {
  return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
  });
}

/**
 * 3.4 replace_img_src
 */
function replace_img_src(target,new_src){ 
  if(!target||!new_src){return console.log('Provide target / new src')}
  target.setAttribute('src',new_src);
}


/* ================================
 * 4. HTML Escape Functions
 * ================================ */

/**
 * 4.1 escapeHtml
 * Function to escape HTML characters.
 */
function escapeHtml(html) {
  return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

/* ================================
 * 6. HTML Loading Function
 * ================================ */

/**
 * 6.1 loadHTML
 * Function to load HTML content.
 */
// Page maninpulation
function loadHTML(e, t, prepend = false) {
  return new Promise((n, o) => {
    const i = new XMLHttpRequest();
    i.open("GET", t, !0),
      (i.onreadystatechange = function () {
        4 === i.readyState &&
          (200 === i.status
            ? (prepend 
                ? (document.querySelector(e).insertAdjacentHTML('afterbegin', i.responseText))
                : (document.querySelector(e).innerHTML = i.responseText), 
               n())
            : o(`Failed to load HTML from ${t}`));
      }),
      i.send();
  });
}
/* ================================
  * 7. Numerical Functions
  * ================================ */
 /* 7.1 randomNum
  * Function to generate a random number within a range.
  */
function randomNum(min = 0, max = 17) { return Math.floor(Math.random() * (max - min)) + min; }
/* 7.2 isNeg
 * Function to check if a number is negative.
 */
function isNeg(x) { if (!isNaN(x) && x < 0) { return true; } }
/* 7.3 isEven
  * Function to check if a number is even.
  */
function isEven(num) { if ( !num && num!==0 || isNaN(num) ) return console.error(`Num required, ${num} is NaN`);
  return (num % 2 == 0) ? true : false;
}
/* 7.4 setRange
 * Function to set a number within a range.
 */
function setRange(i, min, max) {
  if (i < min) i = min;
  else if (i > max) i = max;
  return i;
}
/* 7.5 inRange
  * Function to check if a number is within a range.
  */
function inRange(num, min, max) { if (num <= max && num >= min) return true; }
/* 7.6 randomHex
  * Function to generate a random hexadecimal number.
  */
function randomHex(bytes=8) {
  if (typeof bytes !== 'number' || !Number.isInteger(bytes)){ throw new TypeError('bytes must be an integer'); }

  let result = '';    
  const chars = 'abcdef0123456789';
  for (let i = 0; i < bytes * 2; i++) { result += chars.charAt(randomNum(0, 9)); }
  return result;
}
/* 7.7 createHexchain
  * Function to create a chain of hexadecimal numbers.
*/
function createHexchain(chainlength,hexlength=8) {
  if (!chainlength) { return console.error('Hex length not defined'); }
  let hlen = chainlength; let hexchain = [];
  for (let i = 0; i < hlen; i++) { hexchain.push("#" + randomHex(hexlength)); }
  return hexchain;
}



const stickyNav = false;
let navAttachAttempts = 0;

function toggleVerticalNav(type) {
  if (!type) { return console.error('toggleVerticalNav needs a type(open/close)'); }
  type = type.toLowerCase();
  let navBar = document.querySelector('#Vertical_NavWrapper');
  let navSwitch = document.querySelector('#Vertical_NavSwitch');
  console.log(`toggling nav :${type}`);
//   if (nav) {
    if (navBar.style.display === 'none' || navBar.style.display === '') {
        navBar.style.display = 'block';
        navSwitch.innerHTML="⚞";
        setTimeout(() => {
            navBar.classList.add('show');
        }, 10); // Small delay to ensure the display property is applied before the transition
    } else {
        navSwitch.innerHTML="☰";
        navBar.classList.remove('show');
        setTimeout(() => {
            navBar.style.display = 'none';
        }, 500); // Match the transition duration
    }
}


function toggleVnavExpansion(ele){      
  const expandedSection = event.target.querySelector('.expandable-content');
  expandedSection.classList.toggle('hidden');

  return console.log('click is expanded');

}


function attachNavListener() {
    
    if (stickyNav) {
        // Horizontal Nav
        if (window === window.top && document.querySelector('nav') !== null) {
            console.log('Nav listener attached');
            // If timeout is set, end the function
            window.addEventListener('scroll', function () {
                let header = document.querySelector('header');
                console.log('scrolling');
                let nav = document.querySelector('nav');
                if (this.scrollY > header.clientHeight - header.clientHeight / 2) { nav.classList.add('sticky_nav'); }
                else { nav.classList.remove('sticky_nav'); }
            });
        } 
    }
    else { console.log('Sticky Nav is disabled'); }

  
  // Trigger functions inside the Vertical Nav
  let vNav = document.querySelector('#Vertical_NavWrapper');

  vNav.addEventListener('click', (event) => {
    const isVNavOpen = vNav.style.display !== 'none';
    const clickIsInWrapper = event.target.id === 'Vertical_NavWrapper';
    const clickIsExpandedItem = event.target.closest('.Nav_Expanded');

    if ( clickIsInWrapper && isVNavOpen){
      return toggleVerticalNav('close');
    }
    // Expand nav
    if (clickIsExpandedItem){
      toggleVnavExpansion(event.target);
    }

  })
  
}


function getPagePath() {
    const url = new URL(document.URL);
    return url.pathname; // Returns everything after the domain, e.g., "/folder/page" or "/page"
}

function setCurrentNavigationPage(page=getPagePath()){
  const navigatablePages = document.querySelectorAll('.NavListitem:not(.Nav_Switch)');
  navigatablePages.forEach((pageLink) => {
    if (pageLink.getAttribute('href') === page || (page === "/" || page === "/index.html") && pageLink.getAttribute('href') === "/index.html") {
      pageLink.classList.add('selected');
      pageLink.href="#"
      console.log(`Current page set to: ${page}`);
    } else {
      pageLink.classList.remove('selected');
    }
  })
}



const headerComponent = '/shared/assets/components/header.html';
const navComponent = '/shared/assets/components/modern-navbar.html';
const footerComponent = '/shared/assets/components/footer.html';

// Attach the listener to the nav (open/close vertical nav)
document.addEventListener('DOMContentLoaded', 
  initialiseSettings = () => {
    if (!Settings) return console.warn('No settings to make')

    

    
    if (Settings.createHeader){
      fetch(headerComponent)
        .then(response => response.text())
        .then(html => {
            const headerElements = document.querySelectorAll('header[data-render="component"]');
            if (!headerElements.length) {
              const header = createElement('header',{id:'header', 'data-render':'component',innerHTML:html});
              document.body.prepend(header);
            }
            
            headerElements.forEach(header => {
                header.innerHTML = html;
            });
        })
        .catch(error => console.error('Error loading header:', error));
    }
    if(Settings.createNav){
      // check if the nav.css file is srced in the document head
      const domhasNavCSS = document.querySelector('link[href="/shared/assets/css/nav.css"]');
      if(!domhasNavCSS){
        console.warn('Nav CSS not found. Please add it to the head for proper styling.');
        const navCSS = createElement('link',{rel:'stylesheet', href:'/shared/assets/styles/nav.css'});
        document.head.appendChild(navCSS);
      }
     
      fetch(navComponent + '?v=' + Date.now())
        .then(response => response.text())
        .then(html => {
            domHasNav = document.getElementById('nav');
            if(!domHasNav){ 
              navigation = createElement('div',{id:'nav'});
              //inset after the header ( or prepend to the body if no header)
              if(dQ('header'))dQ('header').insertAdjacentElement('afterend',navigation);
              else dQ('body').prepend(navigation);
            }
            document.getElementById('nav').innerHTML = html;
            // Re-initialize ModernNavigation after nav is loaded
            if (window.modernNav) {
                window.modernNav.setupEventListeners();
                window.modernNav.setActiveNavItem();
            } else if (window.ModernNavigation) {
                window.modernNav = new window.ModernNavigation();
            }
        })
        .catch(error => console.error('Error loading navigation:', error));
    }
    if(Settings.createFooter){
      fetch(footerComponent)
      .then(response => response.text())
      .then(html => {
          if (document.querySelector('footer')){ document.querySelector('footer').innerHTML = html; }
          else{
              const footer = createElement('footer',{id:'footer', 'data-render':'component',innerHTML:html});
              document.body.append(footer);
          }
      })
      .catch(error => console.error('Error loading footer:', error));
    } 

    if(Settings.returnButton){
      loadHTML('body','/components/returnButton.html', true).then(() => {
        console.log('ccc')
      })
    }

});