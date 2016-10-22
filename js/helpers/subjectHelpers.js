/**
 * Created by Roman on 21.8.14.
 */
function getSubject(courseID) {
    try {
        var courses = LAMPA.request("course:entities");
        return (courses.loaded === true) ? courses.get('abbr') : '';
    }
    catch (ex) {
        return '';
    }
}