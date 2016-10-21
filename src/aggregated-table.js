/**
 * Created by IvanP on 27.09.2016.
 */

import TableData from './table-data';
import ReportalBase from "r-reporal-base";
import TableColumns from "r-table-columns";
import SortTable from "r-sort-table/src/sort-table";

var styles = require('r-sort-table/src/sort-table-styles.css');

/**
 * A base class for aggregated tables
 * @extends TableData
 * */
class AggregatedTable extends TableData {
  /*
   * @param {Object} options - options to configure the way data is stripped off the table
   * @param {HTMLTableElement} options.source - source table that will be an input for data stripping
   * @param {HTMLTableElement} [options.refSource] - a reference to a floating header, if any
   * @param {Number} [options.rowheaderColumnIndex=0] - 0-based index of the column that we need to check against to see if it's a multidimentional table
   * @param {Number|Object=} [options.defaultHeaderRow=-1] - index of the row in `thead` (incremented from 0) that will have sorting enabled for columns. If `-1` then last row.
   * @param {String=} options.dataStripDirection='row' - direction in which data stripping will occur: `row` strips across rows and presents an array where each array item is an array of cell values. `column` strips values verticaly in a column, the resulting array will contain arrays (per column) with values resembling normalized data for cells in the column
   * @param {Boolean=} [options.excludeBlock=true] - if table contains block cells that rowspan across several rows, we might need to exclude those from actual data
   * @param {Array|Number} [options.excludeColumns] - if table contains columns that are not to be in data, then pass a single index or an array of cell indices (0-based). You need to count columns not by headers but by the cells in rows.
   * @param {Array|Number} [options.excludeRows] - if table contains rows that are not to be in data, then pass a single index or an array of row indices (0-based). You need to count only rows that contain data, not the table-header rows.
   * @param {Boolean=} options.multidimensional=false - whether the table has aggregating cells that aggregate rowheaders. Result of {@link TableData#detectMultidimentional} may be passed here to automatically calculate if it has aggregating cells.
   * @param {SortTable} options.sorting - sorting options, see {@link SortTable}. If you want to leave all options default but enable sorting, pass an empty object(`.., sorting:{}`), or sorting won't be applied.
   * */
  constructor(options){
    super();
    let {
      source,refSource,
      rowheaderColumnIndex,defaultHeaderRow,dataStripDirection,excludeBlock,excludeColumns,excludeRows,multidimensional,
      sorting
    } = options;

    this.source = source;
    this.refSource=refSource;

    /** @inheritDoc */
    this.data = this.constructor.getData({source,refSource,defaultHeaderRow,excludeBlock,excludeColumns,excludeRows,direction:dataStripDirection,multidimensional});

    multidimensional = typeof multidimensional == undefined? this.constructor.detectMultidimensional(source,rowheaderColumnIndex):multidimensional;

    if(sorting && typeof sorting == 'object'){
      let reorderFunction = e=>{
        return this.constructor.reorderRows(this.data,this.source,multidimensional)
      };
      [source,refSource].forEach(target=>{
        if(target){
          target.addEventListener('reportal-table-sort', reorderFunction)
        }
      });

      sorting.source = source;
      sorting.refSource = refSource;
      sorting.defaultHeaderRow = defaultHeaderRow;
      sorting.data=this.data;
      sorting.multidimensional = multidimensional;
      this.sorting = new SortTable(sorting);

      // add listener to do reordering on sorting
    }

    /**
     * @type {{index:Number, title:String, colSpan:Number, cell: HTMLTableCellElement, ?refCell:HTMLTableCellElement}} columns - an array of columns
     * */
    this.columns = this.sorting && this.sorting.columns? this.sorting.columns : new TableColumns({source,refSource,defaultHeaderRow});
  }

  /**
   * Extracts data from a given cell. Override in an inherited class if you need to add any metadata to it.
   * @param {HTMLTableCellElement} cell - cell element to have data stripped off it
   * @param {HTMLTableCellElement} rowIndex - index of the row it's in
   * @param {HTMLTableCellElement} columnIndex - index of the column it's in
   * @returns {{cell:HTMLTableCellElement, data:?String|?Number, columnIndex:Number}} Returns an object `{cell:HTMLTableCellElement, data:?String|?Number, columnIndex:Number}` (if data is absent in the cell or its text content boils down to an empty string - i.e. there are no characters in the cell, only HTML tags) it returns null in `data`
   * @override
   * */
  static prepareDataCell(cell, rowIndex, columnIndex){
    return {
      cell,
      data: ReportalBase.isNumber(cell.textContent.trim()),
      columnIndex
    }
  }

  /**
   * This function takes care of repositioning rows in the table to match the `data` array in the way it was sorted and if the data is separated into blocks, then move the block piece to the first row in each data block.
   * */
  static reorderRows(data,source,multidimensional){
    let fragment = document.createDocumentFragment();
    AggregatedTable.dimensionalDataIterator(data,multidimensional,dataitem=>{
      dataitem.forEach(item=>{fragment.appendChild(item[0].cell.parentNode)}); // this doesn't account for column stripped data
    });
    source.querySelector('tbody').appendChild(fragment);
  }

  static dimensionalDataIterator(data,multidimensional,callback){
    if(!multidimensional){
      return callback(data)
    } else { // if array has nested array blocks
      data.forEach(dimension=>{
        callback(dimension);
      });
    }
  }


}

export default AggregatedTable
