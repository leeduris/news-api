const router = require('express').Router()

router.use(
    '/',
    require("./users"),
    require("./articles"),
    require("./graphql")
);

module.exports = router