// Predefined Configuration
var configJson = {
    "title":"Contact",
    "userUrl":"https://api.randomuser.me/",
    "numberCards": 300,
    "tabs": ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
};

$(document).ready(function(){
    var body = $('body');
    //add Preloader
    body.append('<div class="preloader"><div>Loading Data</div></div>');
    //add Contact Information Div
    body.append('<div class="contactInfoBg hidden"><div class="contactInfo"></div></div>');

    //add Contact Information Background Click
    $('.contactInfoBg').click(function(){
        $(this).addClass('hidden');
    });

    //Hide Contact Book till data is loaded
    $('section').addClass('hidden');

    // Set Values
    contacts.parentElement = 'section header';
    contacts.tabElement = 'section main';
    contacts.tabs = configJson.tabs;
    contacts.title = 'Contacts';

    // Load and Create Contacts List
    contacts.loadContacts(configJson.userUrl, configJson.numberCards);
});
