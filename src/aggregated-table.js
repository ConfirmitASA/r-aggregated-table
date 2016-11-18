/**
 * Created by IvanP on 27.09.2016.
 */

import TableData from './table-data';
import ReportalBase from "r-reporal-base";
import TableColumns from "r-table-columns";
import SortTable from "r-sort-table/src/sort-table";
import TableFloatingHeader from "r-table-floating-header/src/table-floating-header";

let styles = require('r-sort-table/src/sort-table-styles.css');
let aggregatedTableCSS = require('./aggregated-table.css');

/**
 * A base class for aggregated tables. Multidimensional property of data is automatically calculated, thus removed from params.
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
   * @param {SortTable} options.sorting - sorting options, see {@link SortTable}. If you want to leave all options default but enable sorting, pass an empty object(`.., sorting:{}`), or sorting won't be applied.
   * @param {SortTable} options.floatingHeader - floating header, see {@link SortTable}. If you want to leave all options default but enable sorting, pass an empty object(`.., sorting:{}`), or sorting won't be applied.
   * */
  constructor(options){
    let {
      source,
      rowheaderColumnIndex,defaultHeaderRow,dataStripDirection,excludeBlock,excludeColumns,excludeRows,
      sorting,
      floatingHeader
    } = options;
    super();

    /**
     *  The source table
     *  @type {HTMLTableElement}
     *  @memberOf AggregatedTable
     *  */
    this.source = source;
    let refSource;
    if(floatingHeader && typeof floatingHeader=='object'){
      this.floatingHeader = new TableFloatingHeader(source);
      /**
       *  The floating header
       *  @type {HTMLTableElement}
       *  @memberOf AggregatedTable
       *  */
      this.refSource = refSource = this.floatingHeader.header;
    }

    /**
     *  Whether data is monodimensional or multidimensional
     *  @type {Boolean}
     *  @memberOf AggregatedTable
     *  */

    this.multidimensional = this.constructor.detectMultidimensional(source);

    /**
     *  data Array
     *  @type {Array.<{cell:HTMLTableCellElement, data:?String|?Number, columnIndex:Number}>}
     *  @memberOf AggregatedTable
     *  */
    this.data = this.constructor.getData({source,refSource,defaultHeaderRow,excludeBlock,excludeColumns,excludeRows,direction:dataStripDirection,multidimensional: this.multidimensional});


    if(sorting && typeof sorting == 'object'){
      let reorderFunction = e=>{
        return this.constructor.reorderRows(this.data,this.source,this.multidimensional)
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
      sorting.multidimensional = this.multidimensional;

      /**
       *  sorting object. See {@link SortTable}
       *  @type {SortTable}
       *  @memberOf AggregatedTable
       *  */
      this.sorting = new SortTable(sorting);

      // add listener to do reordering on sorting
    }

    /**
     * table columns array
     * @type {Array.<{index:Number, title:String, colSpan:Number, cell: HTMLTableCellElement, ?refCell:HTMLTableCellElement}>}
     * @memberOf AggregatedTable
     * */
    this.columns = this.sorting && this.sorting.columns? this.sorting.columns : new TableColumns({source,refSource,defaultHeaderRow});
  }


  /**
   * Extracts data from a given cell. Override in an inherited class if you need to add any metadata to it.
   * @param {HTMLTableCellElement} cell - cell element to have data stripped off it
   * @param {HTMLTableCellElement} rowIndex - index of the row it's in
   * @param {HTMLTableCellElement} columnIndex - index of the column it's in
   * @returns {{cell:HTMLTableCellElement, ?data:String|Number, columnIndex:Number}} Returns an object `{cell:HTMLTableCellElement, data:?String|?Number, columnIndex:Number}` (if data is absent in the cell or its text content boils down to an empty string - i.e. there are no characters in the cell, only HTML tags) it returns null in `data`
   * @override
   * */
  static prepareDataCell(cell, rowIndex, columnIndex){
    return {
      cell,
      data: ReportalBase.isNumber(cell.textContent.trim()),
      columnIndex,
      rowIndex
    }
  }

  /**
   * This function takes care of repositioning rows in the table to match the `data` array in the way it was sorted and if the data is separated into blocks, then move the block piece to the first row in each data block.
   * @param {Array} data - full sorted dataset. Instance of {@link TableData#getData}
   * @param {HTMLTableElement} source - source table
   * @param {Boolean} multidimensional
   * */
  static reorderRows(data,source,multidimensional){
    let fragment = document.createDocumentFragment();
    AggregatedTable.dimensionalDataIterator(data,multidimensional,(dataDimension)=>{
      if(multidimensional){AggregatedTable.repositionBlockCell(dataDimension)} // if multidimensional reposition aggregating block cell to the topmost row in sorted array
      dataDimension.forEach(item=>{fragment.appendChild(item[0].cell.parentNode)}); // add row to fragment in the array order, this doesn't account for column stripped data yet
    });
    source.querySelector('tbody').appendChild(fragment);
  }

  /*
   * Repositions the rowspanning block cell from the initial row to the new sorted row
   * @param {Array} items - dimension of data
   * */
  static repositionBlockCell(items){
    let blockRowItem = items.filter(item=>item[0].cell.parentNode.classList.contains('firstInBlock'))[0];
    let blockRow = blockRowItem[0].cell.parentNode;
    if(items.indexOf(blockRowItem)!=0){// if block row isn't first in dimension
      let newFirstRow = items[0][0].cell.parentNode;
      newFirstRow.insertBefore(blockRow.querySelector('.blockCell'),newFirstRow.firstElementChild);// move block cell
      newFirstRow.classList.add('firstInBlock');
      blockRow.classList.remove('firstInBlock');
    }
  }

  /**
   * allows to perform action on data based on its multidimensionality
   * @param {Array} data - full dataset. Instance of {@link TableData#getData}
   * @param {Boolean} multidimensional
   * @param {!Function} callback - a function to be executed on a dimension of data. Callback is called with two attributes: `dimension` - the current iteration of data and `index` (optional) if it's multidimensional
   * */
  static dimensionalDataIterator(data,multidimensional,callback){
    if(!callback || typeof callback != 'function'){throw new TypeError('`callback` must be passed and be a function')}
    if(!multidimensional){
      return callback(data)
    } else { // if array has nested array blocks
      data.forEach((dimension,index)=>{
        callback(dimension,index);
      });
    }
  }


}

export default AggregatedTable
