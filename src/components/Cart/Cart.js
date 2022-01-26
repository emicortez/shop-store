import React, { useContext, useState } from 'react';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';
import Modal from '../UI/Modal';
import classes from './Cart.module.css';
import Checkout from './Checkout';

const Cart = props => {

    const cartCtx = useContext(CartContext);
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const addCartItemHandler = (item) => {
        cartCtx.addItem({ ...item, amount: 1 })
    };

    const removeCartItemHandler = (id) => {
        cartCtx.removeItem(id);
    };

    const orderHandler = () => {
        setIsCheckout(true);
    };

    const cartItems = (
        <ul className={classes['cart-items']}>
            {cartCtx.items.map(item => (
                <CartItem
                    key={item.key}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onRemove={removeCartItemHandler.bind(null, item.id)}
                    onAdd={addCartItemHandler.bind(null, item)} />
            ))}
        </ul>
    );

    const modalAction = (
        <div className={classes.actions} >
            <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
            {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
        </div>
    );

    const submitOrderHandler = async data => {
        setIsSubmiting(true);

        await fetch('https://react-http-a4db9-default-rtdb.firebaseio.com/orders.json', {
            method: 'POST',
            body: JSON.stringify({
                user: data,
                orderedItem: cartCtx.items
            })
        });

        setIsSubmiting(false);
        setDidSubmit(true);

        cartCtx.clearCart();
    };

    const cartModalContent = (<React.Fragment>
        {cartItems}
        <div>
            <span>Total Amount </span>
            <span>{totalAmount}</span>
        </div>
        {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
        {!isCheckout && modalAction}
    </React.Fragment>
    );

    const isSubmittingContent = (
        <p>sending order...</p>
    );

    const isSubmittedContent = (
        <React.Fragment>
            <p>Successfully sent the order</p>
            <div className={classes.actions} >
                <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
            </div>
        </React.Fragment>
    );

    return (
        <Modal onClose={props.onClose}>
            {!isSubmiting && !didSubmit && cartModalContent}
            {isSubmiting && isSubmittingContent}
            {!isSubmiting && didSubmit && isSubmittedContent}
        </Modal>
    );
}

export default Cart;