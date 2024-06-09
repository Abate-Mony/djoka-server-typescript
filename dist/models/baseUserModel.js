import mongoose from "mongoose";
// Base User Schema
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: [
            "student",
            "teacher",
            "admin",
            "parent",
            "accountant",
            "principal",
            "driver",
        ],
    },
    password: {
        type: String,
        required: [true, "please password is required "],
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    discriminatorKey: "role",
    collection: "users",
    versionKey: false,
    timestamps: true,
});
const User = mongoose.model("User", UserSchema);
// Student Schema
const StudentSchema = new mongoose.Schema({
    dateOfBirth: { type: Date },
    address: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment" },
    disciplineId: { type: mongoose.Schema.Types.ObjectId, ref: "Discipline" },
    performanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Performance" },
});
const Student = User.discriminator("student", StudentSchema);
// Teacher Schema/
const TeacherSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    disciplineId: { type: mongoose.Schema.Types.ObjectId, ref: "Discipline" },
    performanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Performance" },
});
const Teacher = User.discriminator("teacher", TeacherSchema);
// Admin Schema
const AdminSchema = new mongoose.Schema({});
const Admin = User.discriminator("admin", AdminSchema);
// Parent Schema
const ParentSchema = new mongoose.Schema({
    address: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Parent = User.discriminator("parent", ParentSchema);
// Accountant Schema
const AccountantSchema = new mongoose.Schema({});
const Accountant = User.discriminator("accountant", AccountantSchema);
// Principal Schema
const PrincipalSchema = new mongoose.Schema({});
const Principal = User.discriminator("principal", PrincipalSchema);
// Driver Schema
const DriverSchema = new mongoose.Schema({});
const Driver = User.discriminator("driver", DriverSchema);
export { User, Student, Teacher, Admin, Parent, Accountant, Principal, Driver };
//# sourceMappingURL=baseUserModel.js.map