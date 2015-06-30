module.exports = function() {

    this.set('db', {
        autoupdate: true,
        driver: 'mysql',
        username: 'root',
        database: 'sycle_gateway',
        collation: 'utf8_unicode_ci'
    })
};
