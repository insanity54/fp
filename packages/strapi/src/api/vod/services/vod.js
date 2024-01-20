'use strict';

/**
 * vod service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vod.vod');
