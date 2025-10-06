/*
    This file handles any sort of social links, Such as:

        * Social navigation navbar
         ( Essentially a footer that provides links to other social accounts, and social medias
            - makes bubble icons or text based links
            - can include personal details (phone number, email)

            examples: Any commercial site (microsoft, xbox... ect)   
         )
        
        * Linktree
         ( Similar to the social navbar, except this is normally horizontal rows, and will take up the whole page
            - only includes pages that are ME
            examples: linktree.com
         )

*/
Socials={   // If social links exist, create Footer function will run
    // settings:{
        // createFooter:false, // Create footer on load
        // createLinkTree:true, // Create Linktree on load
        // type:'balls', // the icon shape     
        // branding:true, // Made by Bweb branding on creations
        // link_settings_position:3 // the array position to store additional settings (this will be ignored by some functions)
    // },

    createLinkTree:function(user){

        main=createElement('main',{id:'AML_container'});
        
        function make_title(){
            let header=createElement('h1',{innerHTML:`<img src="${user[0]}"> <h1>${user[1]}</h1> `})
            main.prepend(header);
        }
    
        for (let i=0; i<Socials.links.length; i++){ let x=Socials.links[i];
            let link_element=createElement('div',{ className:'AML_link',
                innerHTML:`<a href="${x[1]}">${x[0]}</a>`,
                style:`background-image:url(${x[2]})`
            })
            main.append(link_element);
        }
    
        function make_footer(){
            let footer=createElement('footer',{innerHTML:`<p>${Socials.settings.foot_note?Socials.settings.foot_note:'Powered by Bloodweb.net'}</p><img src="./BloodW.png">`})
            main.append(footer);
        }     
        make_title();
        make_footer();
        document.body.append(main);
     
    },
}

