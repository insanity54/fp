'use strict';

/**
 * vtuber service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vtuber.vtuber');
