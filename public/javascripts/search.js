function debounce(func, delay) {
    let timeout;
    return (...args) => {
      if (timeout) { clearTimeout(timeout) }
      timeout = setTimeout(() => func.apply(null, args), delay);
    };
};

const Search = {
    
    bindEvents: function() {
        this.$search.on('input', this.valueChanged);
        this.$container.on('click', 'a', this.handleClick.bind(this))
    },

    _getAllContacts: async function(){
        let response = await fetch('/api/contacts', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        response = await response.json()
        response.map(contact => {
            if (contact.tags) {
                contact.tags = contact.tags.split(",")
            } else {
                contact.tags = [];
            }})
        return response;
    },

    handleClick: async function(e) {
        e.preventDefault();
        let value = $(e.target).text().trim();
        let contacts = await this._getAllContacts();
        contacts = contacts.filter(contact => {
            for (let i = 0; i < contact.tags.length; i += 1){
               if (contact.tags[i].trim() === value){
                return true;
               }
            }
            return false;
        });
        this.$container.html(List.$listTemplate({ contacts }))
    },

    valueChanged: async function() {
      let value = this.$search.val();
      let contacts = await this._getAllContacts();
      contacts = contacts.filter(contact => {
        return contact.full_name.toLowerCase().startsWith(value)
       });
      this.$container.html(List.$listTemplate({ contacts }))
    },

    init: function() {
      this.$search = $("#search_input");
      this.$container = $("#list_container");
      this.valueChanged = debounce(this.valueChanged.bind(this), 400);
      this.bindEvents();  
    }
}