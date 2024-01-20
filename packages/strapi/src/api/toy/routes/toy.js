'use strict';

/**
 * toy router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::toy.toy');
