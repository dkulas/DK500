jQuery(document).ready(function($) {

	var getStock = function() {

		$("div#chartContainer, p#errorHandling, #stockName, #ipoDate, #volume, #stockOpen, #stockClose, #historicalAverage, div#test").empty();
		$("p#errorHandling").css("display", "none");

		var stockSymbol = document.getElementById("stockSym").value;

		$("div.cssload-container").css("display", "block");

		$.ajax({

			url: "https://www.quandl.com/api/v3/datasets/WIKI/" + stockSymbol + ".json?api_key=6QRi2WE7PV6yrG1j56pP",
			dataType: "json",

			error: function(jqXHR, textStatus, errorThrown) {

				$("div.cssload-container").css("display", "none");
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
				var stockName = parsed_json["dataset"]["name"].match("^[^\(]+");
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

				/*
					Iterate through stockData and extract the stock close date
					along with its associated stock close price and then
					push those values into sDataPoints array
				*/
				var sDataPoints = new Array();

				for (var i in stockData) {
					sDataPoints.push({label: stockData[i][0], y: stockData[i][4]});
				};

				$.each(sDataPoints, function(i) {
					var templateString = '<table><thead><tr><td><p><strong>Closing Date:</strong> '+sDataPoints[i].label + '<br>' + '<strong>Closing Price:</strong> ' + sDataPoints[i].y+'<br><br></p></td></tr></thead></table>';
					$("#test").append(templateString);
				});

			  var sChart = new CanvasJS.Chart("chartContainer", {
			  	zoomEnabled: true,
			  	zoomType: "xy",
			  	backgroundColor: "rgba(255, 255, 255, .5)",
			  	axisX: {
			  		labelAngle: 0,
			  		labelFontSize: 14,
			  		labelFontColor: "black",
			  		labelFontWeight: "bold",
			  		labelMaxWidth: 40,
			  		includeZero: false,
			  		gridColor: "white",
			  		lineColor: "white",
			  	},
			  	axisY: {
			  		labelFontSize: 14,
			  		includeZero: false,
			  		labelFontColor: "black",
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

			  console.log(sDataPoints);

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

		// Below AJAX call lists all available databases to interact with.  Time to expand scope of project

		$.ajax({

			url: "https://www.quandl.com/api/v3/databases.json",
			dataType: "json",

			error: function(jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseJSON.quandl_error.message);
			},

			success: function(parsed_json) {
				console.log(parsed_json);
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

	$("h1#stockAbbreviation").click(function() {
		$("section#stockInfo").css({
			"opacity": 1,
		});
	});

	var resetCanvas = function() {
		$("#stockGraph").remove();
		// $("#graphSection").append("<canvas id='stockGraph'></canvas>");
	};

});