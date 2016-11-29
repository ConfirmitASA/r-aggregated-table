/**
 * Created by IvanP on 07.09.2016.
 */

import TableData from "./table-data";
import AggregatedTable from "./aggregated-table";
import ReportalBase from "r-reportal-base";
import AggregatedTableRowMeta from "./aggregated-table-row-meta";


window.Reportal = window.Reportal || {};
ReportalBase.mixin(window.Reportal,{
  TableData,
  AggregatedTable,
  AggregatedTableRowMeta
});

export default AggregatedTable
