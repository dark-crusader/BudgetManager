
// MOULE TO CONTROL BUDGET CHANGES
var budgetController = (function() {
    
    // Function constructor for Expense
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Function constructor for Income
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, description, value) {
            var newItem, ID;
            // Next ID is 1 + previous ID is type Array if elements exist
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create Object Based on the type of input
            if (type === 'exp') {
                newItem = new Expense(ID, description, value);
            } else if(type === 'inc') {
                newItem = new Income(ID, description, value);
            }
            // Push the newly created item to the array of its category 
            data.allItems[type].push(newItem);
            // Return the new element
            return newItem;
        }
    
    };

})();


// UPDATES UI TO BE COHERENT WITH CHANGES IN BUDGET CONTROLLER
var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {

        // Method to return input feilds
        getInput: function() {
            return {
            // returns inc: income, exp: expeses
                type: document.querySelector(DOMStrings.inputType).value,
            // returns description of the income/expense
                description: document.querySelector(DOMStrings.inputDescription).value,
            // returns the amount of income/expense
                amount: parseInt(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        // Getter for DOMString Object
        getDOMString: function() {
            return DOMStrings;
        }
    };

})();


// GLOBAL CONTROLLER TO CONTROL ALL OTHER MODULES
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        // Stores DOM class strings
        var DOMStrings = UICtrl.getDOMString();
        // Attach an event Listener to add__btn
        document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem);
        // On pressing enter
        document.addEventListener('keypress', (e) => {
            if (e.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function() {
        // TODOS:
        // 1. Get input data from input fields
        var input = UICtrl.getInput();
        // 2. Update the budget
        var newItem = budgetCtrl.addItem(input.type, input.description, input.amount);
        // 3. Update UI to display updated Item
        

    };
    
    return {
        // Funtion to Initialize the Controller
        init: function() {
            console.log('Started...');
            setupEventListeners();
        }
    };

})(budgetController, UIController);


controller.init();