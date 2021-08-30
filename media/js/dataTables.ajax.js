/*I have found that if we load the dataTable() with 'table' selector at the load of only window object with a setTimeout() (and not with the document object), the problem of table display while fetching ajax data can be removed, for reference please see the following issue on stackoverflow:: https://stackoverflow.com/questions/27873581/datatable-doesnt-work-jquery/68989501#68989501 */

//i.e

$(window).load(()=>{
        
        setTimeout(() => {
         $('table').DataTable();
     }, 1100);
 })


 /*Also i have tried to integrate the following in the main dataTable.js file i.e jquery.dataTable.js but is not able to integrate, if anyone can do that and please let me know in detail.*/ 