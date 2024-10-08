export const USER_ROLES = {
    admin: "admin",
    student: "student",
    proffessour: "proffessour",
};
export const PRODUCT_STATES = {
    pending: "pending",
    recieve: "recieve",
    sent: "sent",
};
export const TASK_STATES = {
    paid: "paid",
    unpaid: "unpaid",
};
export const MONGODB_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    // useFindAndModify: false
};
//# sourceMappingURL=constant.js.map