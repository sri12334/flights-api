import { v4 as Id } from "uuid";

const users = [];

class User {
    static getByEmail(email) {
        return users.find((user) => user.email === email)
    }
    static add(user) {
        const newUser = {
            id: Id(),
            ...user
        };
        users.push(newUser);
        return newUser;
    }
}

export default User;
