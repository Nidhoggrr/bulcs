local switches = { 	{ adress="00" ,	name="FNORDLICHT", 	state="0"} , 
			{ adress="02" ,	name="MONITOR", 	state="0"} , 
			{ adress="03" ,	name="CEILING", 	state="0"} , 
			{ adress="04" ,	name="BALCONY", 	state="0"} , 
			{ adress="05" ,	name="IKEA LAMP", 	state="0"} , 
			{ adress="06" ,	name="SOME PLUG", 	state="0"} , 
			{ adress="01" ,	name="XMAS STAR", 	state="0"} , 
			{ adress="07" ,	name="COFFEE", 	state="0"} } 
require( "lib/tablesave" )
table.save( switches, "switches.txt" )
local switches2 = table.load( "switches.txt" )
for k,v in pairs(switches2) do print(k,v.adress,v.name,v.state) end
