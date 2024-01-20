const { init } = require('@paralleldrive/cuid2');

module.exports = {
    async beforeUpdate(event) {
        const { data } = event.params;
        if (!data.cuid) {
            const length = 10; // 50% odds of collision after ~51,386,368 ids
            const cuid = init({ length });
            event.params.data.cuid = cuid();
        }
    }
}