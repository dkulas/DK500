jQuery(document).ready(function($) {

	var getStock = function() {

		$("h2#errorHandling").empty();

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
				var stockName = parsed_json["dataset"]["name"];
				var stockIPODate = parsed_json["dataset"]["start_date"];
				var stockCloseDate = stockData[0][0];
				var stockOpen = stockData[0][1];
				var stockHigh = stockData[0][2];
				var stockLow = stockData[0][3];
				var stockClose = stockData[0][4];
				console.log("Stock Name: " + stockName);
				console.log("Stock Close Date: " + stockCloseDate);
				console.log("Stock Open Value: " + stockOpen);
				console.log("Stock High Value: " + stockHigh);
				console.log("Stock Low Value: " + stockLow);
				console.log("Stock Close Value: " + stockClose);
				console.log("Stock IPO Date: " + stockIPODate);
				
				// For-Loop to gather and sum all Stock Close values
				var stockCloseTotal = 0;
				var stockCloseAverage = 0;

				for (var i = 0; i < stockData.length; i++) {

					stockCloseTotal += stockData[i][4];
					stockCloseAverage = stockCloseTotal / stockData.length; 

				}

				console.log("Stock Close Average: " + stockCloseAverage);

				/*
					For...in loop that will iterate over
					the entire set of data and extract
					the stock close date along with its 
					associated stock close price and then
					push those values into their
					respective arrays (detailed below)
				*/
				var datesArray = [];
				var pricesArray = [];

				for (var i in stockData) {

					datesArray.push(stockData[i][0]);
					pricesArray.push(stockData[i][4]);

				}

				// console.log("Dates Array: " + datesArray);
				// console.log("Prices Array: " + pricesArray);

				// initialize the graph/chart
				var context = document.getElementById("stockGraph").getContext("2d");
				var stockChart = new Chart(context, {
					type: 'line',
					data: {
						labels: datesArray.reverse(),
						datasets: [{
							label: '$' + stockSymbol.toUpperCase(),
							data: pricesArray.reverse(),
							backgroundColor: "#0077CC",
						}]
					},
					options: {
						responsive: true,
					}
				});

			},

			complete: function() {

				console.log("Completed");
				
			}
		});
	}

	$("input#stockSym").keypress(function(event) {
		if (event.keyCode == 13 || event.which == 13) {
			$("input#submitBtn").focus();
			event.preventDefault();
			resetCanvas();
			getStock();
		}
	});

	$("input#submitBtn").click(function() {
		resetCanvas();
		getStock();
	});

	var resetCanvas = function() {
		$("#stockGraph").remove();
		$("#graphSection").append("<canvas id='stockGraph'></canvas>");
	};

});