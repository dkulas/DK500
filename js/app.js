jQuery(document).ready(function($) {

	var getStock = function() {

		var stockSymbol = document.getElementById("stockSym").value;
		console.log(stockSymbol);

		$.ajax({

			url: "https://www.quandl.com/api/v3/datasets/WIKI/" + stockSymbol + ".json?api_key=6QRi2WE7PV6yrG1j56pP",
			dataType: "json",

			error: function(jqXHR, textStatus, errorThrown) {

				$("h2#errorHandling").append("Error: " + jqXHR.responseJSON.quandl_error.message);
				$("h2#errorHandling").css({
					"display": "block"
				});

				console.log("Error: " + jqXHR.responseJSON.quandl_error.message);

			},

			success: function(parsed_json) {

				console.log(parsed_json);

				var stockData = parsed_json["dataset"]["data"];
				var stockCode = parsed_json["dataset"]["dataset_code"];
				var stockCloseDate = stockData[0][0];
				var stockOpen = stockData[0][1];
				var stockHigh = stockData[0][2];
				var stockLow = stockData[0][3];
				var stockClose = stockData[0][4];
				console.log("Stock Close Date: " + stockCloseDate);
				console.log("Stock Open Value: " + stockOpen);
				console.log("Stock High Value: " + stockHigh);
				console.log("Stock Low Value: " + stockLow);
				console.log("Stock Close Value: " + stockClose);


				// For-Loop to gather and sum all Stock Close values
				var stockCloseTotal = 0;
				var stockCloseAverage = 0;

				for (var i = 0; i < stockData.length; i++) {

					stockCloseTotal += stockData[i][4];
					stockCloseAverage = stockCloseTotal / stockData.length; 

				}

				console.log("Stock Close Total: " + stockCloseTotal);
				console.log("Stock Close Average: " + stockCloseAverage);

				// For-In Loop to gather and store Stock Close Date and Stock Close Value to be used in Chart JS
				// for (var i in stockData) {
				// 	console.log(stockData[i][0] + ": " + stockData[i][4]);
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