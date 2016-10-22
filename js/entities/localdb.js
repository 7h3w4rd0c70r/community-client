/**
 * Created by Patrik on 8/11/2016.
 */

Lampa.module('Entities', function (Entities, Lampa, Backbone, Marionette, $, _) {

    Entities.LocalDB = {
        _meta: { }
    };

    Entities.LocalQueue = { };

    Entities.LocalAPI = Entities.Api.extend({
        newTable: function (table) {
            return Entities.LocalDB[table] = {
                collection: [ ],
                fetch: function () { return false; }
            };
        },
        constructTable: function (table, fetch) {
            var _table = this.newTable(table);
            _table.fetch = fetch;
        },
        fetch: function (table, index) {
            var _this = this,
                _table = Entities.LocalDB[table] || this.newTable(table),
                defer = $.Deferred(),
                value;
            if (value = _table.collection[Number(index)]) return defer.resolve(value);
            $.when(_this.waitForQueue(table, index)).done(function (fetched) {
                if (fetched)
                    return defer.resolve(_table.collection[Number(index)]);
                _this.signToQueue(table, index);
                $.when(_table.fetch(Number(index))).done(function (entity) {
                    defer.resolve(
                        _this.save(table, index, entity)
                    );
                });
            });
            return defer;
        },
        signToQueue: function (table, index) {
            Entities.LocalQueue[table] = Entities.LocalQueue[table] || [ ];
            return Entities.LocalQueue[table][index] = true;
        },
        removeFromQueue: function (table, index) {
            Entities.LocalQueue[table] && Entities.LocalQueue[table][index]
                ? function removeFromQueue() {
                delete Entities.LocalQueue[table][index];
                Entities.LocalQueue[table] && Entities.LocalQueue[table].length == 0
                    ? delete Entities.LocalQueue[table] : { };
            }() : { };
        },
        waitForQueue: function (table, index) {
            var defer = $.Deferred(),
                round = 1,
                wait = function (timeout) {
                    if (round > 24) return defer.resolve(false);
                    timeout = timeout || 0;
                    setTimeout(function () {
                        Entities.LocalQueue[table][index] ? wait() : defer.resolve(true);
                    }, timeout + round);
                };
            Entities.LocalQueue[table] ?
                (Entities.LocalQueue[table][index] ?
                    wait() :
                    defer.resolve(false)) :
                defer.resolve(false);
            return defer;
        },
        save: function (table, index, value) {
            var _table = Entities.LocalDB[table];
            this.removeFromQueue(table, index);
            if (!_table)
                this.newTable(table);
            return _table.collection[Number(index)] = value;
        },
        remove: function (table, index) {
            var _table = Entities.LocalDB[table];
            if (!_table)
                this.newTable(table);
            delete _table.collection[index];
            if (_table.collection[index])
                return false;
            else
                return true;
        },
        exist: function (table, index) {
            var _table = Entities.LocalDB[table];
            if (index && _table.collection[Number(index)])
                return true;
            else if (_table)
                return true;
            return false;
        },
        _meta: {
            save: function (module, key, value) {
                if (!Entities.LocalDB['_meta'][module])
                    Entities.LocalDB['_meta'][module] = { };
                return Entities.LocalDB['_meta'][module][key] = value;
            },
            get: function (module, key) {
                var defer = $.Deferred();
                if (!Entities.LocalDB['_meta'][module] || !Entities.LocalDB['_meta'][module][key])
                    return defer.resolve(null);
                defer.resolve(Entities.LocalDB['_meta'][module][key]);
                return defer;
            }
        }
    });

    var LocalAPI = new Entities.LocalAPI();

    Lampa.reqres.setHandler('local:constructTable', function (table, fetch) {
        table = table || 'default';
        typeof fetch != 'function' ? fetch = function () { } : { };
        return LocalAPI.constructTable(table, fetch);
    });

    Lampa.reqres.setHandler('local:fetch', function (table, index) {
        table = table || 'default';
        table == '_meta' ? table = 'default' : { };
        index = index || 0;
        return LocalAPI.fetch(table, index);
    });

    Lampa.reqres.setHandler('local:remove', function (table, index) {
        table = table || 'default';
        index = index || 0;
        return LocalAPI.remove(table, index);
    });

    Lampa.reqres.setHandler('local:save', function (table, index, value) {
        table = table || 'default';
        index = index || 0;
        value = value || false;
        return LocalAPI.save(table, index, value);
    });

    Lampa.reqres.setHandler('local:exist', function (table, index) {
        table = table || 'default';
        index = index || false;
        return LocalAPI.exist(table, index);
    });

    Lampa.reqres.setHandler('local:newTable', function (table) {
        table = table || 'default';
        return LocalAPI.newTable(table);
    });

    Lampa.reqres.setHandler('_meta:save', function (module, key, value) {
        module = String(module || 'default');
        key = String(key || '0');
        return LocalAPI._meta.save(module, key, value);
    });

    Lampa.reqres.setHandler('_meta:get', function (module, key) {
        module = String(module || 'default');
        key = String(key || '0');
        return LocalAPI._meta.get(module, key);
    });

});










