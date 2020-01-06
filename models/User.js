const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

var GroupSchema = new mongoose.Schema({
    groupID: { type: mongoose.Schema.Types.ObjectId, required: true },
    memberType: { type: String, enum: ['MEMBER', 'GROUPHEAD'], required: true }
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    userType: { type: String, enum: ['USER', 'MOD', 'ADMIN', 'Steward'], default: 'USER' },
    groups: [{ type: GroupSchema }],
    level: { type: Number, default: 1 },
    grade: { type: Number, default: 9},
    description: { type: String}
});



UserSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) {
        const document = this;
        bcrypt.hash(this.password, saltRounds, function(err, hashedPassword) {
            if (err) {
                next(err);
            } else {
                document.password = hashedPassword;
                next();
            }
        });
    } else {
        next();
    }
});

UserSchema.methods.isCorrectPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);