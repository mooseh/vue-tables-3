module.exports = function(column, start, end) {

    var dateFormat = this.dateFormat(column);
    var el = typeof column==='string'? $(this.refs.filters[column]):column;

    el.text(start.format(dateFormat) + " - " + end.format(dateFormat));
}
