$(() => {
    List.init();
    new Form($("main"), {id: null, full_name: null, phone_number: null, email: null, tags: null, isEdit: false});
    Search.init();
 }) 