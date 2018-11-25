@{%
const nuller = d => null;
%}

atma 				-> (statement "\n"):+
statement 			->	line_comments
				 	 	| block_comments
line_comments		-> "//" [.]:* "\n"							{% nuller %}
block_comments		-> "/*" [.]:* "*/"							{% nuller %}
