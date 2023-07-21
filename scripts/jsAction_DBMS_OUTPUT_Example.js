// a sample oracle procedure call

// oracle Types initialization 
var TYPES = Packages.oracle.jdbc.OracleTypes;

//get connection
var conn = context.currentVU.get('Connection_name_used_in_sql_connection');


//dbms_output initialization
var dbms_output = new DbmsOutput(conn);
//enable dbms_output
dbms_output.enable(1000000);

// call object initialization
var sql = "begin SCHEMA_NAME.PROCDURE_NAME(first_parameter=>?,second_parameter=>?); end;";
var cs = conn.prepareCall(sql);

cs.setString(1,'first_parameter_value');
cs.registerOutParameter(2,TYPES.CURSOR);

cs.execute();
//dbms_output.show();
dbms_output.show();

//output the result

var result = cs.getCursor(2);
//loop the result cursor
while (result.next()) {
  logger.debug(result.getString(1));
}


//close dbms_output
dbms_output.close();

//close resultset
result.close();
