# vue-bootstrap-table

This project was originally a fork of [jbaysolutions/vue-bootstrap-table](https://github.com/jbaysolutions/vue-bootstrap-table). 
The main reason for this fork is to increase control of the table components and to reduce the project size. 

Please see [Changelog](/CHANGELOG.md) for detailed changes.

## Features

* Sortable
* Multicolumn Sorting
* Searchable
* Select display columns
* Pagination
* On Table Editing

## Requirements

* Vue 2.6.0+ (tested with 2.6.10)
* Bootstrap 4 css (for Bootstrap 3 css use 1.1.x)
* Fontawesome 5


## Installation

#### [npm](https://www.npmjs.org/package/vue2-bootstrap-table2)

    # install with npm    
	npm install vue2-bootstrap-table2 --save
    
    # install with yarn    
    yarn add vue2-bootstrap-table2


Import the library

```javascript
    import VueBootstrapTable from "vue2-bootstrap-table2";
```

Add to other Vue components 

 ```javascript
    export default {
        components: {
            VueBootstrapTable: VueBootstrapTable,
        },
    // ... data, methods, mounted (), etc.
    }
    
``` 

#### browser

Include the browser-ready bundle (download from [releases](https://github.com/jbaysolutions/vue2-bootstrap-table/releases)) in your page. The components will be automatically available.

```html
    <script src="vue2-bootstrap-table2.umd.min.js"></script>
```


## Usage

```javascript

    new Vue({
        el: '#app',
        components: {
            VueBootstrapTable: VueBootstrapTable
        },
        data: {
            columns: [
                {
                    title:"id",
                },
                {
                    title:"name",
                    visible: true,
                    editable: true,
                    filterable: false
                },
                {
                    title:"age",
                    visible: true,
                    editable: true,
                },
                {
                    title:"country",
                    visible: true,
                    editable: true,
                    sortable: false
                }
            ],
            values: [
                {
                    "id": 1,
                    "name": "John",
                    "country": "UK",
                    "age": 25,
                },
                {
                    "id": 2,
                    "name": "Mary",
                    "country": "France",
                    "age": 30,
                },
                {
                    "id": 3,
                    "name": "Ana",
                    "country": "Portugal",
                    "age": 20,
                }
            ]
        },
    });
```` 


````html

    <vue-bootstrap-table
            :columns="columns"
            :values="values"
            :show-filter="true"
            :show-column-picker="true"
            :sortable="true"
            :paginated="true"
            :multi-column-sortable=true
            :filter-case-sensitive=false

    >
        <template v-slot:name="slotProps">
            {{slotProps.value.name}}
        </template>
        <template v-slot:description="slotProps">
            {{slotProps.value.description}}
        </template>
    </vue-bootstrap-table>
```` 

## Configuration Props

```javascript

    props: {
        /**
         * The column titles, required
         */
        columns: {
            type: Array,
            required: true,
        },
        /**
         * The rows, an Array of objects
         */
        values: {
            type: Array,
            required: true,
        },
        /**
         * Enable/disable table row selection, optional, default false.
         * When true, it will add a checkbox column on the left side and use the value.selected field
         */
        selectable: {
            type: Boolean,
            required: false,
            default: true,
        },
        /**
         * Enable/disable table sorting, optional, default true
         */
        sortable: {
            type: Boolean,
            required: false,
            default: true,
        },
        /**
         * Enable/disable table multicolumn sorting, optional, default false.
         * Also sortable must be enabled for this function to work.
         */
        multiColumnSortable: {
            type: Boolean,
            required: false,
            default: false,
        },
        /**
         * Enable/disable input filter, optional, default false
         */
        showFilter: {
            type: Boolean,
            required: false,
            default: false,
        },
        /**
         * Define if Filter search field is to work in a case Sensitive way. Default: true
         */
        filterCaseSensitive: {
            type: Boolean,
            required: false,
            default: true,
        },
        /**
         * Enable/disable column picker to show/hide table columns, optional, default false
         */
        showColumnPicker: {
            type: Boolean,
            required: false,
            default: false,
        },
        /**
         * Enable/disable pagination for the table, optional, default false
         */
        paginated: {
            type: Boolean,
            required: false,
            default: false,
        },
        /**
         * If pagination is enabled defining the page size, optional, default 10
         */
        pageSize: {
            type: Number,
            required: false,
            default: 10,
        },
        /**
         * Setting default order column. Expected name of the column
         */
        defaultOrderColumn: {
            type: String,
            required: false,
            default: null,
        },
        /**
         * Setting default order direction. Boolean: true = ASC , false = DESC
         */
        defaultOrderDirection: {
            type: Boolean,
            required: false,
            default: true,
        }
    },

```

### Column Array Definition

The `columns` array takes object of type:

```javascript
{
    title: String,              // Mandatory: Title to be presented on the Table
    name: String,               // Optional: The name of the "data" property. If nothing, title is used.
    visible: Boolean,              // Optional: column visible? (Default: true)
    editable: Boolean,            // Optional: column cells editable? (Default: false)
    columnstyle: String         // Optional: styles to be applied to the Column Header
    cellstyle: String           // Optional: styles to be applied to the Cells of this column
    renderfunction: Function    // Optional: Function that receives as input the column name and entry, and returns an HTML String for drawing cell
    sortable: Boolean           // Optional, by default it is true!  Used to set particular columns as not sortable, in case the table is sortable itself. - From 1.1.12
    filterable: Boolean         // Optional, by default it is true!  Used to exclude columns from the filtering process. - From 1.1.13
}
```

#### Column Definition Examples

Column with Title "Id" , which is visible but not editable:

```javascript
{
    title:"Id",
}
```
Column with Title "Name" , which is visible and editable:

```javascript
{
    title:"Name",
    visible: true,
    editable: true,
}
```

#### Column slots example

````html

    <vue-bootstrap-table
            :columns="columns"
            :values="values"
            :show-filter="true"
            :show-column-picker="true"
            :sortable="true"
            :paginated="true"
            :multi-column-sortable=true
            :filter-case-sensitive=false

    >
        <template v-slot:name="slotProps">
            {{slotProps.value.name}}
        </template>
        <template v-slot:description="slotProps">
            {{slotProps.value.description}}
        </template>
    </vue-bootstrap-table>
```` 

A slot will be created for each column, named with column.name. It has two props available:
 * "column" - the column object
 * "value" - the value object for the corresponding row



#### Render Function Example

For a Column definition like so:

```javascript
columns: [
    {
        title: "Test",
        visible: true,
        renderfunction: renderTestColumn
    }
],
```

There must be a javascript function called `renderTestColumn`  :

```javascript
<script>
    var renderTestColumn = function (colname, entry) {
        return '<div class="btn-group" role="group" >'+
            '  <button type="button" class="btn btn-sm btn-primary"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>'+
            '  <button type="button" class="btn btn-sm btn-danger"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>'+
            '</div><span>'+JSON.stringify(entry)+'</span>';
    };
</script>
```

### DEFAULT Ordering

To setup your default ordering for the table:

````html

    <vue-bootstrap-table
            [...]
            :default-order-column="columnToSortBy"
            :default-order-direction=true
    >
    </vue-bootstrap-table>
````

On your Vue instance :

````javascript
data: {
        columnToSortBy: "name",
}
````

This will make the default column order be :  
 * column: name  
 * order: ascending

## Contribute

If you have a feature request, please add it as an issue or make a pull request.


## TODO List

- [x] Basic table
- [x] Sorting
- [x] Multicolumn Sorting
- [x] Filter
- [x] Column picker
- [x] Pagination
- [x] Editing
- [ ] Responsive
- [ ] Dates sorting
- [ ] Keyboard navigation