Socials.meta={
    name:'Jack Ewers',
    birthday:'10-29-1995' // american format dumb
}
Socials.links = [
    //['Name','Link_href','img_href','settings']
    ['Jackewers.com','/','http://www.jackewers.com/favicon.ico','footer:no'],
    ['Phone: +61 479 000 429','tel:+61479000429','i/Icons/Phone.png'],
    ['Email: yo@JackEwers.com','mailto:webmaster@jackewers.com','i/Icons/Mail.png'],
    // ['Twitter', 'https://www.twitter.com/', 'https://www.twitter.com/favicon.ico'],
    ['LinkedIn', 'https://www.linkedin.com/in/the-guy-with-the-holes/', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAZlBMVEUAfrv///8AerkAcLUpgbzE2urI2OnR4u4Adbfs9PlUksUAeLgAbbPN3+30+PuQt9fk7vVpoMtHjsK0z+RAhr8AZbC+1ejb6PIAarKXvdqFs9Z9rtNspc1Xm8ktisGlxt+AqdBjmMfy32DQAAAFJElEQVR4nO2d2ZKjIBRAEckEJcGFjlsW0///k6OxZ5JOFOwBK1znnpepmipbTi67LCQYaAQBi2i+JMjwz5G/O0U28OODjEzou9NjB03kXxnFoMsw9UemzAEXmAGRl4OMbEAXmAHeyJvMHnxcesS+l5GnFQSmC81JdjLp7t3pcMMu7WSSVQSmC03SyayixPSIgKSHdyfCFYeUqPDdiXBFqMgaGpkB3pDzesrMmVyAd8vu0Mu7U4AgCBCo6KArqP06ERZ/ZlkW54TDbppoeLnWaptGUVTuVZJRwN0GzpJNFNwp1UlAjU542gdPRMUFZHCoaOWzS0d6AjhCFcOU1Cuyqd6dtp9Cp1z6+WlwsWknXYIA2LyOOGpcggjU+IHmkU4m+AVJhusyWR8aSJ9CmN4lCAr27iTOhtcmmQhOHXAYay2/U8Pp1hhdggLKLAI/mWXKGEiFFhrqsh6ZAclnYWGWCa5AZHYvPf8xGSDV2bpk1pTN5lQAEZQKYFVVM6VmmQLMKKDSDwB6aiDlf1ZHE0qR6eAmGQUlk3WINQ3OKNOXGgXIpbM56YY0aQynxPQwTUaTULoyf6Bsuk8DqcAMTE7PQpsCvCFYMlZuyk+ALqRfALl9cWkZrLJ/h4bn9JuK+oAZlgFRkXobyZ6oOPEdoIZ/lLCq6OVyEYcQclQeoAJ6SBAEQZD/DkopYezjC8b6/4DZnFFB8vhUq66vdBvvReVGNf06sCVWGt0WzE0y9gNqn3h6gNP42r52yQO5ba8xcd5tijMd51cbdtY98G3+k9OsLSfHsWV7ZW6X9jOVaoheZ2doXmgeKB9G2kKcVDqpcotPkTCX0WEb7et+vfx0dGQg95C8+2Ydnivz5K/cH7m7umApGcoTfVT+PuFwHLiQjDD83UfSsyubZWT4xZzDHjg6qgcWkeHnn6h01G5slpARMz7IPds4yWkLyOjX403ZuOgPuJcRR/PqohFc7CZzLlNlPyr79yczexvXMs3HdP9Fz9Z+a7xrmXrG0oIJWu9k9v9UYG5E1hnNsYwVynY9qE8yge1neq9kbEPjlUzwaRcav2RqKxfPZCK7fOaXTPBpNez0TMau4fRMRlq1m57JBFaFxjcZq0UhC8ukG9WqYju/w7ax2ea2nIzc1vmu2oUdVcWacp5QarMDcSkZucnC8F41UX7I5sXHQ5my4c+Zn4tkzhiUWLQ0y8hs8rG5I3GcMclpcxjLIjKbielwejTHxqY6W0Jm+zH161LzoNpmPnABGTndkRcX4y/R+iWj68eHo+v0HrE5Wsq9TKldcUtNM1E2raZ7mURbHRl3uex9kkn1sxIiN+Qzr2RM+4d3hrbGKxlT1RpOn6XgnUxkWqTODR88fJIx7uqiORyZjfGNhi07PskUxjbPsNPdJxlzA17pqzOfZMxdq52+NvRIRpo/Gxv2IPskYz7o1rDVHWVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQBmVQZg0yKtIgX5cp03yjeSA1n4UTKql7pXlhtIY81pH/9Anz3VvU8EabTfRUz0+fsH+lhQuCIKsGzJ1LRuiFjJy4ChR6Ji7Op/MD3hCbzcJ+ESoSHd6dCFccImJ1kINP0E4F0LVrenjdyaQrKTRh2slIeFcvjcGPspMJtqsoNLQb4ZJZY1n/4f2BFf3VzGUM3obH/XkVt3umCwY8p33dxjZcml1Dlxnuyvy6ATwBbUOTweI3D+SEwl4CpEIAAAAASUVORK5CYII='],
    // ['Instagram', 'https://www.instagram.com', 'https://www.instagram.com/favicon.ico'],
    ['Github', 'https://github.com/The-Guy-With-the-Holes', 'https://github.com/favicon.ico'],
    ['Doulingo', 'https://www.duolingo.com/profile/Spike.edu', 'https://d35aaqx5ub95lt.cloudfront.net/favicon.ico'],
    ['Crypto.com', 'https://crypto.com/nft/profile/spikedeathcore?tab=collectibles', 'https://crypto.com/__assets/favicon-32x32.png?v=0f6f06777a5d4bc338bfeca412628e1c']
];


// Function to create a social linkk footer
//Requires Social.links
Socials.createFooter=function(){

    let footer_sub_container=createElement('div',{className:`${Socials.settings.type=="balls"?'Horizontal_Socials':'Vertical_Socials'} Socials_Container`});
    let footer=dQ('footer')?dQ('footer'):createElement('footer',{id:'footer',style:'background-color:salmon;'});
    for(let i=0; i<Socials.links.length; i++){ let x=Socials.links[i];
        // Skip items that have 'footer:no' in settings 
        if (x[Socials.settings.link_settings_position]&&x[Socials.settings.link_settings_position].includes('footer:no')) {continue;}
        let container,container_content
        container=createElement('div',{className:`balls${isEven(i)?'x':'y'} Rotern`});
        // if social settings type == balls, only create the icons
        container_content=createElement('a',{href:x[1], target:'blank_',innerHTML:`<img src="${x[2]}" class="balls" alt="${x[0]} link"> ${Socials.settings.type=="balls"&&x[2]?``:`<p>${x[0]}</p>` }`});
        container.append(container_content);
        footer_sub_container.append(container);	
        }

    if (Socials.settings.branding===true){
        let bloodworks_container = createElement('p',{id:'foot_note',innerHTML:`<p style="text-align:right; margin-right:min(2vw,16px)">Powered by <a href="http://www.bloodweb.net">Bloodweb.net<img src="./BloodW.png"></img></a></p>`});    
        // footer.append(bloodworks_container);
    }
    
    document.body.append(footer_sub_container);  
}


// If Socials.links&&, create footer
document.addEventListener('DOMContentLoaded',function(){
    if (!Socials.links){
        return console.error('ERROR, SOCIAL LINKS NOT DEFINED');
    }
    // if create setting === true >> build
    Socials.settings.createFooter==true?Socials.createFooter():null;
    Socials.settings.createLinkTree==true?Socials.createLinkTree(['i/web-ready/image_1.jpeg','@the_guy_with_the_holes']):null;  

})
