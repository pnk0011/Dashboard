


var app = angular.module('MyAwesomeApp', ['ngWebsocket', 'chart.js']);

app.controller('cnt', function ($scope, $http, $websocket, $timeout) {


  $scope.putloader = false;

  $scope.putLoader = function () {

    $scope.putloader = true;

  }

  $scope.callalert = function (alertmsg) {
    $scope.showWarningMessage(alertmsg);
  }

  var start;
  var alertTimeoutCallback = function (time) {

    start = Date.now();
    $timeout(function () {
      var end = Date.now();
      if ((end - start) / 1000 > 4) {
        $(".alert").animate({
          opacity: 0
        }, 500, function () {
          $timeout(function () {
            $scope.alertModal = false;
            $scope.$apply(function () {
              $(".alert").css({
                opacity: 1
              });

            });
          }, 50);

        });
      }


    }, time);

  };
  $scope.showWarningMessage = function (warningmsg) {
    $scope.alertModal = true;
    $scope.alertDescription = warningmsg;
    alertTimeoutCallback(5000);
  }







  $('.videoModal').on('hide.bs.modal', function (e) {
    var $if = $(e.delegateTarget).find('video');
    var src = $if.attr("src");
    $if.attr("src", 'https://vodafone-socialcore.s3.ap-south-1.amazonaws.com/test-video.mp4');
    $if.attr("src", src);
  });

  //Graph Container Method Call 
  var i = 0;

  $scope.labels = [];

  $scope.series = ['Y-values'];
  $scope.data = [[]];
  $scope.data[0] = [];

  $scope.colours = [{
    fillColor: "rgba(255,0,0,1)",
    strokeColor: "rgba(151,187,205,1)",
    pointColor: "rgba(151,187,205,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(151,187,205,0.8)"
  }];

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  $scope.GraphContainerMethod = function () {

    $scope.ActivelineGraph = true;





    var ws = $websocket.$new('ws://35.154.106.116:8001/');




    ws.$on('$open', function (message) {

      $scope.callalert('connection to ws://35.154.106.116:8001/ has been established');
      console.log('connection to ws://35.154.106.116:8001/ has been established !!');


    })


    ws.$on('$message', function (message) { // it listents for 'incoming event'


      if ($scope.ActivelineGraph == true) {


        $scope.putloader = false;
        reader = new FileReader();
        reader.readAsText(message);
        // $scope.Yvalues =  reader.result;


        reader.onload = () => {
          // var gvalue =  document.getElementById('Yvalue');
          // gvalue.model = reader.result;
          console.log("Result: " + reader.result);
          $scope.Yvalues = reader.result;
          $scope.data[0].push(reader.result);
          $scope.labels.push($scope.data[0].length - 1);

          $scope.$apply();
        };

      }

    });





  }

  $scope.ImageContainerMethod = function () {

    $scope.imageStream = true;


    var ws = $websocket.$new('ws://35.154.106.116:8080/camera');



    ws.$on('$open', function (message) {
      $scope.callalert('connection to ws​://35.154.106.116:8080/camera  has been established');
      console.log('connection to ws​://35.154.106.116:8080/camera has been established !!');
      // document.getElementById("loader").style.display = "none";
      // $scope.putloader = false;


    })


    ws.$on('$message', function (message) { // it listents for 'incoming event'


      if ($scope.imageStream == true) {

        $scope.putloader = false;
        reader = new FileReader();
        reader.readAsText(message);
        $scope.Yvalues = reader.result;


        reader.onload = () => {
          var Image = document.getElementById('showImage');
          Image.src = 'data:image/jpeg;base64,' + reader.result;

          // console.log("Result: " + reader.result);


          $scope.$apply();
        };

      }


    });



  }

  $scope.messageList = [];

  $scope.LoggingContainerMethod = function () {

    $scope.Logging = true;


    var ws = $websocket.$new('ws://35.154.106.116:8003/');



    ws.$on('$open', function (message) {
      $scope.callalert('connection to ws://35.154.106.116:8003/  has been established');
      console.log('connection to ws://35.154.106.116:8003/ has been established !!');



    })


    ws.$on('$message', function (message) { // it listents for 'incoming event'


      if ($scope.Logging == true) {

        $scope.putloader = false;
        reader = new FileReader();
        reader.readAsText(message);



        reader.onload = () => {

          if (reader.result != '' && reader.result != null)
            $scope.messageList.push(reader.result);

          console.log("Result: " + reader.result);


          $scope.$apply();
        };

      }


    });



  }









  // Registration Form Method 

  $scope.sendRegistrationData = function (data) {

    if ($scope.registration.$valid) {  //to validate the form
      $scope.putLoader();  //  loader  call
      $scope.registration.submitted = false;
      var data = data;
      $http.post('http://35.154.106.116:5000/register', JSON.stringify(data)).then(function (response) {

        if (response.data) {
          $scope.putloader = false; // 
          $scope.callalert('Data posted successfully');
          $scope.Register = {};
          console.log('Data posted successfully' + response.data);
        }

      }, function (response) {


        console.log('error while posting data' + response.data);

      });

    }
    else {
      $scope.registration.submitted = true;
    }




  }



  $('#myModal').modal({
    backdrop: 'static'


  })
  $('#myModal').modal('hide');


  // video controller method

  $scope.VideoContainerMethod = function () {

    $scope.DataValue = [];

    $http.get("http://35.154.106.116:5000/videoinfo")
      .then(function (response) {

        $scope.DataValue[0] = response.data["Casualities"];
        $scope.DataValue[1] = response.data["Feed status"];
        $scope.DataValue[2] = response.data["Last active time"];
        $scope.DataValue[3] = response.data["Link"];
        $scope.DataValue[4] = response.data.Location.Block;
        $scope.DataValue[5] = response.data.Location.Unit;
        $scope.DataValue[6] = response.data.Name;

        //  $scope.DataValue = videoInfo;
        //  console.log('video info response data: ' + videoInfo[4]);  
        console.log('video info response status: ' + response.data["Last active time"]);
        console.log('video info response status: ' + JSON.stringify(response.data));
        $scope.myWelcome = JSON.stringify(response);
      });


  }










});






