local switches = { 	{ adress="00" ,	name="FNORDLICHT", 	state="0", oncommand="10", offcommand="00", module="rfmsend"} , 
			{ adress="02" ,	name="MONITOR", 	state="0", oncommand="10", offcommand="00", module="rfmsend"} , 
			{ adress="03" ,	name="CEILING", 	state="0", oncommand="12", offcommand="12", module="rfmsend"} , 
			{ adress="04" ,	name="BALCONY", 	state="0", oncommand="10", offcommand="00", module="rfmsend"} , 
			{ adress="05" ,	name="IKEA LAMP", 	state="0", oncommand="10", offcommand="00", module="rfmsend"} , 
			{ adress="06" ,	name="SOME PLUG", 	state="0", oncommand="10", offcommand="00", module="rfmsend"} , 
			{ adress="01" ,	name="XMAS STAR", 	state="0", oncommand="10", offcommand="00", module="test"} , 
			{ adress="07" ,	name="COFFEE", 		state="0", oncommand="10", offcommand="00", module="rfmsend"} } 
require( "lib/tablesave" )
table.save( switches, "switches.txt" )
local switches2 = table.load( "switches.txt" )
for k,v in pairs(switches2) do print(k,v.adress,v.name,v.state,v.oncommand,v.offcommand,v.module) end
