const Discount = require("../models/discount")
const User = require("../models/user")

exports.grantReward = async (req, res) => {
    try {
        const { shopLocation, shoppingAmount, email } = req.body
        const date = Date.now()
        const reward = shoppingAmount * 0.003
        const userId = (await User.findOne({ email: email })).id;

        if (!userId) {
            req.flash("error", 'no registered account with the associated email')
            return res.redirect("/admin/grant-reward")
        }
        Discount.create({
            userId: userId, shopLocation: shopLocation, date: date,shoppingAmount:shoppingAmount,
            discount: reward
        }, (error, dis) => {
            if (dis) {
                console.log(dis)
                req.flash("success", "transaction add successfully")
                return res.redirect("/admin/grant-reward")
            }
            else{
                const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
                console.log(validationErrors)
                req.flash("error", validationErrors)
                return res.redirect("/admin/grant-reward")   
            }
        }
        )
     
    }
    catch (error) {
        req.flash("error", error)
        return res.redirect("/admin/grant-reward")
    }
};
exports.grantRewardView = async (req, res) => {
    res.render('admin/add-reward', {
        errors: req.flash('error'),
        success: req.flash('success'),
        pageTitle: "add transation",
        active: "add"
    })

}
exports.deleteReward = async (req, res) => {
    try{
    const id = req.body.id
    console.log(id)
    await Discount.findOneAndDelete({id:id})
    req.flash("success", "successfully removed transaction")
    return res.redirect("/admin/view-reward")}
    catch(error){
        req.flash("error", 'something went wrong')
        return res.redirect("/admin/view-reward")
    }
};
exports.viewAllRewards = async (req, res) => {
    const rewards = await Discount.find({}).populate('userId')
    res.render('admin/edit-reward', {
        errors: req.flash('error'),
        rewards: rewards,
        success: req.flash('success'),
        pageTitle: "view transactions",
        active: "view"
    })

}
exports.viewAllUserRewards = async (req, res) => {
    const id = req.session.userId;
    const rewards = await Discount.find({ userId: id })
    var totalAmount = 0
    rewards.filter(reward => totalAmount = Number(reward.discount) + totalAmount)
    res.render('discounts', {
        errors: req.flash('error'),
        rewards: rewards,
        totalAmount: totalAmount,
        success: req.flash('success'),
        pageTitle: 'rewards'

    })

}