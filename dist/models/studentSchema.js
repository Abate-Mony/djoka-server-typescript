import mongoose from 'mongoose';
const StudentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
    enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    disciplineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discipline', required: true },
    performanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Performance', required: true },
}, {
    timestamps: true,
    versionKey: false
});
const Student = mongoose.model('Student', StudentSchema);
export default Student;
//# sourceMappingURL=studentSchema.js.map