
// MOULE TO CONTROL BUDGET CHANGES
var budgetController = (function() {
    
    // Update the budget based on user input

})();


// UPDATES UI TO BE COHERENT WITH CHANGES IN BUDGET CONTROLLER
var UIController = (function() {

    // Contols UI Diplay management and updation

})();


// GLOBAL CONTROLLER TO CONTROL ALL OTHER MODULES
var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {
        // TODOS:
        // 1. Get input data from input field
        // 2. Update the budget
        // 3. Update UI to display updated budget
        

    }
    
    // Attach an event Listener to add__btn
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    // On pressing enter
    document.querySelector('.add__description').addEventListener('keypress', (e) => {
        if (e.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);


