const { init } = require('@paralleldrive/cuid2');

module.exports = function() {
    const length = 10;
    const genCuid = init({ length });
    return genCuid();
}