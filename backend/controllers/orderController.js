const Order = require("../models/orderModel");
const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const addOrderItems = expressAsyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    buyeremail,
    selleremail,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: req.user._id,
      buyeremail,
      selleremail,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

    //send email to buyer and seller
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      port: 465, // true for 465, false for other ports
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD,
      },
      secure: true,
    });

    const mailData = {
      from: "urjitdesai07@gmail.com", // sender address
      to: buyeremail, // list of receivers
      subject: `Order Recieved `,
      text: `items will be shipped to the following address`,
      html: "<p>Your order has been placed successfully!. Sent by Proshop! </p>",
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });
  }
});

// GET ORDER BY ID
const getOrderById = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// UPDATE ORDER TO PAID
// const updateOrderToPaid= expressAsyncHandler(async (req, res) => {
//     const order= await Order.findById(req.params.id)

//     if(order){
//         order.isPaid= true
//         order.paidAt= Date.now()
//         // below object stuff comes from paypal
//         order.paymentResult={
//             id: req.body.id,
//             status: req.body.status,
//             update_time: req.body.update_time,
//             email_address: req.body.payer.email_address
//         }

//         const updatedOrder= await order.save()
//         res.json(updatedOrder)
//     } else {
//         res.status(404)
//         throw new Error("Order not found")
//     }
// })

// UPDATE ORDER TO PAID
const updateOrderToPaid = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // below object stuff comes from paypal

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// GET ALL ORDERS OF THE USER
const getMyOrders = expressAsyncHandler(async (req, res) => {
  console.log("getMyOrders got= ", req.body);
  const orders = await Order.find({ user: req.user._id });

  res.json(orders);
});

// GET ALL ORDERS OF ALL USERS
const getAllOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  console.log("getAllorders data= ", orders);
  res.json(orders);
});

// UPDATE ORDER TO DELIVERED
const updateOrderToDelivered = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    console.log(updatedOrder);
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

module.exports = {
  addOrderItems,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  getOrderById,
};
