import mongoose,{Schema,models,model} from "mongoose"; // import mongoose core and helpers: Schema type, models cache, and model creator
import bcrypt from "bcryptjs"; // import bcryptjs to hash passwords

// TypeScript interface describing the shape of a user document
export interface user{
    email:string; // user's email address
    password:string; // user's hashed password
    _id?:mongoose.Types.ObjectId; // optional MongoDB ObjectId assigned by mongoose
    createdAt?:Date; // optional timestamp added by mongoose when timestamps option is enabled
    updatedAt?:Date; // optional timestamp added by mongoose when timestamps option is enabled
}

// Create a new Mongoose Schema for the user collection, typed with the `user` interface
const userSchema=new Schema<user>({
    email:{type:String , required : true , unique : true}, // email field: required and must be unique
    password:{type:String , required : true}, // password field: required (will store hashed password)
},{
    timestamps:true // automatically add `createdAt` and `updatedAt` fields
})

// Pre-save middleware: runs before saving a document to the database
userSchema.pre("save", async function(next){
    // `this` refers to the document being saved (use function() to get correct `this`)
    if(this.isModified("password")){ // only hash the password if it has been changed or is new
        this.password = await bcrypt.hash(this.password, 10); // hash the password with salt rounds = 10
    }
    next(); // call next to continue the save operation
})

// Use existing compiled model if available (prevents OverwriteModelError in dev/hot-reload environments),
// otherwise create a new model named "User" using the defined schema and TypeScript type
const User = models.User || model<user>("User", userSchema);

export default User; // export the model as the default export for use elsewhere in the app