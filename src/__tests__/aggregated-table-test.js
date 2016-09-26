/**
 * Created by IvanP on 21.09.2016.
 */
import AggregatedTable from '../aggregated-table'

describe('AggregatedTable', () => {
  beforeEach(() => {
    jasmine.getFixtures().fixturesPath = 'base/src/__tests__/fixtures';
    loadFixtures('table-nested-headers.html','table-crazy-nested-headers.html','table-nested-rowheaders.html');
  });
  it('.getData should get data',()=>{
    let TNH = document.querySelector('#table-nested-headers'),
        TCNH = document.querySelector('#table-crazy-nested-headers'),
        TNRH = document.querySelector('#table-nested-rowheaders');
    let data_TNH_row = AggregatedTable.getData({
      source:TNH
    });
    let data_TNH_row_exclude_number = AggregatedTable.getData({
      source:TNH,
      excludeRows:0
    });
    let data_TNH_row_exclude_array = AggregatedTable.getData({
      source:TNH,
      excludeRows:[0,1]
    });
    let data_TNH_column = AggregatedTable.getData({
      source:TNH,
      direction:'column'
    });
    let data_TNH_column_exclude_number = AggregatedTable.getData({
      source:TNH,
      direction:'column',
      excludeColumns:0
    });
    let data_TNH_column_exclude_array = AggregatedTable.getData({
      source:TNH,
      direction:'column',
      excludeColumns:[0,-1]
    });
    let data_TCNH_row = AggregatedTable.getData({
      source:TCNH
    });
    let data_TCNH_column = AggregatedTable.getData({
      source:TCNH,
      direction:'column'
    });
    let multidimentional = AggregatedTable.detectMultidimentional(TNRH);
    let data_TNRH_row = AggregatedTable.getData({
      source:TNRH,
      multidimentional,
      direction:'column',
    });
    let data_TNRH_column = AggregatedTable.getData({
      source:TNRH,
      multidimentional,
      direction:'row'
    });

    expect(data_TNH_row).toEqual([["GROUP OVERALL",37,4176,46,269,29,347,34,493,33,1830,52,238,38,657,43,143],["Rowheader 1",37,3872,43,251,30,330,36,473,33,1700,51,209,39,592,44,125],["Rowheader 2",32,120,80,5,40,10,50,6,30,60,42,12,5,21,60,5],["Rowheader 3",48,80,67,3,0,1,-20,5,47,55,75,4,80,10,0,2],["Rowheader 4",null,0,null,0,null,0,null,0,null,0,null,0,null,0,null,0],["Rowheader 5",null,0,null,0,null,0,null,0,null,0,null,0,null,0,null,0],["Rowheader 6",36,104,60,10,33,6,-11,9,7,15,54,13,50,34,64,11]]);
    expect(data_TNH_row.length).toEqual(TNH.querySelectorAll('tbody>tr').length);
    expect(data_TNH_row[0].length).toEqual(TNH.querySelectorAll('tbody>tr:first-child>td').length);

    expect(data_TNH_row_exclude_number).toEqual([["Rowheader 1",37,3872,43,251,30,330,36,473,33,1700,51,209,39,592,44,125],["Rowheader 2",32,120,80,5,40,10,50,6,30,60,42,12,5,21,60,5],["Rowheader 3",48,80,67,3,0,1,-20,5,47,55,75,4,80,10,0,2],["Rowheader 4",null,0,null,0,null,0,null,0,null,0,null,0,null,0,null,0],["Rowheader 5",null,0,null,0,null,0,null,0,null,0,null,0,null,0,null,0],["Rowheader 6",36,104,60,10,33,6,-11,9,7,15,54,13,50,34,64,11]]);
    expect(data_TNH_row_exclude_number.length).toEqual(TNH.querySelectorAll('tbody>tr').length-1);
    expect(data_TNH_row_exclude_number[0].length).toEqual(TNH.querySelectorAll('tbody>tr:first-child>td').length);

    expect(data_TNH_row_exclude_array).toEqual([["Rowheader 2",32,120,80,5,40,10,50,6,30,60,42,12,5,21,60,5],["Rowheader 3",48,80,67,3,0,1,-20,5,47,55,75,4,80,10,0,2],["Rowheader 4",null,0,null,0,null,0,null,0,null,0,null,0,null,0,null,0],["Rowheader 5",null,0,null,0,null,0,null,0,null,0,null,0,null,0,null,0],["Rowheader 6",36,104,60,10,33,6,-11,9,7,15,54,13,50,34,64,11]]);
    expect(data_TNH_row_exclude_array.length).toEqual(TNH.querySelectorAll('tbody>tr').length-2);
    expect(data_TNH_row_exclude_array[0].length).toEqual(TNH.querySelectorAll('tbody>tr:first-child>td').length);

    expect(data_TNH_column).toEqual([["GROUP OVERALL","Rowheader 1","Rowheader 2","Rowheader 3","Rowheader 4","Rowheader 5","Rowheader 6"],[37,37,32,48,null,null,36],[4176,3872,120,80,0,0,104],[46,43,80,67,null,null,60],[269,251,5,3,0,0,10],[29,30,40,0,null,null,33],[347,330,10,1,0,0,6],[34,36,50,-20,null,null,-11],[493,473,6,5,0,0,9],[33,33,30,47,null,null,7],[1830,1700,60,55,0,0,15],[52,51,42,75,null,null,54],[238,209,12,4,0,0,13],[38,39,5,80,null,null,50],[657,592,21,10,0,0,34],[43,44,60,0,null,null,64],[143,125,5,2,0,0,11]]);
    expect(data_TNH_column.length).toEqual(TNH.querySelectorAll('tbody>tr:first-child>td').length);
    expect(data_TNH_column[0].length).toEqual(TNH.querySelectorAll('tbody>tr').length);

    expect(data_TNH_column_exclude_number).toEqual([[37,37,32,48,null,null,36],[4176,3872,120,80,0,0,104],[46,43,80,67,null,null,60],[269,251,5,3,0,0,10],[29,30,40,0,null,null,33],[347,330,10,1,0,0,6],[34,36,50,-20,null,null,-11],[493,473,6,5,0,0,9],[33,33,30,47,null,null,7],[1830,1700,60,55,0,0,15],[52,51,42,75,null,null,54],[238,209,12,4,0,0,13],[38,39,5,80,null,null,50],[657,592,21,10,0,0,34],[43,44,60,0,null,null,64],[143,125,5,2,0,0,11]]);
    expect(data_TNH_column_exclude_number.length).toEqual(TNH.querySelectorAll('tbody>tr:first-child>td').length-1);
    expect(data_TNH_column_exclude_number[0].length).toEqual(TNH.querySelectorAll('tbody>tr').length);

    expect(data_TNH_column_exclude_array).toEqual([[37,37,32,48,null,null,36],[4176,3872,120,80,0,0,104],[46,43,80,67,null,null,60],[269,251,5,3,0,0,10],[29,30,40,0,null,null,33],[347,330,10,1,0,0,6],[34,36,50,-20,null,null,-11],[493,473,6,5,0,0,9],[33,33,30,47,null,null,7],[1830,1700,60,55,0,0,15],[52,51,42,75,null,null,54],[238,209,12,4,0,0,13],[38,39,5,80,null,null,50],[657,592,21,10,0,0,34],[43,44,60,0,null,null,64]]);
    expect(data_TNH_column_exclude_array.length).toEqual(TNH.querySelectorAll('tbody>tr:first-child>td').length-2);
    expect(data_TNH_column_exclude_array[0].length).toEqual(TNH.querySelectorAll('tbody>tr').length);


    expect(data_TCNH_row).toEqual([
      ["Yes",76,100,72,100,1408,100,1835,100,13299,100,4248,100,2394,100,1722,100,79,100,53,100,13299,100,0,null,0,null,0,null,0,null],
      ["No",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,null,0,null,0,null,0,null],
      ["Total",76,100,72,100,1408,100,1835,100,13299,100,4248,100,2394,100,1722,100,79,100,53,100,13299,100,0,null,0,null,0,null,0,null]
    ]);
    expect(data_TCNH_row.length).toEqual(TCNH.querySelectorAll('tbody>tr').length);
    expect(data_TCNH_row[0].length).toEqual(TCNH.querySelectorAll('tbody>tr:first-child>td').length);

    expect(data_TCNH_column).toEqual([
      ["Yes","No","Total"],[76,0,76],[100,0,100],[72,0,72],[100,0,100],[1408,0,1408],[100,0,100],[1835,0,1835],[100,0,100],[13299,0,13299],[100,0,100],[4248,0,4248],[100,0,100],[2394,0,2394],[100,0,100],[1722,0,1722],[100,0,100],[79,0,79],[100,0,100],[53,0,53],[100,0,100],[13299,0,13299],[100,0,100],[0,0,0],[null,null,null],[0,0,0],[null,null,null],[0,0,0],[null,null,null],[0,0,0],[null,null,null]
    ]);
    expect(data_TCNH_column.length).toEqual(TCNH.querySelectorAll('tbody>tr:first-child>td').length);
    expect(data_TCNH_column[0].length).toEqual(TCNH.querySelectorAll('tbody>tr').length);

    expect(data_TNRH_row).toEqual([
      [["Male","Female"],[38,38],[50,50],[53,19],[73.6,26.4],[763,645],[54.2,45.8],[1002,833],[54.6,45.4],[7325,5974],[55.1,44.9],[2348,1900],[55.3,44.7],[1319,1075],[55.1,44.9],[952,770],[55.3,44.7],[50,29],[63.3,36.7],[27,26],[50.9,49.1],[7325,5974],[55.1,44.9],[0,0],[null,null],[0,0],[null,null],[0,0],[null,null],[0,0],[null,null]],
      [["Male","Female"],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[null,null],[0,0],[null,null],[0,0],[null,null],[0,0],[null,null]],
      [["Yes","No"],[17,0],[22.4,0],[43,0],[59.7,0],[434,0],[30.8,0],[581,0],[31.7,0],[4163,0],[31.3,0],[1321,0],[31.1,0],[750,0],[31.3,0],[525,0],[30.5,0],[30,0],[38,0],[16,0],[30.2,0],[4163,0],[31.3,0],[0,0],[null,null],[0,0],[null,null],[0,0],[null,null],[0,0],[null,null]],
      [["Yes","No"],[21,0],[27.6,0],[21,0],[29.2,0],[480,0],[34.1,0],[624,0],[34,0],[4594,0],[34.5,0],[1479,0],[34.8,0],[844,0],[35.3,0],[598,0],[34.7,0],[21,0],[26.6,0],[16,0],[30.2,0],[4594,0],[34.5,0],[0,0],[null,null],[0,0],[null,null],[0,0],[null,null],[0,0],[null,null]],
      [["Yes","No"],[38,0],[50,0],[8,0],[11.1,0],[494,0],[35.1,0],[630,0],[34.3,0],[4542,0],[34.2,0],[1448,0],[34.1,0],[800,0],[33.4,0],[599,0],[34.8,0],[28,0],[35.4,0],[21,0],[39.6,0],[4542,0],[34.2,0],[0,0],[null,null],[0,0],[null,null],[0,0],[null,null],[0,0],[null,null]]
    ]);
    expect(data_TNRH_row.length).toEqual(TNRH.querySelectorAll('tbody>tr.firstInBlock').length);
    expect(data_TNRH_row[0].length).toEqual(TNRH.querySelectorAll('tbody>tr.firstInBlock:first-child>td:not(.blockCell)').length);

    expect(data_TNRH_column).toEqual([
      [["Male",38,50,53,73.6,763,54.2,1002,54.6,7325,55.1,2348,55.3,1319,55.1,952,55.3,50,63.3,27,50.9,7325,55.1,0,null,0,null,0,null,0,null],["Female",38,50,19,26.4,645,45.8,833,45.4,5974,44.9,1900,44.7,1075,44.9,770,44.7,29,36.7,26,49.1,5974,44.9,0,null,0,null,0,null,0,null]],
      [["Male",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,null,0,null,0,null,0,null],["Female",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,null,0,null,0,null,0,null]],
      [["Yes",17,22.4,43,59.7,434,30.8,581,31.7,4163,31.3,1321,31.1,750,31.3,525,30.5,30,38,16,30.2,4163,31.3,0,null,0,null,0,null,0,null],["No",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,null,0,null,0,null,0,null]],
      [["Yes",21,27.6,21,29.2,480,34.1,624,34,4594,34.5,1479,34.8,844,35.3,598,34.7,21,26.6,16,30.2,4594,34.5,0,null,0,null,0,null,0,null],["No",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,null,0,null,0,null,0,null]],
      [["Yes",38,50,8,11.1,494,35.1,630,34.3,4542,34.2,1448,34.1,800,33.4,599,34.8,28,35.4,21,39.6,4542,34.2,0,null,0,null,0,null,0,null],["No",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,null,0,null,0,null,0,null]]
    ]);
    expect(data_TNRH_column.length).toEqual(TNRH.querySelectorAll('tbody>tr.firstInBlock').length);
    expect(data_TNRH_column[0].length).toEqual(TNRH.querySelector('tbody>tr.firstInBlock>td.blockCell').rowSpan);
    expect(data_TNRH_column[0][0].length).toEqual(TNRH.querySelectorAll('tbody>tr.firstInBlock:first-child>td:not(.blockCell)').length);
  });
  it('.detectMultidimentional should detect multidimentional setup without passed column',()=>{
    expect(AggregatedTable.detectMultidimentional($j('#table-nested-rowheaders')[0])).toBe(true);
    expect(AggregatedTable.detectMultidimentional($j('#table-nested-headers')[0])).toBe(false);
  });
});
