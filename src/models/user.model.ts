import bcrypt from "bcryptjs";
import mongoose, { Query } from "mongoose";
import validator from "validator";

interface UserDocument extends Document {
  name: string;
  email: string;
  role: "seller" | "coach" | "user" | "admin";
  photo: string;
  password: string;
  active: boolean;
  passwordChangedAt: Date;
  passwordResetToken: any;
  passwordResetTokenExpires: any;
  passwordConfirm: string | undefined;

  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;

  changedPasswordAfter: (JWTTimestamp: any) => boolean;
}

//  role can be seller ,coach, user,admin
const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    max: [40, "a user name must be below 40 caracters"],
    min: [2, "a user name must be above 2 caracters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "a user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["seller", "coach", "user", "admin"],
    default: "user",
  },
  photo: {
    type: String,
    default: "default.png",
  },
  password: {
    type: String,
    required: [true, "a user must have a password"],
    minLength: 8,
  },
  passwordConfirm: {
    type: String as unknown as string | undefined,
    required: [true, "a user must have a confirm password "],
    minLength: 8,

    validate: {
      validator: function (this: any, value: string): boolean {
        return value === this.password;
      },
      message:
        "password and password Confirm not matched , please  check again!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: {},
  passwordResetTokenExpires: {},
  active: {
    type: Boolean,
    default: true,
  },
});

//  DOCUMENT pre save middleware
// check if the password has been updated{in case of updating it would be modified }
// if its new we hash it and remove the confirm that we dont store it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// to dont get the password when querying the document(s)
userSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.select("-password");
  next();
});

//  !login : check the user password with   the input when he login {inctance method :available  in all documents} and  RETURN TRUE OR FALSE

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  const correct = await bcrypt.compare(candidatePassword, userPassword);
  return correct;
};

// !protect: check if the password changed after the jwt was issued using the passwordchangedAt if it existt we compare the jwt iat
// ! if it doesnt exist we pass directly

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: any) {
  if (this.passwordChangedAt) {
    // £JWTTimestamp are in the seconds and this.passwordChangedAt is in the date format so we change it and compare
    const timestamp = this.passwordChangedAt.getTime();
    return timestamp > JWTTimestamp * 1000;
  }
  return false;
};

//
//
export const User = mongoose.model<UserDocument>("User", userSchema);
