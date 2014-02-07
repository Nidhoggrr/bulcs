#!/usr/bin/lua5.1
nexthop="bulcs"
localpath="/srv/www/lights/"
local forwarder=false

package.path = localpath .. "lib/?.lua;" .. package.path

local file,err = io.open( localpath .. "switches.txt", "r" )
if file~=nil then
	forwarder=false or forwarder
	
	local tmpfile,err = io.open( "/tmp/switches.txt", "r" )
	if tmpfile~=nil then
		tmpfile:close()
	else
		instr = file:read("*a")

		outfile = io.open("/tmp/switches.txt", "w")
		outfile:write(instr)
		outfile:close()
	end
	file:close()
else
	forwarder=true
end

local CGI = require( "CGI" )
CGI:response():setHeader('Expires: Sat, 1 Jan 2005 00:00:00 GMT;Cache-Control: no-cache, must-revalidate;Pragma: no-cache;')
local adress = (CGI:request():parameter("adress")~=nil) and CGI:request():parameter("adress") or "02"
local state = (CGI:request():parameter("state")~=nil) and CGI:request():parameter("state") or "0"

request = function (rU)
	local answer
        if (pcall (require, "socket")) and (rU~=nil) then
                local http = require("socket.http")
                answer = http.request(rU)
	else
		answer = [[
			No answer from ]] .. nexthop
        end
	return answer
end

local requestURL


if forwarder then
	if (CGI:request():parameter("adress")~=nil) and (CGI:request():parameter("state")~=nil) then
		requestURL = "http://" .. nexthop .. "/lights/cgi-bin/states.lua?state=" .. state .. "&adress=" .. adress
	elseif (CGI:request():parameter("adress")~=nil) then
		requestURL = "http://" .. nexthop .. "/lights/cgi-bin/states.lua?adress=" .. adress
	else
		requestURL = "http://" .. nexthop .. "/lights/cgi-bin/states.lua"
	end
	CGI:print()(request(requestURL))
else
	require( "tablesave" )
	local switches = table.load( "/tmp/switches.txt" )
	if (CGI:request():parameter("adress")~=nil) and (CGI:request():parameter("state")~=nil) then
		for k,v in pairs(switches) do 
			if (adress==v.adress) then
				v.state=state
				if (v.module=="rfmsend") then
					if (state=="1") then
						os.execute("sudo " .. localpath .. "modules/rfmsend/rfmsend -a " .. adress .. " -s " .. v.oncommand)
					elseif (state=="0") then 
						os.execute("sudo " .. localpath .. "modules/rfmsend/rfmsend -a " .. adress .. " -s " .. v.offcommand)
					end
				else
						os.execute("echo " .. adress .. " -s " .. v.offcommand .."> /tmp/test.tst")
						 CGI:print()(adress .. " -s " .. v.offcommand)
				end
			end
		end
		--requestURL = "http://" .. ethersex .. "/ecmd?fs20%20send%200xCCCC%200x" .. adress .. "%200x" .. state .. "0"
		--request(requestURL)
		--os.execute("sudo " .. localpath .. "modules/rfmsend/rfmsend -a " .. adress .. " -s " .. state .. "0")
		table.save( switches, "/tmp/switches.txt" )
	end
	local json = require ("dkjson")
	if (CGI:request():parameter("adress")~=nil) then
		for k,v in pairs(switches) do 
			if (adress==v.adress) then
				CGI:print()(json.encode (v, { indent = true })) 
			end
		end
	else
		local inventory = {}
		for k,v in pairs(switches) do
			inventory[k] = v.adress
		end
		CGI:print()(json.encode (inventory, { indent = true }))
	end
--		table.save( switches, "/tmp/switches.txt" )
end

