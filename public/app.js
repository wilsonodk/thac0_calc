(function ($, data, debugMode) {

    var api,
        instance,
        templates = {};

    // Register all templates
    $('script[type="text/template"]').each(function(idx, val) {

        var name = val.id.slice(0, -4);

        templates[name] = $(val).html();
    });

    // Common functions

    function debug() {
        if (debugMode) {
            arguments[0] = 'debug: ' + arguments[0];
            console.log.apply(console, arguments);
        }
    }

    // Event handlers

    function getThac0Event(app, player) {

        return function changeHandler(evt) {

            app.trigger('load:change', $(evt.target).parent().parent(), player);

        }
    }

    // API

     // Api function to add modules to the App
    api = $.observable(function(arg) {

        if (!arg) {
            return instance;
        }

        if ($.isFunction(arg)) {
            api.on('ready', arg);
        } else {
            instance = new App(arg);

            instance.on('ready', function() {
                api.trigger('ready', instance);
            });
        }
    });


    // App
    function App(conf) {

        var self  = $.observable(this);

        $.extend(self, conf);

        self.load = function(page, fn) {

            debug('App::load page(%s) function', page, fn);

            self.trigger('before:load', page);

            self.one('load', fn);

        };

        setTimeout(function() {
            self.trigger('ready');
            self.trigger('load', conf);
        }, 1);

        // On each "page" load
        self.on('load', function(view) {

            view = view || {};

            var type =  view.type ? 'load:' + view.type : 'load';

            debug('trigger(%s)', type, view);

            self.trigger(type, view);
        });

    }

    /*
     * Modules
     */

    api(function appSetupModule(app) {

        app.on('load', function appLoadHandler(view) {

            var id;

            $.each(view.names, function(key, val) {

                app.root.append($.render(templates.pcTitle, {name: key}));

                for (var i = 1; i <= view.targets; i++) {

                    id = key.replace(/\s+/g, '-') +'-'+ i;

                    app.root.append($.render(templates.target, {
                        num: i,
                        id: id,
                        thac0: val.thac0
                    }));

                    app.trigger('load:select', {name: key, num: i, id: id, player: val});
                }
            });
        });

    });

    api(function selectModule(app) {

        app.load('select');

        app.on('load:select', function selectLoadHandler(view) {

            debug('load:select', view);

            var ele;

            // Create the AC select field
            ele = $('#' + view.id + ' select.ac');
            $.each(data.ac, function (key, val) {
                ele.append($.render(templates.armorOption, {
                    armor: key,
                    ac: val
                }));
            });


            // Create the weapon select field
            ele = $('#' + view.id + ' select.weapon');
            $.each(view.player.weapons, function (idx, val) {
                ele.append($.render(templates.weaponOption, {
                    name: val
                }));
            });

            // Create the armor select field
            ele = $('#' + view.id + ' select.armor');
            $.each(data.armor, function (key, val) {
                ele.append($.render(templates.armorOption, {
                    ac: val,
                    armor: key
                }));
            });

            $('#' + view.id + ' select').on('change', getThac0Event(app, view.player));
            $('#' + view.id + ' input.shield').on('change', getThac0Event(app, view.player));
            $('#' + view.id + ' input.shield').trigger('change');
        });
    });

    api(function changeModule(app) {

        app.load('change');

        app.on('load:change', function changeLoadHandler(parent, player) {

            var thac0   = player.thac0,
                weapon  = parent.find('select.weapon').val(),
                shield  = parent.find('input.shield').is(':checked') ? 1 : 0,
                ac      = Number(parent.find('select.ac').val()) - shield,
                armor   = parent.find('select.armor option:selected').text(),
                tar     = parent.find('span'),
                mod     = Number(data.weapon[weapon][armor]),
                modstr  = (mod >= 0 ? ' + ' : ' ' ),
                roll;

            debug('THAC0(%s) AC(%s %s) Modifier(%s)', thac0, ac, shield, mod);

            roll = thac0 - (ac + mod);

            tar.text(roll + ' = ' + thac0 + ' - (' + ac + modstr + mod + ')');
            //tar.text(roll);

        });
    });

    api({
        type: 'app',
        targets: 3,
        root: $('body'),
        names: {
            'Josiah': {
                'thac0': 16 - 4,
                'weapons': ['Bastard sword', 'Long sword']
            },
            'Bull': {
                'thac0': 18,
                'weapons': ['Flail']
            }
        }
    });


}(jQuery, window.thac0_data, window.location.toString().indexOf('localhost') !== -1));
