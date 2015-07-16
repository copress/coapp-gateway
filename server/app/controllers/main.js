var Application = require('./application');

function Main(init) {
    Application.call(this, init);
}

require('util').inherits(Main, Application);

Main.prototype.index = function (c) {
    this.title = 'index';
    c.res.render('./index');
    if (c.context.inAction) {
        c.next();
    }
};

Main.prototype.login = function (c) {
    this.title = 'login';
    var demoUser;
    if (process.env.NODE_ENV !== 'prod' &&
        process.env.NODE_ENV !== 'production') {
        demoUser = {
            username: 'bob',
            password: 'secret'
        };
    }
    this.demoUser = demoUser;
    c.render();
};

module.exports = Main;
