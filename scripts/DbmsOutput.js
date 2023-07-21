/*This script originally written in java by Tom Kyte – I've converted it to javascript
*/
function DbmsOutput(conn) {
    this.enable_stmt = conn.prepareCall("begin dbms_output.enable(:1); end;");
    this.disable_stmt = conn.prepareCall("begin dbms_output.disable; end;");
    this.show_stmt = conn.prepareCall(
        'declare ' +
        '    l_line varchar2(255); ' +
        '    l_done number; ' +
        '    l_buffer long; ' +
        'begin ' +
        '    loop ' +
        '        exit when length(l_buffer) + 255 > :1 OR l_done = 1; ' +
        '        dbms_output.get_line(l_line, l_done); ' +
        '        l_buffer := l_buffer || l_line || chr(10); ' +
        '    end loop; ' +
        '    :2 := l_done; ' +
        '    :buffer := l_buffer; ' +
        'end;'
    );
}

DbmsOutput.prototype.enable = function(size) {
    this.enable_stmt.setInt(1, size);
    this.enable_stmt.executeUpdate();
};

DbmsOutput.prototype.disable = function() {
    this.disable_stmt.executeUpdate();
};

DbmsOutput.prototype.show = function() {
    var done = 0;
    this.show_stmt.registerOutParameter(2, java.sql.Types.INTEGER);
    this.show_stmt.registerOutParameter(3, java.sql.Types.VARCHAR);
    for (;;) {
        this.show_stmt.setInt(1, 32000);
        this.show_stmt.executeUpdate();
        console.log(this.show_stmt.getString(3));
        if ((done = this.show_stmt.getInt(2)) == 1) break;
    }
};

DbmsOutput.prototype.close = function() {
    this.enable_stmt.close();
    this.disable_stmt.close();
    this.show_stmt.close();
};
