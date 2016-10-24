/**
 * Created by IvanP on 21.09.2016.
 */
import AggregatedTable from '../aggregated-table'

describe('AggregatedTable', () => {
  beforeEach(() => {
    jasmine.getFixtures().fixturesPath = 'base/src/__tests__/fixtures';
    loadFixtures('table-nested-headers.html','table-crazy-nested-headers.html','table-nested-rowheaders.html');
  });

  describe('dimensionalDataIterator',()=>{
    let spy, dataset=[['glory'],['honor']], rresult;

    beforeEach(()=>{
      spy={
        callback:value=>{rresult = value}
      };
      spyOn(spy,'callback').and.callThrough();
    });

    it('returns whole dataset for monodimensional data',()=>{
      AggregatedTable.dimensionalDataIterator(dataset, false, spy.callback);
      expect(spy.callback).toHaveBeenCalledTimes(1);
      expect(rresult).toEqual(dataset);
    });
    it('returns calls dataset for each dimension in multidimensional data',()=>{
      AggregatedTable.dimensionalDataIterator(dataset, true, spy.callback);
      expect(spy.callback).toHaveBeenCalledTimes(dataset.length);
      expect(rresult).toEqual(['honor']);
    });
  });

  describe('reorderRows',()=>{
    let TNH;

    beforeEach(()=>{
      TNH = document.querySelector('#table-nested-headers');
    });

    it('reorders rows',()=>{
      let firstRow = TNH.querySelector('tbody>tr:first-child');
      let a1 = new AggregatedTable({
        source: TNH,
        dataStripDirection:'row',
        //refSource,
        //rowheaderColumnIndex,
        //defaultHeaderRow,
        //excludeBlock,
        //excludeColumns,
        //excludeRows,
        sorting:{defaultSorting:[{column:0,direction:'asc'}]}
      });
      expect(TNH.querySelector('tbody:first-child>tr:first-child')).not.toEqual(firstRow);
      TNH.removeChild(TNH.querySelector('thead')); // to be sure header doesn't influence rowIndex
      let line = a1.data.indexOf(a1.data.filter(row=>row[0].cell.parentNode==firstRow)[0]);
      expect(firstRow.rowIndex).toEqual(line);
    });
  });
  describe('repositionBlockCell',()=>{
    let TNRH;

    beforeEach(()=>{
      TNRH = document.querySelector('#table-nested-rowheaders');
    });

    it('reorders rows',()=>{
      let firstRow = TNRH.querySelector('tbody>tr:first-child');
      let a1 = new AggregatedTable({
        source: TNRH,
        dataStripDirection:'row',
        sorting:{defaultSorting:[{column:2,direction:'desc'}]}
      });
      expect(TNRH.querySelector('tbody>tr:first-child').children.length).toBeGreaterThan(TNRH.querySelector('tbody>tr:nth-child(2)').children.length);
      expect(TNRH.querySelector('tbody>tr:first-child')).toBeMatchedBy('.firstInBlock');
    });
  });

});
