jQuery(document).ready(function($) {

	var getStock = function() {

		var stockSymbol = document.getElementById("stockSym").value;
		console.log(stockSymbol);

		$.ajax({

			url: "https://www.quandl.com/api/v3/datasets/WIKI/"+ stockSymbol + ".json?api_key=6QRi2WE7PV6yrG1j56pP",
			dataType: "json",

			error: function(jqXHR, textStatus, errorThrown) {

				$("").append("Error: " + jqXHR.responseText);
				$("").css({
					"display": "block"
				});

				console.log("Error: " + jqXHR.responseText);

			},

			success: function(parsed_json) {

				console.log(parsed_json);

				var data = parsed_json["dataset"]["data"];
				var stockCode = parsed_json["dataset"]["dataset_code"];
				var stockCloseDate = parsed_json["dataset"]["data"][0][0];
				var stockOpen = parsed_json["dataset"]["data"][0][1];
				var stockHigh = parsed_json["dataset"]["data"][0][2];
				var stockLow = parsed_json["dataset"]["data"][0][3];
				var stockClose = parsed_json["dataset"]["data"][0][4];
				var stockCloseTotal = 0;
				var stockCloseAverage = 0;

				// For-Loop to gather and sum all Stock Close values
				for (var i = 0; i < data.length; i++) {

					stockCloseTotal += data[i][4];
					stockCloseAverage = stockCloseTotal / data.length; 

				}

				console.log("Stock Close Total: " + stockCloseTotal);
				console.log("Stock Close Average: " + stockCloseAverage);

				// For-In Loop to gather and store Stock Close Date and Stock Close Value to be used in Chart JS
				// for (var i in data) {
				// 	console.log(data[i][0] + ": " + data[i][4]);
				// }

			},

			complete: function() {

				console.log("Completed");
				
			}
		});
	}

	$("input#submitBtn").keypress(function(event) {
		if (event.keyCode == 13 || event.which == 13) {
			$("input#submitBtn").focus();
			event.preventDefault();
			getStock();
		}
	});

	$("input#submitBtn").click(function() {
		getStock();
	});

});