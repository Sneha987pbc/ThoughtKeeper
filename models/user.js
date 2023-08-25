const { createHmac, randomBytes } = require('crypto');
const {createTokenForUser} = require("../service/authentication")
const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL:{
        type: String,
        default: "../public/info.png",   
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

},
{timestamps: true});

// for arrow function how this keyword behave serach for this
userSchema.pre("save", function (next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    // salt is like secret key
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();


})

userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
    const user = await this.findOne( {email});
    if(!user) throw new Error('User not found');

    const salt  = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");
    
    if(hashedPassword !== userProvidedHash) throw new Error('Incorrect Password');

    // return {...user._doc, password: undefined, salt: undefined};
    // return user;

    const token = createTokenForUser(user);
    return token;

})

const User = model('user', userSchema);

module.exports = User;



// const { createHmac } = await import('node:crypto');

// go for siye cryptohash node

// const secret = 'abcdefg';
// const hash = createHmac('sha256', secret)
//                .update('I love cupcakes')
//                .digest('hex');
// console.log(hash);

// here you can generate this secret key using randomBytes as well

// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e