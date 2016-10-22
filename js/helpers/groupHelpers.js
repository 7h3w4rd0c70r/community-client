/**
 * Created by Roman on 11.8.14.
 */

function getGroupListItem(groupID) {
    $.when(Lampa.request("group:cached", groupID)).done(
        function (group) {
            return group.get('name')
        }
    );
}


