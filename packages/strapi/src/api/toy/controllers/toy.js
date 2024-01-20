'use strict';

/**
 * toy controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::toy.toy');
