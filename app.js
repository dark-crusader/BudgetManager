
// MOULE TO CONTROL BUDGET CHANGES
var budgetController = (function() {
    
    // Function constructor for Expense
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercent = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    // Function constructor for Income
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(ele => {
            sum += ele.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        },

        // Function to remove element from data store
        deleteItem: function(type, ID) {
            
            //Get ID's of all elements
            var ids = data.allItems[type].map(ele => {
                return ele.id;
            });
            
            // Find the index of required ID
            var index = ids.indexOf(ID);

            // Remove the element at the index if found
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // TODOS:
            // Calculate total income and epenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income expended
            // Percentage is calculated only if there is some income
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            
        },

        // Calculates the percentages of all expenses
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(expense) {
                expense.calcPercent(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPercent = data.allItems.exp.map(function(expense) {
                return expense.getPercentage();
            });
            return allPercent;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },

        test: data
    
    };

})();


// UPDATES UI TO BE COHERENT WITH CHANGES IN BUDGET CONTROLLER
var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        expensePercentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPer: '.item__percentage'
    };

    // Formats numbers for display
    function formatNumber(num, type) {
        var sign = type === 'inc' ? '+ ' : '- ';
        num = num.toFixed(2);
        var splitNum = num.split('.');
        var int = splitNum[0];
        var dec = splitNum[1];
        int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + int + '.' + dec;
    }

    return {

        // Method to return input feilds
        getInput: function() {
            return {
            // returns inc: income, exp: expeses
                type: document.querySelector(DOMStrings.inputType).value,
            // returns description of the income/expense
                description: document.querySelector(DOMStrings.inputDescription).value,
            // returns the amount of income/expense as a float
                amount: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        // Method to add items
        addListItem: function(obj, type) {
            // TODOS:
            // Create a skeletral HTML string
            var html = '';
            var element;               // To store HTML element to manipulate
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }
            
            // Modify string to include actual data
            var placeholders = ['%id%', '%desc%', '%value%'];
            var inputValue = [obj.id, obj.description, formatNumber(obj.value, type)];

            for(var i = 0; i < inputValue.length; i++) {
                html = html.replace(placeholders[i], inputValue[i]);
            }

            // Insert the HTML string to DOM at the end of section
            document.querySelector(element).insertAdjacentHTML('beforeend', html);

        },

        // Function to delete item from UI
        deleteListItem: function(ID) {
            // Remove the element with the passed ID
            var ele = document.getElementById(ID);
            ele.parentNode.removeChild(ele);
        },

        // Method to clear input fields
        clearFields: function() {
            var fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            var fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(ele => {
                ele.value = '';
            });

            fieldsArray[0].focus();
        },

        // Function to refresh budget
        refreshBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
                    Math.abs(obj.budget), 
                    obj.budget >= 0 ? 'inc' : 'exp'
                );
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.expensePercentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.expensePercentageLabel).textContent = '-';
            }
        
        },

        // Refreshes the precentages in UI
        refreshPercentages: function(percentages) {
            // Get NodeList of all expense elements
            var fields = document.querySelectorAll(DOMStrings.expPer);
            // Update percentage for each in UI
            fields.forEach((ele, index) => {
                if (percentages[index] > 0) {
                    ele.textContent = percentages[index] + '%';
                } else {
                    ele.textContent = '-';
                }
            });

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

        // Adding remove functionality
        // Add event handler to parent for event Delegation and handling
        document.querySelector(DOMStrings.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function() {
        // TODOS:
        // 1. Calculate new Budget
        budgetCtrl.calculateBudget();
        // 2. Get the updated budget
        var budget = budgetCtrl.getBudget();
        // 3. Update the budget in UI
        UICtrl.refreshBudget(budget);
    };

    var updatePercentages = function() {
        //TODOS
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        // 2. Read percentages from budgetController
        var percentages = budgetController.getPercentages();
        console.log(percentages);
        
        // 3. Update UI with new Percentages
        UICtrl.refreshPercentages(percentages);
    };

    // Function to initiate item creation
    var ctrlAddItem = function() {
        // TODOS:
        // 1. Get input data from input fields
        var input = UICtrl.getInput();

        if (input.description !== '' && input.amount > 0 && !isNaN(input.amount)) {
            // 2. Update the budget
        var newItem = budgetCtrl.addItem(input.type, input.description, input.amount);
        // 3. Update UI to display updated Item
        UICtrl.addListItem(newItem, input.type);
        // 4. Clear the fields on input
        UICtrl.clearFields();
        // 5. Calculate and update budget on UI
        updateBudget();
        } else {
            alert('There should be an description.\nValue should be greater than 0.');
        }
        // 6. Update expense percentages
        updatePercentages();
        
    };

    // Function to initiate  item deletion
    var ctrlDeleteItem = function(e) {
        // Get the ID of the 4th parent node
        var itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        var type, ID;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // Delete item form data store
            budgetCtrl.deleteItem(type, ID);
            // Delete item form UI
            UICtrl.deleteListItem(itemID);
            // Update and display the budget
            updateBudget();
            // Update expense percentages
            updatePercentages();
        }
    };
    
    return {
        // Funtion to Initialize the Controller
        init: function() {
            console.log('Started...');
            setupEventListeners();
            UICtrl.refreshBudget(budgetCtrl.getBudget());
        }
    };

})(budgetController, UIController);

// Initialize the app
controller.init();