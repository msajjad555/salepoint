const express=require("express");
const router=express.Router()
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controller/orderController");
const {auth,authorizeRoles}=require('../middleware/auth')

router.route('/order/new').post(auth,newOrder)
router.route('/order/:id').get(auth,getSingleOrder)
// router.route("/admin/orders").get(auth, authorizeRoles("admin"), getAllOrders);
router.route('/orders/me').get(auth,myOrders)
router.route('/orders').get(auth,getAllOrders);
router.route('/order/:id').put(updateOrder).delete(deleteOrder);
module.exports=router