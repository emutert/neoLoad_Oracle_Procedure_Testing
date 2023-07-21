// a sample oracle procedure call

// oracle Types initialization 
var TYPES = Packages.oracle.jdbc.OracleTypes;

//get connection
var conn = context.currentVU.get('Connection_name_used_in_sql_connection');

// call object initialization
var sql = "begin SCHEMA_NAME.PROCDURE_NAME(first_parameter=>?,second_parameter=>?); end;";
var cs = conn.prepareCall(sql);

cs.setString(1,'first_parameter_value');
cs.registerOutParameter(2,TYPES.CURSOR);

cs.execute();

//output the result

var result = cs.getCursor(2);
//loop the result cursor
while (result.next()) {
  logger.debug(result.getString(1));
}

//close resultset
result.close();
