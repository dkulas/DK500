jQuery(document).ready(function($) {

	var getStock = function() {

		$("div#chartContainer, p#errorHandling, h1#stockAbbreviation, #stockName, #ipoDate, #volume, #stockOpen, #historicalAverage").empty();
		$("p#errorHandling, h1#stockAbbreviation").css("display", "none");

		var stockSymbol = document.getElementById("stockSym").value;
		console.log(stockSymbol);

		$("div.cssload-container").css("display", "block");

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

				$("div.cssload-container").css("display", "none");

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
					stockCloseAverage = (Math.floor(100 * stockCloseAverage) / 100).toFixed(2);

				}

				console.log("Historical Average Stock-Close Price: " + stockCloseAverage);

				/*
					Iterate through stockData and extract the stock close date
					along with its associated stock close price and then
					push those values into sDataPoints array
				*/
				var sDataPoints = new Array();

				for (var i in stockData) {

					sDataPoints.push({label: stockData[i][0], y: stockData[i][4]});

				}

			  var sChart = new CanvasJS.Chart("chartContainer", {
			  	zoomEnabled: true,
			  	zoomType: "xy",
			  	backgroundColor: "rgba(255, 255, 255, .5)",
			  	axisX: {
			  		labelAngle: 0,
			  		labelFontSize: 14,
			  		labelFontColor: "white",
			  		labelFontWeight: "bold",
			  		labelMaxWidth: 40,
			  		includeZero: false,
			  		gridColor: "white",
			  		lineColor: "white",
			  	},
			  	axisY: {
			  		labelFontSize: 14,
			  		includeZero: false,
			  		labelFontColor: "white",
			  		labelFontWeight: "bold",
			  		gridColor: "white",
			  		lineColor: "white",
			  	},
			  	data: [{
			  		type: "line",
			  		lineColor: "black",
			  		dataPoints: sDataPoints.reverse()
			  	}]
			  });

			  sChart.render();

			  $("#stockAbbreviation").css("display", "inline-block").append(stockCode);
			  $("#stockName").append("<strong>Name: </strong>" + stockName);
			  $("#stockOpen").append("<strong>Previous-Day Opening Price: </strong>" + "$" + stockOpen);
			  $("#stockClose").append("<strong>Previous-Day Closing Price: </strong>" + "$" + stockClose);
			  $("#ipoDate").append("<strong>IPO Date: </strong>" + stockIPODate);
			  $("#volume").append("<strong>Trading Volume: </strong>" + stockVolume);
			  $("#historicalAverage").append("<strong>Historical Close-Average: </strong>" + "$" + stockCloseAverage + " / per share");

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