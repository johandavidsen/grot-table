# Changelog

## [1.5.1] - June 19, 2019

### Fixed

* Fixed onModelChange => The function was not providing the updated model.
* Fixed multiedit on row.

## [1.5] - June 18, 2019

### Changed

* Restructured the component to be named grot-table instead of vue2-bootstrap-table.
* Published package to NPMJS.

## [1.4] - June 17, 2019

### Changed

* Removed all AJAX code as this should be a different abstraction layer.
* Removed the Row click handler and instead implemented a model change system.
* Update the Readme to reflect the code changes.

## [1.3] - May 28, 2019

### Changed

* Split the default view into the following ui components: CheckBox, ColumnPicker, Pagination, SearchInput, TableHeader
  and TableRow.
* **BREAKING CHANGES**: Moved all the AJAX related code into the file: Ajax. Effectively disabling the AJAX feature.
* Refactored the function buildColumnObject into the JS class *Column*.
* Updated the Readme such that it corresponds to the refactored code.

## [Pre-fork Changelog]

### 1.2.1 (May 22, 2019)

* changed project structure and build using Vue CLI
* bugfix when multiple tables were on the same page

### 1.2.0 (May 21, 2019)

* Support for column slots
* Selectable rows
* Update to Bootstrap v4.3.1
* Update to Vue v2.6.10


### 1.1.13 (August 24, 2018)

* #19 - Disable filter for specific columns

### 1.1.12

* Enhancement - exposed methods.

### 1.1.11  - dev build

* Enhancement - #11 - Dynamic Page Size
* Enhancement - Started creating public methods to simplify stuff.

### 1.1.10.1 (July 19, 2018)

* Bug fix - axios problem with passing axios config object

### 1.1.10 (July 19, 2018)

* Bug fix - Delegate true and false behaviours leading to not loading data
* Bug fix - Ajax redundant fetch when not needed
* Enhancement - #14 - Adding support for default ordering
* Enhancement - Documentation of code

### 1.1.9 (July 19, 2018)

* Bug fix - Support for IE11 (maybe fixed for IE10 aswell)

### 1.1.8 (August 11, 2017)

* Bug fix - Issue 5 - Axios config not being loaded with GET method and Delegate false.

### 1.1.7 (August 10, 2017)

* Allowing Axios configuration to be passed for the requests

### 1.1.6 (June 29, 2017)

* Search case sensitivity configurable

### 1.1.5 (June 21, 2017)

* Row Click Handler added

### 1.1.4 (June 12, 2017)

* Fix- delegate now doesn't use echo

## 1.1.3  (June 5, 2017)

* Define a Render Function support by column
* Define Column Styles by column
* Define Cell Styles by column

## 1.1.2 (June 2, 2017)

* Fix to Sorting
* Added Multicolumn Sorting
* Fix dynamic adding rows with update to interface
* Ajax with multicolumn sorting

## 1.1.1 (June 1, 2017)

* Added more Events

## 1.1.0 (May 31, 2017)

* Migration of vue-bootstrap-table2 to Vue2
