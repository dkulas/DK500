jQuery(document).ready(function($) {

	var getStock = function() {

		$("div#chartContainer, p#errorHandling, h1#stockName").empty();
		$("p#errorHandling, h1#stockName").css("display", "none");

		var stockSymbol = document.getElementById("stockSym").value;
		console.log(stockSymbol);

		$.ajax({

			url: "https://www.quandl.com/api/v3/datasets/WIKI/" + stockSymbol + ".json?api_key=6QRi2WE7PV6yrG1j56pP",
			dataType: "json",

			error: function(jqXHR, textStatus, errorThrown) {

				$("p#errorHandling").append("Error: " + jqXHR.responseJSON.quandl_error.message);
				$("p#errorHandling").fadeIn().css({
					"display": "block"
				});

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
				var stockVolume = stockData[0][5];
				
				// For-Loop to gather and sum all Stock Close values
				var stockCloseTotal = 0;
				var stockCloseAverage = 0;

				for (var i = 0; i < stockData.length; i++) {

					stockCloseTotal += stockData[i][4];
					stockCloseAverage = stockCloseTotal / stockData.length; 

				}

				console.log("Historical Average Stock-Close Price: " + stockCloseAverage);

				/*
					For...in loop that will iterate over
					the entire set of data and extract
					the stock close date along with its 
					associated stock close price and then
					push those values into their
					respective arrays (detailed below)
				*/
				// var datesArray = new Array();
				// var pricesArray = new Array();
				var sDataPoints = new Array();

				for (var i in stockData) {

					// datesArray.push(stockData[i][0]);
					// pricesArray.push(stockData[i][4]);
					sDataPoints.push({label: stockData[i][0], y: stockData[i][4]});

				}

			  var sChart = new CanvasJS.Chart("chartContainer", {
			  	zoomEnabled: true,
			  	zoomType: "xy",
			  	axisX: {
			  		labelAngle: 0,
			  		labelFontSize: 14,
			  		labelMaxWidth: 40,
			  		includeZero: false,
			  	},
			  	axisY: {
			  		labelFontSize: 14,
			  	},
			  	data: [{
			  		type: "line",
			  		dataPoints: sDataPoints.reverse()
			  	}]
			  });

			  sChart.render();
			  $("#stockName").css("display", "inline-block").append(stockCode);

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