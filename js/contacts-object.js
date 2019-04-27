// Create Reusable Contacts Object
var contacts = {
    contactsList: [],
    parentElement: '',
    tabElement: '',
    tabs: [],
    contacts: [],
    title: ''
};


contacts.loadContacts = function(url, count) {
    var parameters = {
        format: 'json',
        results: count,
        nat: 'GB'
    };

    var contactsLoad = $.ajax({
        url: url,
        dataType: 'json',
        data: parameters
    });

    contactsLoad.done(function(json) {
        if(json.error) {
            $('.preloader div').html(json.error);
        } else {
            contacts.createContactsArray(json);
        }
    });

    contactsLoad.fail(function(statusMessage, error) {
        console.log(statusMessage, error);
        $('.preloader div').html('Error loading data. Please check console.log for error');
    });
};

contacts.createTabHeaders =  function(){
    var parentElement = this.parentElement;
    $(parentElement).html('<h3>'+ this.title +'</h3><ul></ul>');
    $(this.tabs).each(function(index, value) {
        if(contacts.contacts[value.toLowerCase()] === undefined || contacts.contacts[value].length === 0) {
            $(parentElement + ' ul').append('<li class="disabled"><label>' + value.toUpperCase() + '<span>0</span></label></li>');
        } else {
            $(parentElement + ' ul').append('<li><label>' + value.toUpperCase() + '</label><span>' + contacts.contacts[value].length + '</span></li>');
        }
    });
    $(this.parentElement + ' ul li').first().addClass('active');
    this.makeTabClickable();
    this.openTab(this.contacts[$(this.parentElement + ' ul li label').first().text().toLowerCase()]);
};

contacts.makeTabClickable = function(){
    // Set action for each tab
    $(this.parentElement + ' ul li').not('.active').not('.disabled').click(function(){
        $(contacts.parentElement + ' ul li').removeClass('active');
        $(this).addClass('active');
        contacts.openTab(contacts.contacts[$(this).find('label').text().toLowerCase()]);
    });
};

contacts.createContactsArray = function(json) {
    this.contactsList = json;
    var contacts = json.results;
    var contactsData = [];
    $.each(contacts, function(index, value) {
        contactsData[value.name.last.charAt(0).toLowerCase()] = contactsData[value.name.last.charAt(0).toLowerCase()] || [];
        contactsData[value.name.last.charAt(0).toLowerCase()].push(this);
    });
    this.contacts = contactsData;
    this.createTabHeaders();
    $('.preloader').addClass('hidden');
    $('section').removeClass('hidden');
};

contacts.openTab = function(tabData) {
    if(tabData !== undefined) {
        $(this.tabElement).html('<ul class="contactList"></ul>');
        $(tabData).each(function (index, value) {
            $(contacts.tabElement + ' ul.contactList').append('<li>' + value.name.first.charAt(0).toUpperCase() + value.name.first.slice(1) + ' ' + value.name.last.toUpperCase() + '</li>');
            $(contacts.tabElement + ' ul.contactList li').last().data(value);
        });
    } else {
        $(this.tabElement).html('<div class="message error">No contacts found</div>');
    }
    this.makeContactClickable();
};

contacts.makeContactClickable = function(){
    $(this.tabElement + ' ul.contactList li').click(function(){
        var contactInfo = $('.contactInfo');
        var parent = $(this);
        var left, top;
        var windowWidth = $(window).width();

        if(windowWidth > 600) {
            if (parent.offset().left < (windowWidth / 2)) {
                left = (windowWidth / 2) + 8;
            } else {
                left = (windowWidth / 2) - (contactInfo.width() + 16);
            }
            top = parent.offset().top;
        } else {
            left = 30;
            top = parent.offset().top + 40;
        }

        contactInfo.css({
            top: top,
            left: left
        });

        var loginDiv = $('<div class="loginInfo">USERNAME <br />'+ parent.data().login.username +'</div>');
        var topDiv = $('<div class="topDiv"><img src="'+ parent.data().picture.large +'" alt="'+ parent.data().name.last.toUpperCase() +' '+ parent.data().name.first +'">'+ parent.data().name.last.toUpperCase() +' '+ parent.data().name.first +'</div>');
        var infoDiv = '<div class="infoDiv"><div class="col-01">';
        infoDiv += '<ul>';
        infoDiv += '<li>e-mail</li>';
        infoDiv += '<li>phone</li>';
        infoDiv += '<li>street</li>';
        infoDiv += '<li>city</li>';
        infoDiv += '<li>state</li>';
        infoDiv += '<li>postcode</li>';
        infoDiv += '</ul>';
        infoDiv += '</div><div class="col-02">';
        infoDiv += '<ul>';
        infoDiv += '<li>'+ parent.data().email +'</li>';
        infoDiv += '<li>'+ parent.data().phone +'</li>';
        infoDiv += '<li>'+ parent.data().location.street +'</li>';
        infoDiv += '<li>'+ parent.data().location.city +'</li>';
        infoDiv += '<li>'+ parent.data().location.state +'</li>';
        infoDiv += '<li>'+ parent.data().location.postcode +'</li>';
        infoDiv += '</ul>';
        infoDiv += '</div></div>';

        contactInfo.html(loginDiv);
        contactInfo.append(topDiv);
        contactInfo.append(infoDiv);
        contactInfo.append('<div class="btn-Close">X</div>');

        $('.contactInfoBg').removeClass('hidden');
    });
};
