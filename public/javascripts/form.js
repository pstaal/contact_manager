class Form {
    constructor(container, object = {}){
      this.formTemplate = Handlebars.compile($("#form_template").html())
      this.container = container;
      this.container[0].insertAdjacentHTML("afterbegin",this.formTemplate(object));
      this.$form = this.container.find("form");
      this.$input = this.container.find("input");
      this.$button = this.container.find(".form_button");
      this.$input.on('change', this.handleChange.bind(this));
      this.$form.on('submit', this.handleFormSubmit.bind(this));
    }

    handleValueAbsence($control) {
      var labelText = $control.attr('name');
      var $errorMessage = $control.next('.error_message');
      var errorMessage = labelText + ' is a required field.';
  
      $control.addClass('invalid_field');
      $errorMessage.text(errorMessage);
    }
  
    handlePatternMismatch($control) {
      var labelText = $control.attr('name');
      var $errorMessage = $control.next('.error_message');
      var errorMessage = 'Please Enter a valid ' + labelText + '.';
  
      $control.addClass('invalid_field');
      $errorMessage.text(errorMessage);
    }

    handleValueTooLong($control) {
      var labelText = $control.attr('name');
      var length = $control.attr('maxLength')
      var $errorMessage = $control.next('.error_message');
      var errorMessage = `The ${labelText} cannot be longer than ${length} characters`;
  
      $control.addClass('invalid_field');
      $errorMessage.text(errorMessage);
    }

    handleValueTooShort ($control) {
        var labelText = $control.attr('name');
        var length = $control.attr('minLength');
        var $errorMessage = $control.next('.error_message');
        var errorMessage = `The ${labelText} has to be at least ${length} characters`;
    
        $control.addClass('invalid_field');
        $errorMessage.text(errorMessage);
    }
  
    validateControl ($control) {
      if ($control[0].validity.valueMissing) {
        this.handleValueAbsence($control);
        return false;
      } else if ($control[0].validity.patternMismatch) {
        this.handlePatternMismatch($control);
        return false;
      } else if ($control[0].validity.tooShort){
        this.handleValueTooShort($control);
        return false;
      } else if ($control[0].validity.tooLong) {
        this.handleValueTooLong($control);
        return false;
      } else {
        $control.next('.error_message').text('');
        $control.removeClass('invalid_field');
      }
  
      return true;
    }
  
    handleFormSubmit(e) {
      e.preventDefault();
      let data = {
        full_name: this.$form.find('input[name="full_name"]').val(),
        email: this.$form.find('input[name="email"]').val(),
        phone_number: this.$form.find('input[name="phone_number"]').val(),
        tags: this.$form.find('input[name="tags"]').val(),
      }

      if (this.$button.text().includes("Add")){
        this.addContact(data);
      } else if (this.$button.text().includes("Edit")){
        let id = this.$form.attr("data-id")
        this.editContact(data, id)
      }
    }

    addContact(data) {
        let self = this;
        $.ajax({
            url: '/api/contacts',
            type: "POST",
            data
          }).done(function() {
            List.renderList();
            self.$form[0].reset();
            self.$button.prop("disabled", !self.$form[0].checkValidity())
          });
    }

    editContact(data, id) {
        data = {
            ...data,
            id
        };
       
        $.ajax({
            url: `/api/contacts/${id}`,
            type: "PUT",
            data
          }).done(function() {
            List.renderList();
            List.hidePrompt();
          });

    }
  
    validateFormInputs() {
      for (let i = 0; i < this.$input.length; i += 1){
        if (!this.$input[i].checkValidity()){
            return false;
        }
      }
      return true;

    }
  

    handleChange(e) {
        var $control = $(e.target);
        this.validateControl($control);
        this.$button.prop("disabled", !this.validateFormInputs());
    }
  
   
  };
  

 