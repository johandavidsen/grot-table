export default class Column {
  constructor({ title, name, visible, editable, renderfunction, columnstyle, cellstyle, sortable, filterable }) {
    this.title = title
    this.name = name ? name : title
    this.visible = visible ? visible : true
    this.editable = editable ? editable : false
    this.renderfunction = renderfunction ? renderfunction : false
    this.columnstyle = columnstyle ? columnstyle : ""
    this.cellstyle = cellstyle ? cellstyle : ""
    this.sortable = sortable ? sortable : true
    this.filterable = filterable ? filterable : true
  }
}