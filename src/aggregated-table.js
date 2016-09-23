/**
 * Created by IvanP on 21.09.2016.
 */
import ReportalBase from "r-reporal-base";
import AggregatedTableRowMeta from "./AggregatedTableRowMeta";

/**
 * A base class for Aggregated tables. Provides data stripping functionality
 * */
class AggregatedTable {

  /**
   * Detects if the dataset is multi-dimentional and sets classes on items: a rowspanning cell gets a `.blockCell` and the row containing it a `.firstInBlock`
   * __Doesn't work with `Horizontal Percents` enabled!__
   * @param {HTMLTableElement} source - source table
   * @param {Number} [columnIndex=0] - 0-based index of the column that we need to check against to see if it's a multidimentional table
   * @return {Boolean} Returns if the data in table is multi-dimentional
   * */
  static detectMultidimentional(source,columnIndex=0){
    let multidimentional = false;
    let blocks = source.parentNode.querySelectorAll(`table#${source.id}>tbody>tr>td:nth-child(${columnIndex+1})[rowspan]`);
    if(blocks.length>0){
      multidimentional = true;
      [].slice.call(blocks).forEach(blockCell=>{
        blockCell.classList.add('blockCell');
        blockCell.parentNode.classList.add('firstInBlock');
      });
    }
    return multidimentional
  }

  /**
   * Extracts data from a given cell. Override in an inherited class if you need to add any metadata to it.
   * @param {HTMLTableCellElement} cell - cell element to have data stripped off it
   * @param {HTMLTableCellElement} rowIndex - index of the row it's in
   * @param {HTMLTableCellElement} columnIndex - index of the column it's in
   * @returns {?String|?Number} Returns a `String`, a `Number` or a `null` (if data is absent in the cell or its text content boils down to an empty string - i.e. there are no characters in the cell, only HTML tags)
   * */
  static prepareDataCell(cell, rowIndex, columnIndex){
    return ReportalBase.isNumber(cell.textContent.trim());
  }

  /**
   * A universsal data-axtraction function. It strips data from a table's body. Data can be stripped by rows (horizontally) or by columns (vertically) which is controlled by `direction`. It accounts for a spanning block cell and may exclude it.
   * @param {Object} options - options to configure the way data is stripped off the table
   * @param {HTMLTableElement} options.source - source table that will be an input for data stripping
   * @param {String} options.direction='row' - direction in which data stripping will occur: `row` strips across rows and presents an array where each array item is an array of cell values. `column` strips values verticaly in a column, the resulting array will contain arrays (per column) with values resembling normalized data for cells in the column
   * @param {Boolean} [options.excludeBlock = true] - if table contains block cells that rowspan across several rows, we might need to exclude those from actual data
   * @param {Array|Number} [options.excludeColumns] - if table contains cells that are not to be in data, then pass a single index or an array of cell indices (0-based)
   * @param {Array|Number} [options.excludeRows] - if table contains rows that are not to be in data, then pass a single index or an array of row indices (0-based)
   * @param {Array|Number} options.multidimentional=false - whether the table has aggregating cells that aggregate rowheaders. Result of {@link AggregatedTable#detectMultidimentional} may be passed here to automatically calculate if it has aggregating cells.
   * @returns {Array} returns data array.
   * */
  static getData(options){
    let {source,excludeBlock=true,excludeColumns,excludeRows,direction='row',multidimentional=false,meta}=options;
    let data = [];
    if(source && source.tagName == 'TABLE'){
      let rows = [].slice.call(source.parentNode.querySelectorAll(`table#${source.id}>tbody>tr`));
      if(rows.length>0){
        var tempArray=[];
        rows.forEach((row,rowIndex)=>{
          if(multidimentional){
            // we need to check if the `tempArray` is not empty and push it to the `data` array, because we've encountered a new block, so the old block has to be pushed to data. Then we need to create a new block array and push there
            if(row.classList.contains('firstInBlock')){
              if(Array.isArray(tempArray) && tempArray.length>0){data.push(tempArray);}
              tempArray = [];
            }
          }
          if (direction=='row' && !Array.isArray(tempArray[tempArray.length])) { // if a row in an array doesn't exist create it
            tempArray[tempArray.length] = [];
          }
          if(!(excludeRows && ((typeof excludeRows == 'number' && rowIndex == excludeRows) || (Array.isArray(excludeRows) && excludeRows.indexOf(rowIndex)!=-1)))) {
            [].slice.call(row.children).forEach((cell, index) => {
              if (!(excludeColumns && ((typeof excludeColumns == 'number' && cell.cellIndex == excludeColumns) || (Array.isArray(excludeColumns) && excludeColumns.indexOf(cell.cellIndex) != -1)))) {
                if (typeof direction == 'string' && direction == 'row') { //if we strip data horizontally by row
                  if(!(multidimentional && excludeBlock && cell.rowSpan>1)){ // if it's a block cell we'd exclude it from data
                    tempArray[tempArray.length-1].push(AggregatedTable.prepareDataCell(cell,rowIndex,index));
                  }
                } else if (typeof direction == 'string' && direction == 'column') { //if we strip data vertically by column
                  let realIndex = index;
                  if(!(multidimentional && excludeBlock && cell.rowSpan>1)){ //exclude block cell
                    realIndex += !row.classList.contains('firstInBlock')? 0 : -1; // offset cell that follows block cell one position back
                    if (!Array.isArray(tempArray[realIndex])) { //create column array for current column if not available
                      tempArray[realIndex] = [];
                    }
                    tempArray[realIndex].push(AggregatedTable.prepareDataCell(cell,rowIndex,realIndex));
                  }
                } else {
                  throw new TypeError('direction has tobe a String==`row | column`, not a ${direction}')
                }
              }
            });
          }
        });
        //we need to push the last block Array because there'll be no `.firstInBlock` anymore to do that
        if(multidimentional && Array.isArray(tempArray) && tempArray.length>0){
          data.push(tempArray)
        } else {
          data = tempArray;
        }
      } else {
        throw new Error(`table#${source.id}'s body must contain rows`);
      }
    } else {
      throw new TypeError('source must be defined and be a table');
    }
    return data;
  }

}

export default AggregatedTable
