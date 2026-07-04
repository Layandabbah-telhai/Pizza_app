# Pizza Ordering System

## Student

Name: Layan Dabbah  
ID: 215057191

## Repository Link

https://github.com/Layandabbah-telhai/Pizza_app.git

## Installation and Run Instructions

### Server Side

```bash
cd server
npm install
npm run dev
```

The server runs on:

```text
http://localhost:3001
```

### Client Side

```bash
cd client
npm install
npm run dev
```

The client runs on:

```text
http://localhost:5173
```

## Project Structure

```text
pizza_app_215057191
├── server
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── client
│   ├── src
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## Project Structure Explanation

The project consists of two parts:

- Server: Built with Node.js and Express. It validates orders, calculates the final price, stores orders in memory, and manages order status.
- Client: Built with React. It allows customers to create orders and provides separate screens for the customer, restaurant employee, and delivery person.

## Price Calculation

The final order price is calculated on the server.

The server calculates the total based on:

- Pizza
- Size
- Toppings
- Delivery fee

The client only displays an estimated price for the user.

## Personal Rule

Since my student ID ends with 1, the personal rule is:

- Orders above 100 NIS receive free delivery.
- Otherwise, the delivery fee is 15 NIS.

This rule is implemented on the server.

## Changes from Exercise 1

The original design from Exercise 1 was kept.

The only change is that instead of implementing a real login system, the application uses navigation between three screens:

- Customer
- Restaurant Employee
- Delivery Person

This keeps the project simple while matching the assignment requirements.

# Questions

## 1. What is the difference between the client side and the server side?

The client side is the React application that users interact with.

The server side is the Express REST API that validates orders, calculates prices, stores orders, and updates their status.

## 2. Where is the total price calculated and why?

The total price is calculated on the server.

This prevents users from changing prices in the browser and ensures the final amount is always correct.

## 3. What happens when a customer sends an invalid order?

The server validates the request.

If the order is invalid, it returns HTTP 400 with an error message explaining the problem.

## 4. What happens after the simulated payment succeeds?

The server creates a new order, marks the payment as paid, sets the order status to new, saves it in memory, and returns an order confirmation.

## 5. What is your personal rule?

Orders above 100 NIS receive free delivery.

Otherwise, the delivery fee is 15 NIS.

## 6. What was the most challenging part of the exercise?

Connecting the React client with the Express server and keeping the order status flow synchronized.

## 7. What design decision did you make and why?

We separated the application into three screens:

- Customer
- Restaurant Employee
- Delivery Person

This makes the system easier to understand and use while keeping the implementation simple.