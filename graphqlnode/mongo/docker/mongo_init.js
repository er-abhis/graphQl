db.createUser({
    user: "backend_admin",
    pwd: "password",
    roles: [{
        role: "root",
        db: "admin"
    }]
});