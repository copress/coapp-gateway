var witty = require('witty')
    , Controller = witty.Controller;

var PagesController = new Controller();

PagesController.main = function () {
    this.title = 'Sycle API Gateway';
    this.render();
};

PagesController.login = function () {
    var demoUser;
    if (process.env.NODE_ENV !== 'prod' &&
        process.env.NODE_ENV !== 'production') {
        demoUser = {
            username: 'bob',
            password: 'secret'
        };
    }
    this.demoUser = demoUser;
    this.render();
};

module.exports = PagesController;
