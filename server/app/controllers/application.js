var Application = module.exports = function Application(init) {
    init.before(function protectFromForgeryHook(ctl) {
        ctl.protectFromForgery('099470176a7b75c8b889373cff11f38a4e82eefa');
    });
};
