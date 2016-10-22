/**
 * Created by Roman on 23.5.14.
 */

Lampa.module("LessonsModule.Grid", function (Grid, Lampa, Backbone, Marionette, $, _) {
    Grid.Controller = {
        main: function (params) {
            var skeleton = new Lampa.SkeletonView();
            skeleton.className = "container-fluid";
            skeleton.render();

            var layout = new Grid.Layout();
            layout.params = params;
            params[0] = params[0] || "teacher=myself";

            $.when(Lampa.request("lesson:load", params), Lampa.request("school:entity")).done(function (entities, school) {
                var i = 0, d, firstPeriodDay, lastPeriodDay;
                if (entities === null) return;
                firstPeriodDay = Lampa.request("school:firstDay");
                lastPeriodDay = Lampa.request("school:lastDay");
                layout.days = Lampa.request("helper:getDaysInterval", firstPeriodDay, lastPeriodDay);

                for (i; i < layout.days.length; i++) {
                    d = Lampa.request("helper:dayIdentityCode", layout.days[i]);

                    if (layout[d + "Region"] === undefined) {
                        layout.addRegion(d + "Region", "#" + d);
                    }
                }

                layout.on("show", function () {
                    try {
                        Lampa.trigger("progressBar:show");
                        $.when(Lampa.request("hour:entities")).done(function (hours) {
                            var days, j = 0, d, lessons, dayRegion, lessonsView;

                            if (hours.length > 0) {
                                skeleton.line.show(new Grid.Hours({collection: hours}));
                            }

                            if (layout.days !== undefined) {
                                days = Lampa.request("day:entities", layout.days);
                                layout.daysRegion.show(new Grid.Days({collection: days}));
                                if (entities.length > 0) {

                                    for (j; j < layout.days.length; j++) {
                                        d = Lampa.request("helper:dayIdentityCode", layout.days[j]);
                                        lessons = entities.filter(
                                            function (a) {
                                                return a.get("d") === d;
                                            }
                                        );

                                        dayRegion = d + "Region";
                                        if (layout[dayRegion] !== undefined) {
                                            lessonsView = new Grid.Lessons({collection: new Backbone.Collection(lessons)});
                                            layout[dayRegion].show(lessonsView);
                                        }
                                    }
                                }
                            }

                            if (document.getElementsByClassName("now")[1] !== undefined) {
                                document.getElementsByClassName("now")[1].scrollIntoView();
                            }
                            else {
                                if (document.getElementsByClassName("future")[1] !== undefined) {
                                    document.getElementsByClassName("future")[1].scrollIntoView();
                                } else {
                                    if (document.getElementsByClassName("history").length > 0) {
                                        document.getElementsByClassName("history")[document.getElementsByClassName("history").length - 1].scrollIntoView();
                                    }
                                }
                            }
                            Lampa.trigger("progressBar:hide");
                            layout.triggerMethod("ShowAllIcons");
                        });
                    } catch (ex) {
                        console.log(ex.message);
                    }
                });
                skeleton.page.show(layout);
            });
        }
    };
});

