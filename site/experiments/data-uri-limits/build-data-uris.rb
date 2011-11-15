require 'datafy'

prefix = 'data:text/css;base64,'
sizes = [ 1, 2, 3, 4, 5, 6, 7, 8, 16, 32, 64, 128, 256 ]

# puts "#{CGI::escape( '   ' ).length}"

sizes.each do |size|
	styles = "#test-div-#{size} { color : red; }"
	desired_size = size * 1024
	space_left = desired_size - Base64.encode64( styles ).gsub("\n", '').length - Base64.encode64( prefix ).gsub("\n", '').length
	spaces = " " * ( space_left / 3 ) 
	
	result = Datafy::make_data_uri( spaces + styles, 'text/css' )
	# puts "#{size}kb: #{result.length}" 
	puts "<link rel=\"stylesheet\" type=\"text/css\" href=\"#{result}\" />"
end