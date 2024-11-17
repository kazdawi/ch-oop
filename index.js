class CartItem {
    constructor(element) {
        this.element = element;
        this.price = parseFloat(this.element.dataset.price);  // Get the price from the data-price attribute
        this.quantityInput = this.element.querySelector('.qty');  // Get the corresponding quantity input
    }

    getQuantity() {
        return parseInt(this.quantityInput.value);
    }

    setQuantity(quantity) {
        this.quantityInput.value = quantity;
    }

    getTotalPrice() {
        return this.price * this.getQuantity();
    }

    remove() {
        this.element.remove();
    }

    static updateTotal(cartItems) {
        let total = 0;
        cartItems.forEach(item => total += item.getTotalPrice());
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }
}

class Cart {
    constructor() {
        this.cartItems = [];
        this.init();
    }

    init() {
        // Select all cart items and create CartItem objects
        const items = document.querySelectorAll('.cart-item');
        items.forEach(itemElement => {
            const cartItem = new CartItem(itemElement);
            this.cartItems.push(cartItem);
        });

        // Set up event listeners for plus/minus buttons and trash icons
        this.setupEventListeners();
        
        // Initialize total
        CartItem.updateTotal(this.cartItems);
    }

    setupEventListeners() {
        this.setupQuantityChange();
        this.setupItemRemoval();
        this.setupHeartIconToggle();
    }

    setupQuantityChange() {
        // Event listeners for quantity changes (both plus and minus buttons)
        const plusButtons = document.querySelectorAll('.qty-plus');
        const minusButtons = document.querySelectorAll('.qty-minus');

        plusButtons.forEach(plusButton => {
            const cartItem = this.getCartItem(plusButton);
            plusButton.addEventListener("click", () => {
                cartItem.setQuantity(cartItem.getQuantity() + 1);
                CartItem.updateTotal(this.cartItems);  // Update the total whenever quantity changes
            });
        });

        minusButtons.forEach(minusButton => {
            const cartItem = this.getCartItem(minusButton);
            minusButton.addEventListener("click", () => {
                if (cartItem.getQuantity() > 1) {
                    cartItem.setQuantity(cartItem.getQuantity() - 1);
                    CartItem.updateTotal(this.cartItems);  // Update the total whenever quantity changes
                }
            });
        });
    }

    setupItemRemoval() {
        // Event listener for removing an item
        const trashIcons = document.querySelectorAll('.fa-trash-can');

        trashIcons.forEach(trashIcon => {
            trashIcon.addEventListener('click', () => {
                const cartItem = this.getCartItem(trashIcon);
                cartItem.remove();  // Remove the item from the DOM
                this.cartItems = this.cartItems.filter(item => item !== cartItem);  // Remove from cartItems array
                CartItem.updateTotal(this.cartItems);  // Recalculate the total after removal
            });
        });
    }

    setupHeartIconToggle() {
        // Event listener for heart icon toggle
        const heartIcons = document.querySelectorAll('.heart-icon');
        
        heartIcons.forEach(heart => {
            heart.addEventListener('click', () => {
                // Toggle the 'text-red-500' class (which makes the heart red)
                heart.classList.toggle('text-red-500');
            });
        });
    }

    getCartItem(buttonElement) {
        // Find the parent cart-item for any given button or icon
        const cartItemElement = buttonElement.closest('.cart-item');
        return this.cartItems.find(item => item.element === cartItemElement);
    }
}

// Initialize the cart when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new Cart();  // Create a new Cart instance which sets up everything
});
