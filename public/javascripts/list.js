

const List = {

    renderList: function() {
        let self = this;
        $.ajax({
            url: '/api/contacts',
            type: "GET",
            dataType : "json",
          }).done(function(contacts) {
            contacts.map(contact => {
                if (contact.tags) {
                    contact.tags = contact.tags.split(",")
                } else {
                    contact.tags = [];
                }})
            self.$container.html(self.$listTemplate({ contacts }))
          });
    },

    handleDeleteClick: function(e) {
        var contactId   = Number($(e.target).closest('li').attr('data-id'));
        this.showPrompt(contactId);
    },

    handleEditClick: function(e) {
        let id = Number($(e.target).closest('li').attr('data-id'));
        let full_name = $(e.target).closest("li").find(".full_name").text();
        let email = $(e.target).closest("li").find(".email").text();
        let phone_number = $(e.target).closest("li").find(".phone_number").text();
        
        let array = [];
        $(e.target).closest("li").find("a").each((index, anchor) => {
            array.push($(anchor).text())
        });
        let tags =  array.join(",");
        new Form(this.$modal, {id, full_name, email, phone_number, tags, isEdit: true});
        this.$modal.add('.overlay').show();
    },

    showPrompt: function(contactId) {
        this.$modal.html(this.$deleteTemplate({id: contactId}));
        this.$modal.add('.overlay').show();
        this.bindPromptDeleteEvents();
    },

    hidePrompt: function() {
        this.$modal.add('.overlay').hide();
        this.$modal.html('');
    },

    removeContact: function(id) {
        let self = this;
        $.ajax({
            url: `/api/contacts/${id}`,
            type: "DELETE",
          }).done(function() {
            self.hidePrompt();
            self.renderList();
          });
    },


    handleConfirmYes: function(e) {
        var contactId = Number($(e.target).closest('.confirm_wrapper').attr('data-id'));
        this.removeContact(contactId);
    },

    bindPromptDeleteEvents: function() {
        this.$modal.find('.confirm_no').one('click', this.hidePrompt.bind(this));
        this.$modal.find('.confirm_yes').one(
          'click',
          this.handleConfirmYes.bind(this)
        );
      },

    init: function(){
        this.$listTemplate = Handlebars.compile($("#contactsList").html());
        this.$deleteTemplate = Handlebars.compile($('#delete_template').html());
        this.$modal = $('.modal');
        this.$container = $("#list_container");
        Handlebars.registerPartial('tagTemplate', $('#tagTemplate').html());
        Handlebars.registerPartial('contactTemplate', $('#contactTemplate').html());
        this.$container.on('click', '#delete_button', this.handleDeleteClick.bind(this));
        this.$container.on('click', '#edit_button', this.handleEditClick.bind(this));
        $('.overlay').on('click', this.hidePrompt.bind(this));
        this.renderList();
    }

}