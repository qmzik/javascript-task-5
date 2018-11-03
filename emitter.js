'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = new Map();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Object} star
         * @returns {this}
         */
        on: function (event, context, handler, star = { times: Infinity, step: 1 }) {
            if (!events.has(event)) {
                events.set(event, []);
            }

            events.get(event).push({ context, handler, star, called: 0 });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {this}
         */
        off: function (event, context) {
            const removeEvents = [...events.keys()].filter(e => e.indexOf(event) !== -1);

            removeEvents.forEach(e => {
                if (events.get(e)) {
                    events.set(e, events.get(e).filter(val => val.context !== context));
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {this}
         */
        emit: function (event) {
            const evs = getEventsForEmit(event);
            evs.forEach(e => {
                const subs = events.get(e);
                if (subs) {
                    subs.forEach(sub => callEvent(sub));
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {this}
         */
        several: function (event, context, handler, times) {
            this.on(event, context, handler, { times, step: 1 });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {this}
         */
        through: function (event, context, handler, frequency) {
            this.on(event, context, handler, { times: Infinity, step: frequency });

            return this;
        }
    };
}

function getEventsForEmit(event) {
    if (event.indexOf('.') === -1) {
        return [event];
    }

    const splitted = event.split('.');
    const eventsForEmit = [];
    splitted.reduce((prev, current) => {
        const e = `${prev}${prev ? '.' : ''}${current}`;
        eventsForEmit.push(e);

        return e;
    }, '');

    return eventsForEmit.reverse();
}

function callEvent(sub) {
    if (sub.star.times <= sub.called) {
        return;
    }
    if (sub.called % sub.star.step === 0) {
        sub.handler.call(sub.context);
    }

    sub.called++;
}

module.exports = {
    getEmitter,

    isStar
};
