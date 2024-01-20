'use strict';

/**
 * toy service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::toy.toy');
