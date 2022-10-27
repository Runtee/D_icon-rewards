const Discount = require("../models/discount");
const User = require("../models/user")
exports.dashboard = async (req, res) => {
    const id = req.session.userId;
    const rewards = await Discount.find({ userId: id })
    const user = await User.findOne({ id: id })
    var totalAmount = 0 
    rewards.filter(reward => totalAmount = Number(reward.discount) + totalAmount)

    res.render('dashboard',{
        pageTitle: "dashboard",
        totalAmount: totalAmount,
        user: user

    })

};
exports.profileView = async (req, res) => {
    const user = await User.findById(req.session.userId)
    res.render('profile', {
        errors: req.flash('validationErrors'),
        user: user,
        success: req.flash('success'),
        pageTitle: 'profile'

    })

}


exports.profile = (req, res) => {
    let Uprofile = {
        fullName: req.body.fullname,
        phone: req.body.phone,
        address: req.body.address,  

    }
    let id = req.session.userId
    User.findOneAndUpdate({ id: id }, Uprofile, (error, user) => {
        if (error) {
            const validationErrors = Object.keys(error.errors).map(key =>
                error.errors[key].message)
            req.flash('error', validationErrors)
            res.redirect('/dashboard/profile')
        }
        else {
            req.flash('success', 'Successfully updated your profile')
            res.redirect('/dashboard/profile')
        }

    })
}


